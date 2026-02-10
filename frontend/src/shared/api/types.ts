/**
 * API Response Types
 * Generated from Backend V2 API Contract
 */

// ========== Auth Types ==========

export interface RegisterRequest {
  email: string
  password: string
}

export interface RegisterResponse {
  id: number
  email: string
  profileName: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED'
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  userId: number
  email: string
  token: string
  refreshToken: string
  expiresAt: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
  expiresAt: string
}

export interface UserResponse {
  id: number
  email: string
  profileName: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED'
  createdAt: string
  updatedAt: string
}

// ========== User Preferences Types ==========

// Mode type removed - no longer used (always SUCCESS)
// export type Mode = 'SUCCESS' | 'GOAL' | 'EXECUTE' | 'INSIGHT'
export type Context = 'SUCCESS' | 'LIFE' | 'BUSINESS' | 'WORK'
export type GoalsOkrContext = 'LIFE' | 'BUSINESS' | 'WORK' | 'NONE' | 'ALL'

export interface UserPreferenceResponse {
  id: number
  userId: number
  defaultContext: Context  // Always SUCCESS (Content Context)
  // defaultMode is no longer in API (always SUCCESS)
  defaultGoalsOkrContext?: GoalsOkrContext  // Separate Goals-OKR context (LIFE/WORK/BUSINESS/NONE)
  createdAt: string
  updatedAt: string
}

export interface UpdateUserPreferencesRequest {
  // defaultMode and defaultContext are no longer needed (always SUCCESS)
  defaultGoalsOkrContext?: GoalsOkrContext  // Separate Goals-OKR context
}

// ========== Content Types ==========

export interface WheelDTO {
  id: number
  wheelKey: string
  nameNl: string
  nameEn: string
  descriptionNl: string | null
  descriptionEn: string | null
  displayOrder: number
  createdAt: string
}

export interface CategoryDTO {
  id: number
  categoryNumber: number | null
  wheelId: number | null
  titleNl: string
  titleEn: string
  subtitleNl: string | null
  subtitleEn: string | null
  descriptionNl: string | null
  descriptionEn: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryRequest {
  titleNl: string | null
  titleEn: string | null // At least one required
  descriptionNl: string | null
  descriptionEn: string | null
}

export interface UpdateCategoryRequest {
  titleNl: string | null
  titleEn: string | null // At least one required
  descriptionNl: string | null
  descriptionEn: string | null
}

export interface BookDTO {
  id: number
  categoryId: number
  bookNumber: number | null
  workingStatusBookVersionId: number | null
  createdAt: string
  updatedAt: string
}

export interface CreateBookRequest {
  categoryId: number
}

export interface ChapterDTO {
  id: number
  bookId: number
  chapterNumber: number | null
  position: number // 0 (center) or 1-10 (circular)
  workingStatusChapterVersionId: number | null
  createdAt: string
  updatedAt: string
}

export interface CreateChapterRequest {
  bookId: number
  position: number | null // 0 (center) or 1-10 (circular), default = 0
}

export interface SectionDTO {
  id: number
  chapterId: number
  orderIndex: number
  workingStatusSectionVersionId: number | null
  createdAt: string
  updatedAt: string
}

export interface CreateSectionRequest {
  chapterId: number
  orderIndex: number
}

export interface SectionVersionDTO {
  id: number
  sectionId: number
  versionNumber: number
  titleEn: string
  titleNl: string
  introEn: string | null
  introNl: string | null
  createdBy: number
  createdAt: string
}

export interface BookVersionDTO {
  id: number
  bookId: number
  versionNumber: number
  titleEn: string | null
  titleNl: string | null
  introEn: string | null
  introNl: string | null
  createdBy: number | null
  createdAt: string
}

export interface ChapterVersionDTO {
  id: number
  chapterId: number
  versionNumber: number
  titleEn: string | null
  titleNl: string | null
  introEn: string | null
  introNl: string | null
  createdBy: number | null
  createdAt: string
}

export interface ParagraphVersionDTO {
  id: number
  paragraphId: number
  versionNumber: number
  titleEn: string | null
  titleNl: string | null
  contentEn: string | null
  contentNl: string | null
  createdBy: number | null
  createdAt: string
}

// ========== Learning Types ==========

export interface LearningFlowTemplateDTO {
  id: number
  name: string
  description: string | null
  sectionId: number
  createdAt: string
  createdBy: number | null
}

export interface StartEnrollmentRequest {
  userId: number
  templateId: number
  sectionId: number
}

export interface LearningFlowEnrollmentDTO {
  id: number
  userId: number
  templateId: number
  sectionId: number
  startedAt: string
  completedAt: string | null
}

export interface LearningFlowStepDTO {
  id: number
  templateId: number
  paragraphId: number
  orderIndex: number
  questionText: string
}

export interface EnrollmentAnswerDTO {
  id: number
  enrollmentId: number
  stepId: number
  type: 'PICTURE_QUESTION' | 'REFLECTION'
  answerText: string
  createdAt: string
}

export interface EnrollmentStepProgressDTO {
  id: number
  enrollmentId: number
  stepId: number
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  createdAt: string
  updatedAt: string
}

export interface UpdateProgressRequest {
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
}

export interface AddAnswerRequest {
  type: 'PICTURE_QUESTION' | 'REFLECTION'
  answerText: string
}

export interface CreateTemplateRequest {
  name: string
  description?: string | null
  sectionId: number
  createdBy: number
}

export interface CreateSectionVersionRequest {
  titleEn: string
  titleNl: string
  introEn: string | null
  introNl: string | null
  userId: number
}

export interface PublishSectionRequest {
  userId: number
}

export interface ParagraphDTO {
  id: number
  sectionId: number
  paragraphNumber: number
  workingStatusParagraphVersionId: number | null
  createdAt: string
  updatedAt: string
}

export interface CreateParagraphRequest {
  sectionId: number
  paragraphNumber: number // Must be positive
}

// ========== Error Types ==========

export interface ApiError {
  error: string
}

