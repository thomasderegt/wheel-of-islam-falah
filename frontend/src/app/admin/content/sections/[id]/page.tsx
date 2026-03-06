/**
 * Section Detail Page
 * Detail page for viewing and editing a section with version history
 * Route: /admin/content/sections/[id]
 */

'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Edit, Calendar, Hash, BookOpen, Send, Book, Folder, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  VersionHistoryPanel,
  CreateVersionDialog,
  useVersionHistory,
  useSection,
  useChapter,
  useBook,
  useCategory,
  useReviewsByReviewableItem,
  hasReviewInProgress,
} from '@/features/content'
import { submitForReview, getBookCurrentVersion } from '@/features/content/api/contentApi'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { Loading } from '@/shared/components/ui/Loading'
import { Error } from '@/shared/components/ui/Error'
import type { SectionVersionDTO } from '@/shared/api/types'

const language: 'nl' | 'en' = 'en'

/** Toont intro-tekst met behoud van witregels en alinea's. */
function VersionIntro({ text }: { text: string | null | undefined }) {
  if (!text) return null
  return (
    <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
      {text}
    </div>
  )
}

export default function SectionDetailPage() {
  const params = useParams()
  const sectionId = Number(params.id)
  const queryClient = useQueryClient()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null)
  
  const { data: section, isLoading: isLoadingSection, error: sectionError } = useSection(sectionId)
  const { data: versions, isLoading: isLoadingVersions } = useVersionHistory(sectionId, 'SECTION') as { data: SectionVersionDTO[] | undefined; isLoading: boolean }
  
  // Fetch parent information
  const { data: chapter, isLoading: isLoadingChapter } = useChapter(section?.chapterId || null)
  const { data: book, isLoading: isLoadingBook } = useBook(chapter?.bookId || null)
  const { data: category, isLoading: isLoadingCategory } = useCategory(book?.categoryId || null)
  const { data: bookVersion } = useQuery({
    queryKey: ['bookCurrentVersion', book?.id],
    queryFn: () => getBookCurrentVersion(book!.id),
    enabled: !!book?.id,
  })
  const { data: itemReviews } = useReviewsByReviewableItem('SECTION', sectionId)
  const reviewAlreadyInProgress = hasReviewInProgress(itemReviews)

  const handleSubmitForReview = async () => {
    // Get version ID - use workingStatusSectionVersionId or latest version
    const versionId = section?.workingStatusSectionVersionId || (versions && versions.length > 0 ? versions[0].id : null)
    
    if (!versionId) {
      setSubmitError('No version available to submit. Please create a version first.')
      return
    }
    
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      await submitForReview({
        type: 'SECTION',
        referenceId: sectionId,
        versionId: versionId,
        submittedBy: 1, // TODO: Get from auth context
        comment: null
      })
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['section', sectionId] })
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['reviewsByItem', 'SECTION', sectionId] })
      
      alert('Successfully submitted for review!')
    } catch (err: any) {
      console.error('Submit for review error:', err)
      setSubmitError(err.response?.data?.error || err.message || 'Failed to submit for review')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Determine if submit button should be shown and enabled (not if review already in progress)
  const hasVersions = versions && versions.length > 0
  const hasWorkingVersion = !!section?.workingStatusSectionVersionId
  const canSubmit = (hasWorkingVersion || hasVersions) && !reviewAlreadyInProgress

  const selectedVersion =
    selectedVersionId != null && versions
      ? versions.find((v) => v.id === selectedVersionId)
      : null

  if (isLoadingSection) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Loading />
      </div>
    )
  }

  if (sectionError) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Error message="Failed to load section" />
      </div>
    )
  }

  if (!section) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Error message="Section not found" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/content/creation">
          <Button variant="ghost" size="icon" aria-label="Back to Content Creation">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Section Details</h1>
          <p className="text-muted-foreground mt-1">
            Section ID: {sectionId}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CreateVersionDialog entityType="SECTION" entityId={sectionId} />
          {(hasWorkingVersion || hasVersions) && (
            <Button
              onClick={handleSubmitForReview}
              disabled={isSubmitting || !hasWorkingVersion || reviewAlreadyInProgress}
              className="gap-2"
              variant="default"
              title={reviewAlreadyInProgress ? 'Er loopt al een review voor dit contentitem.' : undefined}
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            </Button>
          )}
          {reviewAlreadyInProgress && (
            <span className="text-sm text-muted-foreground">Er loopt al een review voor dit contentitem.</span>
          )}
          <Link href={`/admin/content/sections/${sectionId}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Section Information */}
      <Card>
        <CardHeader>
          <CardTitle>Section Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Order Index</p>
                <p className="font-medium">{section.orderIndex}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Chapter</p>
                {isLoadingChapter ? (
                  <p className="font-medium text-muted-foreground">Loading...</p>
                ) : chapter ? (
                  <Link href={`/admin/content/chapters/${chapter.id}`} className="font-medium text-blue-600 hover:underline">
                    Chapter {chapter.chapterNumber ?? chapter.id}
                  </Link>
                ) : (
                  <p className="font-medium">Chapter ID: {section.chapterId}</p>
                )}
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
                  <p className="font-medium">-</p>
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
                <p className="font-medium">{section.workingStatusSectionVersionId ?? 'None'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">{new Date(section.createdAt).toLocaleDateString()}</p>
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Version History</CardTitle>
            <CreateVersionDialog entityType="SECTION" entityId={sectionId} />
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingVersions ? (
            <p className="text-muted-foreground">Loading version history...</p>
          ) : versions && versions.length > 0 ? (
            <VersionHistoryPanel
              versions={versions}
              currentVersionId={section.workingStatusSectionVersionId}
              entityType="SECTION"
              onVersionClick={(versionId) => setSelectedVersionId(versionId)}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No versions yet. Create your first version to add content.</p>
              <CreateVersionDialog entityType="SECTION" entityId={sectionId} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Geselecteerde versie: titel + intro */}
      {selectedVersion && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>v{selectedVersion.versionNumber} – {(language === 'nl' ? selectedVersion.titleNl : selectedVersion.titleEn) || 'Untitled'}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Sluiten"
              onClick={() => setSelectedVersionId(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <VersionIntro text={(language === 'nl' ? selectedVersion.introNl : selectedVersion.introEn) ?? undefined} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

