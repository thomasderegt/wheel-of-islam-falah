'use client'

/**
 * NavKeyResult Component
 * 
 * Lijst van key results binnen een objective
 * Met "Start Objective" functionaliteit en progress tracking
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useKeyResultsByObjective } from '../hooks/useKeyResultsByObjective'
import { startUserObjectiveEnrollment, getUserObjectiveEnrollments, getKeyResultProgress, getObjective, getUserGoalEnrollments, startUserKeyResultEnrollment, getUserKeyResultEnrollments } from '../api/goalsOkrApi'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Progress } from '@/shared/components/ui/progress'
import { Loading } from '@/shared/components/ui/Loading'
import { CheckCircle2, PlayCircle, Target, Plus, ShoppingCart } from 'lucide-react'
import { useOKRCart } from '../contexts/OKRCartContext'
import type { KeyResultDTO } from '../api/goalsOkrApi'

/**
 * KeyResultCard Component
 * Separate component to handle the useQuery hook for progress
 */
interface KeyResultCardProps {
  keyResult: KeyResultDTO
  userObjectiveEnrollmentId: number | null
  userId: number | null
  language: 'nl' | 'en'
  isStarted: boolean
  objectiveId: number // Template objectiveId for cart validation
}

function KeyResultCard({ keyResult, userObjectiveEnrollmentId, userId, language, isStarted, objectiveId }: KeyResultCardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { addItem, hasItem } = useOKRCart()

  // Get user key result enrollments to find the one for this key result
  // Only fetch if we have a user and a userObjectiveEnrollmentId (meaning the objective is started)
  const { data: userKeyResultEnrollments } = useQuery({
    queryKey: ['goals-okr', 'userKeyResultEnrollments', 'user', user?.id],
    queryFn: () => getUserKeyResultEnrollments(user?.id || 0),
    enabled: !!user?.id && !!userObjectiveEnrollmentId, // Only fetch if objective is started
    retry: false, // Don't retry if backend is not available
    refetchOnWindowFocus: false, // Don't refetch on window focus
  })

  // Find UserKeyResultEnrollment for this key result and objective enrollment
  const userKeyResultEnrollment = userKeyResultEnrollments?.find(
    ukre => ukre.keyResultId === keyResult.id && 
            ukre.userObjectiveInstanceId === userObjectiveEnrollmentId
  )

  const startKeyResultEnrollmentMutation = useMutation({
    mutationFn: ({ userId, userObjectiveEnrollmentId, keyResultId }: { userId: number; userObjectiveEnrollmentId: number; keyResultId: number }) =>
      startUserKeyResultEnrollment(userId, userObjectiveEnrollmentId, keyResultId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'userKeyResultEnrollments'] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'keyResultProgress'] })
    },
  })

  // Get progress for this key result - only if we have a UserKeyResultEnrollment
  const shouldFetch = !!userId && !!userKeyResultEnrollment?.id
  
  const { data: progress } = useQuery({
    queryKey: ['goals-okr', 'keyResultProgress', keyResult.id, userKeyResultEnrollment?.id, userId],
    queryFn: () => {
      if (!userId || !userKeyResultEnrollment?.id) {
        return Promise.resolve(null)
      }
      return getKeyResultProgress(userId, keyResult.id, userKeyResultEnrollment.id)
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
    if (!isStarted || !user?.id || !userObjectiveEnrollmentId) {
      return
    }

    // If userKeyResultEnrollment doesn't exist yet, create it first
    let enrollmentId = userKeyResultEnrollment?.id
    if (!enrollmentId) {
      try {
        const newEnrollment = await startKeyResultEnrollmentMutation.mutateAsync({
          userId: user.id,
          userObjectiveEnrollmentId,
          keyResultId: keyResult.id,
        })
        
        if (!newEnrollment?.id) {
          console.error('Failed to get userKeyResultEnrollment ID:', newEnrollment)
          alert('Failed to start key result enrollment. Please try again.')
          return
        }
        
        enrollmentId = newEnrollment.id
      } catch (error: any) {
        console.error('Failed to start key result enrollment:', error)
        const errorMessage = error?.response?.data?.error || error?.message || 'Failed to start key result enrollment. Please ensure the backend is running.'
        alert(errorMessage)
        return
      }
    }

  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user?.id) return
    
    addItem({
      type: 'KEY_RESULT',
      id: keyResult.id,
      title: getKeyResultTitle(),
      description: getKeyResultDescription(),
      parentId: objectiveId, // Use template objectiveId, not userObjectiveEnrollmentId
    })
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
                  onClick={handleAddToCart}
                  className="h-6 w-6 p-0"
                  title={hasItem('KEY_RESULT', keyResult.id) ? 'Already in cart' : 'Add to Cart'}
                >
                  {hasItem('KEY_RESULT', keyResult.id) ? (
                    <ShoppingCart className="h-3 w-3 text-primary" />
                  ) : (
                    <Plus className="h-3 w-3" />
                  )}
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

        </CardContent>
      </Card>
    </>
  )
}

interface NavKeyResultProps {
  readonly objectiveId: number
  readonly language?: 'nl' | 'en'
}

export function NavKeyResult({ objectiveId, language = 'en' }: NavKeyResultProps) {
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

  // Get user goal enrollments
  const { data: userGoalEnrollments } = useQuery({
    queryKey: ['goals-okr', 'userGoalEnrollments', 'user', user?.id],
    queryFn: () => getUserGoalEnrollments(user?.id || 0),
    enabled: !!user?.id,
  })

  // Get user objective enrollments to check which objectives are already started
  const { data: userObjectiveEnrollments } = useQuery({
    queryKey: ['goals-okr', 'userObjectiveEnrollments', 'user', user?.id],
    queryFn: () => getUserObjectiveEnrollments(user?.id || 0),
    enabled: !!user?.id,
  })

  // Goal layer removed: no userGoalEnrollment needed to start an objective
  const userGoalEnrollment = undefined

  const startEnrollmentMutation = useMutation({
    mutationFn: ({ userId, userGoalEnrollmentId, objectiveId }: { userId: number; userGoalEnrollmentId: number; objectiveId: number }) =>
      startUserObjectiveEnrollment(userId, userGoalEnrollmentId, objectiveId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'userObjectiveEnrollments'] })
      // Navigate to the user objective enrollment
      router.push(`/goals-okr/user-objective-enrollments/${data.id}`)
    },
    onError: (error) => {
      console.error('Failed to start objective enrollment:', error)
      setStartingObjectiveId(null)
    },
  })

  const handleStartObjective = (objectiveId: number) => {
    if (!user?.id) {
      alert('Please log in to start an objective')
      return
    }
    setStartingObjectiveId(objectiveId)
    startEnrollmentMutation.mutate({ 
      userId: user.id, 
      userGoalEnrollmentId: 0, // ignored by API after goal layer removal
      objectiveId 
    })
  }

  const isObjectiveStarted = (objectiveId: number): boolean => {
    return userObjectiveEnrollments?.some(enrollment => enrollment.objectiveId === objectiveId) || false
  }

  const getStartedEnrollmentId = (objectiveId: number): number | null => {
    const enrollment = userObjectiveEnrollments?.find(enrollment => enrollment.objectiveId === objectiveId)
    return enrollment?.id || null
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

  const enrollmentId = getStartedEnrollmentId(objectiveId)
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
                <Loading />
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
            userObjectiveEnrollmentId={enrollmentId}
            userId={user?.id || null}
            language={language}
            isStarted={isStarted}
            objectiveId={objectiveId}
          />
        ))}
      </div>
    </div>
  )
}
