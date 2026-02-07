/**
 * Goals OKR API - API calls for goals-okr module
 */

import apiClient from '@/shared/api/client'

// ========== Types ==========

export interface GoalDTO {
  id: number
  lifeDomainId: number
  titleNl: string
  titleEn: string
  descriptionNl?: string | null
  descriptionEn?: string | null
  orderIndex: number
  createdAt: string
  updatedAt: string
}

export interface ObjectiveDTO {
  id: number
  goalId: number
  titleNl: string
  titleEn: string
  descriptionNl?: string | null
  descriptionEn?: string | null
  orderIndex: number
  createdAt: string
  updatedAt: string
}

export interface KeyResultDTO {
  id: number
  objectiveId: number
  titleNl: string
  titleEn: string
  descriptionNl?: string | null
  descriptionEn?: string | null
  targetValue: number
  unit: string
  orderIndex: number
  createdAt: string
  updatedAt: string
}

export interface UserObjectiveInstanceDTO {
  id: number
  userId: number
  objectiveId: number
  startedAt: string
  completedAt?: string | null
}

export interface InitiativeDTO {
  id: number
  userId: number
  keyResultId: number
  userObjectiveInstanceId: number
  title: string
  description?: string | null
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  targetDate?: string | null
  learningFlowEnrollmentId?: number | null
  createdAt: string
  updatedAt: string
}

export interface InitiativeSuggestionDTO {
  id: number
  keyResultId: number
  titleNl: string
  titleEn: string
  descriptionNl?: string | null
  descriptionEn?: string | null
  learningFlowTemplateId?: number | null
  displayOrder: number
}

export interface KeyResultProgressDTO {
  id: number
  userId: number
  keyResultId: number
  userObjectiveInstanceId: number
  currentValue?: number | null
  updatedAt: string
}

export interface LifeDomainDTO {
  id: number
  domainKey: string
  titleNl: string
  titleEn: string
  descriptionNl?: string | null
  descriptionEn?: string | null
  iconName?: string | null
  displayOrder: number
  wheelId?: number | null
}

