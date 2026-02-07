/**
 * Chapter Overview Page Component
 * 
 * Toont chapter overview met sections
 * Route: /chapter/[id]/overview
 * 
 * Structuur:
 * - Chapter header
 * - Sections list
 * 
 * Special handling:
 * - Als Chapter 0 in Falah Book (Category #0) → render FalahDashboard
 */

'use client'

import { useParams } from 'next/navigation'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { ProtectedRoute } from '@/features/auth'
import { SectionsList, useChapter, useChapterCurrentVersion, ChapterHeader, useBook, useCategory } from '@/features/content'
import { Loading } from '@/shared/components/ui/Loading'
import { Error } from '@/shared/components/ui/Error'
import { useQuery } from '@tanstack/react-query'
import { FalahDashboard } from '@/features/falah/components/FalahDashboard'
import { AutoHierarchicalNavigation } from '@/shared/components/navigation/HierarchicalNavigation'

export default function ChapterOverviewPage() {
  const params = useParams()
  const chapterId = Number(params.id)
  const language: 'nl' | 'en' = 'en' // TODO: Get from language context

  const { data: chapter, isLoading, error } = useChapter(chapterId)
  const { data: chapterVersion, isLoading: isLoadingVersion } = useChapterCurrentVersion(chapterId)
  
  // Load book and category to check if this is Falah dashboard
  const { data: book, isLoading: isLoadingBook } = useBook(chapter?.bookId || null)
  const { data: category, isLoading: isLoadingCategory } = useCategory(book?.categoryId || null)
  
  // Check if this is Falah Dashboard (Chapter 0 in Falah Book, Category #0)
  const isFalahDashboard = chapter?.position === 0 && 
                           category?.categoryNumber === 0

  if (isLoading || isLoadingVersion || isLoadingBook || isLoadingCategory) {
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

  // Render Falah Dashboard if this is Chapter 0 in Falah Book
  if (isFalahDashboard && chapter && book && category) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-6xl mx-auto">
              <FalahDashboard chapter={chapter} book={book} category={category} language={language} />
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  // Normal chapter overview
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar variant="landing" />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-6xl mx-auto">
            {/* Chapter Header */}
            <ChapterHeader 
              chapter={chapter || null} 
              chapterVersion={chapterVersion || null}
              language={language}
            />

            {/* Hierarchical Navigation */}
            <AutoHierarchicalNavigation language={language} />

            {/* Sections List */}
            <SectionsList chapterId={chapterId} language={language} />
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}

