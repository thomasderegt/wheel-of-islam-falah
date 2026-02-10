'use client'

/**
 * Progress Board Page
 * Displays user's progress board for OKR items
 */

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { KanbanBoard } from '@/features/goals-okr/components/KanbanBoard'
import { KanbanFilterPanel } from '@/features/goals-okr/components/KanbanFilterPanel'
import { useKanbanFilters } from '@/features/goals-okr/hooks/useKanbanFilters'
import { useModeContext } from '@/shared/hooks/useModeContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function KanbanPage() {
  // TODO: Get from language context
  const language = 'en' as 'nl' | 'en'
  const { filters, setFilters } = useKanbanFilters()
  const { goalsOkrContext } = useModeContext()
  const router = useRouter()

  // Redirect if Goals-OKR context is NONE
  useEffect(() => {
    if (goalsOkrContext === 'NONE') {
      router.push('/home')
    }
  }, [goalsOkrContext, router])

  // Don't render if Goals-OKR context is NONE
  if (goalsOkrContext === 'NONE') {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col relative">
        {/* Navbar */}
        <Navbar variant="landing" />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col p-8 relative z-0">
          <Container className="max-w-7xl mx-auto w-full">
            {/* Filter Panel */}
            <div className="mb-6">
              <KanbanFilterPanel value={filters} onChange={setFilters} language={language} />
            </div>

            {/* Progress Board */}
            <KanbanBoard language={language} filters={filters} />
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
