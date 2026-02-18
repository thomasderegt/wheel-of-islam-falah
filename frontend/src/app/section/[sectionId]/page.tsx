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

import { useParams } from 'next/navigation'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { ProtectedRoute } from '@/features/auth'
import { SectionViewer } from '@/features/content'

export default function SectionViewerPage() {
  const params = useParams()
  const sectionId = Number(params.sectionId)
  const language: 'nl' | 'en' = 'en' // TODO: Get from language context

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar variant="landing" />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-4xl mx-auto">
            <SectionViewer sectionId={sectionId} language={language} />
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}

