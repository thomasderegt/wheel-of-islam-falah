/**
 * Category Page Component
 * 
 * Toont category header en books voor een specifieke category
 * Route: /category/[id]
 * 
 * Structuur:
 * - Category Header (titel + description)
 * - BookSwitcher met books van die category
 */

'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { ProtectedRoute } from '@/features/auth'
import { BookSwitcher, useCategory, useBooksByCategory } from '@/features/content'
import { Loading } from '@/shared/components/ui/Loading'
import { Error } from '@/shared/components/ui/Error'
import { Button } from '@/shared/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default function CategoryPage() {
  const params = useParams()
  const categoryId = Number(params.id)
  // TODO: Get from language context
  const language = 'en' as 'nl' | 'en'

  const { data: category, isLoading: isLoadingCategory, error: categoryError } = useCategory(categoryId)
  const { data: books, isLoading: isLoadingBooks, error: booksError } = useBooksByCategory(categoryId)

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

  if (categoryError || booksError) {
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

  const categoryTitle = language === 'nl' ? category?.titleNl : category?.titleEn

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar variant="landing" />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Link href="/success">
                <Button variant="ghost" size="icon" aria-label="Back">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                {categoryTitle || `Category ${categoryId}`}
              </h1>
            </div>
            {/* BookSwitcher */}
            {books && books.length > 0 ? (
              <BookSwitcher
                categoryId={categoryId}
                books={books}
                categoryName={categoryTitle || `Category ${categoryId}`}
                language={language}
                publishedOnly
              />
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

