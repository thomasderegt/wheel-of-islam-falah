/**
 * Review Detail Page
 * Detail page for viewing a review with approve/reject actions
 * Route: /admin/content/review/[id]
 */

'use client'

import React, { useState } from 'react'
import type { ReviewCommentDTO } from '@/features/content/api/contentApi'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, FileText } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getReview, approveReview, rejectReview } from '@/features/content/api/contentApi'
import { useReviewComments } from '@/features/content/hooks/useReviewComments'
import { FieldCommentList } from '@/features/content/components/FieldCommentList'
import { VoiceRecordButton } from '@/features/content/components/VoiceRecordButton'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Loading } from '@/shared/components/ui/Loading'
import { Error } from '@/shared/components/ui/Error'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { Textarea } from '@/shared/components/ui/textarea'
import { Label } from '@/shared/components/ui/label'

function FieldWithComments({
  reviewId,
  fieldName,
  fieldLabel,
  content,
  reviewedVersionId,
  comments,
  newCommentByField,
  setNewCommentByField,
  addingField,
  setAddingField,
  addComment,
  updateComment,
  deleteComment,
  refreshComments,
  currentUserId,
}: {
  reviewId: number
  fieldName: string
  fieldLabel: string
  content: string
  reviewedVersionId: number
  comments: ReviewCommentDTO[]
  newCommentByField: Record<string, string>
  setNewCommentByField: React.Dispatch<React.SetStateAction<Record<string, string>>>
  addingField: string | null
  setAddingField: (v: string | null) => void
  addComment: (r: { reviewedVersionId: number; fieldName: string; commentText: string }) => Promise<ReviewCommentDTO>
  updateComment: (id: number, r: { commentText: string }) => Promise<ReviewCommentDTO>
  deleteComment: (id: number) => Promise<void>
  refreshComments: () => void
  currentUserId?: number
}) {
  const newText = newCommentByField[fieldName] ?? ''
  const isAdding = addingField === fieldName
  const [showTextInput, setShowTextInput] = useState(false)

  const handleAdd = async () => {
    if (!newText.trim()) return
    setAddingField(fieldName)
    try {
      await addComment({ reviewedVersionId, fieldName, commentText: newText.trim() })
      setNewCommentByField((prev) => ({ ...prev, [fieldName]: '' }))
      setShowTextInput(false)
      refreshComments()
    } catch (e) {
      console.error(e)
      alert('Failed to add comment')
    } finally {
      setAddingField(null)
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <dt className="text-sm font-medium text-muted-foreground mb-1">{fieldLabel}</dt>
        <dd className="p-3 bg-muted rounded-md whitespace-pre-wrap">{content}</dd>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Comments on {fieldLabel}</h4>
        <FieldCommentList
          comments={comments}
          compact
          onEdit={async (id, text) => {
            await updateComment(id, { commentText: text })
            refreshComments()
          }}
          onDelete={async (id) => {
            await deleteComment(id)
            refreshComments()
          }}
          currentUserId={currentUserId}
          allowDeleteForAll
        />
        <div className="mt-3 space-y-2">
          {showTextInput && (
            <>
              <Textarea
                value={newText}
                onChange={(e) => setNewCommentByField((prev) => ({ ...prev, [fieldName]: e.target.value }))}
                placeholder={`Add a comment for ${fieldLabel}...`}
                className="min-h-[60px]"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAdd}
                  disabled={!newText.trim() || isAdding}
                >
                  {isAdding ? 'Adding...' : 'Add comment'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowTextInput(false)
                    setNewCommentByField((prev) => ({ ...prev, [fieldName]: '' }))
                  }}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTextInput((v) => !v)}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Text
            </Button>
            <VoiceRecordButton
              reviewId={reviewId}
              reviewedVersionId={reviewedVersionId}
              fieldName={fieldName}
              onSuccess={refreshComments}
              disabled={isAdding}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ReviewDetailPage() {
  const params = useParams()
  const router = useRouter()
  const reviewId = Number(params.id)
  const queryClient = useQueryClient()
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [newCommentByField, setNewCommentByField] = useState<Record<string, string>>({})
  const [addingField, setAddingField] = useState<string | null>(null)
  const userId = 1 // TODO: Get from auth context
  const { user } = useAuth()

  const { data: review, isLoading, error } = useQuery({
    queryKey: ['review', reviewId],
    queryFn: () => getReview(reviewId),
    enabled: !!reviewId,
  })

  const {
    getCommentsForField,
    addComment,
    updateComment,
    deleteComment,
    refresh: refreshComments,
  } = useReviewComments(review?.id ?? null)

  const approveMutation = useMutation({
    mutationFn: (data: { reviewedBy: number; comment?: string | null }) =>
      approveReview(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review', reviewId] })
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      setApproveDialogOpen(false)
      setComment('')
      router.push('/admin/content/review')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: (data: { reviewedBy: number; comment: string }) =>
      rejectReview(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review', reviewId] })
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      setRejectDialogOpen(false)
      setComment('')
      router.push('/admin/content/review')
    },
  })

  const handleApproveSubmit = () => {
    approveMutation.mutate({
      reviewedBy: userId,
      comment: comment || null,
    })
  }

  const handleRejectSubmit = () => {
    if (!comment.trim()) {
      alert('Comment is required for rejection')
      return
    }
    rejectMutation.mutate({
      reviewedBy: userId,
      comment: comment,
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'secondary'
      case 'APPROVED':
        return 'default'
      case 'REJECTED':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Loading />
      </div>
    )
  }

  if (error || !review) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Error message={error?.message || 'Review not found'} />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/content/review">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Reviews
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{review.title || 'Review'}</CardTitle>
              <p className="text-muted-foreground mt-1">
                {review.entityType} • Version {review.reviewedVersionId}
              </p>
            </div>
            <Badge variant={getStatusBadgeVariant(review.status)}>{review.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Review ID</dt>
              <dd className="mt-1">{review.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Submitted By</dt>
              <dd className="mt-1">{review.submittedBy ?? 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Reviewed By</dt>
              <dd className="mt-1">{review.reviewedBy ?? '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
              <dd className="mt-1">{new Date(review.createdAt).toLocaleString()}</dd>
            </div>
          </dl>

          {review.comment && (
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Comment</dt>
              <dd className="mt-1 p-3 bg-muted rounded-md">{review.comment}</dd>
            </div>
          )}

          {review.status === 'SUBMITTED' && (
            <div className="flex gap-2 pt-4">
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setComment('')
                  setApproveDialogOpen(true)
                }}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setComment('')
                  setRejectDialogOpen(true)
                }}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content being reviewed - separate card */}
      {(review.versionContentTitleEn || review.versionContentTitleNl ||
        review.versionContentIntroEn || review.versionContentIntroNl ||
        review.versionContentContentEn || review.versionContentContentNl) && (
        <Card>
          <CardHeader>
            <CardTitle>Content being reviewed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(review.versionContentTitleEn || review.versionContentTitleNl) && (
              <FieldWithComments
                reviewId={review.id}
                fieldName={review.versionContentTitleEn ? 'titleEn' : 'titleNl'}
                fieldLabel="Title"
                content={review.versionContentTitleEn || review.versionContentTitleNl}
                reviewedVersionId={review.reviewedVersionId}
                comments={getCommentsForField(review.versionContentTitleEn ? 'titleEn' : 'titleNl')}
                newCommentByField={newCommentByField}
                setNewCommentByField={setNewCommentByField}
                addingField={addingField}
                setAddingField={setAddingField}
                addComment={addComment}
                updateComment={updateComment}
                deleteComment={deleteComment}
                refreshComments={refreshComments}
                currentUserId={user?.id ?? userId}
              />
            )}
            {(review.versionContentIntroEn || review.versionContentIntroNl) && (
              <FieldWithComments
                reviewId={review.id}
                fieldName={review.versionContentIntroEn ? 'introEn' : 'introNl'}
                fieldLabel="Intro"
                content={review.versionContentIntroEn || review.versionContentIntroNl}
                reviewedVersionId={review.reviewedVersionId}
                comments={getCommentsForField(review.versionContentIntroEn ? 'introEn' : 'introNl')}
                newCommentByField={newCommentByField}
                setNewCommentByField={setNewCommentByField}
                addingField={addingField}
                setAddingField={setAddingField}
                addComment={addComment}
                updateComment={updateComment}
                deleteComment={deleteComment}
                refreshComments={refreshComments}
                currentUserId={user?.id ?? userId}
              />
            )}
            {(review.versionContentContentEn || review.versionContentContentNl) && (
              <FieldWithComments
                reviewId={review.id}
                fieldName={review.versionContentContentEn ? 'contentEn' : 'contentNl'}
                fieldLabel="Content"
                content={review.versionContentContentEn || review.versionContentContentNl}
                reviewedVersionId={review.reviewedVersionId}
                comments={getCommentsForField(review.versionContentContentEn ? 'contentEn' : 'contentNl')}
                newCommentByField={newCommentByField}
                setNewCommentByField={setNewCommentByField}
                addingField={addingField}
                setAddingField={setAddingField}
                addComment={addComment}
                updateComment={updateComment}
                deleteComment={deleteComment}
                refreshComments={refreshComments}
                currentUserId={user?.id ?? userId}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Review</DialogTitle>
            <DialogDescription>
              Approve this review? You can optionally add a comment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="approveComment">Comment (optional)</Label>
              <Textarea
                id="approveComment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
              />
            </div>
            {approveMutation.isError && (
              <p className="text-sm text-destructive">
                Error: {approveMutation.error?.message || 'Failed to approve review'}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApproveSubmit} disabled={approveMutation.isPending}>
              {approveMutation.isPending ? 'Approving...' : 'Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Review</DialogTitle>
            <DialogDescription>
              Reject this review. A comment is required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejectComment">Comment *</Label>
              <Textarea
                id="rejectComment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Explain why this review is rejected..."
                rows={4}
                required
              />
            </div>
            {rejectMutation.isError && (
              <p className="text-sm text-destructive">
                Error: {rejectMutation.error?.message || 'Failed to reject review'}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRejectSubmit}
              disabled={rejectMutation.isPending || !comment.trim()}
              variant="destructive"
            >
              {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
