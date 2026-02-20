'use client'

/**
 * Insight Page (Kanban Dashboard)
 * Shows statistics about kanban items: objectives, key results, initiatives (no goal layer).
 */

import { ProtectedRoute, useAuth } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useKanbanItems } from '@/features/goals-okr/hooks/useKanbanItems'
import { Loading } from '@/shared/components/ui/Loading'
import { useModeContext } from '@/shared/hooks/useModeContext'
import { useWheels } from '@/features/goals-okr/hooks/useWheels'
import { useLifeDomains } from '@/features/goals-okr/hooks/useLifeDomains'
import { goalsOkrContextToWheelKey, getWheelIdFromGoalsOkrContext } from '@/shared/utils/contextUtils'
import { useMemo, useState, useEffect, useRef, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart'
import { Pie, PieChart, Cell } from 'recharts'
import { getObjective, getKeyResult, getUserObjectiveInstance, getUserKeyResultInstance, getAllLifeDomains, getAllWheels } from '@/features/goals-okr/api/goalsOkrApi'

export default function InsightPage() {
  const { user } = useAuth()
  const { goalsOkrContext } = useModeContext()
  const { data: kanbanItems, isLoading } = useKanbanItems(user?.id || null)
  const { data: wheels } = useWheels()
  const { data: lifeDomains } = useLifeDomains()
  const language = 'en' as 'nl' | 'en'
  const router = useRouter()

  // Redirect if Goals-OKR context is NONE
  useEffect(() => {
    if (goalsOkrContext === 'NONE') {
      router.push('/home')
    }
  }, [goalsOkrContext, router])

  const targetWheelKey = useMemo(() => {
    if (goalsOkrContext === 'NONE' || goalsOkrContext === 'ALL') return null
    return goalsOkrContextToWheelKey(goalsOkrContext)
  }, [goalsOkrContext])

  const filteredKanbanItems = useMemo(() => {
    if (!kanbanItems || goalsOkrContext === 'NONE') {
      return []
    }
    if (!wheels || !lifeDomains) {
      return kanbanItems
    }
    const key = goalsOkrContextToWheelKey(goalsOkrContext)
    if (!key) {
      return kanbanItems
    }
    const wheelId = getWheelIdFromGoalsOkrContext(goalsOkrContext, wheels)
    if (!wheelId) {
      return kanbanItems
    }
    return kanbanItems
  }, [kanbanItems, goalsOkrContext, wheels, lifeDomains])

  const [objectiveStatsByWheel, setObjectiveStatsByWheel] = useState<Map<string, {
    todo: number
    inProgress: number
    inReview: number
    done: number
    wheelName: string
  }>>(new Map())
  const [isLoadingObjectiveStats, setIsLoadingObjectiveStats] = useState(false)
  const [objectivesByDomain, setObjectivesByDomain] = useState<Map<string, Map<number, {
    domainName: string
    count: number
  }>>>(new Map())
  const [keyResultsByDomain, setKeyResultsByDomain] = useState<Map<string, Map<number, {
    domainName: string
    count: number
  }>>>(new Map())
  const [lifeDomainsByWheel, setLifeDomainsByWheel] = useState<Map<string, Array<{
    id: number
    nameNl: string
    nameEn: string
  }>>>(new Map())
  const [isLoadingObjectivesByDomain, setIsLoadingObjectivesByDomain] = useState(false)
  const [isLoadingKeyResultsByDomain, setIsLoadingKeyResultsByDomain] = useState(false)
  const languageRef = useRef<'nl' | 'en'>('en')
  languageRef.current = language

  // Load Objective statistics by wheel (was "goal stats by wheel")
  useEffect(() => {
    if (!filteredKanbanItems || filteredKanbanItems.length === 0 || !user?.id) {
      setObjectiveStatsByWheel(new Map())
      return
    }

    const targetKey = (goalsOkrContext !== 'NONE' && goalsOkrContext !== 'ALL') ? goalsOkrContextToWheelKey(goalsOkrContext) : null
    setIsLoadingObjectiveStats(true)

    const loadObjectiveStatsByWheel = async () => {
      const wheelStatsMap = new Map<string, {
        todo: number
        inProgress: number
        inReview: number
        done: number
        wheelName: string
      }>()

      const [wheelsData, lifeDomainsData] = await Promise.all([
        getAllWheels(),
        getAllLifeDomains()
      ])

      const wheelMap = new Map<number, { wheelKey: string; nameNl: string; nameEn: string }>()
      wheelsData.forEach(wheel => {
        wheelMap.set(wheel.id, { wheelKey: wheel.wheelKey, nameNl: wheel.nameNl, nameEn: wheel.nameEn })
      })

      const domainToWheelMap = new Map<number, number>()
      lifeDomainsData.forEach(domain => {
        if (domain.wheelId) {
          domainToWheelMap.set(domain.id, domain.wheelId)
        }
      })

      for (const item of filteredKanbanItems) {
        if (item.itemType !== 'OBJECTIVE') continue

        try {
          const userObjectiveInstance = await getUserObjectiveInstance(item.itemId)
          const objective = await getObjective(userObjectiveInstance.objectiveId)
          const wheelId = domainToWheelMap.get(objective.lifeDomainId)
          const wheel = wheelId ? wheelMap.get(wheelId) : null
          const wheelKey = wheel?.wheelKey || 'UNKNOWN'

          if (targetKey && wheelKey !== targetKey) continue

          const currentLanguage = languageRef.current
          const wheelName = wheel
            ? (currentLanguage === 'nl' ? wheel.nameNl : wheel.nameEn)
            : 'Unknown'

          if (!wheelStatsMap.has(wheelKey)) {
            wheelStatsMap.set(wheelKey, {
              todo: 0,
              inProgress: 0,
              inReview: 0,
              done: 0,
              wheelName: wheelName,
            })
          }

          const wheelStats = wheelStatsMap.get(wheelKey)!
          if (item.columnName === 'TODO') wheelStats.todo++
          else if (item.columnName === 'IN_PROGRESS') wheelStats.inProgress++
          else if (item.columnName === 'IN_REVIEW') wheelStats.inReview++
          else if (item.columnName === 'DONE') wheelStats.done++
        } catch (error) {
          console.error(`Error loading objective stats for kanban item ${item.id}:`, error)
        }
      }

      setObjectiveStatsByWheel(wheelStatsMap)
      setIsLoadingObjectiveStats(false)
    }

    loadObjectiveStatsByWheel().catch(error => {
      console.error('Error loading objective stats by wheel:', error)
      setIsLoadingObjectiveStats(false)
    })
  }, [filteredKanbanItems, user?.id, goalsOkrContext])

  // Load Objectives and Key Results by domain (no quarter filter)
  useEffect(() => {
    setIsLoadingObjectivesByDomain(true)
    setIsLoadingKeyResultsByDomain(true)

    const loadByDomain = async () => {
      const [wheelsData, lifeDomainsData] = await Promise.all([
        getAllWheels(),
        getAllLifeDomains()
      ])

      const wheelOfLife = wheelsData.find(w => w.wheelKey === 'WHEEL_OF_LIFE')
      const wheelOfBusiness = wheelsData.find(w => w.wheelKey === 'WHEEL_OF_BUSINESS')
      const wheelOfWork = wheelsData.find(w => w.wheelKey === 'WHEEL_OF_WORK')

      if (!wheelOfLife && !wheelOfBusiness && !wheelOfWork) {
        setIsLoadingObjectivesByDomain(false)
        setIsLoadingKeyResultsByDomain(false)
        return
      }

      const domainToWheelMap = new Map<number, number>()
      lifeDomainsData.forEach(domain => {
        if (domain.wheelId) {
          domainToWheelMap.set(domain.id, domain.wheelId)
        }
      })

      const domainNameMap = new Map<number, { nameNl: string; nameEn: string }>()
      lifeDomainsData.forEach(domain => {
        domainNameMap.set(domain.id, { nameNl: domain.titleNl, nameEn: domain.titleEn })
      })

      const allDomainsByWheel = new Map<string, Array<{ id: number; nameNl: string; nameEn: string }>>()
      if (wheelOfLife) {
        allDomainsByWheel.set('WHEEL_OF_LIFE', lifeDomainsData
          .filter(d => d.wheelId === wheelOfLife.id)
          .map(d => ({ id: d.id, nameNl: d.titleNl, nameEn: d.titleEn })))
      }
      if (wheelOfBusiness) {
        allDomainsByWheel.set('WHEEL_OF_BUSINESS', lifeDomainsData
          .filter(d => d.wheelId === wheelOfBusiness.id)
          .map(d => ({ id: d.id, nameNl: d.titleNl, nameEn: d.titleEn })))
      }
      if (wheelOfWork) {
        allDomainsByWheel.set('WHEEL_OF_WORK', lifeDomainsData
          .filter(d => d.wheelId === wheelOfWork.id)
          .map(d => ({ id: d.id, nameNl: d.titleNl, nameEn: d.titleEn })))
      }
      setLifeDomainsByWheel(allDomainsByWheel)

      if (!filteredKanbanItems || filteredKanbanItems.length === 0 || !user?.id) {
        setObjectivesByDomain(new Map())
        setKeyResultsByDomain(new Map())
        setIsLoadingObjectivesByDomain(false)
        setIsLoadingKeyResultsByDomain(false)
        return
      }

      const targetKey = goalsOkrContext !== 'NONE' ? goalsOkrContextToWheelKey(goalsOkrContext) : null
      const objectivesStatsMap = new Map<string, Map<number, { domainName: string; count: number }>>()
      const keyResultsStatsMap = new Map<string, Map<number, { domainName: string; count: number }>>()

      for (const item of filteredKanbanItems) {
        if (item.itemType !== 'OBJECTIVE' && item.itemType !== 'KEY_RESULT') continue

        try {
          let lifeDomainId: number | null = null

          if (item.itemType === 'OBJECTIVE') {
            const userObjectiveInstance = await getUserObjectiveInstance(item.itemId)
            const objective = await getObjective(userObjectiveInstance.objectiveId)
            lifeDomainId = objective.lifeDomainId
          } else {
            const userKeyResultInstance = await getUserKeyResultInstance(item.itemId)
            const keyResult = await getKeyResult(userKeyResultInstance.keyResultId)
            const objective = await getObjective(keyResult.objectiveId)
            lifeDomainId = objective.lifeDomainId
          }

          if (!lifeDomainId) continue

          const wheelId = domainToWheelMap.get(lifeDomainId)
          if (!wheelId) continue

          let wheelKey: string | null = null
          if (wheelId === wheelOfLife?.id) wheelKey = 'WHEEL_OF_LIFE'
          else if (wheelId === wheelOfBusiness?.id) wheelKey = 'WHEEL_OF_BUSINESS'
          else if (wheelId === wheelOfWork?.id) wheelKey = 'WHEEL_OF_WORK'
          if (!wheelKey || (targetKey && wheelKey !== targetKey)) continue

          const domainInfo = domainNameMap.get(lifeDomainId)
          if (!domainInfo) continue

          const currentLanguage = languageRef.current
          const domainName = currentLanguage === 'nl' ? domainInfo.nameNl : domainInfo.nameEn

          if (item.itemType === 'OBJECTIVE') {
            if (!objectivesStatsMap.has(wheelKey)) {
              objectivesStatsMap.set(wheelKey, new Map())
            }
            const domainStatsMap = objectivesStatsMap.get(wheelKey)!
            if (!domainStatsMap.has(lifeDomainId)) {
              domainStatsMap.set(lifeDomainId, { domainName, count: 0 })
            }
            domainStatsMap.get(lifeDomainId)!.count++
          } else {
            if (!keyResultsStatsMap.has(wheelKey)) {
              keyResultsStatsMap.set(wheelKey, new Map())
            }
            const domainStatsMap = keyResultsStatsMap.get(wheelKey)!
            if (!domainStatsMap.has(lifeDomainId)) {
              domainStatsMap.set(lifeDomainId, { domainName, count: 0 })
            }
            domainStatsMap.get(lifeDomainId)!.count++
          }
        } catch (error) {
          console.error(`Error loading by domain for kanban item ${item.id}:`, error)
        }
      }

      setObjectivesByDomain(objectivesStatsMap)
      setKeyResultsByDomain(keyResultsStatsMap)
      setIsLoadingObjectivesByDomain(false)
      setIsLoadingKeyResultsByDomain(false)
    }

    loadByDomain().catch(error => {
      console.error('Error loading by domain:', error)
      setIsLoadingObjectivesByDomain(false)
      setIsLoadingKeyResultsByDomain(false)
    })
  }, [filteredKanbanItems, user?.id, goalsOkrContext])

  if (isLoading) {
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

  const wheelOrder = targetWheelKey
    ? [targetWheelKey]
    : ['WHEEL_OF_LIFE', 'WHEEL_OF_BUSINESS', 'WHEEL_OF_WORK']
  const wheelNames: Record<string, string> = {
    'WHEEL_OF_LIFE': 'Wheel of Life',
    'WHEEL_OF_BUSINESS': 'Wheel of Business',
    'WHEEL_OF_WORK': 'Wheel of Work'
  }

  const renderPieChartCard = (
    title: string,
    domainStatsMap: Map<number, { domainName: string; count: number }>,
    allDomainsForWheel: Array<{ id: number; nameNl: string; nameEn: string }>,
    isLoading: boolean,
    key: string
  ) => {
    if (isLoading) {
      return (
        <Card key={key}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loading />
            </div>
          </CardContent>
        </Card>
      )
    }

    if (allDomainsForWheel.length === 0) {
      return (
        <Card key={key}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {language === 'nl' ? 'Geen life domains gevonden' : 'No life domains found'}
            </div>
          </CardContent>
        </Card>
      )
    }

    const currentLanguage = languageRef.current
    const colors = [
      "oklch(0.646 0.222 41.116)",
      "oklch(0.6 0.118 184.704)",
      "oklch(0.398 0.07 227.392)",
      "oklch(0.828 0.189 84.429)",
      "oklch(0.5 0.15 280)",
      "oklch(0.7 0.2 120)",
      "oklch(0.55 0.18 200)",
      "oklch(0.65 0.16 320)",
      "oklch(0.58 0.18 15)",
      "oklch(0.72 0.16 160)",
    ]

    const pieData = allDomainsForWheel.map((domain, index) => {
      const st = domainStatsMap.get(domain.id)
      const count = st?.count || 0
      const domainName = currentLanguage === 'nl' ? domain.nameNl : domain.nameEn
      return {
        name: domainName,
        value: count,
        fill: colors[index % colors.length],
        domainId: domain.id
      }
    })

    const total = pieData.reduce((sum, item) => sum + item.value, 0)
    const pieDataWithPercentage = pieData.map(item => ({
      ...item,
      percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'
    }))
    const filteredData = pieDataWithPercentage.filter(item => item.value > 0)

    return (
      <Card key={key}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {language === 'nl' ? 'Totaal' : 'Total'}: {total}
              </p>
            </div>
            <div className="flex flex-col gap-4 items-center justify-center">
              <div className="flex-shrink-0">
                {filteredData.length === 0 ? (
                  <div className="flex items-center justify-center w-[200px] h-[200px] text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                    {language === 'nl' ? 'Geen data' : 'No data'}
                  </div>
                ) : (
                  <ChartContainer
                    config={Object.fromEntries(
                      filteredData.map(item => [item.name, { label: item.name, color: item.fill }])
                    )}
                    className="mx-auto aspect-square w-[200px] h-[200px]"
                  >
                    <PieChart>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Pie data={filteredData} dataKey="value" nameKey="name" outerRadius={90} strokeWidth={5}>
                        {filteredData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                )}
              </div>
              {pieDataWithPercentage.length > 0 && (
                <div className="space-y-2 text-sm">
                  {pieDataWithPercentage
                    .sort((a, b) => b.value - a.value)
                    .map((entry) => (
                      <div key={entry.domainId} className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full ${entry.value === 0 ? 'opacity-30' : ''}`}
                          style={{ backgroundColor: entry.fill }}
                        />
                        <span className={`text-muted-foreground ${entry.value === 0 ? 'opacity-50' : ''}`}>
                          {entry.name}: {entry.value} ({entry.percentage}%)
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const domainCharts: ReactNode[] = []
  const itemTypeConfigs = [
    { type: 'OBJECTIVE' as const, domainMap: objectivesByDomain, isLoading: isLoadingObjectivesByDomain, label: 'Objectives' },
    { type: 'KEY_RESULT' as const, domainMap: keyResultsByDomain, isLoading: isLoadingKeyResultsByDomain, label: 'Key Results' },
  ]

  itemTypeConfigs.forEach(({ domainMap, isLoading, label }) => {
    wheelOrder.forEach((wheelKey) => {
      const domainStatsMap = domainMap.get(wheelKey) || new Map()
      const allDomainsForWheel = lifeDomainsByWheel.get(wheelKey) || []
      domainCharts.push(
        renderPieChartCard(
          `${wheelNames[wheelKey]}: ${label} by domain`,
          domainStatsMap,
          allDomainsForWheel,
          isLoading,
          `${label}-${wheelKey}`
        )
      )
    })
  })

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar variant="landing" />
        <main className="flex-1 flex flex-col p-8 pb-24">
          <Container className="max-w-6xl mx-auto">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Insight</h1>

              {/* Objectives and Key Results by domain */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {domainCharts}
              </div>

              {/* Objective stats by wheel (status distribution) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  (['WHEEL_OF_LIFE', 'WHEEL_OF_BUSINESS', 'WHEEL_OF_WORK'] as const).map((wheelKey) => {
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
              </div>
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
