'use client'

/**
 * Kanban Dashboard Page
 * Shows statistics about kanban items
 */

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { useAuth } from '@/features/auth'
import { useKanbanItems } from '@/features/goals-okr/hooks/useKanbanItems'
import { Loading } from '@/shared/components/ui/Loading'
import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2, Clock, AlertCircle, PlayCircle } from 'lucide-react'
import Link from 'next/link'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart'
import { Pie, PieChart, Cell } from 'recharts'

export default function KanbanDashboardPage() {
  const { user } = useAuth()
  const { data: kanbanItems, isLoading } = useKanbanItems(user?.id || null)
  const router = useRouter()

  const stats = useMemo(() => {
    if (!kanbanItems) {
      return {
        todo: { total: 0, goals: 0, objectives: 0, keyResults: 0, initiatives: 0 },
        inProgress: { total: 0, goals: 0, objectives: 0, keyResults: 0, initiatives: 0 },
        inReview: { total: 0, goals: 0, objectives: 0, keyResults: 0, initiatives: 0 },
        done: { total: 0, goals: 0, objectives: 0, keyResults: 0, initiatives: 0 },
        started: { total: 0, goals: 0, objectives: 0, keyResults: 0, initiatives: 0 },
      }
    }

    const countByType = (items: typeof kanbanItems, columnName: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE') => {
      const filtered = items.filter(item => item.columnName === columnName)
      return {
        total: filtered.length,
        goals: filtered.filter(item => item.itemType === 'GOAL').length,
        objectives: filtered.filter(item => item.itemType === 'OBJECTIVE').length,
        keyResults: filtered.filter(item => item.itemType === 'KEY_RESULT').length,
        initiatives: filtered.filter(item => item.itemType === 'INITIATIVE').length,
      }
    }

    const todo = countByType(kanbanItems, 'TODO')
    const inProgress = countByType(kanbanItems, 'IN_PROGRESS')
    const inReview = countByType(kanbanItems, 'IN_REVIEW')
    const done = countByType(kanbanItems, 'DONE')
    const started = {
      total: inProgress.total + inReview.total + done.total,
      goals: inProgress.goals + inReview.goals + done.goals,
      objectives: inProgress.objectives + inReview.objectives + done.objectives,
      keyResults: inProgress.keyResults + inReview.keyResults + done.keyResults,
      initiatives: inProgress.initiatives + inReview.initiatives + done.initiatives,
    }

    return {
      todo,
      inProgress,
      inReview,
      done,
      started,
    }
  }, [kanbanItems])

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-6xl mx-auto">
              <Loading />
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar variant="landing" />
        <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-6xl mx-auto">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              
              {/* Grid 2 rows x 4 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/goals-okr/kanban">
                  <Card className="cursor-pointer hover:border-primary transition-colors h-full">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Items om te starten
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold">{stats.todo.total}</div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Goals: {stats.todo.goals}</div>
                          <div>Objectives: {stats.todo.objectives}</div>
                          <div>Key Results: {stats.todo.keyResults}</div>
                          <div>Initiatives: {stats.todo.initiatives}</div>
                        </div>
                        <div className="pt-2 text-xs text-primary flex items-center gap-1">
                          Bekijk items <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/goals-okr/kanban">
                  <Card className="cursor-pointer hover:border-primary transition-colors h-full">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <PlayCircle className="h-4 w-4 text-muted-foreground" />
                        Actief bezig
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold">{stats.inProgress.total}</div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Goals: {stats.inProgress.goals}</div>
                          <div>Objectives: {stats.inProgress.objectives}</div>
                          <div>Key Results: {stats.inProgress.keyResults}</div>
                          <div>Initiatives: {stats.inProgress.initiatives}</div>
                        </div>
                        <div className="pt-2 text-xs text-primary flex items-center gap-1">
                          Bekijk items <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/goals-okr/kanban">
                  <Card className="cursor-pointer hover:border-primary transition-colors h-full">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        Wachten op review
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold">{stats.inReview.total}</div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Goals: {stats.inReview.goals}</div>
                          <div>Objectives: {stats.inReview.objectives}</div>
                          <div>Key Results: {stats.inReview.keyResults}</div>
                          <div>Initiatives: {stats.inReview.initiatives}</div>
                        </div>
                        <div className="pt-2 text-xs text-primary flex items-center gap-1">
                          Bekijk items <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/goals-okr/kanban">
                  <Card className="cursor-pointer hover:border-primary transition-colors h-full">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        Afgerond
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold">{stats.done.total}</div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Goals: {stats.done.goals}</div>
                          <div>Objectives: {stats.done.objectives}</div>
                          <div>Key Results: {stats.done.keyResults}</div>
                          <div>Initiatives: {stats.done.initiatives}</div>
                        </div>
                        <div className="pt-2 text-xs text-primary flex items-center gap-1">
                          Bekijk items <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Pie Chart with Legend - Second row, columns 1-2, left circle right legend */}
                <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Verdeling items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    {/* Pie Chart - Left side */}
                    <div>
                      <ChartContainer
                        config={{
                          todo: {
                            label: "Items om te starten",
                            color: "oklch(0.646 0.222 41.116)",
                          },
                          inProgress: {
                            label: "Actief bezig",
                            color: "oklch(0.6 0.118 184.704)",
                          },
                          inReview: {
                            label: "Wachten op review",
                            color: "oklch(0.398 0.07 227.392)",
                          },
                          done: {
                            label: "Afgerond",
                            color: "oklch(0.828 0.189 84.429)",
                          },
                        }}
                        className="mx-auto aspect-square max-h-[200px]"
                      >
                        <PieChart>
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Pie
                            data={[
                              {
                                name: "todo",
                                value: stats.todo.total,
                                fill: "oklch(0.646 0.222 41.116)",
                              },
                              {
                                name: "inProgress",
                                value: stats.inProgress.total,
                                fill: "oklch(0.6 0.118 184.704)",
                              },
                              {
                                name: "inReview",
                                value: stats.inReview.total,
                                fill: "oklch(0.398 0.07 227.392)",
                              },
                              {
                                name: "done",
                                value: stats.done.total,
                                fill: "oklch(0.828 0.189 84.429)",
                              },
                            ]}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            strokeWidth={5}
                          />
                        </PieChart>
                      </ChartContainer>
                    </div>
                    {/* Legend - Right side */}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'oklch(0.646 0.222 41.116)' }} />
                        <span className="text-muted-foreground">Items om te starten: {stats.todo.total}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'oklch(0.6 0.118 184.704)' }} />
                        <span className="text-muted-foreground">Actief bezig: {stats.inProgress.total}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'oklch(0.398 0.07 227.392)' }} />
                        <span className="text-muted-foreground">Wachten op review: {stats.inReview.total}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'oklch(0.828 0.189 84.429)' }} />
                        <span className="text-muted-foreground">Afgerond: {stats.done.total}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
