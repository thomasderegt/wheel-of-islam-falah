/**
 * Priorities helpers
 * Used by Priorities page, Insight, and Goals-OKR
 * Source of truth: API (priority_assessment)
 */

export type WheelPrefix = 'success' | 'life' | 'business' | 'work'

const WHEEL_LABEL_TO_PREFIX: Record<string, WheelPrefix> = {
  'Wheel of Success': 'success',
  'Wheel of Life': 'life',
  'Wheel of Business': 'business',
  'Wheel of Work': 'work',
}

export function getWheelPrefix(wheelLabel: string): WheelPrefix | null {
  return WHEEL_LABEL_TO_PREFIX[wheelLabel] ?? null
}

export type PrioritySummaryItem = { key: string; title: string; score: number }

export function getPrioritySummary(
  scores: Record<string, number>,
  items: { key: string; titleNl: string; titleEn: string; wheelLabel: string }[],
  skippedWheels: Set<WheelPrefix>,
  language: 'nl' | 'en'
): PrioritySummaryItem[] {
  return items
    .filter((item) => {
      const prefix = item.key.split(':')[0] as WheelPrefix
      return !skippedWheels.has(prefix)
    })
    .map((item) => ({
      key: item.key,
      title: language === 'nl' ? item.titleNl : item.titleEn,
      score: scores[item.key] ?? 0,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
}

const WHEEL_ORDER = ['Wheel of Success', 'Wheel of Life', 'Wheel of Business', 'Wheel of Work'] as const

export type PrioritySummaryByWheel = { wheelLabel: string; items: PrioritySummaryItem[] }

export function getPrioritySummaryByWheel(
  scores: Record<string, number>,
  items: { key: string; titleNl: string; titleEn: string; wheelLabel: string }[],
  skippedWheels: Set<WheelPrefix>,
  language: 'nl' | 'en'
): PrioritySummaryByWheel[] {
  const byWheel = new Map<string, PrioritySummaryItem[]>()
  for (const item of items) {
    const prefix = item.key.split(':')[0] as WheelPrefix
    if (skippedWheels.has(prefix)) continue
    const score = scores[item.key] ?? 0
    if (score <= 0) continue
    const entry: PrioritySummaryItem = {
      key: item.key,
      title: language === 'nl' ? item.titleNl : item.titleEn,
      score,
    }
    const label = item.wheelLabel
    if (!byWheel.has(label)) byWheel.set(label, [])
    byWheel.get(label)!.push(entry)
  }
  for (const arr of byWheel.values()) {
    arr.sort((a, b) => b.score - a.score)
  }
  return WHEEL_ORDER
    .filter((label) => byWheel.has(label))
    .map((label) => ({ wheelLabel: label, items: byWheel.get(label)! }))
}
