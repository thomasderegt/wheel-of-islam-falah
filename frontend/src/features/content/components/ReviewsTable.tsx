/**
 * ReviewsTable Component
 * Table displaying reviews with approve/reject actions
 */

'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { CheckCircle, XCircle, Eye } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { approveReview, rejectReview, type ReviewDTO } from '../api/contentApi'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { Textarea } from '@/shared/components/ui/textarea'
import { Label } from '@/shared/components/ui/label'

interface ReviewsTableProps {
  readonly reviews: ReviewDTO[]
}

export function ReviewsTable({ reviews }: ReviewsTableProps) {
  const queryClient = useQueryClient()
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<ReviewDTO | null>(null)
  const [comment, setComment] = useState('')
  const userId = 1 // TODO: Get from auth context

  const approveMutation = useMutation({
    mutationFn: (data: { reviewedBy: number; comment?: string | null }) =>
      approveReview(selectedReview!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      setApproveDialogOpen(false)
      setSelectedReview(null)
      setComment('')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: (data: { reviewedBy: number; comment: string }) =>
      rejectReview(selectedReview!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      setRejectDialogOpen(false)
      setSelectedReview(null)
      setComment('')
    },
  })

  const handleApprove = (review: ReviewDTO) => {
    setSelectedReview(review)
    setComment('')
    setApproveDialogOpen(true)
  }

  const handleReject = (review: ReviewDTO) => {
    setSelectedReview(review)
    setComment('')
    setRejectDialogOpen(true)
  }

  const handleApproveSubmit = () => {
    if (!selectedReview) return
    approveMutation.mutate({
      reviewedBy: userId,
      comment: comment || null,
    })
  }

  const handleRejectSubmit = () => {
    if (!selectedReview || !comment.trim()) {
      alert('Comment is required for rejection')
      return
    }
    rejectMutation.mutate({
      reviewedBy: userId,
      comment: comment,
    })
  }

  const getStatusBadgeVariant = (status: ReviewDTO['status']) => {
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

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No reviews found</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Version ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">{review.id}</TableCell>
                <TableCell>{review.reviewedVersionId}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(review.status)}>
                    {review.status}
                  </Badge>
                </TableCell>
                <TableCell>{review.submittedBy ?? 'N/A'}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {review.comment || 'No comment'}
                </TableCell>
                <TableCell>
                  {new Date(review.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {review.status === 'SUBMITTED' && (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(review)}
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(review)}
                        className="gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
            <Button
              variant="outline"
              onClick={() => setApproveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApproveSubmit}
              disabled={approveMutation.isPending}
            >
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
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
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
    </>
  )
}

