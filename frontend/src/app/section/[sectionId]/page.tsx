/**
 * Section Viewer Page Component
 * 
 * Toont section content (read-only)
 * Route: /section/[sectionId]
 * 
 * Structuur:
 * - Section title
 * - Section intro
 * - Section paragraphs
 */

'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { ProtectedRoute } from '@/features/auth'
import { SectionViewer, useSection } from '@/features/content'
import { Button } from '@/shared/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default function SectionViewerPage() {
  const params = useParams()
  const router = useRouter()
  const sectionId = Number(params.sectionId)
  const language: 'nl' | 'en' = 'en' // TODO: Get from language context
  const { data: section } = useSection(sectionId)

  const backHref = section ? `/chapter/${section.chapterId}/overview` : null

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar variant="landing" />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              {backHref ? (
                <Link href={backHref}>
                  <Button variant="ghost" size="icon" aria-label="Back">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button variant="ghost" size="icon" aria-label="Back" onClick={() => router.back()}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
            </div>
            <SectionViewer sectionId={sectionId} language={language} />
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}

