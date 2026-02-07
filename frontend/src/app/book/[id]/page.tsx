/**
 * Book Page Component
 * 
 * Toont book met NavBookCircle voor chapters
 * Route: /book/[id]
 * 
 * Structuur:
 * - Book header
 * - NavBookCircle met chapters (position 0-10)
 */

'use client'

import { useParams } from 'next/navigation'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { ProtectedRoute } from '@/features/auth'
import { NavBookCircle } from '@/features/content'
import { AutoHierarchicalNavigation } from '@/shared/components/navigation/HierarchicalNavigation'

export default function BookPage() {
  const params = useParams()
  const bookId = Number(params.id)
  const language: 'nl' | 'en' = 'en' // TODO: Get from language context

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar variant="landing" />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-6xl mx-auto">
            {/* Book Header */}
            <div className="mb-8 space-y-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Book {bookId}
              </h1>
            </div>

            {/* Hierarchical Navigation */}
            <AutoHierarchicalNavigation language={language} />

            {/* NavBookCircle */}
            <div className="flex items-center justify-center min-h-[600px]">
              <NavBookCircle bookId={bookId} language={language} />
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}

