'use client'

/**
 * Progress Board Page
 * Displays user's progress board for OKR items
 */

import { Suspense, useEffect } from 'react'
import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { KanbanBoard } from '@/features/goals-okr/components/KanbanBoard'
import { KanbanFilterPanel } from '@/features/goals-okr/components/KanbanFilterPanel'
import { useKanbanFilters } from '@/features/goals-okr/hooks/useKanbanFilters'
import { useModeContext } from '@/shared/hooks/useModeContext'
import { useRouter } from 'next/navigation'
import { Loading } from '@/shared/components/ui/Loading'

function KanbanContent() {
  const language = 'en' as 'nl' | 'en'
  const { filters, setFilters } = useKanbanFilters()
  const { goalsOkrContext } = useModeContext()
  const router = useRouter()

  useEffect(() => {
    if (goalsOkrContext === 'NONE') {
      router.push('/home')
    }
  }, [goalsOkrContext, router])

  if (goalsOkrContext === 'NONE') {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col relative">
        <Navbar variant="landing" />
        <main className="flex-1 flex flex-col p-8 relative z-0">
          <Container className="max-w-7xl mx-auto w-full">
            <div className="mb-6">
              <KanbanFilterPanel value={filters} onChange={setFilters} language={language} />
            </div>
            <KanbanBoard language={language} filters={filters} />
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default function KanbanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Navbar variant="landing" />
        <main className="flex-1 flex items-center justify-center p-8">
          <Loading />
        </main>
      </div>
    }>
      <KanbanContent />
    </Suspense>
  )
}
