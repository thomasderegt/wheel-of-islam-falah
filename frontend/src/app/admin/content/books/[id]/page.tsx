/**
 * Book Detail Page
 * Detail page for viewing and editing a book with version history
 * Route: /admin/content/books/[id]
 */

'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Calendar, Hash, Send, Folder } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { VersionHistoryPanel, CreateVersionDialog, useVersionHistory, useBook, useCategory } from '@/features/content'
import { submitForReview } from '@/features/content/api/contentApi'
import { useQueryClient } from '@tanstack/react-query'
import { Loading } from '@/shared/components/ui/Loading'
import { Error } from '@/shared/components/ui/Error'

export default function BookDetailPage() {
  const params = useParams()
  const bookId = Number(params.id)
  const queryClient = useQueryClient()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  const { data: book, isLoading: isLoadingBook, error: bookError } = useBook(bookId)
  const { data: versions, isLoading: isLoadingVersions } = useVersionHistory(bookId, 'BOOK')
  
  // Fetch parent information
  const { data: category, isLoading: isLoadingCategory } = useCategory(book?.categoryId || null)
  
  const handleSubmitForReview = async () => {
    // Get version ID - use workingStatusBookVersionId or latest version
    const versionId = book?.workingStatusBookVersionId || (versions && versions.length > 0 ? versions[0].id : null)
    
    if (!versionId) {
      setSubmitError('No version available to submit. Please create a version first.')
      return
    }
    
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      await submitForReview({
        type: 'BOOK',
        referenceId: bookId,
        versionId: versionId,
        submittedBy: 1, // TODO: Get from auth context
        comment: null
      })
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['book', bookId] })
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      
      alert('Successfully submitted for review!')
    } catch (err: any) {
      console.error('Submit for review error:', err)
      setSubmitError(err.response?.data?.error || err.message || 'Failed to submit for review')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Determine if submit button should be shown and enabled
  const hasVersions = versions && versions.length > 0
  const hasWorkingVersion = !!book?.workingStatusBookVersionId
  const canSubmit = hasWorkingVersion || hasVersions

  if (isLoadingBook) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Loading />
      </div>
    )
  }

  if (bookError) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Error message="Failed to load book" />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Error message="Book not found" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/content/creation">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Content Creation
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Book Details</h1>
          <p className="text-muted-foreground mt-1">
            Book ID: {bookId}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateVersionDialog entityType="BOOK" entityId={bookId} />
          {canSubmit && (
            <Button 
              onClick={handleSubmitForReview}
              disabled={isSubmitting || !hasWorkingVersion}
              className="gap-2"
              variant="default"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            </Button>
          )}
          <Link href={`/admin/content/books/${bookId}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Book Information */}
      <Card>
        <CardHeader>
          <CardTitle>Book Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Book Number</p>
                <p className="font-medium">{book.bookNumber ?? 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                {isLoadingCategory ? (
                  <p className="font-medium text-muted-foreground">Loading...</p>
                ) : category ? (
                  <Link href={`/admin/content/categories/${category.id}`} className="font-medium text-blue-600 hover:underline">
                    {category.titleEn || category.titleNl || `Category ID: ${category.id}`}
                  </Link>
                ) : (
                  <p className="font-medium">Category ID: {book.categoryId}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Working Version ID</p>
                <p className="font-medium">{book.workingStatusBookVersionId ?? 'None'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">{new Date(book.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Error */}
      {submitError && (
        <Card className="p-4 bg-destructive/10 border-destructive">
          <p className="text-sm text-destructive">{submitError}</p>
        </Card>
      )}

      {/* Version History */}
      {isLoadingVersions ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Loading version history...</p>
        </Card>
      ) : versions && versions.length > 0 ? (
        <VersionHistoryPanel
          versions={versions}
          currentVersionId={book.workingStatusBookVersionId}
          entityType="BOOK"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Version History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">No versions yet. Create your first version to add content.</p>
            <CreateVersionDialog entityType="BOOK" entityId={bookId} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

