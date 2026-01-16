/**
 * Content Review Page
 * Page for reviewing and approving/rejecting content submissions
 * Route: /admin/content/review
 */

'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { ReviewsTable, useReviews } from '@/features/content'
import { Loading } from '@/shared/components/ui/Loading'
import { Error } from '@/shared/components/ui/Error'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'

export default function ContentReviewPage() {
  const [statusFilter, setStatusFilter] = useState<'SUBMITTED' | 'APPROVED' | 'REJECTED'>('SUBMITTED')
  const { data: reviews, isLoading, error } = useReviews(statusFilter)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/content">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Content Management
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content Review</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="statusFilter" className="text-sm font-medium">
            Filter by Status:
          </label>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
          >
            <SelectTrigger id="statusFilter" className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SUBMITTED">Submitted</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive">
          <Error message={error.message || 'Failed to load reviews'} />
        </Card>
      )}

      {isLoading ? (
        <Card className="p-8 text-center">
          <Loading />
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              Reviews ({reviews?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewsTable reviews={reviews || []} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
