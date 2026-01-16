/**
 * Book Page Component
 * 
 * Toont book met CircularMenu voor chapters
 * Route: /book/[id]
 * 
 * Structuur:
 * - Book header
 * - CircularMenu met chapters (position 0-10)
 */

'use client'

import { useParams } from 'next/navigation'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { ProtectedRoute } from '@/features/auth'
import { CircularMenu } from '@/features/content'

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

            {/* CircularMenu */}
            <div className="flex items-center justify-center min-h-[600px]">
              <CircularMenu bookId={bookId} language={language} />
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}

