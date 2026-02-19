'use client'

/**
 * OKR Objective Detail Page
 *
 * Shows the objective (title, description) and key results as cards.
 * Clicking a key result card navigates to the key result detail page.
 * When the user has a UserObjectiveInstance for this objective, shows "Add custom key result".
 */

import { useState } from 'react'
import { ProtectedRoute, useAuth } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { Button } from '@/shared/components/ui/button'
import { KeyResultList } from '@/features/goals-okr/components/KeyResultList'
import { CreateCustomKeyResultDialog } from '@/features/goals-okr/components/CreateCustomKeyResultDialog'
import { getObjective, getUserObjectiveInstances } from '@/features/goals-okr/api/goalsOkrApi'
import { Loading } from '@/shared/components/ui/Loading'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'

export default function OKRObjectiveDetailPage() {
  const params = useParams()
  const objectiveId = params?.id ? Number(params.id) : null
  const router = useRouter()
  const { user } = useAuth()
  const [createKeyResultDialogOpen, setCreateKeyResultDialogOpen] = useState(false)

  const { data: objective, isLoading: isLoadingObjective } = useQuery({
    queryKey: ['goals-okr', 'objective', objectiveId],
    queryFn: () => getObjective(objectiveId!),
    enabled: objectiveId !== null,
  })

  const { data: userObjectiveInstances } = useQuery({
    queryKey: ['goals-okr', 'userObjectiveInstances', user?.id],
    queryFn: () => getUserObjectiveInstances(user!.id),
    enabled: !!user?.id,
  })

  const userInstance = userObjectiveInstances?.find(
    (inst) => inst.objectiveId === objectiveId
  )
  const lifeDomainId = objective?.lifeDomainId

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
                {lifeDomainId && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 text-base"
                    onClick={() => router.push(`/goals-okr/life-domains/${lifeDomainId}`)}
                  >
                    Back
                  </Button>
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
              <div className="space-y-4">
                {lifeDomainId && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 text-base"
                    onClick={() => router.push(`/goals-okr/life-domains/${lifeDomainId}`)}
                  >
                    Back
                  </Button>
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
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-semibold">Key Results</h2>
                  {userInstance && (
                    <Button
                      variant="outline"
                      onClick={() => setCreateKeyResultDialogOpen(true)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add custom key result
                    </Button>
                  )}
                </div>
                <KeyResultList objectiveId={objectiveId} />
              </div>
            </div>
          </Container>
        </main>

        {userInstance && (
          <CreateCustomKeyResultDialog
            open={createKeyResultDialogOpen}
            onOpenChange={setCreateKeyResultDialogOpen}
            userObjectiveInstanceId={userInstance.id}
            onSuccess={() => setCreateKeyResultDialogOpen(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