export interface KanbanItemDTO {
  id: number
  userId: number
  itemType: 'GOAL' | 'OBJECTIVE' | 'KEY_RESULT' | 'INITIATIVE'
  itemId: number
  columnName: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'
  position: number
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface WheelDTO {
  id: number
  wheelKey: string
  nameNl: string
  nameEn: string
  descriptionNl?: string | null
  descriptionEn?: string | null
  displayOrder: number
}

// ========== Wheels ==========

/**
 * Get all wheels
 * GET /api/v2/goals-okr/wheels
 */
export async function getAllWheels(): Promise<WheelDTO[]> {
  const response = await apiClient.get<WheelDTO[]>('/api/v2/goals-okr/wheels')
  return response.data
}

// ========== Life Domains ==========

/**
 * Get all life domains
 * GET /api/v2/goals-okr/life-domains
 */
export async function getAllLifeDomains(): Promise<LifeDomainDTO[]> {
  const response = await apiClient.get<LifeDomainDTO[]>('/api/v2/goals-okr/life-domains')
  return response.data
}

// ========== Goals ==========

/**
 * Get goals by life domain
 * GET /api/v2/goals-okr/life-domains/{lifeDomainId}/goals
 */
export async function getGoalsByLifeDomain(lifeDomainId: number): Promise<GoalDTO[]> {
  const response = await apiClient.get<GoalDTO[]>(
    `/api/v2/goals-okr/life-domains/${lifeDomainId}/goals`
  )
  return response.data
}

/**
 * Get a goal by ID
 * GET /api/v2/goals-okr/goals/{id}
 */
export async function getGoal(goalId: number): Promise<GoalDTO> {
  const response = await apiClient.get<GoalDTO>(`/api/v2/goals-okr/goals/${goalId}`)
  return response.data
}

// ========== Objectives ==========

/**
 * Get objectives by goal
 * GET /api/v2/goals-okr/goals/{goalId}/objectives
 */
export async function getObjectivesByGoal(goalId: number): Promise<ObjectiveDTO[]> {
  const response = await apiClient.get<ObjectiveDTO[]>(
    `/api/v2/goals-okr/goals/${goalId}/objectives`
  )
  return response.data
}

/**
 * Get an objective by ID
 * GET /api/v2/goals-okr/objectives/{id}
 */
export async function getObjective(objectiveId: number): Promise<ObjectiveDTO> {
  const response = await apiClient.get<ObjectiveDTO>(`/api/v2/goals-okr/objectives/${objectiveId}`)
  return response.data
}

// ========== Key Results ==========

/**
 * Get key results by objective
 * GET /api/v2/goals-okr/objectives/{objectiveId}/key-results
 */
export async function getKeyResultsByObjective(objectiveId: number): Promise<KeyResultDTO[]> {
  const response = await apiClient.get<KeyResultDTO[]>(
    `/api/v2/goals-okr/objectives/${objectiveId}/key-results`
  )
  return response.data
}

/**
 * Get a key result by ID
 * GET /api/v2/goals-okr/key-results/{id}
 */
export async function getKeyResult(keyResultId: number): Promise<KeyResultDTO> {
  const response = await apiClient.get<KeyResultDTO>(`/api/v2/goals-okr/key-results/${keyResultId}`)
  return response.data
}

// ========== User Objective Instances ==========

/**
 * Start a new user objective instance
 * POST /api/v2/goals-okr/user-objective-instances
 */
export async function startUserObjectiveInstance(
  userId: number,
  objectiveId: number
): Promise<UserObjectiveInstanceDTO> {
  const response = await apiClient.post<UserObjectiveInstanceDTO>(
    '/api/v2/goals-okr/user-objective-instances',
    { userId, objectiveId }
  )
  return response.data
}

/**
 * Get user objective instances for a user
 * GET /api/v2/goals-okr/users/{userId}/user-objective-instances
 */
export async function getUserObjectiveInstances(userId: number): Promise<UserObjectiveInstanceDTO[]> {
  const response = await apiClient.get<UserObjectiveInstanceDTO[]>(
    `/api/v2/goals-okr/users/${userId}/user-objective-instances`
  )
  return response.data
}

/**
 * Get a user objective instance by ID
 * GET /api/v2/goals-okr/user-objective-instances/{id}
 */
export async function getUserObjectiveInstance(
  userObjectiveInstanceId: number
): Promise<UserObjectiveInstanceDTO> {
  const response = await apiClient.get<UserObjectiveInstanceDTO>(
    `/api/v2/goals-okr/user-objective-instances/${userObjectiveInstanceId}`
  )
  return response.data
}

/**
 * Complete a user objective instance
 * POST /api/v2/goals-okr/user-objective-instances/{id}/complete
 */
export async function completeUserObjectiveInstance(
  userObjectiveInstanceId: number
): Promise<UserObjectiveInstanceDTO> {
  const response = await apiClient.post<UserObjectiveInstanceDTO>(
    `/api/v2/goals-okr/user-objective-instances/${userObjectiveInstanceId}/complete`
  )
  return response.data
}

// ========== Initiatives ==========

/**
 * Get initiatives by user objective instance
 * GET /api/v2/goals-okr/user-objective-instances/{userObjectiveInstanceId}/initiatives
 */
export async function getInitiativesByUserObjectiveInstance(
  userObjectiveInstanceId: number
): Promise<InitiativeDTO[]> {
  const response = await apiClient.get<InitiativeDTO[]>(
    `/api/v2/goals-okr/user-objective-instances/${userObjectiveInstanceId}/initiatives`
  )
  return response.data
}

/**
 * Get all initiatives for a user
 * GET /api/v2/goals-okr/users/{userId}/initiatives
 */
export async function getInitiativesForUser(userId: number): Promise<InitiativeDTO[]> {
  const response = await apiClient.get<InitiativeDTO[]>(
    `/api/v2/goals-okr/users/${userId}/initiatives`
  )
  return response.data
}

/**
 * Get an initiative by ID
 * GET /api/v2/goals-okr/initiatives/{id}
 */
export async function getInitiative(initiativeId: number): Promise<InitiativeDTO> {
  const response = await apiClient.get<InitiativeDTO>(`/api/v2/goals-okr/initiatives/${initiativeId}`)
  return response.data
}

/**
 * Create a new initiative
 * POST /api/v2/goals-okr/initiatives
 */
export async function createInitiative(request: {
  userId: number
  keyResultId: number
  userObjectiveInstanceId: number
  title: string
  description?: string | null
  targetDate?: string | null
  learningFlowEnrollmentId?: number | null
}): Promise<InitiativeDTO> {
  const response = await apiClient.post<InitiativeDTO>('/api/v2/goals-okr/initiatives', request)
  return response.data
}

/**
 * Update an initiative
 * PUT /api/v2/goals-okr/initiatives/{id}
 */
export async function updateInitiative(
  initiativeId: number,
  request: {
    title?: string | null
    description?: string | null
    targetDate?: string | null
    learningFlowEnrollmentId?: number | null
  }
): Promise<InitiativeDTO> {
  const response = await apiClient.put<InitiativeDTO>(
    `/api/v2/goals-okr/initiatives/${initiativeId}`,
    request
  )
  return response.data
}

/**
 * Complete an initiative
 * POST /api/v2/goals-okr/initiatives/{id}/complete
 */
export async function completeInitiative(initiativeId: number): Promise<InitiativeDTO> {
  const response = await apiClient.post<InitiativeDTO>(
    `/api/v2/goals-okr/initiatives/${initiativeId}/complete`
  )
  return response.data
}

// ========== Initiative Suggestions ==========

export async function getInitiativeSuggestionsByKeyResult(
  keyResultId: number
): Promise<InitiativeSuggestionDTO[]> {
  const response = await apiClient.get<InitiativeSuggestionDTO[]>(
    `/api/v2/goals-okr/key-results/${keyResultId}/suggestions`
  )
  return response.data
}

// ========== Key Result Progress ==========

/**
 * Get key result progress
 * GET /api/v2/goals-okr/key-result-progress?userId={userId}&keyResultId={keyResultId}&userObjectiveInstanceId={userObjectiveInstanceId}
 */
export async function getKeyResultProgress(
  userId: number,
  keyResultId: number,
  userObjectiveInstanceId: number
): Promise<KeyResultProgressDTO | null> {
  // Don't make request if parameters are invalid
  if (!userId || !keyResultId || !userObjectiveInstanceId || userObjectiveInstanceId <= 0) {
    return null
  }

  try {
    const response = await apiClient.get<KeyResultProgressDTO>(
      `/api/v2/goals-okr/key-result-progress`,
      {
        params: {
          userId,
          keyResultId,
          userObjectiveInstanceId,
        },
      }
    )
    return response.data
  } catch (error: any) {
    // 404 means no progress exists yet, which is fine - return null
    if (error.response?.status === 404) {
      return null
    }
    // For network errors (no response), also return null instead of throwing
    // This prevents console errors when the backend is not available or when
    // the user hasn't started the objective yet
    if (!error.response) {
      console.warn('Key result progress request failed (no response):', {
        userId,
        keyResultId,
        userObjectiveInstanceId,
      })
      return null
    }
    throw error
  }
}

// ========== Kanban Items ==========

/**
 * Get all kanban items for a user
 * GET /api/v2/goals-okr/users/{userId}/kanban-items
 */
export async function getKanbanItems(userId: number): Promise<KanbanItemDTO[]> {
  const response = await apiClient.get<KanbanItemDTO[]>(
    `/api/v2/goals-okr/users/${userId}/kanban-items`
  )
  return response.data
}

/**
 * Add a kanban item
 * POST /api/v2/goals-okr/kanban-items
 */
export async function addKanbanItem(request: {
  userId: number
  itemType: 'GOAL' | 'OBJECTIVE' | 'KEY_RESULT' | 'INITIATIVE'
  itemId: number
}): Promise<KanbanItemDTO> {
  const response = await apiClient.post<KanbanItemDTO>(
    '/api/v2/goals-okr/kanban-items',
    request
  )
  return response.data
}

/**
 * Update kanban item position
 * PUT /api/v2/goals-okr/kanban-items/{itemId}/position
 */
export async function updateKanbanItemPosition(
  itemId: number,
  columnName: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE',
  position: number
): Promise<KanbanItemDTO> {
  const response = await apiClient.put<KanbanItemDTO>(
    `/api/v2/goals-okr/kanban-items/${itemId}/position`,
    { columnName, position }
  )
  return response.data
}

/**
 * Delete a kanban item
 * DELETE /api/v2/goals-okr/kanban-items/{itemId}
 */
export async function deleteKanbanItem(itemId: number): Promise<void> {
  await apiClient.delete(`/api/v2/goals-okr/kanban-items/${itemId}`)
}

/**
 * Update key result progress
 * PUT /api/v2/goals-okr/key-result-progress
 */
export async function updateKeyResultProgress(request: {
  userId: number
  keyResultId: number
  userObjectiveInstanceId: number
  currentValue?: number | null
}): Promise<KeyResultProgressDTO> {
  const response = await apiClient.put<KeyResultProgressDTO>(
    '/api/v2/goals-okr/key-result-progress',
    request
  )
  return response.data
}

// ========== User-Specific Goals ==========

export interface UserGoalDTO {
  id: number
  userId: number
  lifeDomainId?: number | null
  title: string
  description?: string | null
  createdAt: string
  updatedAt: string
  completedAt?: string | null
}

/**
 * Create a user-specific goal
 * POST /api/v2/goals-okr/users/{userId}/user-goals
 */
export async function createUserGoal(
  userId: number,
  request: {
    lifeDomainId?: number
    title: string
    description?: string
  }
): Promise<UserGoalDTO> {
  const response = await apiClient.post<UserGoalDTO>(
    `/api/v2/goals-okr/users/${userId}/user-goals`,
    { ...request, userId }
  )
  return response.data
}

/**
 * Get all user-specific goals for a user
 * GET /api/v2/goals-okr/users/{userId}/user-goals
 */
export async function getUserGoals(userId: number): Promise<UserGoalDTO[]> {
  const response = await apiClient.get<UserGoalDTO[]>(
    `/api/v2/goals-okr/users/${userId}/user-goals`
  )
  return response.data
}

// ========== User-Specific Objectives ==========

export interface UserObjectiveDTO {
  id: number
  userId: number
  userGoalId: number
  title: string
  description?: string | null
  createdAt: string
  updatedAt: string
  completedAt?: string | null
}

/**
 * Create a user-specific objective
 * POST /api/v2/goals-okr/users/{userId}/user-objectives
 */
export async function createUserObjective(
  userId: number,
  request: {
    userGoalId: number
    title: string
    description?: string
  }
): Promise<UserObjectiveDTO> {
  const response = await apiClient.post<UserObjectiveDTO>(
    `/api/v2/goals-okr/users/${userId}/user-objectives`,
    { ...request, userId }
  )
  return response.data
}

/**
 * Get all user-specific objectives for a user goal
 * GET /api/v2/goals-okr/user-goals/{userGoalId}/user-objectives
 */
export async function getUserObjectivesByUserGoal(
  userGoalId: number
): Promise<UserObjectiveDTO[]> {
  const response = await apiClient.get<UserObjectiveDTO[]>(
    `/api/v2/goals-okr/user-goals/${userGoalId}/user-objectives`
  )
  return response.data
}

// ========== User-Specific Key Results ==========

export interface UserKeyResultDTO {
  id: number
  userId: number
  userObjectiveId: number
  title: string
  description?: string | null
  targetValue?: number | null
  unit?: string | null
  currentValue: number
  createdAt: string
  updatedAt: string
  completedAt?: string | null
}

/**
 * Create a user-specific key result
 * POST /api/v2/goals-okr/users/{userId}/user-key-results
 */
export async function createUserKeyResult(
  userId: number,
  request: {
    userObjectiveId: number
    title: string
    description?: string
    targetValue?: number
    unit?: string
  }
): Promise<UserKeyResultDTO> {
  const response = await apiClient.post<UserKeyResultDTO>(
    `/api/v2/goals-okr/users/${userId}/user-key-results`,
    { ...request, userId }
  )
  return response.data
}

/**
 * Get all user-specific key results for a user objective
 * GET /api/v2/goals-okr/user-objectives/{userObjectiveId}/user-key-results
 */
export async function getUserKeyResultsByUserObjective(
  userObjectiveId: number
): Promise<UserKeyResultDTO[]> {
  const response = await apiClient.get<UserKeyResultDTO[]>(
    `/api/v2/goals-okr/user-objectives/${userObjectiveId}/user-key-results`
  )
  return response.data
}
