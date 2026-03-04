'use client'

import { usePrioritiesSummary } from '@/shared/hooks/usePrioritiesSummary'

type Props = Readonly<{
  language?: 'nl' | 'en'
}>

export function PrioritySummaryCard({ language = 'en' }: Props) {
  const { summaryByWheel, isLoading } = usePrioritiesSummary(language)

  const hasData = summaryByWheel.some((g) => g.items.length > 0)
  if (isLoading || !hasData) return null

  const label = language === 'nl' ? 'Focus voor deze cycle:' : 'Focus for this cycle:'

  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="space-y-2">
        {summaryByWheel.map((group) => (
          <div key={group.wheelLabel} className="text-sm">
            <span className="font-medium text-foreground">{group.wheelLabel}:</span>{' '}
            <span className="text-muted-foreground">
              {group.items.map((s) => `${s.title} (${s.score})`).join(', ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
