/**
 * ReviewsTable Component
 * Table displaying reviews with View button linking to detail page
 */

'use client'

import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Eye } from 'lucide-react'
import type { ReviewDTO } from '../api/contentApi'

interface ReviewsTableProps {
  readonly reviews: ReviewDTO[]
}

export function ReviewsTable({ reviews }: ReviewsTableProps) {
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
    <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
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
                <TableCell className="font-medium">{review.entityType || '-'}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={review.title || ''}>{review.title || '-'}</TableCell>
                <TableCell>{review.id}</TableCell>
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
                  <Link href={`/admin/content/review/${review.id}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  )
}

