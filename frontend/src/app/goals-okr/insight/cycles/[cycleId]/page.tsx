'use client'

/**
 * Cycle detail page – shows priorities for a specific Falah cycle.
 */

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ProtectedRoute, useAuth } from '@/features/auth'
import { useFalahCycles, useExitFalahCycleFlow, useCompleteFalahCycle } from '@/features/auth/hooks/useFalahCycles'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Loading } from '@/shared/components/ui/Loading'
import { useModeContext } from '@/shared/hooks/useModeContext'
import { usePrioritiesSummary } from '@/shared/hooks/usePrioritiesSummary'
import { useEffect } from 'react'
import { Button } from '@/shared/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { routes } from '@/shared/constants/routes'

export default function CycleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rawId = params.cycleId
  const cycleId =
    rawId != null && !Number.isNaN(Number(rawId)) ? Number(rawId) : null
  const { user } = useAuth()
  const { data: cycles, isLoading: isLoadingCycles } = useFalahCycles(user?.id ?? null)
  const exitFlow = useExitFalahCycleFlow(user?.id ?? null)
  const completeCycle = useCompleteFalahCycle(user?.id ?? null)
  const cycle = cycles?.find((c) => c.id === cycleId)
  const activeCycle = cycles?.find((c) => c.active)
  const isInFlow = !!activeCycle && !activeCycle?.flowExited && activeCycle?.id === cycleId
  const { goalsOkrContext } = useModeContext()
  const language = 'en' as 'nl' | 'en'

  const { summaryByWheel, isLoading: isLoadingPriorities } = usePrioritiesSummary(
    language,
    cycleId != null && Number.isFinite(cycleId) ? cycleId : undefined
  )

  useEffect(() => {
    if (goalsOkrContext === 'NONE') {
      router.push('/home')
    }
  }, [goalsOkrContext, router])

  if (isLoadingCycles || cycleId == null) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8 pb-24">
            <Container className="max-w-6xl mx-auto">
              <Loading />
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (goalsOkrContext === 'NONE') {
    return null
  }

  if (!cycle) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8 pb-24">
            <Container className="max-w-6xl mx-auto">
              <p className="text-muted-foreground">
                {language === 'nl' ? 'Cycle niet gevonden.' : 'Cycle not found.'}
              </p>
              <Link href="/goals-okr/insight">
                <Button variant="outline" className="mt-4">
                  {language === 'nl' ? 'Terug naar Insight' : 'Back to Insight'}
                </Button>
              </Link>
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  const hasPriorities = summaryByWheel.some((g) => g.items.length > 0)

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar variant="landing" />
        <main className="flex-1 flex flex-col p-8 pb-24">
          <Container className="max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Link href="/goals-okr/insight">
                  <Button variant="ghost" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold">
                  {language === 'nl' ? 'Cycle details' : 'Cycle details'}
                </h1>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {cycle.active
                      ? (language === 'nl' ? 'Actief' : 'Active')
                      : (language === 'nl' ? 'Afgerond' : 'Completed')}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {language === 'nl' ? 'Gestart' : 'Started'}:{' '}
                    {new Date(cycle.startedAt).toLocaleString()}
                  </p>
                  {cycle.completedAt && (
                    <p className="text-sm text-muted-foreground">
                      {language === 'nl' ? 'Afgerond' : 'Completed'}:{' '}
                      {new Date(cycle.completedAt).toLocaleString()}
                    </p>
                  )}
                </CardHeader>
                {cycle.active && (
                  <CardContent>
                    <Button
                      size="sm"
                      onClick={async () => {
                        try {
                          await completeCycle.mutateAsync(cycle.id)
                          router.push(routes.home)
                        } catch (e) {
                          console.error('Failed to complete cycle:', e)
                        }
                      }}
                      disabled={completeCycle.isPending}
                    >
                      {completeCycle.isPending ? '...' : language === 'nl' ? 'Rond af' : 'Complete'}
                    </Button>
                  </CardContent>
                )}
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {language === 'nl' ? 'Prioriteiten' : 'Priorities'}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'nl'
                      ? 'Je focus voor deze cycle.'
                      : 'Your focus for this cycle.'}
                  </p>
                </CardHeader>
                <CardContent>
                  {isLoadingPriorities ? (
                    <div className="flex items-center justify-center py-8">
                      <Loading />
                    </div>
                  ) : hasPriorities ? (
                    <div className="space-y-3">
                      {summaryByWheel.map((group) => (
                        <div key={group.wheelLabel} className="text-sm">
                          <span className="font-medium text-foreground">{group.wheelLabel}:</span>{' '}
                          <span className="text-muted-foreground">
                            {group.items.map((s) => `${s.title} (${s.score})`).join(', ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {language === 'nl'
                        ? 'Geen prioriteiten ingesteld voor deze cycle.'
                        : 'No priorities set for this cycle.'}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {isInFlow && (
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
                <Link href="/goals-okr/execute">
                  <Button variant="outline" className="gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="gap-2"
                  disabled={exitFlow.isPending}
                  onClick={async () => {
                    if (!activeCycle) return
                    try {
                      await exitFlow.mutateAsync(activeCycle.id)
                      router.push(routes.home)
                    } catch (e) {
                      console.error('Failed to exit flow:', e)
                    }
                  }}
                >
                  {exitFlow.isPending ? '...' : language === 'nl' ? 'Afronden' : 'Finish'}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
