'use client'

/**
 * Progress Board Page
 * Displays user's progress board for OKR items
 */

import Link from 'next/link'
import { Suspense, useEffect } from 'react'
import { ProtectedRoute, useAuth } from '@/features/auth'
import { useFalahCycles, useExitFalahCycleFlow } from '@/features/auth/hooks/useFalahCycles'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { KanbanBoard } from '@/features/goals-okr/components/KanbanBoard'
import { KanbanFilterPanel } from '@/features/goals-okr/components/KanbanFilterPanel'
import { useKanbanFilters } from '@/features/goals-okr/hooks/useKanbanFilters'
import { useModeContext } from '@/shared/hooks/useModeContext'
import { useRouter } from 'next/navigation'
import { Loading } from '@/shared/components/ui/Loading'
import { Button } from '@/shared/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function KanbanContent() {
  const { user } = useAuth()
  const { data: cycles } = useFalahCycles(user?.id ?? null)
  const exitFlow = useExitFalahCycleFlow(user?.id ?? null)
  const activeCycle = cycles?.find((c) => c.active)
  const isInFlow = !!activeCycle && !activeCycle.flowExited

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

            {isInFlow && (
              <div className="flex justify-between items-center gap-2 mt-8 pt-6 border-t border-border">
                <Link href="/goals-okr">
                  <Button variant="outline" className="gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="text-muted-foreground"
                  onClick={() =>
                    activeCycle &&
                    exitFlow.mutate(activeCycle.id, { onSuccess: () => router.push('/home') })
                  }
                >
                  Quit
                </Button>
                <Link href="/goals-okr/insight">
                  <Button className="gap-2">
                    Next: Reflection
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
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
