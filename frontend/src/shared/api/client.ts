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
          // Try to extract error message from various possible formats (including Spring validation)
          let errorMessage = 'Unknown error'
          if (errorData) {
            if (typeof errorData === 'string') {
              errorMessage = errorData
            } else if (typeof errorData === 'object') {
              const d = errorData as unknown as Record<string, unknown>
              // Backend Map.of("error", ...) and Spring validation / ProblemDetail
              const single = d.error ?? d.message ?? d.detail
              if (typeof single === 'string') {
                errorMessage = single
              } else if (Array.isArray(d.errors) && d.errors.length > 0) {
                errorMessage = (d.errors as string[]).join('; ')
              } else if (Array.isArray(d.fieldErrors)) {
                errorMessage = (d.fieldErrors as Array<{ field?: string; message?: string }>)
                  .map((e) => `${e.field ?? 'field'}: ${e.message ?? ''}`).join('; ')
              } else {
                errorMessage = JSON.stringify(errorData)
              }
            }
          }
          // Single-line log so the message is always visible (no collapsed {})
          const method = error.config?.method ?? 'GET'
          const requestPayload = error.config?.data
            ? (typeof error.config.data === 'string' ? error.config.data : JSON.stringify(error.config.data))
            : undefined
          console.error(
            `API Error: ${status} ${statusText || ''} | ${errorMessage} | ${method} ${url}` +
              (requestPayload ? ` | body: ${requestPayload}` : '')
          )
          if (typeof errorData !== 'undefined' && errorData !== null) {
            console.error('API Error response body:', typeof errorData === 'string' ? errorData : JSON.stringify(errorData))
          }
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
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          // Try to refresh token (use raw axios - no auth header needed)
          const response = await axios.post(
            `${config.api.baseUrl}/api/v2/user/refresh`,
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' }, timeout: config.api.timeout }
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
        const refreshStatus = axios.isAxiosError(refreshError) ? refreshError.response?.status : undefined
        // Only redirect when refresh failed due to auth (400 invalid token, 401 unauthorized)
        // For network errors or 500, reject so the UI can show the error - avoid unexpected redirect
        const isAuthFailure = refreshStatus === 400 || refreshStatus === 401
        if (isAuthFailure) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user')
          const authStore = (await import('@/features/auth/store/authStore')).useAuthStore.getState()
          authStore.clearAuth()
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient

