/**
 * Chapter Detail Page
 * Detail page for viewing and editing a chapter with version history
 * Route: /admin/content/chapters/[id]
 */

'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Calendar, Hash, Book, Send, Folder } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { VersionHistoryPanel, CreateVersionDialog, useVersionHistory, useChapter, useBook, useCategory } from '@/features/content'
import { submitForReview, getBookCurrentVersion } from '@/features/content/api/contentApi'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { Loading } from '@/shared/components/ui/Loading'
import { Error } from '@/shared/components/ui/Error'

export default function ChapterDetailPage() {
  const params = useParams()
  const chapterId = Number(params.id)
  const queryClient = useQueryClient()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  const { data: chapter, isLoading: isLoadingChapter, error: chapterError } = useChapter(chapterId)
  const { data: versions, isLoading: isLoadingVersions } = useVersionHistory(chapterId, 'CHAPTER')
  
  // Fetch parent information
  const { data: book, isLoading: isLoadingBook } = useBook(chapter?.bookId || null)
  const { data: category, isLoading: isLoadingCategory } = useCategory(book?.categoryId || null)
  const { data: bookVersion } = useQuery({
    queryKey: ['bookCurrentVersion', book?.id],
    queryFn: () => getBookCurrentVersion(book!.id),
    enabled: !!book?.id,
  })
  
  const handleSubmitForReview = async () => {
    if (!chapter || !chapter.workingStatusChapterVersionId) {
      setSubmitError('No version available to submit. Please create a version first.')
      return
    }
    
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      await submitForReview({
        type: 'CHAPTER',
        referenceId: chapterId,
        versionId: chapter.workingStatusChapterVersionId,
        submittedBy: 1, // TODO: Get from auth context
        comment: null
      })
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['chapter', chapterId] })
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      
      alert('Successfully submitted for review!')
    } catch (err: any) {
      console.error('Submit for review error:', err)
      setSubmitError(err.response?.data?.error || err.message || 'Failed to submit for review')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingChapter) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Loading />
      </div>
    )
  }

  if (chapterError) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Error message="Failed to load chapter" />
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Error message="Chapter not found" />
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
          <h1 className="text-3xl font-bold">Chapter Details</h1>
          <p className="text-muted-foreground mt-1">
            Chapter ID: {chapterId}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateVersionDialog entityType="CHAPTER" entityId={chapterId} />
          {chapter.workingStatusChapterVersionId && (
            <Button 
              onClick={handleSubmitForReview}
              disabled={isSubmitting}
              className="gap-2"
              variant="default"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            </Button>
          )}
          <Link href={`/admin/content/chapters/${chapterId}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Chapter Information */}
      <Card>
        <CardHeader>
          <CardTitle>Chapter Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Chapter Number</p>
                <p className="font-medium">{chapter.chapterNumber ?? 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Position</p>
                <p className="font-medium">{chapter.position}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Book className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Book</p>
                {isLoadingBook ? (
                  <p className="font-medium text-muted-foreground">Loading...</p>
                ) : book ? (
                  <Link href={`/admin/content/books/${book.id}`} className="font-medium text-blue-600 hover:underline">
                    {bookVersion?.titleEn || bookVersion?.titleNl || `Book ID: ${book.id}`}
                  </Link>
                ) : (
                  <p className="font-medium">Book ID: {chapter.bookId}</p>
                )}
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
                  <p className="font-medium">-</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Working Version ID</p>
                <p className="font-medium">{chapter.workingStatusChapterVersionId ?? 'None'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">{new Date(chapter.createdAt).toLocaleDateString()}</p>
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
          currentVersionId={chapter.workingStatusChapterVersionId}
          entityType="CHAPTER"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Version History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">No versions yet. Create your first version to add content.</p>
            <CreateVersionDialog entityType="CHAPTER" entityId={chapterId} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

