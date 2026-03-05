'use client'

/**
 * Insight Page (Kanban Dashboard)
 * Shows statistics about kanban items: objectives, key results, initiatives (no goal layer).
 */

import Link from 'next/link'
import { ProtectedRoute, useAuth } from '@/features/auth'
import { useFalahCycles, useExitFalahCycleFlow, useCompleteFalahCycle } from '@/features/auth/hooks/useFalahCycles'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Loading } from '@/shared/components/ui/Loading'
import { useModeContext } from '@/shared/hooks/useModeContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { routes } from '@/shared/constants/routes'
import { PrioritySummaryCard } from '@/shared/components/priorities/PrioritySummaryCard'

export default function InsightPage() {
  const { user } = useAuth()
  const { data: cycles, isLoading: isLoadingCycles } = useFalahCycles(user?.id ?? null)
  const exitFlow = useExitFalahCycleFlow(user?.id ?? null)
  const completeCycle = useCompleteFalahCycle(user?.id ?? null)
  const activeCycle = cycles?.find((c) => c.active)
  const hasActiveCycle = !!activeCycle
  const isInFlow = hasActiveCycle && !activeCycle?.flowExited
  const { goalsOkrContext } = useModeContext()
  const language = 'en' as 'nl' | 'en'
  const router = useRouter()

  // Redirect if Goals-OKR context is NONE
  useEffect(() => {
    if (goalsOkrContext === 'NONE') {
      router.push('/home')
    }
  }, [goalsOkrContext, router])

  // Uitgeschakeld: alleen cycle info op insight page
  // - Load Objective statistics by wheel
  // - Load Objectives and Key Results by domain

  if (isLoadingCycles) {
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar variant="landing" />
        <main className="flex-1 flex flex-col p-8 pb-24">
          <Container className="max-w-6xl mx-auto">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Insight</h1>

              <PrioritySummaryCard language={language} />

              {/* Falah cycle overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Falah cycles
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'nl'
                      ? 'Rond een cycle handmatig af. Pas daarna kun je een nieuwe starten.'
                      : 'Complete a cycle manually. Only then can you start a new one.'}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cycles && cycles.length > 0 ? (
                    <div className="space-y-3">
                      {cycles.map((cycle) => (
                        <div
                          key={cycle.id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
                        >
                          <Link
                            href={routes.insightCycle(cycle.id)}
                            className="flex-1 min-w-0 cursor-pointer hover:opacity-90 transition-opacity"
                          >
                            <div className="text-sm">
                              <p className="font-medium text-foreground">
                                {cycle.active
                                  ? (language === 'nl' ? 'Actief' : 'Active')
                                  : (language === 'nl' ? 'Afgerond' : 'Completed')}
                              </p>
                              <p className="text-muted-foreground">
                                {language === 'nl' ? 'Gestart' : 'Started'}: {new Date(cycle.startedAt).toLocaleString()}
                              </p>
                              {cycle.completedAt && (
                                <p className="text-muted-foreground">
                                  {language === 'nl' ? 'Afgerond' : 'Completed'}: {new Date(cycle.completedAt).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </Link>
                          {cycle.active && (
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
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {language === 'nl' ? 'Nog geen cycles.' : 'No cycles yet.'}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Objectives and Key Results by domain - uitgecommentarieerd: alleen cycle info */}
              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {domainCharts}
              </div> */}

              {/* Objective stats by wheel (status distribution) - uitgecommentarieerd: alleen cycle info */}
              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isLoadingObjectiveStats ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {language === 'nl' ? 'Verdeling objectives per wheel' : 'Objectives per wheel'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center py-8">
                        <Loading />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  wheelOrder.map((wheelKey) => {
                      const wheelStats = objectiveStatsByWheel.get(wheelKey) ?? {
                        todo: 0,
                        inProgress: 0,
                        inReview: 0,
                        done: 0,
                        wheelName: wheelNames[wheelKey] ?? wheelKey,
                      }
                      const total = wheelStats.todo + wheelStats.inProgress + wheelStats.inReview + wheelStats.done
                      const pieData = [
                        { name: 'todo', value: wheelStats.todo, fill: 'oklch(0.646 0.222 41.116)' },
                        { name: 'inProgress', value: wheelStats.inProgress, fill: 'oklch(0.6 0.118 184.704)' },
                        { name: 'inReview', value: wheelStats.inReview, fill: 'oklch(0.398 0.07 227.392)' },
                        { name: 'done', value: wheelStats.done, fill: 'oklch(0.828 0.189 84.429)' },
                      ].filter(item => item.value > 0)

                      return (
                        <Card key={wheelKey}>
                          <CardHeader>
                            <CardTitle className="text-lg font-semibold">
                              {wheelStats.wheelName}: {language === 'nl' ? 'Objectives per status' : 'Objectives by status'}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">
                                  {language === 'nl' ? 'Totaal' : 'Total'}: {total} {language === 'nl' ? 'objectieven' : 'objectives'}
                                </p>
                              </div>
                              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                                <div className="flex-shrink-0">
                                  {pieData.length > 0 ? (
                                    <ChartContainer
                                      config={{
                                        todo: { label: language === 'nl' ? 'Om te starten' : 'To do', color: 'oklch(0.646 0.222 41.116)' },
                                        inProgress: { label: language === 'nl' ? 'Actief bezig' : 'In progress', color: 'oklch(0.6 0.118 184.704)' },
                                        inReview: { label: language === 'nl' ? 'Wachten op review' : 'In review', color: 'oklch(0.398 0.07 227.392)' },
                                        done: { label: language === 'nl' ? 'Afgerond' : 'Done', color: 'oklch(0.828 0.189 84.429)' },
                                      }}
                                      className="mx-auto aspect-square w-[200px] h-[200px]"
                                    >
                                      <PieChart>
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                        <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} strokeWidth={5}>
                                          {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                          ))}
                                        </Pie>
                                      </PieChart>
                                    </ChartContainer>
                                  ) : (
                                    <div className="flex items-center justify-center w-[200px] h-[200px] text-sm text-muted-foreground">
                                      {language === 'nl' ? 'Geen data' : 'No data'}
                                    </div>
                                  )}
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'oklch(0.646 0.222 41.116)' }} />
                                    <span className="text-muted-foreground">Todo: {wheelStats.todo}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'oklch(0.6 0.118 184.704)' }} />
                                    <span className="text-muted-foreground">In Progress: {wheelStats.inProgress}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'oklch(0.398 0.07 227.392)' }} />
                                    <span className="text-muted-foreground">In Review: {wheelStats.inReview}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'oklch(0.828 0.189 84.429)' }} />
                                    <span className="text-muted-foreground">Done: {wheelStats.done}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                )}
              </div> */}
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
