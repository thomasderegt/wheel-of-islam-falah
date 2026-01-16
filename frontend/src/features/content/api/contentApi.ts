/**
 * Content API - API calls for content management
 */

import apiClient from '@/shared/api/client'
import type { 
  BookVersionDTO, 
  ChapterVersionDTO, 
  ParagraphVersionDTO, 
  SectionVersionDTO,
  CategoryDTO,
  BookDTO,
  ChapterDTO,
  SectionDTO,
  SectionVersionDTO as SectionVersionDTOType
} from '@/shared/api/types'

// ========== Version History ==========

/**
 * Get version history for a book
 */
export async function getBookVersionHistory(bookId: number): Promise<BookVersionDTO[]> {
  const response = await apiClient.get(`/api/v2/content/books/${bookId}/versions`)
  return response.data
}

/**
 * Get version history for a chapter
 */
export async function getChapterVersionHistory(chapterId: number): Promise<ChapterVersionDTO[]> {
  const response = await apiClient.get(`/api/v2/content/chapters/${chapterId}/versions`)
  return response.data
}

/**
 * Get version history for a paragraph
 */
export async function getParagraphVersionHistory(paragraphId: number): Promise<ParagraphVersionDTO[]> {
  const response = await apiClient.get(`/api/v2/content/paragraphs/${paragraphId}/versions`)
  return response.data
}

/**
 * Get version history for a section
 */
export async function getSectionVersionHistory(sectionId: number): Promise<SectionVersionDTO[]> {
  const response = await apiClient.get(`/api/v2/content/sections/${sectionId}/versions`)
  return response.data
}

// ========== Content Viewer (Public/Read-only) ==========

/**
 * Get category by ID
 */
export async function getCategory(categoryId: number): Promise<CategoryDTO> {
  const response = await apiClient.get(`/api/v2/content/categories/${categoryId}`)
  return response.data
}

/**
 * Get category by category number
 */
export async function getCategoryByNumber(categoryNumber: number): Promise<CategoryDTO> {
  const response = await apiClient.get(`/api/v2/content/categories/${categoryNumber}?byNumber=true`)
  return response.data
}

/**
 * Get all books in a category
 */
export async function getBooksByCategory(categoryId: number): Promise<BookDTO[]> {
  const response = await apiClient.get(`/api/v2/content/categories/${categoryId}/books`)
  return response.data
}

/**
 * Get all published books in a category (PUBLIC endpoint)
 * Only returns books with PUBLISHED status
 */
export async function getPublicBooksByCategory(categoryId: number): Promise<BookDTO[]> {
  const response = await apiClient.get(`/api/v2/content/categories/${categoryId}/books?published=true`)
  return response.data
}

/**
 * Get all published chapters in a book (PUBLIC endpoint)
 * Only returns chapters with PUBLISHED status
 */
export async function getPublicChaptersByBook(bookId: number): Promise<ChapterDTO[]> {
  const response = await apiClient.get(`/api/v2/content/books/${bookId}/chapters?published=true`)
  return response.data
}

/**
 * Get all chapters in a book
 */
export async function getChaptersByBook(bookId: number): Promise<ChapterDTO[]> {
  const response = await apiClient.get(`/api/v2/content/books/${bookId}/chapters`)
  return response.data
}

/**
 * Get chapter by ID
 */
export async function getChapter(chapterId: number): Promise<ChapterDTO> {
  const response = await apiClient.get(`/api/v2/content/chapters/${chapterId}`)
  return response.data
}

/**
 * Get all published sections in a chapter (PUBLIC endpoint)
 * Only returns sections with PUBLISHED status
 */
export async function getPublicSectionsByChapter(chapterId: number): Promise<SectionDTO[]> {
  const response = await apiClient.get(`/api/v2/content/chapters/${chapterId}/sections?published=true`)
  return response.data
}

/**
 * Get all sections in a chapter
 */
export async function getSectionsByChapter(chapterId: number): Promise<SectionDTO[]> {
  const response = await apiClient.get(`/api/v2/content/chapters/${chapterId}/sections`)
  return response.data
}

/**
 * Get all published paragraphs in a section (PUBLIC endpoint)
 * Only returns paragraphs with PUBLISHED status
 */
export async function getPublicParagraphsBySection(sectionId: number): Promise<any[]> {
  const response = await apiClient.get(`/api/v2/content/sections/${sectionId}/paragraphs?published=true`)
  return response.data
}

/**
 * Get all paragraphs in a section
 */
export async function getParagraphsBySection(sectionId: number): Promise<any[]> {
  const response = await apiClient.get(`/api/v2/content/sections/${sectionId}/paragraphs`)
  return response.data
}

/**
 * Get section by ID
 */
