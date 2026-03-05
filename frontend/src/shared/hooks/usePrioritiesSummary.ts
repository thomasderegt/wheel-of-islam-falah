'use client'

import { useMemo } from 'react'
import { useAuth } from '@/features/auth'
import { useFalahCycles } from '@/features/auth/hooks/useFalahCycles'
import { usePriorityAssessment } from '@/features/auth/hooks/usePriorityAssessment'
import { useLifeDomains } from '@/features/goals-okr/hooks/useLifeDomains'
import { useWheels } from '@/features/goals-okr/hooks/useWheels'
import { getPrioritySummary, getPrioritySummaryByWheel, type WheelPrefix } from '@/shared/utils/priorities'
import type { LifeDomainDTO } from '@/features/goals-okr/api/goalsOkrApi'

function buildPriorityItems(
  lifeDomains: LifeDomainDTO[] | undefined,
  wheels: { wheelKey: string; id: number; nameNl: string; nameEn: string }[] | undefined
): { key: string; titleNl: string; titleEn: string; wheelLabel: string }[] {
  const items: { key: string; titleNl: string; titleEn: string; wheelLabel: string }[] = []
  if (!wheels) return items

  const wheelOfSuccess = wheels.find((w) => w.wheelKey === 'WHEEL_OF_SUCCESS')
  const wheelOfLife = wheels.find((w) => w.wheelKey === 'WHEEL_OF_LIFE')
  const wheelOfBusiness = wheels.find((w) => w.wheelKey === 'WHEEL_OF_BUSINESS')
  const wheelOfWork = wheels.find((w) => w.wheelKey === 'WHEEL_OF_WORK')

  const add = (
    wheel: { id: number; nameNl: string; nameEn: string } | undefined,
    prefix: string
  ) => {
    if (!wheel || !lifeDomains) return
    lifeDomains
      .filter((d) => d.wheelId === wheel.id)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .forEach((d) => {
        items.push({
          key: `${prefix}:${d.id}`,
          titleNl: d.titleNl,
          titleEn: d.titleEn,
          wheelLabel: wheel.nameEn,
        })
      })
  }

  add(wheelOfSuccess, 'success')
  add(wheelOfLife, 'life')
  add(wheelOfBusiness, 'business')
  add(wheelOfWork, 'work')

  return items
}

export type PrioritySummaryItem = { title: string; score: number }

export function usePrioritiesSummary(
  language: 'nl' | 'en' = 'en',
  cycleId?: number | null
): {
  summary: PrioritySummaryItem[]
  summaryByWheel: { wheelLabel: string; items: PrioritySummaryItem[] }[]
  isLoading: boolean
} {
  const { user } = useAuth()
  const { data: cycles } = useFalahCycles(user?.id ?? null)
  const activeCycle = cycles?.find((c) => c.active)
  const falahCycleId = cycleId ?? activeCycle?.id ?? null

  const { data: assessment, isLoading: loadingAssessment } = usePriorityAssessment(
    user?.id ?? null,
    falahCycleId
  )
  const { data: lifeDomains } = useLifeDomains()
  const { data: wheels } = useWheels()

  const items = useMemo(
    () => buildPriorityItems(lifeDomains ?? undefined, wheels ?? undefined),
    [lifeDomains, wheels]
  )

  const scores = assessment?.scores ?? {}
  // Map legacy 'falah' to 'success' for backward compatibility
  const skippedWheels = new Set<WheelPrefix>(
    (assessment?.skippedWheels ?? [])
      .map((x) => (x === 'falah' ? 'success' : x))
      .filter((x): x is WheelPrefix =>
        ['success', 'life', 'business', 'work'].includes(x)
      )
  )

  const summary = useMemo(() => {
    return getPrioritySummary(scores, items, skippedWheels, language).map((s) => ({
      title: s.title,
      score: s.score,
    }))
  }, [scores, items, skippedWheels, language])

  const summaryByWheel = useMemo(() => {
    return getPrioritySummaryByWheel(scores, items, skippedWheels, language).map((g) => ({
      wheelLabel: g.wheelLabel,
      items: g.items.map((s) => ({ title: s.title, score: s.score })),
    }))
  }, [scores, items, skippedWheels, language])

  const isLoading = !!user?.id && loadingAssessment

  return { summary, summaryByWheel, isLoading }
}
