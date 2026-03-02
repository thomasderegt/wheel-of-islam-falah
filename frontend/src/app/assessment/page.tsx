'use client'

/**
 * Assessment Page - 360° Self-Assessment
 *
 * Rate your current state per life domain (1–10).
 * Part of the Falah growth cycle: Self Assessment → Insight → Direction.
 */

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { useLifeDomains } from '@/features/goals-okr/hooks/useLifeDomains'
import { useWheels } from '@/features/goals-okr/hooks/useWheels'
import { Loading } from '@/shared/components/ui/Loading'
import { useMemo, useState, useEffect } from 'react'
import { routes } from '@/shared/constants/routes'
import Link from 'next/link'
import { Button } from '@/shared/components/ui/button'

const STORAGE_KEY = 'woi-assessment-scores'

function loadScores(): Record<number, number> {
  if (globalThis.window === undefined) return {}
  try {
    const raw = globalThis.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, number>
    return Object.fromEntries(
      Object.entries(parsed).map(([k, v]) => [Number(k), Math.min(10, Math.max(1, v))])
    )
  } catch {
    return {}
  }
}

function saveScores(scores: Record<number, number>) {
  if (globalThis.window === undefined) return
  globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
}

export default function AssessmentPage() {
  const { data: lifeDomains, isLoading: loadingDomains } = useLifeDomains()
  const { data: wheels, isLoading: loadingWheels } = useWheels()

  const [scores, setScores] = useState<Record<number, number>>({})

  useEffect(() => {
    setScores(loadScores())
  }, [])

  const wheelOfLifeDomains = useMemo(() => {
    if (!lifeDomains || !wheels) return []
    const wheelOfLife = wheels.find((w) => w.wheelKey === 'WHEEL_OF_LIFE')
    if (!wheelOfLife) return lifeDomains
    return lifeDomains
      .filter((d) => d.wheelId === wheelOfLife.id)
      .sort((a, b) => a.displayOrder - b.displayOrder)
  }, [lifeDomains, wheels])

  const handleScoreChange = (lifeDomainId: number, score: number) => {
    const next = { ...scores, [lifeDomainId]: score }
    setScores(next)
    saveScores(next)
  }

  const language = 'en' as 'nl' | 'en'

  if (loadingDomains || loadingWheels) {
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
              {language === 'nl' ? 'Zelfevaluatie' : 'Self-Assessment'}
            </h1>

            <p className="text-muted-foreground">
              {language === 'nl'
                ? 'Beoordeel je huidige staat per levensdomein (1–10). Dit vormt de basis voor je richting en doelen.'
                : 'Rate your current state per life domain (1–10). This forms the basis for your direction and goals.'}
            </p>

            {wheelOfLifeDomains.length === 0 ? (
              <p className="text-muted-foreground">
                {language === 'nl'
                  ? 'Geen levensdomeinen gevonden. Controleer of de backend draait.'
                  : 'No life domains found. Check if the backend is running.'}
              </p>
            ) : (
              <div className="space-y-6">
                {wheelOfLifeDomains.map((domain) => {
                  const title = language === 'nl' ? domain.titleNl : domain.titleEn
                  const value = scores[domain.id] ?? 5
                  return (
                    <div
                      key={domain.id}
                      className="rounded-lg border bg-card p-4 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <label
                          htmlFor={`score-${domain.id}`}
                          className="font-medium text-foreground"
                        >
                          {title}
                        </label>
                        <span className="text-lg font-semibold text-primary tabular-nums">
                          {value}
                        </span>
                      </div>
                      <input
                        id={`score-${domain.id}`}
                        type="range"
                        min={1}
                        max={10}
                        value={value}
                        onChange={(e) =>
                          handleScoreChange(domain.id, Number(e.target.value))
                        }
                        className="w-full h-2 rounded-full appearance-none bg-muted accent-primary cursor-pointer"
                      />
                    </div>
                  )
                })}
              </div>
            )}

            <div className="pt-4 flex gap-3">
              <Button variant="outline" asChild>
                <Link href={routes.home}>{language === 'nl' ? 'Terug' : 'Back'}</Link>
              </Button>
              <Button asChild>
                <Link href="/goals-okr/insight">
                  {language === 'nl' ? 'Naar Insight' : 'View Insight'}
                </Link>
              </Button>
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