export async function getSection(sectionId: number): Promise<SectionDTO> {
  const response = await apiClient.get(`/api/v2/content/sections/${sectionId}`)
  return response.data
}

/**
 * Get book by ID
 */
export async function getBook(bookId: number): Promise<BookDTO> {
  const response = await apiClient.get(`/api/v2/content/books/${bookId}`)
  return response.data
}

/**
 * Get paragraph by ID
 */
export async function getParagraph(paragraphId: number): Promise<any> {
  const response = await apiClient.get(`/api/v2/content/paragraphs/${paragraphId}`)
  return response.data
}

/**
 * Get published version of a section
 */
export async function getSectionPublishedVersion(sectionId: number): Promise<SectionVersionDTOType | null> {
  try {
    const response = await apiClient.get(`/api/v2/content/sections/${sectionId}/versions/published`)
    return response.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null
    }
    throw error
  }
}

/**
 * Get current (working) version of a section
 */
export async function getSectionCurrentVersion(sectionId: number): Promise<SectionVersionDTOType | null> {
  try {
    const response = await apiClient.get(`/api/v2/content/sections/${sectionId}/versions/current`)
    return response.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null
    }
    throw error
  }
}

/**
 * Get current (working) version of a book
 */
export async function getBookCurrentVersion(bookId: number): Promise<BookVersionDTO | null> {
  try {
    const response = await apiClient.get(`/api/v2/content/books/${bookId}/versions/current`)
    return response.data
  } catch (error: any) {
    // 404 means no version exists yet - this is normal, return null
    if (error.response?.status === 404) {
      return null
    }
    // Log other errors but don't throw for missing versions
    console.warn(`Failed to get book current version for book ${bookId}:`, error.response?.status || error.message)
    return null
  }
}

/**
 * Get current (working) version of a chapter
 */
export async function getChapterCurrentVersion(chapterId: number): Promise<ChapterVersionDTO | null> {
  try {
    const response = await apiClient.get(`/api/v2/content/chapters/${chapterId}/versions/current`)
    return response.data
  } catch (error: any) {
    // 404 means no version exists yet - this is normal, return null
    if (error.response?.status === 404) {
      return null
    }
    // Log other errors but don't throw for missing versions
    console.warn(`Failed to get chapter current version for chapter ${chapterId}:`, error.response?.status || error.message)
    return null
  }
}

/**
 * Get published version of a paragraph
 */
export async function getParagraphPublishedVersion(paragraphId: number): Promise<ParagraphVersionDTO | null> {
  try {
    const response = await apiClient.get(`/api/v2/content/paragraphs/${paragraphId}/versions/published`)
    return response.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null
    }
    throw error
  }
}

// ========== Admin Content Management ==========

/**
 * Get all categories (for admin - includes all content)
 */
export async function getAllCategories(): Promise<CategoryDTO[]> {
  const response = await apiClient.get(`/api/v2/content/categories`)
  return response.data
}

// ========== Create Content ==========

/**
 * Create a new category
 */
export async function createCategory(data: {
  titleNl?: string | null
  titleEn?: string | null
  descriptionNl?: string | null
  descriptionEn?: string | null
}): Promise<CategoryDTO> {
  const response = await apiClient.post(`/api/v2/content/categories`, data)
  return response.data
}

/**
 * Create a new book
 */
export async function createBook(data: {
  categoryId: number
}): Promise<BookDTO> {
  const response = await apiClient.post(`/api/v2/content/books`, data)
  return response.data
}

/**
 * Create a new chapter
 */
export async function createChapter(data: {
  bookId: number
  position?: number | null
}): Promise<ChapterDTO> {
  const response = await apiClient.post(`/api/v2/content/chapters`, data)
  return response.data
}

/**
 * Create a new section
 */
export async function createSection(data: {
  chapterId: number
  orderIndex: number
}): Promise<SectionDTO> {
  const response = await apiClient.post(`/api/v2/content/sections`, data)
  return response.data
}

/**
 * Create a new paragraph
 */
export async function createParagraph(data: {
  sectionId: number
  paragraphNumber: number
}): Promise<any> {
  const response = await apiClient.post(`/api/v2/content/paragraphs`, data)
  return response.data
}

// ========== Update Content ==========

/**
 * Update a book
 */
export async function updateBook(bookId: number, data: {
  bookNumber?: number | null
}): Promise<BookDTO> {
  const response = await apiClient.put(`/api/v2/content/books/${bookId}`, data)
  return response.data
}

/**
 * Update a chapter
 */
export async function updateChapter(chapterId: number, data: {
  chapterNumber?: number | null
  position?: number | null
}): Promise<ChapterDTO> {
  const response = await apiClient.put(`/api/v2/content/chapters/${chapterId}`, data)
  return response.data
}

