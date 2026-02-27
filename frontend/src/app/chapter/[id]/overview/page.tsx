/**
 * Chapter Overview Page Component
 *
 * Toont chapter overview volgens normale structuur:
 * - Breadcrumbs: Category > Book > Chapter
 * - Chapter header (titel + intro)
 * - Sections list
 *
 * Route: /chapter/[id]/overview
 */

'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { ProtectedRoute } from '@/features/auth'
import {
  SectionsList,
  useChapter,
  useChapterCurrentVersion,
  ChapterHeader,
  useBook,
  useCategory,
} from '@/features/content'
import { Loading } from '@/shared/components/ui/Loading'
import { Error } from '@/shared/components/ui/Error'
import { ChevronRight } from 'lucide-react'

export default function ChapterOverviewPage() {
  const params = useParams()
  const chapterId = Number(params.id)
  const language: 'nl' | 'en' = 'en' as 'nl' | 'en' // TODO: Get from language context

  const { data: chapter, isLoading, error } = useChapter(chapterId)
  const { data: chapterVersion, isLoading: isLoadingVersion } = useChapterCurrentVersion(chapterId)
  const { data: book } = useBook(chapter?.bookId ?? null)
  const { data: category } = useCategory(book?.categoryId ?? null)

  if (isLoading || isLoadingVersion) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-6xl mx-auto">
              <Loading />
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-6xl mx-auto">
              <Error message={error.message || 'Failed to load chapter'} />
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  const chapterTitle =
    chapterVersion && language === 'nl'
      ? (chapterVersion.titleNl || chapterVersion.titleEn || `Chapter ${chapterId}`)
      : chapterVersion
        ? (chapterVersion.titleEn || chapterVersion.titleNl || `Chapter ${chapterId}`)
        : `Chapter ${chapterId}`

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar variant="landing" />

        <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-6xl mx-auto">
            {/* Breadcrumbs: Category > Book > Chapter */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6"
            >
              {category ? (
                <Link
                  href={`/category/${category.id}`}
                  className="hover:text-foreground transition-colors"
                >
                  {language === 'nl' ? category.titleNl || category.titleEn : category.titleEn || category.titleNl || `Category ${category.id}`}
                </Link>
              ) : (
                <span>…</span>
              )}
              {category && <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />}
              {book ? (
                <Link
                  href={`/book/${book.id}`}
                  className="hover:text-foreground transition-colors"
                >
                  {language === 'nl' ? 'Book' : 'Book'} {book.id}
                </Link>
              ) : (
                category && <span>…</span>
              )}
              {book && <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />}
              <span className="text-foreground font-medium" aria-current="page">
                {chapterTitle}
              </span>
            </nav>

            <ChapterHeader
              chapter={chapter ?? null}
              chapterVersion={chapterVersion ?? null}
              language={language}
            />

            <SectionsList chapterId={chapterId} language={language} />
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}

