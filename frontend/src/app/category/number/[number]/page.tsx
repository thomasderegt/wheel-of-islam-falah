/**
 * Category Page Component (by number)
 * 
 * Toont category header en NavBookCircle voor het eerste book in de category
 * Route: /category/number/[number]
 * 
 * Structuur:
 * - Category Header (titel + description)
 * - NavBookCircle voor het eerste book
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { ProtectedRoute } from '@/features/auth'
import { NavBookCircle, usePublicBooksByCategory, useBookCurrentVersion } from '@/features/content'
import { getCategoryByNumber } from '@/features/content/api/contentApi'
import { useQuery } from '@tanstack/react-query'
import { Loading } from '@/shared/components/ui/Loading'
import { Error } from '@/shared/components/ui/Error'
import { Button } from '@/shared/components/ui/button'
import { Switch } from '@/shared/components/ui/switch'
import { Label } from '@/shared/components/ui/label'
import { useFitToScreen } from '@/shared/hooks/useFitToScreen'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function CategoryByNumberPage() {
  const params = useParams()
  const categoryNumber = Number(params.number)
  // TODO: Get from language context
  const language = 'en' as 'nl' | 'en'
  const [currentBookIndex, setCurrentBookIndex] = useState(0)
  const [fitToScreen, setFitToScreen] = useFitToScreen()

  const { data: category, isLoading: isLoadingCategory, error: categoryError } = useQuery({
    queryKey: ['categoryByNumber', categoryNumber],
    queryFn: () => getCategoryByNumber(categoryNumber),
  })

  const { data: books, isLoading: isLoadingBooks, error: booksError } = usePublicBooksByCategory(category?.id || null)
  const currentBook = books && books.length > 0 ? books[currentBookIndex] : null
  const { data: bookVersion } = useBookCurrentVersion(currentBook?.id || null)

  // Reset to first book when books change
  useEffect(() => {
    if (books && books.length > 0) {
      setCurrentBookIndex(0)
    }
  }, [books])

  const handlePreviousBook = () => {
    if (books && books.length > 0) {
      setCurrentBookIndex(prev => (prev > 0 ? prev - 1 : books.length - 1))
    }
  }

  const handleNextBook = () => {
    if (books && books.length > 0) {
      setCurrentBookIndex(prev => (prev < books.length - 1 ? prev + 1 : 0))
    }
  }

  if (isLoadingCategory || isLoadingBooks) {
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

  if (categoryError || booksError || !category) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-6xl mx-auto">
              <Error message={categoryError?.message || booksError?.message || 'Failed to load category'} />
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  const categoryTitle = language === 'nl' ? category.titleNl : category.titleEn

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar variant="landing" />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-6xl mx-auto">
            {/* Back + Category Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/success">
                <Button variant="ghost" size="icon" aria-label="Back">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                {categoryTitle || `Category ${categoryNumber}`}
              </h1>
            </div>

            {books && books.length > 0 ? (
              <div className="space-y-4">
                {/* Book Navigation */}
                {books.length > 1 && (
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePreviousBook}
                      aria-label="Previous book"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <span className="text-lg font-semibold">
                      {bookVersion 
                        ? (language === 'nl' ? bookVersion.titleNl : bookVersion.titleEn) || `Book ${books[currentBookIndex].id}`
                        : `Book ${books[currentBookIndex].id}`} ({currentBookIndex + 1} / {books.length})
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNextBook}
                      aria-label="Next book"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                )}

                {/* NavBookCircle with fit to screen */}
                <NavBookCircle bookId={books[currentBookIndex].id} language={language} fitToScreen={fitToScreen} publishedOnly />
                <div className="flex items-center justify-center gap-2">
                  <Switch
                    id="fit-to-screen"
                    checked={fitToScreen}
                    onCheckedChange={setFitToScreen}
                  />
                  <Label htmlFor="fit-to-screen" className="text-sm text-muted-foreground cursor-pointer">
                    Fit to screen
                  </Label>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No books available in this category.</p>
              </div>
            )}
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}

