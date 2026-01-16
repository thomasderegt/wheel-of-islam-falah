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
      if (error.response && error.response.status !== 404 && !isPublicEndpoint) {
        console.error('API Error Response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
          url: error.config?.url,
          method: error.config?.method,
          requestData: error.config?.data ? (typeof error.config.data === 'string' ? JSON.parse(error.config.data) : error.config.data) : undefined
        })
    } else if (error.request) {
      // Network errors (no response) - only log if not a 404-related request
      // These can happen due to network issues, but we handle them gracefully
      const url = error.config?.url || 'unknown'
      // Don't log errors for /versions/current or /public endpoints (expected 404s)
      if (!url.includes('/versions/current') && !url.includes('/public/')) {
        console.error('API Request Error (no response):', {
          request: error.request,
          message: error.message,
          url: error.config?.url,
          method: error.config?.method
        })
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