/**
 * Update a paragraph
 */
export async function updateParagraph(paragraphId: number, data: {
  paragraphNumber?: number | null
}): Promise<any> {
  const response = await apiClient.put(`/api/v2/content/paragraphs/${paragraphId}`, data)
  return response.data
}

// ========== Version Management ==========

/**
 * Create a new section version
 */
export async function createSectionVersion(sectionId: number, data: {
  titleEn?: string | null
  titleNl?: string | null
  introEn?: string | null
  introNl?: string | null
  userId: number
}): Promise<SectionVersionDTO> {
  const response = await apiClient.post(`/api/v2/content/sections/${sectionId}/versions`, {
    sectionId,
    ...data,
  })
  return response.data
}

/**
 * Create a new book version
 */
export async function createBookVersion(bookId: number, data: {
  titleEn?: string | null
  titleNl?: string | null
  introEn?: string | null
  introNl?: string | null
  userId: number
}): Promise<BookVersionDTO> {
  const response = await apiClient.post(`/api/v2/content/books/${bookId}/versions`, {
    bookId,
    ...data,
  })
  return response.data
}

/**
 * Create a new chapter version
 */
export async function createChapterVersion(chapterId: number, data: {
  titleEn?: string | null
  titleNl?: string | null
  introEn?: string | null
  introNl?: string | null
  userId: number
}): Promise<ChapterVersionDTO> {
  const response = await apiClient.post(`/api/v2/content/chapters/${chapterId}/versions`, {
    chapterId,
    ...data,
  })
  return response.data
}

// ========== Review Management ==========

export interface ReviewDTO {
  id: number
  reviewableItemId: number
  reviewedVersionId: number
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED'
  comment: string | null
  submittedBy: number | null
  reviewedBy: number | null
  createdAt: string
  updatedAt: string
}

/**
 * Get reviews by status
 */
export async function getReviewsByStatus(status: 'SUBMITTED' | 'APPROVED' | 'REJECTED'): Promise<ReviewDTO[]> {
  const response = await apiClient.get(`/api/v2/content/reviews/status/${status}`)
  return response.data
}

/**
 * Get review by ID
 */
export async function getReview(reviewId: number): Promise<ReviewDTO> {
  const response = await apiClient.get(`/api/v2/content/reviews/${reviewId}`)
  return response.data
}

/**
 * Submit content for review
 */
export async function submitForReview(data: {
  type: 'SECTION' | 'PARAGRAPH' | 'CHAPTER' | 'BOOK'
  referenceId: number
  versionId: number
  submittedBy: number
  comment?: string | null
}): Promise<ReviewDTO> {
  const response = await apiClient.post(`/api/v2/content/reviews/submit`, data)
  return response.data
}

/**
 * Approve a review
 */
export async function approveReview(reviewId: number, data: {
  reviewedBy: number
  comment?: string | null
}): Promise<ReviewDTO> {
  const response = await apiClient.post(`/api/v2/content/reviews/${reviewId}/approve`, data)
  return response.data
}

/**
 * Reject a review
 */
export async function rejectReview(reviewId: number, data: {
  reviewedBy: number
  comment: string
}): Promise<ReviewDTO> {
  const response = await apiClient.post(`/api/v2/content/reviews/${reviewId}/reject`, data)
  return response.data
}

// ========== Review Comments ==========

export interface ReviewCommentDTO {
  id: number
  reviewId: number
  reviewedVersionId: number
  fieldName: string
  commentText: string
  createdBy: number
  createdAt: string
  updatedAt: string
}

export interface AddReviewCommentRequest {
  reviewedVersionId: number
  fieldName: string
  commentText: string
}

export interface UpdateReviewCommentRequest {
  commentText: string
}

/**
 * Add a comment to a specific field of a review
 */
export async function addReviewComment(
  reviewId: number,
  request: AddReviewCommentRequest
): Promise<ReviewCommentDTO> {
  const response = await apiClient.post(`/api/v2/content/reviews/${reviewId}/comments`, request)
  return response.data
}

/**
 * Get all comments for a review
 */
export async function getReviewComments(reviewId: number): Promise<ReviewCommentDTO[]> {
  const response = await apiClient.get(`/api/v2/content/reviews/${reviewId}/comments`)
  return response.data
}

/**
 * Update a review comment
 */
export async function updateReviewComment(
  commentId: number,
  request: UpdateReviewCommentRequest
): Promise<ReviewCommentDTO> {
  const response = await apiClient.put(`/api/v2/content/reviews/comments/${commentId}`, request)
  return response.data
}

/**
 * Delete a review comment
 */
export async function deleteReviewComment(commentId: number): Promise<void> {
  await apiClient.delete(`/api/v2/content/reviews/comments/${commentId}`)
}
