'use client'

/**
 * OKR User Key Result Instance Page
 * 
 * Shows initiatives for a user key result instance with ability to create new ones
 */

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { Button } from '@/shared/components/ui/button'
import { InitiativeListForKeyResult } from '@/features/goals-okr/components/InitiativeListForKeyResult'
import { CreateInitiativeDialog } from '@/features/goals-okr/components/CreateInitiativeDialog'
import { InitiativeSuggestions } from '@/features/goals-okr/components/InitiativeSuggestions'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserKeyResultInstance, getKeyResult, startUserInitiativeInstance } from '@/features/goals-okr/api/goalsOkrApi'
import type { InitiativeDTO } from '@/features/goals-okr/api/goalsOkrApi'
import { Loading } from '@/shared/components/ui/Loading'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useAddKanbanItem } from '@/features/goals-okr/hooks/useKanbanItems'

export default function OKRUserKeyResultInstancePage() {
  const params = useParams()
  const instanceId = Number(params.id)
  const router = useRouter()
  const language = 'en' as 'nl' | 'en'
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedInitiative, setSelectedInitiative] = useState<InitiativeDTO | null>(null)
  const addKanbanItem = useAddKanbanItem()

  // Get user key result instance to find the key result and objective instance
  const { data: userInstance, isLoading: isLoadingInstance } = useQuery({
    queryKey: ['goals-okr', 'userKeyResultInstance', instanceId],
    queryFn: () => getUserKeyResultInstance(instanceId),
    enabled: !!instanceId,
  })

  // Get key result details
  const { data: keyResult, isLoading: isLoadingKeyResult } = useQuery({
    queryKey: ['goals-okr', 'keyResult', userInstance?.keyResultId],
    queryFn: () => getKeyResult(userInstance!.keyResultId),
    enabled: !!userInstance?.keyResultId,
  })

  const handleCreateInitiative = () => {
    setCreateDialogOpen(true)
  }

  const handleDialogClose = () => {
    setCreateDialogOpen(false)
  }

  const startInitiativeMutation = useMutation({
    mutationFn: ({ userId, userKeyResultInstanceId, initiativeId }: { userId: number; userKeyResultInstanceId: number; initiativeId: number }) => {
      console.log('Starting initiative instance:', { userId, userKeyResultInstanceId, initiativeId })
      return startUserInitiativeInstance(userId, userKeyResultInstanceId, initiativeId)
    },
    onSuccess: async (userInitiativeInstance) => {
      console.log('Initiative instance started successfully:', userInitiativeInstance)
      
      // Add to kanban board after starting the initiative instance
      if (user?.id && userInitiativeInstance?.id) {
        try {
          console.log('Adding initiative to kanban board:', { userId: user.id, itemId: userInitiativeInstance.id })
          await addKanbanItem.mutateAsync({
            userId: user.id,
            itemType: 'INITIATIVE',
            itemId: userInitiativeInstance.id, // Use the UserInitiativeInstance ID
          })
          console.log('Initiative added to kanban board successfully')
        } catch (error) {
          console.error('Failed to add initiative to kanban board:', error)
          alert(language === 'nl' 
            ? 'Initiative gestart, maar kon niet worden toegevoegd aan progress board. Probeer het handmatig toe te voegen.'
            : 'Initiative started, but could not be added to progress board. Please try adding it manually.')
        }
      } else {
        console.warn('Missing user ID or initiative instance ID:', { userId: user?.id, instanceId: userInitiativeInstance?.id })
      }
      
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'userInitiativeInstances'] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'initiatives', 'userKeyResultInstance', instanceId] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'kanban-items', 'user', user?.id] })
      
      setConfirmDialogOpen(false)
      setSelectedInitiative(null)
      
      // Show success message
      const initiativeTitle = selectedInitiative 
        ? (language === 'nl' ? (selectedInitiative.titleNl || selectedInitiative.titleEn) : (selectedInitiative.titleEn || selectedInitiative.titleNl))
        : 'Initiative'
      alert(language === 'nl' 
        ? `${initiativeTitle} is gestart en toegevoegd aan je progress board!`
        : `${initiativeTitle} has been started and added to your progress board!`)
    },
    onError: (error: any) => {
      console.error('Failed to start initiative instance:', error)
      console.error('Error details:', {
        message: error?.message,
        response: error?.response,
        status: error?.response?.status,
        data: error?.response?.data,
        url: error?.config?.url,
        method: error?.config?.method
      })
      
      let errorMessage = language === 'nl' 
        ? 'Kon initiative niet starten. Probeer het opnieuw.'
        : 'Failed to start initiative. Please try again.'
      
      if (error?.response) {
        if (error.response.status === 404) {
          errorMessage = language === 'nl'
            ? 'Endpoint niet gevonden. Controleer of de backend draait en opnieuw is gestart.'
            : 'Endpoint not found. Please check if the backend is running and has been restarted.'
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error
        } else if (error.response.status === 500) {
          errorMessage = language === 'nl'
            ? 'Server fout. Controleer de backend logs.'
            : 'Server error. Please check the backend logs.'
        }
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      alert(errorMessage)
    },
  })

  const handleSelectSuggestion = (suggestion: InitiativeDTO) => {
    setSelectedInitiative(suggestion)
    setConfirmDialogOpen(true)
  }

  const handleConfirmStartInitiative = () => {
    if (!user?.id || !selectedInitiative) return
    
    startInitiativeMutation.mutate({
      userId: user.id,
      userKeyResultInstanceId: instanceId,
      initiativeId: selectedInitiative.id,
    })
  }

  const handleCancelStartInitiative = () => {
    setConfirmDialogOpen(false)
    setSelectedInitiative(null)
  }

  if (isLoadingInstance || isLoadingKeyResult) {
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

  if (!userInstance || !keyResult) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-6xl mx-auto">
              <div className="text-center text-muted-foreground py-12">
                <p>Key result instance not found</p>
              </div>
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  const keyResultTitle = language === 'nl' ? (keyResult.titleNl || keyResult.titleEn) : (keyResult.titleEn || keyResult.titleNl)
  const keyResultDescription = language === 'nl' ? (keyResult.descriptionNl || keyResult.descriptionEn) : (keyResult.descriptionEn || keyResult.descriptionNl)

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar variant="landing" />
        <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-6xl mx-auto">
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                {keyResult.objectiveId && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 text-base"
                    onClick={() => router.push(`/goals-okr/objectives/${keyResult.objectiveId}`)}
                  >
                    Back
                  </Button>
                )}
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">
                    {language === 'nl' ? 'Key Result' : 'Key Result'}
                  </p>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                    {keyResultTitle}
                  </h1>
                  {keyResultDescription && (
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                      {keyResultDescription}
                    </p>
                  )}
                  <p className="text-lg font-semibold text-foreground mt-4">
                    {language === 'nl' ? 'Initiatives voor dit Key Result' : 'Initiatives for this Key Result'}
                  </p>
                </div>
              </div>

              {/* Suggested Initiatives */}
              {keyResult && (
                <div className="space-y-4">
                  <InitiativeSuggestions
                    keyResultId={keyResult.id}
                    language={language}
                    onSelectSuggestion={handleSelectSuggestion}
                  />
                </div>
              )}

              {/* Initiatives List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">
                    {language === 'nl' ? 'Mijn Initiatives' : 'My Initiatives'}
                  </h2>
                  <Button
                    onClick={handleCreateInitiative}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {language === 'nl' ? 'Nieuw Initiative' : 'New Initiative'}
                  </Button>
                </div>
                <InitiativeListForKeyResult
                  userKeyResultInstanceId={instanceId}
                  keyResultId={keyResult?.id}
                  language={language}
                />
              </div>
            </div>
          </Container>
        </main>

        {/* Create Initiative Dialog */}
        <CreateInitiativeDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          keyResultId={userInstance?.keyResultId ?? undefined}
          keyResultTitle={keyResultTitle}
          userKeyResultInstanceId={instanceId}
          language={language}
          onSuccess={handleDialogClose}
        />

        {/* Confirm Start Initiative Dialog */}
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {language === 'nl' ? 'Initiative starten?' : 'Start Initiative?'}
              </DialogTitle>
              <DialogDescription>
                {selectedInitiative && (
                  <>
                    {language === 'nl' 
                      ? `Wil je "${selectedInitiative.titleNl || selectedInitiative.titleEn}" starten?`
                      : `Do you want to start "${selectedInitiative.titleEn || selectedInitiative.titleNl}"?`
                    }
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCancelStartInitiative}
                disabled={startInitiativeMutation.isPending}
              >
                {language === 'nl' ? 'Annuleren' : 'Cancel'}
              </Button>
              <Button
                onClick={handleConfirmStartInitiative}
                disabled={startInitiativeMutation.isPending}
              >
                {startInitiativeMutation.isPending 
                  ? (language === 'nl' ? 'Starten...' : 'Starting...')
                  : (language === 'nl' ? 'Starten' : 'Start')
                }
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
