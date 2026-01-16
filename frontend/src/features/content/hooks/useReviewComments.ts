/**
 * Hook for managing review comments
 */

import { useState, useEffect, useCallback } from "react"
import { 
  getReviewComments, 
  addReviewComment, 
  updateReviewComment, 
  deleteReviewComment,
  type ReviewCommentDTO,
  type AddReviewCommentRequest,
  type UpdateReviewCommentRequest
} from "../api/contentApi"

export function useReviewComments(reviewId: number | null) {
  const [comments, setComments] = useState<ReviewCommentDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Fetch comments
  const fetchComments = useCallback(async () => {
    if (!reviewId) {
      setComments([])
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await getReviewComments(reviewId)
      setComments(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }, [reviewId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  // Add comment
  const addComment = useCallback(async (
    request: AddReviewCommentRequest
  ): Promise<ReviewCommentDTO> => {
    if (!reviewId) {
      throw new Error("Review ID is required")
    }

    setError(null)
    try {
      const newComment = await addReviewComment(reviewId, request)
      setComments((prev) => [...prev, newComment])
      return newComment
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      throw err
    }
  }, [reviewId])

  // Update comment
  const updateComment = useCallback(async (
    commentId: number,
    request: UpdateReviewCommentRequest
  ): Promise<ReviewCommentDTO> => {
    setError(null)
    try {
      const updated = await updateReviewComment(commentId, request)
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? updated : c))
      )
      return updated
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      throw err
    }
  }, [])

  // Delete comment
  const deleteComment = useCallback(async (commentId: number): Promise<void> => {
    setError(null)
    try {
      await deleteReviewComment(commentId)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      throw err
    }
  }, [])

  // Get comments for a specific field
  const getCommentsForField = useCallback((fieldName: string): ReviewCommentDTO[] => {
    return comments.filter((c) => c.fieldName === fieldName)
  }, [comments])

  return {
    comments,
    loading,
    error,
    addComment,
    updateComment,
    deleteComment,
    getCommentsForField,
    refresh: fetchComments,
  }
}
