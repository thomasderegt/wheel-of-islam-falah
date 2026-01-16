/**
 * Learning Review Page
 * Review dashboard page for reviewing learning template and step versions
 * Route: /admin/learning/review
 * 
 * NOTE: Learning template/step version reviews are not yet implemented in v2 backend.
 * This page shows the structure but reviews are not available yet.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Textarea } from '@/shared/components/ui/textarea'

type ReviewStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
type ReviewType = 'TEMPLATE' | 'STEP' | 'ALL'

interface ReviewFilters {
  status: ReviewStatus
  type: ReviewType
  templateName?: string
  sectionId?: number
}

export default function LearningReviewPage() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [filters, setFilters] = useState<ReviewFilters>({
    status: 'SUBMITTED',
    type: 'ALL',
  })
  const [sections, setSections] = useState<any[]>([])
  const [loadingSections, setLoadingSections] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<any | null>(null)
  const [comment, setComment] = useState('')
  const [processing, setProcessing] = useState(false)

  // Load sections for filter
  useEffect(() => {
    // TODO: Load sections when review API is available
    setLoadingSections(false)
  }, [])

  const loadReviews = useCallback(async () => {
    // NOTE: Learning template/step version reviews are not yet implemented in v2
    // This is a placeholder that will be implemented when the backend supports it
    setLoading(true)
    setError(null)
    try {
      // TODO: Implement when review API is available
      setItems([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadReviews()
  }, [loadReviews, refreshKey])

  const handleApprove = async () => {
    // TODO: Implement when review API is available
    setApproveDialogOpen(false)
    setSelectedReview(null)
    setComment('')
  }

  const handleReject = async () => {
    // TODO: Implement when review API is available
    setRejectDialogOpen(false)
    setSelectedReview(null)
    setComment('')
  }

  const openApproveDialog = (item: any) => {
    setSelectedReview(item)
    setComment('')
    setApproveDialogOpen(true)
  }

  const openRejectDialog = (item: any) => {
    setSelectedReview(item)
    setComment('')
    setRejectDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Submitted</Badge>
      case 'APPROVED':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>
      case 'REJECTED':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>
      case 'DRAFT':
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: 'TEMPLATE' | 'STEP') => {
    if (type === 'TEMPLATE') {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Template</Badge>
    } else {
      return <Badge variant="outline" className="bg-purple-100 text-purple-800">Step</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/learning">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Learning Management
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Learning Review</h1>
        <Button onClick={() => setRefreshKey((prev) => prev + 1)} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Filter Panel */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ status: 'SUBMITTED', type: 'ALL' })}
            >
              Clear
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value as ReviewStatus })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={filters.type}
                onValueChange={(value) => setFilters({ ...filters, type: value as ReviewType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="TEMPLATE">Template</SelectItem>
                  <SelectItem value="STEP">Step</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Template Name Filter */}
            <div className="space-y-2">
              <Label>Template Name</Label>
              <Input
                placeholder="Search by template name..."
                value={filters.templateName || ''}
                onChange={(e) => setFilters({ ...filters, templateName: e.target.value || undefined })}
                disabled={loadingSections}
              />
            </div>

            {/* Section Filter */}
            <div className="space-y-2">
              <Label>Section</Label>
              <Select
                value={filters.sectionId?.toString() || '__all__'}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    sectionId: value && value !== '__all__' ? Number(value) : undefined,
                  })
                }
                disabled={loadingSections}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All sections</SelectItem>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id.toString()}>
                      {section.title || `Section ${section.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive">
          <p className="text-destructive">Error: {error}</p>
        </Card>
      )}

      {loading ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Loading reviews...</p>
        </Card>
      ) : items.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">
            No submitted reviews found
          </p>
          <p className="text-sm text-muted-foreground">
            Learning template and step version reviews are not yet implemented in v2.
            This feature will be available when the backend supports template/step version reviews.
          </p>
        </Card>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={`${item.type}-${item.review.id}`}>
                  <TableCell>{getTypeBadge(item.type)}</TableCell>
                  <TableCell className="font-medium">{item.templateName || item.stepInfo}</TableCell>
                  <TableCell>
                    {item.type === 'TEMPLATE'
                      ? `v${item.templateVersion?.versionNumber || '?'}`
                      : `v${item.stepVersion?.versionNumber || '?'}`}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.review.status)}</TableCell>
                  <TableCell>{item.review.submittedBy || '-'}</TableCell>
                  <TableCell>{new Date(item.review.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {item.review.status === 'SUBMITTED' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              openApproveDialog(item)
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              openRejectDialog(item)
                            }}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Review</DialogTitle>
            <DialogDescription>
              Add an optional comment for this approval
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Comment (optional)</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={processing}>
              {processing ? 'Approving...' : 'Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Review</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection (required)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Comment *</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Explain why this is being rejected..."
                rows={4}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={processing || !comment.trim()}
            >
              {processing ? 'Rejecting...' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

