/**
 * Paragraph Detail Page
 * Detail page for viewing and editing a paragraph with version history
 * Route: /admin/content/paragraphs/[id]
 */

'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Calendar, Hash, FileText, BookOpen, Book, Folder } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { VersionHistoryPanel } from '@/features/content'
import { useVersionHistory, useParagraph, useSection, useChapter, useBook, useCategory } from '@/features/content'
import { getBookCurrentVersion } from '@/features/content/api/contentApi'
import { useQuery } from '@tanstack/react-query'
import { Loading } from '@/shared/components/ui/Loading'
import { Error } from '@/shared/components/ui/Error'

export default function ParagraphDetailPage() {
  const params = useParams()
  const paragraphId = Number(params.id)
  
  const { data: paragraph, isLoading: isLoadingParagraph, error: paragraphError } = useParagraph(paragraphId)
  const { data: versions, isLoading: isLoadingVersions } = useVersionHistory(paragraphId, 'PARAGRAPH')
  
  // Fetch parent information
  const { data: section, isLoading: isLoadingSection } = useSection(paragraph?.sectionId || null)
  const { data: chapter, isLoading: isLoadingChapter } = useChapter(section?.chapterId || null)
  const { data: book, isLoading: isLoadingBook } = useBook(chapter?.bookId || null)
  const { data: category, isLoading: isLoadingCategory } = useCategory(book?.categoryId || null)
  const { data: bookVersion } = useQuery({
    queryKey: ['bookCurrentVersion', book?.id],
    queryFn: () => getBookCurrentVersion(book!.id),
    enabled: !!book?.id,
  })

  if (isLoadingParagraph) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Loading />
      </div>
    )
  }

  if (paragraphError) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Error message="Failed to load paragraph" />
      </div>
    )
  }

  if (!paragraph) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Error message="Paragraph not found" />
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
          <h1 className="text-3xl font-bold">Paragraph Details</h1>
          <p className="text-muted-foreground mt-1">
            Paragraph ID: {paragraphId}
          </p>
        </div>
        <Link href={`/admin/content/paragraphs/${paragraphId}/edit`}>
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      {/* Paragraph Information */}
      <Card>
        <CardHeader>
          <CardTitle>Paragraph Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Paragraph Number</p>
                <p className="font-medium">{paragraph.paragraphNumber ?? 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Section</p>
                {isLoadingSection ? (
                  <p className="font-medium text-muted-foreground">Loading...</p>
                ) : section ? (
                  <Link href={`/admin/content/sections/${section.id}`} className="font-medium text-blue-600 hover:underline">
                    Section {section.orderIndex}
                  </Link>
                ) : (
                  <p className="font-medium">Section ID: {paragraph.sectionId}</p>
                )}
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
                  <p className="font-medium">-</p>
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
                <p className="font-medium">{paragraph.workingStatusParagraphVersionId ?? 'None'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">{new Date(paragraph.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Version History */}
      {isLoadingVersions ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Loading version history...</p>
        </Card>
      ) : versions && versions.length > 0 ? (
        <VersionHistoryPanel
          versions={versions}
          entityType="PARAGRAPH"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Version History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No versions yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

