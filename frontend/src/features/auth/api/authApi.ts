import axios from 'axios'
import apiClient from '@/shared/api/client'
import {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  ChangePasswordRequest,
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  UserResponse,
  UserPreferenceResponse,
  UpdateUserPreferencesRequest,
  FalahCycleResponse,
  PriorityAssessmentResponse,
  SavePriorityAssessmentRequest,
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
   * Change password (when logged in)
   */
  async changePassword(userId: number, data: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      '/api/v2/user/change-password',
      data
    )
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

  /**
   * Start a new Falah growth cycle
   */
  async startFalahCycle(userId: number): Promise<FalahCycleResponse> {
    const response = await apiClient.post<FalahCycleResponse>(
      `/api/v2/user/${userId}/falah-cycles`
    )
    return response.data
  },

  /**
   * Get user's Falah cycles (active and history)
   */
  async getFalahCycles(userId: number): Promise<FalahCycleResponse[]> {
    const response = await apiClient.get<FalahCycleResponse[]>(
      `/api/v2/user/${userId}/falah-cycles`
    )
    return response.data
  },

  /**
   * Exit the Falah cycle creation flow (Finish) - cycle stays active
   */
  async exitFalahCycleFlow(userId: number, cycleId: number): Promise<FalahCycleResponse> {
    const response = await apiClient.patch<FalahCycleResponse>(
      `/api/v2/user/${userId}/falah-cycles/${cycleId}/exit-flow`
    )
    return response.data
  },

  /**
   * Re-enter the Falah cycle creation flow (Continue)
   */
  async reEnterFalahCycleFlow(userId: number, cycleId: number): Promise<FalahCycleResponse> {
    const response = await apiClient.patch<FalahCycleResponse>(
      `/api/v2/user/${userId}/falah-cycles/${cycleId}/re-enter-flow`
    )
    return response.data
  },

  /**
   * Complete a Falah growth cycle
   */
  async completeFalahCycle(userId: number, cycleId: number): Promise<FalahCycleResponse> {
    const response = await apiClient.patch<FalahCycleResponse>(
      `/api/v2/user/${userId}/falah-cycles/${cycleId}/complete`
    )
    return response.data
  },

  /**
   * Get priority assessment for user.
   * Returns null when no assessment exists (404).
   */
  async getPriorityAssessment(
    userId: number,
    falahCycleId?: number | null
  ): Promise<PriorityAssessmentResponse | null> {
    try {
      const validCycleId =
        falahCycleId != null && Number.isFinite(falahCycleId) ? falahCycleId : null
      const params = validCycleId != null ? `?falahCycleId=${validCycleId}` : ''
      const response = await apiClient.get<PriorityAssessmentResponse>(
        `/api/v2/user/${userId}/priority-assessment${params}`
      )
      return response.data
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return null
      }
      throw err
    }
  },

  /**
   * Save priority assessment
   */
  async savePriorityAssessment(
    userId: number,
    data: SavePriorityAssessmentRequest
  ): Promise<PriorityAssessmentResponse> {
    const response = await apiClient.post<PriorityAssessmentResponse>(
      `/api/v2/user/${userId}/priority-assessment`,
      data
    )
    return response.data
  },
}

