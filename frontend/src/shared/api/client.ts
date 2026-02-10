'use client'

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { config } from '@/shared/constants/config'
import { ApiError } from './types'

/**
 * Axios instance with base configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Track "no response" errors to avoid spam
let noResponseErrorCount = 0
const MAX_NO_RESPONSE_ERRORS = 3

/**
 * Request interceptor - Add JWT token to requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor - Handle errors and token refresh
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

      // Enhanced error logging (skip 404 errors as they're often expected for missing resources)
      // Also skip 404s for /public endpoints (temporary until backend is fixed)
      const url = error.config?.url || 'unknown'
      const isPublicEndpoint = url.includes('/public/')
      const is404Error = error.response?.status === 404
      
      // Suppress 404 errors for initiatives endpoint (expected when checking if initiative is user-created or template)
      const shouldSuppress404 = is404Error && url.includes('/goals-okr/initiatives/')
      
      if (error.response) {
        // We have a response from the server
        const status = error.response.status
        const statusText = error.response.statusText
        const errorData = error.response.data
        
        if (status !== 404 && !isPublicEndpoint && !shouldSuppress404) {
          // Try to extract error message from various possible formats
          let errorMessage = 'Unknown error'
          if (errorData) {
            if (typeof errorData === 'string') {
              errorMessage = errorData
            } else if (typeof errorData === 'object') {
              // Try common error message fields
              errorMessage = (errorData as any).error || 
                           (errorData as any).message || 
                           (errorData as any).detail ||
                           JSON.stringify(errorData)
            }
          }
          
          console.error('API Error Response:', {
            status: status,
            statusText: statusText || '(no status text)',
            errorMessage: errorMessage,
            data: errorData,
            dataType: typeof errorData,
            dataString: errorData ? (typeof errorData === 'string' ? errorData : JSON.stringify(errorData)) : '(null/undefined/empty)',
            dataLength: errorData ? (typeof errorData === 'string' ? errorData.length : JSON.stringify(errorData).length) : 0,
            headers: error.response.headers,
            url: error.config?.url || url,
            method: error.config?.method || 'GET',
            requestData: error.config?.data ? (typeof error.config.data === 'string' ? JSON.parse(error.config.data) : error.config.data) : undefined
          })
        }
        // 404 errors are silently ignored (expected for missing resources)
    } else if (error.request) {
      // Network errors (no response) - backend is likely not available
      // Log first few errors, then suppress to avoid console spam
      
      // Always suppress these endpoints (expected to fail gracefully)
      // Also suppress 404 errors for initiatives (expected when checking user-created vs template)
      const shouldSuppress = shouldSuppress404 ||
                            url.includes('/versions/current') || 
                            url.includes('/public/') || 
                            url.includes('/key-result-progress') ||
                            url.includes('/key-results') ||
                            url.includes('/life-domains') ||
                            url.includes('/categories') ||
                            url.includes('/user-key-result-instances') ||
                            url.includes('/user-initiative-instances')
      
      if (!shouldSuppress) {
        noResponseErrorCount++
        if (noResponseErrorCount <= MAX_NO_RESPONSE_ERRORS) {
          console.error('API Request Error (no response):', {
            request: error.request,
            message: error.message,
            url: error.config?.url,
            method: error.config?.method,
            note: noResponseErrorCount === MAX_NO_RESPONSE_ERRORS 
              ? 'Further "no response" errors will be suppressed. Backend may not be available.' 
              : undefined
          })
        }
      }
    } else {
      console.error('API Error (setup):', {
        message: error.message,
        stack: error.stack
      })
    }

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          // Try to refresh token
          const response = await axios.post(
            `${config.api.baseUrl}/api/v2/user/refresh`,
            { refreshToken }
          )
          
          // Update tokens
          localStorage.setItem('auth_token', response.data.token)
          localStorage.setItem('refresh_token', response.data.refreshToken)
          
          // Update auth store if available
          const authStore = (await import('@/features/auth/store/authStore')).useAuthStore.getState()
          if (authStore.tokens) {
            authStore.setTokens({
              token: response.data.token,
              refreshToken: response.data.refreshToken,
              expiresAt: response.data.expiresAt,
            })
          }
          
          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`
          }
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed - clear auth and redirect to login
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        
        // Clear auth store
        const authStore = (await import('@/features/auth/store/authStore')).useAuthStore.getState()
        authStore.clearAuth()
        
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient

