/**
 * FieldCommentList Component
 * Displays a list of comments for a field
 */

"use client"

import type { ReviewCommentDTO } from "../api/contentApi"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Trash2, Edit2 } from "lucide-react"
import { useState } from "react"
import { Textarea } from "@/shared/components/ui/textarea"
import { AuthAudioPlayer } from "./AuthAudioPlayer"

interface FieldCommentListProps {
  comments: ReviewCommentDTO[]
  onEdit: (commentId: number, newText: string) => Promise<void>
  onDelete: (commentId: number) => Promise<void>
  currentUserId?: number
  readOnly?: boolean // If true, comments cannot be edited or deleted
  compact?: boolean // If true, use smaller padding and lighter styling
  /** If true, show delete button for all comments (backend still enforces creator-only) */
  allowDeleteForAll?: boolean
}

export function FieldCommentList({
  comments,
  onEdit,
  onDelete,
  currentUserId,
  readOnly = false,
  compact = false,
  allowDeleteForAll = false,
}: FieldCommentListProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState("")
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleEditStart = (comment: ReviewCommentDTO) => {
    setEditingId(comment.id)
    setEditText(comment.commentText)
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditText("")
  }

  const handleEditSave = async (commentId: number) => {
    try {
      await onEdit(commentId, editText)
      setEditingId(null)
      setEditText("")
    } catch (error) {
      console.error("Failed to update comment:", error)
      alert("Failed to update comment. Please try again.")
    }
  }

  const handleDelete = async (commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return
    }
    try {
      setDeletingId(commentId)
      await onDelete(commentId)
    } catch (error) {
      console.error("Failed to delete comment:", error)
      alert("Failed to delete comment. Please try again.")
      setDeletingId(null)
    }
  }

  if (comments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No comments yet.</p>
    )
  }

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {comments.map((comment) => {
        const isEditing = editingId === comment.id
        const isDeleting = deletingId === comment.id
        const canEdit = currentUserId === comment.createdBy

        const content = (
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className={compact ? "min-h-[60px]" : "min-h-[100px]"}
                    placeholder="Enter your comment..."
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleEditSave(comment.id)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {comment.audioUrl && (
                    <div className="mb-2">
                      <AuthAudioPlayer
                        audioUrl={comment.audioUrl}
                        className="max-w-full h-8"
                      />
                    </div>
                  )}
                  {comment.commentText && comment.commentText !== '[Voice recording]' && (
                    <p className="whitespace-pre-wrap text-sm">
                      {comment.commentText}
                    </p>
                  )}
                  <p className={`text-xs text-muted-foreground ${compact ? "mt-1" : "mt-2"}`}>
                    By user {comment.createdBy} •{" "}
                    {new Date(comment.createdAt).toLocaleString()}
                    {comment.updatedAt !== comment.createdAt && " (edited)"}
                  </p>
                </>
              )}
            </div>
            {!isEditing && !readOnly && (canEdit || allowDeleteForAll) && (
              <div className="flex gap-1 shrink-0">
                {canEdit && !comment.audioUrl && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => handleEditStart(comment)}
                    disabled={isDeleting}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => handleDelete(comment.id)}
                  disabled={isDeleting}
                  title="Delete comment"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )

        return compact ? (
          <div
            key={comment.id}
            className="rounded-md border bg-muted/30 px-3 py-2"
          >
            {content}
          </div>
        ) : (
          <Card key={comment.id}>
            <CardContent className="p-4">
              {content}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
