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

interface FieldCommentListProps {
  comments: ReviewCommentDTO[]
  onEdit: (commentId: number, newText: string) => Promise<void>
  onDelete: (commentId: number) => Promise<void>
  currentUserId?: number
  readOnly?: boolean // If true, comments cannot be edited or deleted
}

export function FieldCommentList({
  comments,
  onEdit,
  onDelete,
  currentUserId,
  readOnly = false,
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
    <div className="space-y-3">
      {comments.map((comment) => {
        const isEditing = editingId === comment.id
        const isDeleting = deletingId === comment.id
        const canEdit = currentUserId === comment.createdBy

        return (
          <Card key={comment.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="min-h-[100px]"
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
                      <p className="whitespace-pre-wrap text-sm">
                        {comment.commentText}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        By user {comment.createdBy} •{" "}
                        {new Date(comment.createdAt).toLocaleString()}
                        {comment.updatedAt !== comment.createdAt && " (edited)"}
                      </p>
                    </>
                  )}
                </div>
                {!isEditing && canEdit && !readOnly && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditStart(comment)}
                      disabled={isDeleting}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(comment.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
