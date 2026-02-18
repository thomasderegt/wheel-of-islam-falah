'use client'

/**
 * KeyResultList Component
 * 
 * Lijst van key results binnen een objective
 * Met "Start Objective" functionaliteit en progress tracking
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useKeyResultsByObjective } from '../hooks/useKeyResultsByObjective'
import { getUserObjectiveInstances, getKeyResultProgress, getObjective, startUserKeyResultInstance, getUserKeyResultInstances } from '../api/goalsOkrApi'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useAddKanbanItem } from '../hooks/useKanbanItems'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Progress } from '@/shared/components/ui/progress'
import { Loading } from '@/shared/components/ui/Loading'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { CheckCircle2, PlayCircle, Target, Plus, Trash2 } from 'lucide-react'
import { useDeleteKeyResult } from '../hooks/useDeleteKeyResult'
import type { KeyResultDTO } from '../api/goalsOkrApi'

/**
 * KeyResultCard Component
 * Separate component to handle the useQuery hook for progress
 */
interface KeyResultCardProps {
  keyResult: KeyResultDTO
  userObjectiveInstanceId: number | null
  userId: number | null
  language: 'nl' | 'en'
  isStarted: boolean
}

function KeyResultCard({ keyResult, userObjectiveInstanceId, userId, language, isStarted }: KeyResultCardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const addKanbanItem = useAddKanbanItem()
  const queryClient = useQueryClient()
  const deleteKeyResultMutation = useDeleteKeyResult()
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Get user key result instances to find the one for this key result
  // Only fetch if we have a user and a userObjectiveInstanceId (meaning the objective is started)
  const { data: userKeyResultInstances } = useQuery({
    queryKey: ['goals-okr', 'userKeyResultInstances', 'user', user?.id],
    queryFn: () => getUserKeyResultInstances(user?.id || 0),
    enabled: !!user?.id && !!userObjectiveInstanceId, // Only fetch if objective is started
    retry: false, // Don't retry if backend is not available
    refetchOnWindowFocus: false, // Don't refetch on window focus
  })

  // Find UserKeyResultInstance for this key result and objective instance
  const userKeyResultInstance = userKeyResultInstances?.find(
    ukri => ukri.keyResultId === keyResult.id && 
            ukri.userObjectiveInstanceId === userObjectiveInstanceId
  )

  const startKeyResultInstanceMutation = useMutation({
    mutationFn: ({ userId, userObjectiveInstanceId, keyResultId }: { userId: number; userObjectiveInstanceId: number; keyResultId: number }) =>
      startUserKeyResultInstance(userId, userObjectiveInstanceId, keyResultId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'userKeyResultInstances'] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'keyResultProgress'] })
    },
  })

  const handleAddToKanban = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user?.id || !userObjectiveInstanceId) {
      alert(language === 'nl' ? 'Start eerst het objective' : 'Please start the objective first')
      return
    }
    setConfirmDialogOpen(true)
  }

  const handleConfirmAddToKanban = async () => {
    if (!user?.id || !userObjectiveInstanceId) return

    try {
      // 1. Start UserKeyResultInstance first (or use existing)
      let instanceId = userKeyResultInstance?.id
      if (!instanceId) {
        const newInstance = await startKeyResultInstanceMutation.mutateAsync({
          userId: user.id,
          userObjectiveInstanceId,
          keyResultId: keyResult.id,
        })
        
        // Validate that we got a valid instance ID
        if (!newInstance?.id) {
          console.error('Failed to get userKeyResultInstance ID:', newInstance)
          alert(language === 'nl' ? 'Kon key result instance niet starten. Probeer opnieuw.' : 'Failed to start key result instance. Please try again.')
          setConfirmDialogOpen(false)
          return
        }
        
        instanceId = newInstance.id
      }

      // 2. Add to Kanban with the instance ID
      addKanbanItem.mutate({
        userId: user.id,
        itemType: 'KEY_RESULT',
        itemId: instanceId, // Use instance ID!
      }, {
        onSuccess: () => {
          setConfirmDialogOpen(false)
        },
        onError: (error: any) => {
          console.error('Failed to add kanban item:', error)
          const errorMessage = error?.response?.data?.error || error?.message || (language === 'nl' ? 'Kon key result niet toevoegen aan kanban board' : 'Failed to add key result to kanban board')
          alert(errorMessage)
          setConfirmDialogOpen(false)
        }
      })
    } catch (error: any) {
      console.error('Failed to start key result instance:', error)
      const errorMessage = error?.response?.data?.error || error?.message || (language === 'nl' ? 'Kon key result instance niet starten. Zorg dat de backend draait.' : 'Failed to start key result instance. Please ensure the backend is running.')
      alert(errorMessage)
      setConfirmDialogOpen(false)
    }
  }

  const handleCancelAddToKanban = () => {
    setConfirmDialogOpen(false)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    deleteKeyResultMutation.mutate(keyResult.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false)
        queryClient.invalidateQueries({ queryKey: ['goals-okr', 'keyResults', 'objective', keyResult.objectiveId] })
      },
      onError: (err: unknown) => {
        const msg = (err as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error ?? (err as Error).message
        alert(msg ?? 'Could not delete key result')
      },
    })
  }

  // Get progress for this key result - only if we have a UserKeyResultInstance
  const shouldFetch = !!userId && !!userKeyResultInstance?.id
  
  const { data: progress } = useQuery({
    queryKey: ['goals-okr', 'keyResultProgress', keyResult.id, userKeyResultInstance?.id, userId],
    queryFn: () => {
      if (!userId || !userKeyResultInstance?.id) {
        return Promise.resolve(null)
      }
      return getKeyResultProgress(userId, keyResult.id, userKeyResultInstance.id)
    },
    enabled: shouldFetch,
    // Don't retry if the query is disabled or if we get a 404 (no progress exists yet)
    retry: (failureCount, error: any) => {
      if (!shouldFetch) return false
      if (error?.response?.status === 404) return false
      return failureCount < 2
    },
  })
  
  const currentValue = progress?.currentValue || 0
  const targetValue = keyResult.targetValue
  const progressPercentage = targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 0
  const isCompleted = progressPercentage >= 100

  const getKeyResultTitle = (): string => {
    if (language === 'nl' && keyResult.titleNl) {
      return keyResult.titleNl
    }
    return keyResult.titleEn || keyResult.titleNl || `Key Result ${keyResult.id}`
  }

  const getKeyResultDescription = (): string => {
    if (language === 'nl' && keyResult.descriptionNl) {
      return keyResult.descriptionNl || ''
    }
    return keyResult.descriptionEn || keyResult.descriptionNl || ''
  }

  const handleCardClick = async () => {
    // When not started: navigate to key result template page (browse mode)
    if (!isStarted) {
      router.push(`/goals-okr/key-results/${keyResult.id}`)
      return
    }

    if (!user?.id || !userObjectiveInstanceId) {
      return
    }

    // If userKeyResultInstance doesn't exist yet, create it first
    let instanceId = userKeyResultInstance?.id
    if (!instanceId) {
      try {
        const newInstance = await startKeyResultInstanceMutation.mutateAsync({
          userId: user.id,
          userObjectiveInstanceId,
          keyResultId: keyResult.id,
        })
        
        if (!newInstance?.id) {
          console.error('Failed to get userKeyResultInstance ID:', newInstance)
          alert('Failed to start key result instance. Please try again.')
          return
        }
        
        instanceId = newInstance.id
      } catch (error: any) {
        console.error('Failed to start key result instance:', error)
        const errorMessage = error?.response?.data?.error || error?.message || 'Failed to start key result instance. Please ensure the backend is running.'
        alert(errorMessage)
        return
      }
    }

    // Navigate to initiatives page
    if (instanceId) {
      router.push(`/goals-okr/user-key-result-instances/${instanceId}`)
    }
  }

  return (
    <>
      <Card 
        className="hover:shadow-lg transition-shadow cursor-pointer"
        onClick={handleCardClick}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {keyResult.number && (
                <span className="text-xs font-mono text-muted-foreground mb-1 block">
                  {keyResult.number}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                {getKeyResultTitle()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {user?.id && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToKanban(e)
                    }}
                    className="h-6 w-6 p-0"
                    title="Add to Progress"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteClick}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    title={language === 'nl' ? 'Key result verwijderen' : 'Remove key result'}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
              {isCompleted && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getKeyResultDescription() && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {getKeyResultDescription()}
            </p>
          )}
          
          {/* Progress */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {currentValue.toFixed(1)} / {targetValue} {keyResult.unit}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-xs text-muted-foreground text-right">
              {progressPercentage.toFixed(0)}%
            </div>
          </div>

          {isStarted && userKeyResultInstance?.id && (
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/goals-okr/user-key-result-instances/${userKeyResultInstance.id}`)
              }}
              className="w-full"
            >
              {language === 'nl' ? 'Bekijk Initiatives' : 'View Initiatives'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Add to Progress Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'nl' ? 'Voeg Key Result toe aan Progress' : 'Add Key Result to Progress'}
            </DialogTitle>
            <DialogDescription>
              {language === 'nl'
                ? 'Dit zal dit key result starten en toevoegen aan je progress board.'
                : 'This will start working on this key result and add it to your progress board.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelAddToKanban}
              disabled={addKanbanItem.isPending || startKeyResultInstanceMutation.isPending}
            >
              {language === 'nl' ? 'Annuleren' : 'Cancel'}
            </Button>
            <Button
              onClick={handleConfirmAddToKanban}
              disabled={addKanbanItem.isPending || startKeyResultInstanceMutation.isPending}
            >
              {(addKanbanItem.isPending || startKeyResultInstanceMutation.isPending)
                ? (language === 'nl' ? 'Bezig...' : 'Starting...')
                : (language === 'nl' ? 'Voeg toe aan Progress' : 'Add to Progress')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Key Result Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'nl' ? 'Key result verwijderen?' : 'Remove key result?'}
            </DialogTitle>
            <DialogDescription>
              {language === 'nl'
                ? `Weet je zeker dat je "${getKeyResultTitle()}" wilt verwijderen? Dit kan alleen als nog niemand dit key result op het progress board heeft.`
                : `Are you sure you want to remove "${getKeyResultTitle()}"? This is only possible if no one has added it to their progress board.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleteKeyResultMutation.isPending}>
              {language === 'nl' ? 'Annuleren' : 'Cancel'}
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleteKeyResultMutation.isPending}>
              {deleteKeyResultMutation.isPending ? (language === 'nl' ? 'Verwijderen...' : 'Removing...') : (language === 'nl' ? 'Verwijderen' : 'Remove')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface KeyResultListProps {
  readonly objectiveId: number
  readonly language?: 'nl' | 'en'
}

export function KeyResultList({ objectiveId, language = 'en' }: KeyResultListProps) {
  const router = useRouter()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { data: keyResults, isLoading } = useKeyResultsByObjective(objectiveId)

  // Get objective (for display)
  const { data: objective } = useQuery({
    queryKey: ['goals-okr', 'objective', objectiveId],
    queryFn: () => getObjective(objectiveId),
    enabled: !!objectiveId,
  })

  // User objective instances – goal layer removed; start objective only via Kanban
  const { data: userObjectiveInstances } = useQuery({
    queryKey: ['goals-okr', 'userObjectiveInstances', 'user', user?.id],
    queryFn: () => getUserObjectiveInstances(user?.id || 0),
    enabled: !!user?.id,
  })

  const handleStartObjective = (_objectiveId: number) => {
    // Goal layer removed – start objectives via Kanban board (personal objective or add from board)
    router.push('/goals-okr/kanban')
  }

  const isObjectiveStarted = (objectiveId: number): boolean => {
    return userObjectiveInstances?.some(instance => instance.objectiveId === objectiveId) || false
  }

  const getStartedInstanceId = (objectiveId: number): number | null => {
    const instance = userObjectiveInstances?.find(instance => instance.objectiveId === objectiveId)
    return instance?.id || null
  }


  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    )
  }

  if (!keyResults || keyResults.length === 0) {
    return (
      <div className="w-full text-center text-muted-foreground py-12">
        <p>No key results found</p>
        <p className="text-sm mt-2">Key results will appear here once templates are created</p>
      </div>
    )
  }

  const instanceId = getStartedInstanceId(objectiveId)
  const isStarted = isObjectiveStarted(objectiveId)

  return (
    <div className="w-full space-y-6">
      {/* Start Objective Button */}
      {!isStarted && (
        <div className="flex justify-center">
          <Button
            onClick={() => handleStartObjective(objectiveId)}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <PlayCircle className="h-4 w-4" />
            Add via Kanban board
          </Button>
        </div>
      )}

      {/* Key Results List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {keyResults.map((keyResult) => (
          <KeyResultCard
            key={keyResult.id}
            keyResult={keyResult}
            userObjectiveInstanceId={instanceId}
            userId={user?.id || null}
            language={language}
            isStarted={isStarted}
          />
        ))}
      </div>
    </div>
  )
}
