/**
 * Learning API - API calls for learning module
 */

import apiClient from '@/shared/api/client'
import type {
  LearningFlowTemplateDTO,
  LearningFlowStepDTO,
  StartEnrollmentRequest,
  LearningFlowEnrollmentDTO,
  CreateTemplateRequest,
  EnrollmentAnswerDTO,
  EnrollmentStepProgressDTO,
  UpdateProgressRequest,
  AddAnswerRequest,
} from '@/shared/api/types'

/**
 * Get all templates
 * GET /api/v2/learning/templates
 */
export async function getAllTemplates(): Promise<LearningFlowTemplateDTO[]> {
  const response = await apiClient.get<LearningFlowTemplateDTO[]>('/api/v2/learning/templates')
  return response.data
}

/**
 * Create a new template
 * POST /api/v2/learning/templates
 */
export async function createTemplate(request: CreateTemplateRequest): Promise<LearningFlowTemplateDTO> {
  const response = await apiClient.post<LearningFlowTemplateDTO>('/api/v2/learning/templates', request)
  return response.data
}

/**
 * Get all templates for a section
 * GET /api/v2/learning/templates/section/{sectionId}
 */
export async function getTemplatesForSection(sectionId: number): Promise<LearningFlowTemplateDTO[]> {
  const response = await apiClient.get<LearningFlowTemplateDTO[]>(
    `/api/v2/learning/templates/section/${sectionId}`
  )
  return response.data
}

/**
 * Delete a template
 * DELETE /api/v2/learning/templates/{id}
 */
export async function deleteTemplate(templateId: number): Promise<void> {
  await apiClient.delete(`/api/v2/learning/templates/${templateId}`)
}

/**
 * Start a new enrollment
 * POST /api/v2/learning/enrollments
 */
export async function startEnrollment(
  request: StartEnrollmentRequest
): Promise<LearningFlowEnrollmentDTO> {
  const response = await apiClient.post<LearningFlowEnrollmentDTO>(
    '/api/v2/learning/enrollments',
    request
  )
  return response.data
}

/**
 * Get an enrollment by ID
 * GET /api/v2/learning/enrollments/{id}
 */
export async function getEnrollment(enrollmentId: number): Promise<LearningFlowEnrollmentDTO> {
  const response = await apiClient.get<LearningFlowEnrollmentDTO>(
    `/api/v2/learning/enrollments/${enrollmentId}`
  )
  return response.data
}

/**
 * Get all steps for a template
 * GET /api/v2/learning/templates/{templateId}/steps
 */
export async function getStepsForTemplate(templateId: number): Promise<LearningFlowStepDTO[]> {
  const response = await apiClient.get<LearningFlowStepDTO[]>(
    `/api/v2/learning/templates/${templateId}/steps`
  )
  return response.data
}

/**
 * Get all enrollments for a user
 * GET /api/v2/learning/enrollments/user/{userId}
 */
export async function getEnrollmentsForUser(userId: number): Promise<LearningFlowEnrollmentDTO[]> {
  const response = await apiClient.get<LearningFlowEnrollmentDTO[]>(
    `/api/v2/learning/enrollments/user/${userId}`
  )
  return response.data
}

/**
 * Get progress for all steps in an enrollment
 * GET /api/v2/learning/enrollments/{enrollmentId}/progress
 */
export async function getProgressForEnrollment(enrollmentId: number): Promise<EnrollmentStepProgressDTO[]> {
  const response = await apiClient.get<EnrollmentStepProgressDTO[]>(
    `/api/v2/learning/enrollments/${enrollmentId}/progress`
  )
  return response.data
}

/**
 * Get progress for a specific step
 * GET /api/v2/learning/enrollments/{enrollmentId}/steps/{stepId}/progress
 */
export async function getProgressForStep(enrollmentId: number, stepId: number): Promise<EnrollmentStepProgressDTO | null> {
  try {
    const response = await apiClient.get<EnrollmentStepProgressDTO>(
      `/api/v2/learning/enrollments/${enrollmentId}/steps/${stepId}/progress`
    )
    return response.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null
    }
    throw error
  }
}

/**
 * Get all answers for an enrollment step
 * GET /api/v2/learning/enrollments/{enrollmentId}/steps/{stepId}/answers
 */
export async function getAnswers(enrollmentId: number, stepId: number): Promise<EnrollmentAnswerDTO[]> {
  const response = await apiClient.get<EnrollmentAnswerDTO[]>(
    `/api/v2/learning/enrollments/${enrollmentId}/steps/${stepId}/answers`
  )
  return response.data
}

/**
 * Add an answer to an enrollment step
 * POST /api/v2/learning/enrollments/{enrollmentId}/steps/{stepId}/answers
 */
export async function addAnswer(
  enrollmentId: number,
  stepId: number,
  request: AddAnswerRequest
): Promise<EnrollmentAnswerDTO> {
  const response = await apiClient.post<EnrollmentAnswerDTO>(
    `/api/v2/learning/enrollments/${enrollmentId}/steps/${stepId}/answers`,
    request
  )
  return response.data
}

/**
 * Update progress for an enrollment step
 * POST /api/v2/learning/enrollments/{enrollmentId}/steps/{stepId}/progress
 */
export async function updateProgress(
  enrollmentId: number,
  stepId: number,
  request: UpdateProgressRequest
): Promise<EnrollmentStepProgressDTO> {
  const response = await apiClient.post<EnrollmentStepProgressDTO>(
    `/api/v2/learning/enrollments/${enrollmentId}/steps/${stepId}/progress`,
    request
  )
  return response.data
}

/**
 * Complete an enrollment
 * POST /api/v2/learning/enrollments/{id}/complete
 */
export async function completeEnrollment(enrollmentId: number): Promise<void> {
  await apiClient.post(`/api/v2/learning/enrollments/${enrollmentId}/complete`, {})
}
