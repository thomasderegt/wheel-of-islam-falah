'use client'

/**
 * OKR Objective Page
 * 
 * Shows key results for a specific objective
 * Navigation: Objective → Key Results
 */

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { KeyResultList } from '@/features/goals-okr/components/KeyResultList'
import { getObjective } from '@/features/goals-okr/api/goalsOkrApi'
import { getGoal } from '@/features/goals-okr/api/goalsOkrApi'
import { Loading } from '@/shared/components/ui/Loading'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { AutoHierarchicalNavigation } from '@/shared/components/navigation/HierarchicalNavigation'

export default function OKRObjectivePage() {
  const params = useParams()
  const objectiveId = params?.id ? Number(params.id) : null
  const router = useRouter()
  
  const { data: objective, isLoading: isLoadingObjective } = useQuery({
    queryKey: ['goals-okr', 'objective', objectiveId],
    queryFn: () => getObjective(objectiveId!),
    enabled: objectiveId !== null,
  })

  // Get goal ID from objective to enable back navigation
  const goalId = objective?.goalId

  // Fetch goal data for back navigation
  const { data: goal } = useQuery({
    queryKey: ['goals-okr', 'goal', goalId],
    queryFn: () => getGoal(goalId!),
    enabled: !!goalId,
  })

  if (isLoadingObjective || !objectiveId) {
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

  if (!objective) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-6xl mx-auto">
              <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
                <h1 className="text-2xl font-bold">Objective not found</h1>
                {goalId && (
                  <button
                    onClick={() => router.push(`/goals-okr/goals/${goalId}`)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Back to Objectives
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
                {goalId && (
                  <button
                    onClick={() => router.push(`/goals-okr/goals/${goalId}`)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Back to Objectives
                  </button>
                )}
                <div className="text-center space-y-2">
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                    {objective.titleEn || objective.titleNl}
                  </h1>
                  {objective.descriptionEn && (
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                      {objective.descriptionEn}
                    </p>
                  )}
                </div>
              </div>

              {/* Hierarchical Navigation */}
              <AutoHierarchicalNavigation />

              {/* Key Results List */}
              <KeyResultList objectiveId={objectiveId} />
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
