/**
 * FieldCommentModal Component
 * Modal for adding and viewing comments on a specific field
 */

"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Textarea } from "@/shared/components/ui/textarea"
import { FieldCommentList } from "./FieldCommentList"
import { useReviewComments } from "../hooks/useReviewComments"
import type { ReviewCommentDTO } from "../api/contentApi"
import { useState } from "react"
import { useAuth } from "@/features/auth/hooks/useAuth"

interface FieldCommentModalProps {
  fieldName: string
  fieldLabel: string
  reviewId: number
  reviewedVersionId: number
  comments: ReviewCommentDTO[]
  rejectedComments?: ReviewCommentDTO[] // Comments from rejected reviews
  onClose: () => void
}

export function FieldCommentModal({
  fieldName,
  fieldLabel,
  reviewId,
  reviewedVersionId,
  comments,
  rejectedComments = [],
  onClose,
}: FieldCommentModalProps) {
  const [newCommentText, setNewCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addComment, updateComment, deleteComment, refresh } = useReviewComments(reviewId)
  const { user } = useAuth()

  const handleAddComment = async () => {
    if (!newCommentText.trim()) {
      return
    }

    setIsSubmitting(true)
    try {
      await addComment({
        reviewedVersionId,
        fieldName,
        commentText: newCommentText.trim(),
      })
      setNewCommentText("")
      await refresh()
    } catch (error) {
      console.error("Failed to add comment:", error)
      alert("Failed to add comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditComment = async (commentId: number, newText: string) => {
    try {
      await updateComment(commentId, { commentText: newText })
      await refresh()
    } catch (error) {
      throw error // Re-throw to let FieldCommentList handle it
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId)
      await refresh()
    } catch (error) {
      throw error // Re-throw to let FieldCommentList handle it
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Comments on {fieldLabel}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Comments from Previous Rejected Reviews */}
          {rejectedComments.length > 0 && (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 p-4">
              <h4 className="mb-3 text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Comments from Previous Rejected Review
              </h4>
              <p className="mb-3 text-xs text-yellow-700 dark:text-yellow-300">
                These comments are from a previous review that was rejected. They are shown for reference.
              </p>
              <FieldCommentList
                comments={rejectedComments}
                onEdit={async () => {}} // Read-only
                onDelete={async () => {}} // Read-only
                currentUserId={user?.id}
                readOnly={true}
              />
            </div>
          )}

          {/* Existing Comments from Current Review */}
          <div>
            <h4 className="mb-3 text-sm font-medium">
              {rejectedComments.length > 0 ? "Current Review Comments" : "Existing Comments"}
            </h4>
            {comments.length > 0 ? (
              <FieldCommentList
                comments={comments}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
                currentUserId={user?.id}
              />
            ) : (
              <p className="text-sm text-muted-foreground">No comments yet for this review.</p>
            )}
          </div>

          {/* Add New Comment */}
          <div className="border-t pt-4">
            <h4 className="mb-3 text-sm font-medium">Add Comment</h4>
            <Textarea
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Enter your comment..."
              className="min-h-[100px]"
            />
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                onClick={handleAddComment}
                disabled={!newCommentText.trim() || isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Comment"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
