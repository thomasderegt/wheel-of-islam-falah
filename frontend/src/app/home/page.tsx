'use client'

/**
 * Home Page - Dashboard
 *
 * Falah Growth process: Success → Assessment → Goals → Execute → Insight.
 */

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import Link from 'next/link'
import { Star, ClipboardCheck, Target, TrendingUp, Lightbulb, Play } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { routes } from '@/shared/constants/routes'

const falahGrowthSteps = [
  { href: routes.success, label: 'Falah', description: 'Wheel of Falah – formation of heart and action', icon: Star },
  { href: routes.assessment, label: 'Self-assessment', description: '360° assessment – where do you stand?', icon: ClipboardCheck },
  { href: '/goals-okr', label: 'Direction', description: 'Set and track your objectives', icon: Target },
  { href: '/goals-okr/execute', label: 'Execution', description: 'Kanban board – daily action', icon: TrendingUp },
  { href: '/goals-okr/insight', label: 'Reflection', description: 'Progress and insight – then back to Falah', icon: Lightbulb },
]

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar variant="landing" />

        <main className="flex-1 flex flex-col p-4 pb-24">
          <Container className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Home
            </h1>

            <p className="text-foreground/90">
              Your dashboard. Start here and navigate to the main areas.
            </p>

            <Link href={routes.success}>
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <Play className="h-4 w-4" />
                Start Falah growth cycle
              </Button>
            </Link>

            <section>
              <div className="flex flex-col gap-3">
                {falahGrowthSteps.map((step, index) => {
                  const Icon = step.icon
                  const isLast = index === falahGrowthSteps.length - 1
                  return (
                    <Link key={step.href} href={step.href} className="flex gap-4 bg-muted/20 hover:bg-muted/40 transition-colors rounded-lg py-3 px-3">
                      <div className="flex flex-col items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/15 border-2 border-primary/50 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        {!isLast && <div className="w-px flex-1 min-h-[24px] bg-border mt-2" />}
                      </div>
                      <div className={`flex-1 ${isLast ? '' : 'pb-6'}`}>
                        <h3 className="font-semibold text-foreground">{step.label}</h3>
                        <p className="text-sm text-foreground/85 mt-1">{step.description}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
