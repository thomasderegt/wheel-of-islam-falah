'use client'

/**
 * Priorities Page (formerly Assessment)
 *
 * Select up to 5 domains to focus on this cycle. Tap a domain to read more and add to your focus.
 * Covers: Wheel of Success (Fiqh, Tazkiyyah), Wheel of Life, Business, Work.
 * Part of the Falah growth cycle: Success → Priorities → Direction → Execute → Insight.
 */

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ProtectedRoute, useAuth } from '@/features/auth'
import { useFalahCycles, useExitFalahCycleFlow } from '@/features/auth/hooks/useFalahCycles'
import { usePriorityAssessment, useSavePriorityAssessment } from '@/features/auth/hooks/usePriorityAssessment'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { useLifeDomains } from '@/features/goals-okr/hooks/useLifeDomains'
import { useWheels } from '@/features/goals-okr/hooks/useWheels'
import { Loading } from '@/shared/components/ui/Loading'
import { useMemo, useState, useEffect, useRef } from 'react'
import { routes } from '@/shared/constants/routes'
import { Button } from '@/shared/components/ui/button'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody, SheetFooter } from '@/shared/components/ui/sheet'
import {
  getPrioritySummary,
  type WheelPrefix,
} from '@/shared/utils/priorities'
import type { LifeDomainDTO } from '@/features/goals-okr/api/goalsOkrApi'
import { cn } from '@/shared/utils/cn'

const MAX_FOCUS_PER_WHEEL = 5

function getKeyPrefix(key: string): string {
  return key.split(':')[0]
}

const MINDSET_TEXT =
  'Everything can feel important, but you can\'t do everything at once. Prioritizing isn\'t about what matters and what doesn\'t—it\'s about what you choose to focus on now and what you leave for later. Ask: "If I could only do one thing this cycle, what would it be?" That\'s your top priority.'

type PriorityItem = {
  key: string
  titleNl: string
  titleEn: string
  descriptionNl: string | null
  descriptionEn: string | null
  displayOrder: number
  wheelLabel: string
}

function buildPriorityItems(
  lifeDomains: LifeDomainDTO[] | undefined,
  wheels: { wheelKey: string; id: number; nameNl: string; nameEn: string }[] | undefined
): PriorityItem[] {
  const items: PriorityItem[] = []
  if (!wheels) return items

  const wheelOfSuccess = wheels.find((w) => w.wheelKey === 'WHEEL_OF_SUCCESS')
  const wheelOfLife = wheels.find((w) => w.wheelKey === 'WHEEL_OF_LIFE')
  const wheelOfBusiness = wheels.find((w) => w.wheelKey === 'WHEEL_OF_BUSINESS')
  const wheelOfWork = wheels.find((w) => w.wheelKey === 'WHEEL_OF_WORK')

  const addLifeDomainsForWheel = (
    wheel: { id: number; nameNl: string; nameEn: string } | undefined,
    prefix: string,
    displayOrderOffset: number
  ) => {
    if (!wheel || !lifeDomains) return
    const domains = lifeDomains
      .filter((d) => d.wheelId === wheel.id)
      .sort((a, b) => a.displayOrder - b.displayOrder)
    for (const d of domains) {
      items.push({
        key: `${prefix}:${d.id}`,
        titleNl: d.titleNl,
        titleEn: d.titleEn,
        descriptionNl: d.descriptionNl ?? null,
        descriptionEn: d.descriptionEn ?? null,
        displayOrder: displayOrderOffset + d.displayOrder,
        wheelLabel: wheel.nameEn,
      })
    }
  }

  addLifeDomainsForWheel(wheelOfSuccess, 'success', 0)
  addLifeDomainsForWheel(wheelOfLife, 'life', 100)
  addLifeDomainsForWheel(wheelOfBusiness, 'business', 200)
  addLifeDomainsForWheel(wheelOfWork, 'work', 300)

  return items.sort((a, b) => a.displayOrder - b.displayOrder)
}

const WHEEL_ORDER = ['Wheel of Success', 'Wheel of Life', 'Wheel of Business', 'Wheel of Work']

/** Short labels for pills (mobile-friendly) */
const WHEEL_PILL_LABELS: Record<string, string> = {
  'Wheel of Success': 'Success',
  'Wheel of Life': 'Life',
  'Wheel of Business': 'Business',
  'Wheel of Work': 'Work',
}

