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
import { startUserObjectiveInstance, getUserObjectiveInstances, getKeyResultProgress, getObjective, getUserGoalInstances, startUserKeyResultInstance, getUserKeyResultInstances } from '../api/goalsOkrApi'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useAddKanbanItem } from '../hooks/useKanbanItems'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Progress } from '@/shared/components/ui/progress'
import { Loading } from '@/shared/components/ui/Loading'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { CheckCircle2, PlayCircle, Target, Plus } from 'lucide-react'
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
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

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
    if (!isStarted || !user?.id || !userObjectiveInstanceId) {
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
        className={`hover:shadow-lg transition-shadow ${isStarted ? 'cursor-pointer' : ''}`}
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

      {/* Confirmation Dialog */}
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
  const [startingObjectiveId, setStartingObjectiveId] = useState<number | null>(null)

  // Get objective to find goalId
  const { data: objective } = useQuery({
    queryKey: ['goals-okr', 'objective', objectiveId],
    queryFn: () => getObjective(objectiveId),
    enabled: !!objectiveId,
  })

  // Get user goal instances
  const { data: userGoalInstances } = useQuery({
    queryKey: ['goals-okr', 'userGoalInstances', 'user', user?.id],
    queryFn: () => getUserGoalInstances(user?.id || 0),
    enabled: !!user?.id,
  })

  // Get user objective instances to check which objectives are already started
  const { data: userObjectiveInstances } = useQuery({
    queryKey: ['goals-okr', 'userObjectiveInstances', 'user', user?.id],
    queryFn: () => getUserObjectiveInstances(user?.id || 0),
    enabled: !!user?.id,
  })

  // Find UserGoalInstance for this objective's goal
  const userGoalInstance = objective && userGoalInstances?.find(ugi => ugi.goalId === objective.goalId)

  const startInstanceMutation = useMutation({
    mutationFn: ({ userId, userGoalInstanceId, objectiveId }: { userId: number; userGoalInstanceId: number; objectiveId: number }) =>
      startUserObjectiveInstance(userId, userGoalInstanceId, objectiveId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'userObjectiveInstances'] })
      // Navigate to the user objective instance
      router.push(`/goals-okr/user-objective-instances/${data.id}`)
    },
    onError: (error) => {
      console.error('Failed to start objective instance:', error)
      setStartingObjectiveId(null)
    },
  })

  const handleStartObjective = (objectiveId: number) => {
    if (!user?.id || !userGoalInstance) {
      alert('Please start the goal first by clicking the + button on the goal')
      return
    }
    setStartingObjectiveId(objectiveId)
    startInstanceMutation.mutate({ 
      userId: user.id, 
      userGoalInstanceId: userGoalInstance.id,
      objectiveId 
    })
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
  const isStarting = startingObjectiveId === objectiveId

  return (
    <div className="w-full space-y-6">
      {/* Start Objective Button */}
      {!isStarted && (
        <div className="flex justify-center">
          <Button
            onClick={() => handleStartObjective(objectiveId)}
            disabled={isStarting || !user?.id}
            size="lg"
            className="gap-2"
          >
            {isStarting ? (
              <>
                <Loading className="h-4 w-4" />
                Starting Objective...
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4" />
                Start Working on This Objective
              </>
            )}
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
