import apiClient from '@/shared/api/client'
import {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  UserResponse,
  UserPreferenceResponse,
  UpdateUserPreferencesRequest,
} from '@/shared/api/types'

/**
 * Auth API
 * All authentication-related API calls
 */

export const authApi = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/api/v2/user/register', data)
    return response.data
  },

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/v2/user/login', data)
    return response.data
  },

  /**
   * Refresh access token
   */
  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>('/api/v2/user/refresh', data)
    return response.data
  },

  /**
   * Get current user
   */
  async getCurrentUser(userId: number): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>(`/api/v2/user/${userId}`)
    return response.data
  },

  /**
   * Logout (client-side only - clears tokens)
   */
  logout(): void {
    // Tokens are cleared by auth store
    // No API call needed (stateless JWT)
  },

  /**
   * Get user preferences
   */
  async getUserPreferences(userId: number): Promise<UserPreferenceResponse> {
    const response = await apiClient.get<UserPreferenceResponse>(`/api/v2/user/${userId}/preferences`)
    return response.data
  },

  /**
   * Update user preferences
   */
  async updateUserPreferences(
    userId: number,
    data: UpdateUserPreferencesRequest
  ): Promise<UserPreferenceResponse> {
    const response = await apiClient.put<UserPreferenceResponse>(
      `/api/v2/user/${userId}/preferences`,
      data
    )
    return response.data
  },
}

