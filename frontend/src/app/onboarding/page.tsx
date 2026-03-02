'use client'

/**
 * Oriëntatiepagina (Phase A – Orientation)
 *
 * Toont na eerste login. Overzicht van de app en optie om de guided tour te starten.
 * Falah Succes Journey: Oriëntatie → Begrip → Doorlopende groeicyclus.
 */

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { Button } from '@/shared/components/ui/button'
import { routes } from '@/shared/constants/routes'
import { Play, Map, BookOpen, CheckCircle, ChevronDown, ChevronUp, Star, Lightbulb, Target, TrendingUp, RefreshCw } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible'

const ORIENTATION_COMPLETED_KEY = 'woi-orientation-completed'
const START_TOUR_1_KEY = 'woi-start-tour-1'
const START_TOUR_2_KEY = 'woi-start-tour-2'

function markOrientationCompleted() {
  if (globalThis.window !== undefined) {
    globalThis.localStorage.setItem(ORIENTATION_COMPLETED_KEY, 'true')
  }
}

function setStartTourFlag(tour: 1 | 2) {
  if (globalThis.window !== undefined) {
    globalThis.sessionStorage.setItem(tour === 1 ? START_TOUR_1_KEY : START_TOUR_2_KEY, 'true')
  }
}

export default function OnboardingPage() {
  const router = useRouter()
  const [isOnboardingExpanded, setIsOnboardingExpanded] = React.useState(true)
  const [isFalahCycleExpanded, setIsFalahCycleExpanded] = React.useState(false)

  const handleSkip = () => {
    markOrientationCompleted()
    router.push(routes.home)
  }

  const handleStartTour = (tour: 1 | 2) => {
    markOrientationCompleted()
    setStartTourFlag(tour)
    router.push(routes.home)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar variant="landing" />

        <main className="flex-1 flex flex-col p-4 pb-8">
          <Container className="max-w-2xl mx-auto flex flex-col gap-8">
            {/* Intro */}
            <section className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Good to have you here
              </h1>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>
                  You&apos;ve just joined Qalbsalim – a platform to help you flourish and achieve sustainable success, Falah, in this life and the next.
                </p>
                <p>
                  We&apos;ve prepared an onboarding process, containing two short guided tours, to give you a flying start.
                </p>
              </div>
            </section>

            {/* Process: Onboarding - collapsible */}
            <Collapsible open={isOnboardingExpanded} onOpenChange={setIsOnboardingExpanded}>
              <section className="relative rounded-lg border border-border bg-muted/20 overflow-hidden">
                <CollapsibleTrigger className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors rounded-lg">
                  <h2 className="font-semibold text-foreground">Onboarding process</h2>
                  {isOnboardingExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-0 px-4 pb-4">
                {/* Step 1: Start */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                      <Play className="h-5 w-5 text-primary" />
                    </div>
                    <div className="w-px flex-1 min-h-[24px] bg-border mt-2" />
                  </div>
                  <div className="flex-1 pb-6">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      Start
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      You&apos;re here. Quick overview and next steps.
                    </p>
                  </div>
                </div>

                {/* Step 2: Tour 1 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center font-semibold text-primary">
                      1
                    </div>
                    <div className="w-px flex-1 min-h-[24px] bg-border mt-2" />
                  </div>
                  <div className="flex-1 pb-6">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Map className="h-4 w-4 text-primary" />
                      Tour 1: Learn how to navigate
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      We&apos;ll show you where everything is – Wheel of Falah, Wheel of Life, Execute and Insight.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => handleStartTour(1)}
                    >
                      Click here to start Tour 1
                    </Button>
                  </div>
                </div>

                {/* Step 3: Tour 2 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center font-semibold text-primary">
                      2
                    </div>
                    <div className="w-px flex-1 min-h-[24px] bg-border mt-2" />
                  </div>
                  <div className="flex-1 pb-6">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Tour 2: Learn core concepts
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      What is Falah, Tazkiyyah, Fiqh? What are life domains, OKRs and a Kanban board? We&apos;ll explain the essentials.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => handleStartTour(2)}
                    >
                      Click here to start Tour 2
                    </Button>
                  </div>
                </div>

                {/* Step 4: Ready to go */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      Ready to go
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      After both tours you&apos;ll know how the app works and what the key concepts mean. You can start your growth journey.
                    </p>
                  </div>
                </div>
                  </div>
                </CollapsibleContent>
              </section>
            </Collapsible>

            {/* Falah growth cycle - collapsible */}
            <Collapsible open={isFalahCycleExpanded} onOpenChange={setIsFalahCycleExpanded}>
              <section className="relative rounded-lg border border-border bg-muted/20 overflow-hidden">
                <CollapsibleTrigger className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors rounded-lg">
                  <h2 className="font-semibold text-foreground">Falah growth process</h2>
                  {isFalahCycleExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-0 px-4 pb-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      After onboarding, you&apos;ll move through this process. It repeats – success is an ongoing, conscious process.
                    </p>
                    {/* Phase 1: Falah */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                          <Star className="h-5 w-5 text-primary" />
                        </div>
                        <div className="w-px flex-1 min-h-[24px] bg-border mt-2" />
                      </div>
                      <div className="flex-1 pb-6">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">Falah</h3>
                        <p className="text-sm text-muted-foreground mt-1">Starting with Falah enables you to set meaningful formative goals.</p>
                      </div>
                    </div>
                    {/* Phase 2: Self Assessment */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                          <Lightbulb className="h-5 w-5 text-primary" />
                        </div>
                        <div className="w-px flex-1 min-h-[24px] bg-border mt-2" />
                      </div>
                      <div className="flex-1 pb-6">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">Self-assessment</h3>
                        <p className="text-sm text-muted-foreground mt-1">Assessment and Insight dashboard – where do you stand?</p>
                      </div>
                    </div>
                    {/* Phase 3: Direction */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                          <Target className="h-5 w-5 text-primary" />
                        </div>
                        <div className="w-px flex-1 min-h-[24px] bg-border mt-2" />
                      </div>
                      <div className="flex-1 pb-6">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">Direction</h3>
                        <p className="text-sm text-muted-foreground mt-1">Formative goals (Wheel of Falah) and context goals (Wheel of Life).</p>
                      </div>
                    </div>
                    {/* Phase 4: Execution */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div className="w-px flex-1 min-h-[24px] bg-border mt-2" />
                      </div>
                      <div className="flex-1 pb-6">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">Execution</h3>
                        <p className="text-sm text-muted-foreground mt-1">Execute via the Kanban board – daily action.</p>
                      </div>
                    </div>
                    {/* Phase 5: Reflection */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                          <RefreshCw className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">Reflection</h3>
                        <p className="text-sm text-muted-foreground mt-1">Insight review and reflection – then back to Falah.</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        markOrientationCompleted()
                        router.push(routes.success)
                      }}
                    >
                      Click here to start Falah Growth process
                    </Button>
                  </div>
                </CollapsibleContent>
              </section>
            </Collapsible>

            {/* Skip */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                className="text-muted-foreground"
                onClick={handleSkip}
              >
                Skip tours
              </Button>
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
