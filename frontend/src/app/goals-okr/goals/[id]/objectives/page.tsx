'use client'

/**
 * OKR Goal Objectives Page
 * 
 * Shows objectives for a specific goal
 * Navigation: Goal → Objectives
 */

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { NavObjectiveCircle } from '@/features/goals-okr/components/NavObjectiveCircle'
import { getGoal } from '@/features/goals-okr/api/goalsOkrApi'
import { Loading } from '@/shared/components/ui/Loading'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { AutoHierarchicalNavigation } from '@/shared/components/navigation/HierarchicalNavigation'

export default function OKRGoalObjectivesPage() {
  const params = useParams()
  const goalId = params?.id ? Number(params.id) : null
  const router = useRouter()
  
  const { data: goal, isLoading: isLoadingGoal } = useQuery({
    queryKey: ['goals-okr', 'goal', goalId],
    queryFn: () => getGoal(goalId!),
    enabled: goalId !== null,
  })

  // Get life domain ID from goal to enable back navigation
  const lifeDomainId = goal?.lifeDomainId

  if (isLoadingGoal || !goalId) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center min-h-[600px]">
                <Loading />
              </div>
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (!goal) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-6xl mx-auto">
              <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
                <h1 className="text-2xl font-bold">Goal not found</h1>
                {lifeDomainId && (
                  <button
                    onClick={() => router.push(`/goals-okr/life-domains/${lifeDomainId}`)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Back to Goals
                  </button>
                )}
              </div>
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
        <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-6xl mx-auto">
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                {lifeDomainId && (
                  <button
                    onClick={() => router.push(`/goals-okr/life-domains/${lifeDomainId}`)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Back to Goals
                  </button>
                )}
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">
                    Goal
                  </p>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                    {goal.titleEn || goal.titleNl}
                  </h1>
                  {goal.descriptionEn && (
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                      {goal.descriptionEn}
                    </p>
                  )}
                  <p className="text-lg font-semibold text-foreground mt-4">
                    Objectives for this Goal
                  </p>
                </div>
              </div>

              {/* Hierarchical Navigation */}
              <AutoHierarchicalNavigation />

              {/* Objectives Grid */}
              <NavObjectiveCircle goalId={goalId} />
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
