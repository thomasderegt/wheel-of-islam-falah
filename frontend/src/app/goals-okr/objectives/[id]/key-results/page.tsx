'use client'

/**
 * OKR Objective Key Results Page
 * 
 * Shows key results for a specific objective
 * Navigation: Objective → Key Results
 */

import { useState } from 'react'
import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { KeyResultList } from '@/features/goals-okr/components/KeyResultList'
import { CreateKeyResultDialog } from '@/features/goals-okr/components/CreateKeyResultDialog'
import { getObjective, getKeyResultsByObjective } from '@/features/goals-okr/api/goalsOkrApi'
import { getGoal } from '@/features/goals-okr/api/goalsOkrApi'
import { Loading } from '@/shared/components/ui/Loading'
import { Button } from '@/shared/components/ui/button'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { AutoHierarchicalNavigation } from '@/shared/components/navigation/HierarchicalNavigation'

export default function OKRObjectiveKeyResultsPage() {
  const params = useParams()
  const objectiveId = params?.id ? Number(params.id) : null
  const router = useRouter()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const language = 'en' as 'nl' | 'en'
  
  const { data: objective, isLoading: isLoadingObjective } = useQuery({
    queryKey: ['goals-okr', 'objective', objectiveId],
    queryFn: () => getObjective(objectiveId!),
    enabled: objectiveId !== null,
  })

  // Get key results to determine order index for new key result
  const { data: keyResults } = useQuery({
    queryKey: ['goals-okr', 'keyResults', 'objective', objectiveId],
    queryFn: () => getKeyResultsByObjective(objectiveId!),
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

  const handleCreateKeyResult = () => {
    setCreateDialogOpen(true)
  }

  const handleDialogClose = () => {
    setCreateDialogOpen(false)
  }

  // Calculate next order index
  const nextOrderIndex = keyResults ? keyResults.length + 1 : 1

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
                    onClick={() => router.push(`/goals-okr/goals/${goalId}/objectives`)}
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
                    onClick={() => router.push(`/goals-okr/goals/${goalId}/objectives`)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Back to Objectives
                  </button>
                )}
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">
                    Objective
                  </p>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                    {objective.titleEn || objective.titleNl}
                  </h1>
                  {objective.descriptionEn && (
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                      {objective.descriptionEn}
                    </p>
                  )}
                  <p className="text-lg font-semibold text-foreground mt-4">
                    Key Results for this Objective
                  </p>
                </div>
              </div>

              {/* Hierarchical Navigation */}
              <AutoHierarchicalNavigation />

              {/* Key Results List with Add Button */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">
                    {language === 'nl' ? 'Key Results' : 'Key Results'}
                  </h2>
                  <Button
                    onClick={handleCreateKeyResult}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {language === 'nl' ? 'Nieuw Key Result' : 'New Key Result'}
                  </Button>
                </div>
                <KeyResultList objectiveId={objectiveId} />
              </div>
            </div>
          </Container>
        </main>

        {/* Create Key Result Dialog */}
        {objectiveId && (
          <CreateKeyResultDialog
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            objectiveId={objectiveId}
            defaultOrderIndex={nextOrderIndex}
            language={language}
            onSuccess={handleDialogClose}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
