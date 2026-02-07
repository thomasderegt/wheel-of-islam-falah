'use client'

/**
 * OKR User Objective Instance Page
 * 
 * Shows initiatives for a user objective instance with ability to create new ones
 */

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { InitiativeList } from '@/features/goals-okr/components/InitiativeList'
import { CreateInitiativeDialog } from '@/features/goals-okr/components/CreateInitiativeDialog'
import { Button } from '@/shared/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getUserObjectiveInstance, getKeyResultsByObjective } from '@/features/goals-okr/api/goalsOkrApi'
import { Loading } from '@/shared/components/ui/Loading'
import { AutoHierarchicalNavigation } from '@/shared/components/navigation/HierarchicalNavigation'

export default function OKRUserObjectiveInstancePage() {
  const params = useParams()
  const instanceId = Number(params.id)
  const language = 'en' as 'nl' | 'en'
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedKeyResultId, setSelectedKeyResultId] = useState<number | null>(null)

  // Get user objective instance to find the objective
  const { data: userInstance, isLoading: isLoadingInstance } = useQuery({
    queryKey: ['goals-okr', 'userObjectiveInstance', instanceId],
    queryFn: () => getUserObjectiveInstance(instanceId),
    enabled: !!instanceId,
  })

  // Get key results for this objective
  const { data: keyResults, isLoading: isLoadingKeyResults } = useQuery({
    queryKey: ['goals-okr', 'keyResults', 'objective', userInstance?.objectiveId],
    queryFn: () => getKeyResultsByObjective(userInstance!.objectiveId),
    enabled: !!userInstance?.objectiveId,
  })

  const handleCreateInitiative = (keyResultId: number) => {
    setSelectedKeyResultId(keyResultId)
    setCreateDialogOpen(true)
  }

  const handleDialogClose = () => {
    setCreateDialogOpen(false)
    setSelectedKeyResultId(null)
  }

  if (isLoadingInstance || isLoadingKeyResults) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center min-h-[400px]">
                <Loading />
              </div>
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (!userInstance) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-6xl mx-auto">
              <div className="text-center text-muted-foreground py-12">
                <p>Objective instance not found</p>
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
              {/* Hierarchical Navigation */}
              <AutoHierarchicalNavigation />

              {/* Header */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  {language === 'nl' ? 'Initiatives' : 'Initiatives'}
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  {language === 'nl' 
                    ? 'Beheer je initiatives om je Key Results te behalen'
                    : 'Manage your initiatives to achieve your Key Results'}
                </p>
              </div>

              {/* Key Results - Quick Create Buttons */}
              {keyResults && keyResults.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">
                    {language === 'nl' ? 'Key Results' : 'Key Results'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {keyResults.map((keyResult) => (
                      <div
                        key={keyResult.id}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">
                            {language === 'nl' ? keyResult.titleNl : keyResult.titleEn}
                          </h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCreateInitiative(keyResult.id)}
                            className="gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            {language === 'nl' ? 'Initiative' : 'Initiative'}
                          </Button>
                        </div>
                        {keyResult.descriptionEn && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {language === 'nl' ? keyResult.descriptionNl : keyResult.descriptionEn}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Initiatives List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">
                    {language === 'nl' ? 'Mijn Initiatives' : 'My Initiatives'}
                  </h2>
                </div>
                <InitiativeList 
                  userObjectiveInstanceId={instanceId} 
                  language={language}
                />
              </div>
            </div>
          </Container>
        </main>

        {/* Create Initiative Dialog */}
        {selectedKeyResultId && (
          <CreateInitiativeDialog
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            keyResultId={selectedKeyResultId}
            userObjectiveInstanceId={instanceId}
            language={language}
            onSuccess={handleDialogClose}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
