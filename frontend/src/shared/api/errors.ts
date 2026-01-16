import { AxiosError } from 'axios'
import { ApiError } from './types'

/**
 * Extract error message from API error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined
    if (apiError?.error) {
      return apiError.error
    }
    if (error.response?.status === 401) {
      return 'Unauthorized. Please log in again.'
    }
    if (error.response?.status === 403) {
      return 'Forbidden. You do not have permission to perform this action.'
    }
    if (error.response?.status === 404) {
      return 'Resource not found.'
    }
    if (error.response?.status === 500) {
      return 'Server error. Please try again later.'
    }
    return error.message || 'An unexpected error occurred.'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred.'
}

