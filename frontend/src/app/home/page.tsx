'use client'

/**
 * Home Page - Dashboard
 *
 * Falah Growth process: Success → Priorities → Goals → Execute → Insight.
 */

import { useRouter } from 'next/navigation'
import { ProtectedRoute, useAuth } from '@/features/auth'
import { useFalahCycles, useStartFalahCycle, useReEnterFalahCycleFlow } from '@/features/auth/hooks/useFalahCycles'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import Link from 'next/link'
import { Star, ClipboardCheck, Target, TrendingUp, Lightbulb, Play } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { routes } from '@/shared/constants/routes'

const falahGrowthSteps = [
  {
    href: routes.success,
    label: 'Success',
    description:
      'The Falah compass: the formation of your heart and action. Explore the core of Falah, Tazkiyyah and Fiqh. This is the starting point of your growth cycle and helps you clarify what truly matters before you set priorities and goals.',
    icon: Star,
  },
  {
    href: routes.assessment,
    label: 'Priorities',
    description:
      'Determine where you want to focus this growth cycle. Choose from the domains of your life (family, work, health, etc.) and identify what needs the most attention now. This creates a clear foundation for your goals.',
    icon: ClipboardCheck,
  },
  {
    href: '/goals-okr',
    label: 'Goals',
    description:
      'Set your objectives, key results and activities. Turn your priorities into concrete goals and measurable results. Here you move from "what do I want?" to "what will I do?" and how you will measure it.',
    icon: Target,
  },
  {
    href: '/goals-okr/execute',
    label: 'Execution',
    description:
      'Plan and carry out your daily actions. Use the Kanban board to organise tasks, track progress and stay focused. This is where your plan becomes action and your growth shows in practice.',
    icon: TrendingUp,
  },
  {
    href: '/goals-okr/insight',
    label: 'Insight',
    description:
      'Overview and insight into your progress. See how far you\'ve come, what works and what you can improve. Reflect on your cycle and use these insights to move on to the next Success step.',
    icon: Lightbulb,
  },
]

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { data: cycles } = useFalahCycles(user?.id ?? null)
  const startCycle = useStartFalahCycle(user?.id ?? null)
  const reEnterFlow = useReEnterFalahCycleFlow(user?.id ?? null)

  const activeCycle = cycles?.find((c) => c.active)
  const hasActiveCycle = !!activeCycle
  let startButtonLabel = 'Start Falah growth cycle'
  if (startCycle.isPending || reEnterFlow.isPending) startButtonLabel = 'Starting...'
  else if (hasActiveCycle) startButtonLabel = 'Continue Falah growth cycle'

  const handleStartOrContinue = async () => {
    if (!user?.id) return
    if (hasActiveCycle) {
      try {
        await reEnterFlow.mutateAsync(activeCycle!.id)
        router.push(routes.success)
      } catch (e) {
        console.error('Failed to re-enter flow:', e)
      }
      return
    }
    try {
      await startCycle.mutateAsync()
      router.push(routes.success)
    } catch (e) {
      console.error('Failed to start Falah cycle:', e)
    }
  }

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
              The Falah compass: the formation of your heart and action. Explore the core of Falah, Tazkiyyah and Fiqh. This is the starting point of your growth cycle and helps you clarify what truly matters before you set priorities and goals.
            </p>

            <Button
              size="lg"
              className="w-full sm:w-auto gap-2"
              onClick={handleStartOrContinue}
              disabled={startCycle.isPending || reEnterFlow.isPending}
            >
              <Play className="h-4 w-4" />
              {startButtonLabel}
            </Button>

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
