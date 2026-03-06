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
import { Play, Info } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { FalahCycleFlow } from '@/features/home/components/FalahCycleFlow'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible'

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
          <Container className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Welcome Home
            </h1>

            <p className="text-foreground/90">
              Life is busy and demanding. Work, school, family, having goals and achieving them – and the question of what actually matters. Nobody really teaches you how to do all of this. That&apos;s why we at <strong>Qalbsalim</strong> created the <strong>Falah Growth Cycle</strong> to help you in the process.
            </p>

            <p className="text-foreground/90">
              On this page you can start or continue your <strong>Falah Growth Cycle</strong>, or click any step in the flow below to jump to Success, Priorities, Goals, Execution, or Insight.
            </p>

            <section className="py-6">
              <FalahCycleFlow />
            </section>

            <Collapsible>
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  aria-label="Show flow steps"
                >
                  <Info className="h-5 w-5" />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="text-foreground/90 space-y-4 mt-4 pl-1">
                  <p><strong>Falah</strong><br />Starting with Falah enables you to set meaningful formative goals.</p>
                  <p><strong>Priorities</strong><br />Where do you want to focus this cycle? Set priorities for your direction and goals.</p>
                  <p><strong>Goals</strong><br />Formative goals (Succes) and context goals (Life & Work).</p>
                  <p><strong>Execution</strong><br />Execute via the Kanban board – daily action.</p>
                  <p><strong>Insight</strong><br />Insight review and reflection – then back to Success.</p>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Button
              size="lg"
              className="w-full sm:w-auto gap-2"
              onClick={handleStartOrContinue}
              disabled={startCycle.isPending || reEnterFlow.isPending}
            >
              <Play className="h-4 w-4" />
              {startButtonLabel}
            </Button>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