function WheelPills({
  wheels,
  activeWheel,
  onWheelChange,
}: Readonly<{
  wheels: [string, PriorityItem[]][]
  activeWheel: string
  onWheelChange: (label: string) => void
}>) {
  if (wheels.length <= 1) return null
  return (
    <div className="overflow-x-auto -mx-1 pb-1">
      <div className="flex gap-2 min-w-min px-1">
        {wheels.map(([wheelLabel]) => {
          const label = WHEEL_PILL_LABELS[wheelLabel] ?? wheelLabel
          const isActive = activeWheel === wheelLabel
          return (
            <button
              key={wheelLabel}
              type="button"
              onClick={() => onWheelChange(wheelLabel)}
              className={cn(
                'px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                'min-h-[44px] flex items-center justify-center',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function groupByWheel(items: PriorityItem[]): [string, PriorityItem[]][] {
  const map = new Map<string, PriorityItem[]>()
  for (const item of items) {
    const list = map.get(item.wheelLabel) ?? []
    list.push(item)
    map.set(item.wheelLabel, list)
  }
  const ordered: [string, PriorityItem[]][] = WHEEL_ORDER.filter((label) =>
    map.has(label)
  ).map((label) => [label, map.get(label)!])
  const remaining: [string, PriorityItem[]][] = Array.from(map.entries()).filter(
    ([label]) => !WHEEL_ORDER.includes(label)
  )
  return [...ordered, ...remaining]
}

function PrioritiesNavigation({
  isInFlow,
  language,
  onQuit,
}: Readonly<{
  isInFlow: boolean
  language: 'nl' | 'en'
  onQuit?: () => void
}>) {
  const quitLabel = language === 'nl' ? 'Afbreken' : 'Quit'
  return (
    <div className="pt-4 pt-6 border-t border-border">
      <div className="flex justify-between items-center gap-2">
        {isInFlow ? (
          <>
            <Link href={routes.success}>
              <Button variant="outline" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                {language === 'nl' ? 'Terug' : 'Back'}
              </Button>
            </Link>
            {onQuit && (
              <Button variant="ghost" onClick={onQuit} className="text-muted-foreground">
                {quitLabel}
              </Button>
            )}
            <Link href="/goals-okr">
              <Button className="gap-2">
                {language === 'nl' ? 'Volgende: Richting' : 'Next: Direction'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href={routes.home}>
              <Button variant="outline" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                {language === 'nl' ? 'Terug' : 'Back'}
              </Button>
            </Link>
            <Link href="/goals-okr/insight">
              <Button className="gap-2">
                {language === 'nl' ? 'Bekijk resultaat' : 'View Result'}
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

function PrioritiesResultSummary({
  summary,
  language,
}: Readonly<{
  summary: { title: string; score: number }[]
  language: 'nl' | 'en'
}>) {
  if (summary.length === 0) return null
  const label = language === 'nl' ? 'Focus voor deze cycle:' : 'Focus for this cycle:'
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <p className="text-sm font-medium text-foreground mb-2">{label}</p>
      <p className="text-muted-foreground">
        {summary.map((s) => s.title).join(', ')}
      </p>
    </div>
  )
}

function DomainDetailSheet({
  item,
  language,
  isSelected,
  onAdd,
  onRemove,
  open,
  onOpenChange,
}: Readonly<{
  item: PriorityItem
  language: 'nl' | 'en'
  isSelected: boolean
  onAdd: () => void
  onRemove: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}>) {
  const title = language === 'nl' ? item.titleNl : item.titleEn
  const description = (language === 'nl' ? item.descriptionNl : item.descriptionEn) || item.descriptionEn || item.descriptionNl
  const addLabel = language === 'nl' ? 'Toevoegen aan focus' : 'Add to focus'
  const removeLabel = language === 'nl' ? 'Verwijderen uit focus' : 'Remove from focus'
  const closeLabel = language === 'nl' ? 'Sluiten' : 'Close'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={cn(
          'left-0 right-0 w-full max-h-[90vh] overflow-hidden flex flex-col',
          'md:left-1/2 md:right-auto md:top-1/2 md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md md:max-h-[85vh] md:rounded-lg'
        )}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <SheetBody className="flex-1 overflow-y-auto">
          {description ? (
            <p className="text-muted-foreground text-sm">{description}</p>
          ) : (
            <p className="text-muted-foreground text-sm italic">
              {language === 'nl' ? 'Geen beschrijving beschikbaar.' : 'No description available.'}
            </p>
          )}
        </SheetBody>
        <SheetFooter className="flex flex-row gap-2">
          {isSelected ? (
            <Button variant="outline" onClick={onRemove} className="flex-1">
              {removeLabel}
            </Button>
          ) : (
            <Button onClick={onAdd} className="flex-1">
              {addLabel}
            </Button>
          )}
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {closeLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function PrioritiesContent({
  itemsByWheel,
  activeWheel,
  onWheelChange,
  language,
  selectedKeys,
  onDomainClick,
}: Readonly<{
  itemsByWheel: [string, PriorityItem[]][]
  activeWheel: string
  onWheelChange: (label: string) => void
  language: 'nl' | 'en'
  selectedKeys: Set<string>
  onDomainClick: (item: PriorityItem) => void
}>) {
  const hintLabel =
    language === 'nl'
      ? 'Selecteer maximaal 5 domeinen per wheel. Tik om meer te lezen en toe te voegen.'
      : 'Select up to 5 domains per wheel. Tap to read more and add to your focus.'

  const activeEntry = itemsByWheel.find(([label]) => label === activeWheel) ?? itemsByWheel[0]
  const [wheelLabel, items] = activeEntry ?? [null, []]
  if (!wheelLabel) return null

  return (
    <div className="space-y-6">
      <WheelPills
        wheels={itemsByWheel}
        activeWheel={activeWheel}
        onWheelChange={onWheelChange}
      />
      <section key={wheelLabel} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground border-b pb-2">{wheelLabel}</h2>
        <p className="text-sm text-muted-foreground">{hintLabel}</p>
        <div className="space-y-2">
          {items.map((item) => {
            const isSelected = selectedKeys.has(item.key)
            const title = language === 'nl' ? item.titleNl : item.titleEn
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onDomainClick(item)}
                className={cn(
                  'w-full rounded-lg border p-4 flex items-center gap-3 text-left min-h-[44px]',
                  'transition-colors hover:border-primary/50',
                  'bg-card cursor-pointer',
                  isSelected && 'border-primary bg-primary/5'
                )}
              >
                {isSelected && (
                  <Check className="h-5 w-5 text-primary flex-shrink-0" aria-hidden />
                )}
                <span className="font-medium flex-1 text-foreground">
                      {title}
                    </span>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default function PrioritiesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { data: cycles } = useFalahCycles(user?.id ?? null)
  const exitFlow = useExitFalahCycleFlow(user?.id ?? null)
  const activeCycle = cycles?.find((c) => c.active)
  const isInFlow = !!activeCycle && !activeCycle.flowExited
  const falahCycleId = activeCycle?.id ?? null

  const { data: lifeDomains, isLoading: loadingDomains } = useLifeDomains()
  const { data: wheels, isLoading: loadingWheels } = useWheels()

  const { data: assessment } = usePriorityAssessment(
    user?.id ?? null,
    falahCycleId
  )
  const saveMutation = useSavePriorityAssessment(user?.id ?? null)

  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [skippedWheels, setSkippedWheels] = useState<Set<WheelPrefix>>(new Set())
  const [sheetItem, setSheetItem] = useState<PriorityItem | null>(null)
  const [activeWheel, setActiveWheel] = useState<string>('')
  const lastLoadedContextRef = useRef<string | null>(null)

  const priorityItems = useMemo(
    () => buildPriorityItems(lifeDomains ?? undefined, wheels ?? undefined),
    [lifeDomains, wheels]
  )

  const itemsByWheel = useMemo(() => groupByWheel(priorityItems), [priorityItems])

  useEffect(() => {
    if (itemsByWheel.length > 0 && (!activeWheel || !itemsByWheel.some(([l]) => l === activeWheel))) {
      setActiveWheel(itemsByWheel[0][0])
    }
  }, [itemsByWheel, activeWheel])

  const contextKey = `${assessment?.id ?? 'none'}-${falahCycleId ?? 'standalone'}`

  useEffect(() => {
    if (!priorityItems.length) return
    if (lastLoadedContextRef.current === contextKey) return
    lastLoadedContextRef.current = contextKey
    let loaded: Record<string, number>
    let skipped: Set<WheelPrefix>
    if (assessment) {
      loaded = { ...assessment.scores }
      skipped = new Set((assessment.skippedWheels ?? []) as WheelPrefix[])
    } else {
      loaded = {}
      skipped = new Set<WheelPrefix>()
    }
    const keysWithScore = priorityItems
      .filter((i) => (loaded[i.key] ?? 0) > 0)
      .sort((a, b) => (loaded[b.key] ?? 0) - (loaded[a.key] ?? 0))
      .map((i) => i.key)
    setSelectedKeys(keysWithScore)
    setSkippedWheels(skipped)
  }, [assessment, lifeDomains, priorityItems, contextKey])

  const handleDomainClick = (item: PriorityItem) => {
    setSheetItem(item)
  }

  const handleAddToFocus = () => {
    if (!sheetItem) return
    const prefix = getKeyPrefix(sheetItem.key)
    setSelectedKeys((prev) => {
      if (prev.includes(sheetItem.key)) return prev
      const sameWheel = prev.filter((k) => getKeyPrefix(k) === prefix)
      if (sameWheel.length < MAX_FOCUS_PER_WHEEL) return [...prev, sheetItem.key]
      const lastSameIdx = prev.map((k) => getKeyPrefix(k) === prefix).lastIndexOf(true)
      return [...prev.slice(0, lastSameIdx), ...prev.slice(lastSameIdx + 1), sheetItem.key]
    })
    setSheetItem(null)
  }

  const handleRemoveFromFocus = () => {
    if (!sheetItem) return
    setSelectedKeys((prev) => prev.filter((k) => k !== sheetItem.key))
    setSheetItem(null)
  }

  const scores = useMemo(() => {
    const s: Record<string, number> = {}
    const byPrefix = new Map<string, string[]>()
    for (const key of selectedKeys) {
      const p = getKeyPrefix(key)
      const list = byPrefix.get(p) ?? []
      list.push(key)
      byPrefix.set(p, list)
    }
    for (const keys of byPrefix.values()) {
      keys.forEach((key, i) => {
        s[key] = MAX_FOCUS_PER_WHEEL - i
      })
    }
    return s
  }, [selectedKeys])

  const selectedKeysSet = useMemo(() => new Set(selectedKeys), [selectedKeys])

  useEffect(() => {
    if (selectedKeys.length === 0) return
    const t = setTimeout(() => {
      saveMutation.mutate({
        scores,
        skippedWheels: [...skippedWheels],
        falahCycleId,
      })
    }, 500)
    return () => clearTimeout(t)
  }, [selectedKeys, scores, skippedWheels, falahCycleId])

  const prioritySummary = useMemo(
    () =>
      getPrioritySummary(scores, priorityItems, skippedWheels, 'en').map((s) => ({
        title: s.title,
        score: s.score,
      })),
    [scores, priorityItems, skippedWheels]
  )

  const language = 'en' as 'nl' | 'en'

  const isLoading = loadingDomains || loadingWheels

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-4 pb-24">
            <Container className="max-w-2xl mx-auto">
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
        <main className="flex-1 flex flex-col p-4 pb-24">
          <Container className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {language === 'nl' ? 'Prioriteiten' : 'Priorities'}
            </h1>

            <p className="text-muted-foreground">
              {language === 'nl'
                ? 'Selecteer maximaal 5 domeinen per wheel om op te focussen deze cycle. Tik om meer te lezen en toe te voegen.'
                : 'Select up to 5 domains per wheel to focus on this cycle. Tap to read more and add to your focus.'}
            </p>

            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">{MINDSET_TEXT}</p>
            </div>

            {priorityItems.length === 0 ? (
              <p className="text-muted-foreground">
                {language === 'nl'
                  ? 'Geen domeinen gevonden. Controleer of de backend draait.'
                  : 'No domains found. Check if the backend is running.'}
              </p>
            ) : (
              <>
                <PrioritiesContent
                  itemsByWheel={itemsByWheel}
                  activeWheel={activeWheel}
                  onWheelChange={setActiveWheel}
                  language={language}
                  selectedKeys={selectedKeysSet}
                  onDomainClick={handleDomainClick}
                />

                <PrioritiesResultSummary summary={prioritySummary} language={language} />
              </>
            )}

            <PrioritiesNavigation
              isInFlow={isInFlow}
              language={language}
              onQuit={
                isInFlow && activeCycle
                  ? () => {
                      exitFlow.mutate(activeCycle.id, {
                        onSuccess: () => router.push('/home'),
                      })
                    }
                  : undefined
              }
            />
          </Container>
        </main>

        {sheetItem && (
          <DomainDetailSheet
            item={sheetItem}
            language={language}
            isSelected={selectedKeysSet.has(sheetItem.key)}
            onAdd={handleAddToFocus}
            onRemove={handleRemoveFromFocus}
            open={!!sheetItem}
            onOpenChange={(open) => !open && setSheetItem(null)}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
