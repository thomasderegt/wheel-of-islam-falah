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
import { startUserObjectiveInstance, getUserObjectiveInstances, getKeyResultProgress } from '../api/goalsOkrApi'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useAddKanbanItem } from '../hooks/useKanbanItems'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Progress } from '@/shared/components/ui/progress'
import { Loading } from '@/shared/components/ui/Loading'
import { CheckCircle2, PlayCircle, Target, Plus } from 'lucide-react'
import type { KeyResultDTO } from '../api/goalsOkrApi'

/**
 * KeyResultCard Component
 * Separate component to handle the useQuery hook for progress
 */
interface KeyResultCardProps {
  keyResult: KeyResultDTO
  instanceId: number | null
  userId: number | null
  language: 'nl' | 'en'
  isStarted: boolean
  onViewInitiatives: () => void
}

function KeyResultCard({ keyResult, instanceId, userId, language, isStarted, onViewInitiatives }: KeyResultCardProps) {
  const { user } = useAuth()
  const addKanbanItem = useAddKanbanItem()

  const handleAddToKanban = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user?.id) return
    addKanbanItem.mutate({
      userId: user.id,
      itemType: 'KEY_RESULT',
      itemId: keyResult.id,
    })
  }
  // Get progress for this key result - hook is now at component level
  // Only fetch progress if we have a valid userId and instanceId (not null and not 0)
  const shouldFetch = !!userId && !!instanceId && instanceId > 0
  
  const { data: progress } = useQuery({
    queryKey: ['goals-okr', 'keyResultProgress', keyResult.id, instanceId, userId],
    queryFn: () => {
      if (!userId || !instanceId || instanceId <= 0) {
        return Promise.resolve(null)
      }
      return getKeyResultProgress(userId, keyResult.id, instanceId)
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

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            {getKeyResultTitle()}
          </span>
          <div className="flex items-center gap-2">
            {user?.id && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddToKanban}
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

        {isStarted && instanceId && (
          <Button
            variant="outline"
            onClick={onViewInitiatives}
            className="w-full"
          >
            View Initiatives
          </Button>
        )}
      </CardContent>
    </Card>
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

  // Get user objective instances to check which objectives are already started
  const { data: userObjectiveInstances } = useQuery({
    queryKey: ['goals-okr', 'userObjectiveInstances', 'user', user?.id],
    queryFn: () => getUserObjectiveInstances(user?.id || 0),
    enabled: !!user?.id,
  })

  const startInstanceMutation = useMutation({
    mutationFn: ({ userId, objectiveId }: { userId: number; objectiveId: number }) =>
      startUserObjectiveInstance(userId, objectiveId),
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
    if (!user?.id) return
    setStartingObjectiveId(objectiveId)
    startInstanceMutation.mutate({ userId: user.id, objectiveId })
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
            instanceId={instanceId}
            userId={user?.id || null}
            language={language}
            isStarted={isStarted}
            onViewInitiatives={() => {
              if (instanceId) {
                router.push(`/goals-okr/user-objective-instances/${instanceId}`)
              }
            }}
          />
        ))}
      </div>
    </div>
  )
}
