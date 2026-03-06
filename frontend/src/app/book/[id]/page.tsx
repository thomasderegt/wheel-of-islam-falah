/**
 * Book Page Component
 * 
 * Toont book met NavBookCircle voor chapters
 * Route: /book/[id]
 * 
 * Structuur:
 * - Back-knop
 * - NavBookCircle met chapters (position 0-10)
 */

'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { ProtectedRoute } from '@/features/auth'
import { NavBookCircle, useBook } from '@/features/content'
import { Button } from '@/shared/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default function BookPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = Number(params.id)
  const language: 'nl' | 'en' = 'en' // TODO: Get from language context
  const { data: book } = useBook(bookId)

  const backHref = '/success'

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar variant="landing" />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-6xl mx-auto">
            <div className="mb-8">
              <Link href={backHref}>
                <Button variant="ghost" size="icon" aria-label="Back">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* NavBookCircle */}
            <div className="flex items-center justify-center min-h-[600px]">
              <NavBookCircle bookId={bookId} language={language} publishedOnly />
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}

