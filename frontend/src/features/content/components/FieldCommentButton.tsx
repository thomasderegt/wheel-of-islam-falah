/**
 * FieldCommentButton Component
 * Button to add/view comments for a specific field
 */

"use client"

import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { MessageSquare } from "lucide-react"
import { useState } from "react"
import { FieldCommentModal } from "./FieldCommentModal"
import type { ReviewCommentDTO } from "../api/contentApi"

interface FieldCommentButtonProps {
  fieldName: string
  fieldLabel: string
  reviewId: number | null
  reviewedVersionId: number
  comments: ReviewCommentDTO[]
  rejectedComments?: ReviewCommentDTO[] // Comments from rejected reviews
}

export function FieldCommentButton({
  fieldName,
  fieldLabel,
  reviewId,
  reviewedVersionId,
  comments,
  rejectedComments = [],
}: FieldCommentButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const fieldComments = comments.filter((c) => c.fieldName === fieldName)
  const commentCount = fieldComments.length

  const handleClick = () => {
    if (!reviewId) {
      alert("No review found for this version. Please submit this version for review first.")
      return
    }
    setIsOpen(true)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        className="gap-2"
        disabled={!reviewId}
        title={!reviewId ? `No review found for version ${reviewedVersionId}. Submit for review first.` : `Add/view comments for ${fieldLabel}`}
      >
        <MessageSquare className="h-4 w-4" />
        Comments
        {commentCount > 0 && (
          <Badge variant="secondary" className="ml-1">
            {commentCount}
          </Badge>
        )}
      </Button>
      {isOpen && reviewId && (
        <FieldCommentModal
          fieldName={fieldName}
          fieldLabel={fieldLabel}
          reviewId={reviewId}
          reviewedVersionId={reviewedVersionId}
          comments={fieldComments}
          rejectedComments={rejectedComments.filter(c => c.fieldName === fieldName)}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
