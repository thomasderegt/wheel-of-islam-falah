'use client'

/**
 * NavObjectiveCircle Component
 * 
 * Grid navigation voor objectives binnen een life domain
 * - Objectives in een grid layout
 * - Click handlers voor navigatie
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useObjectivesByGoal } from '../hooks/useObjectivesByGoal'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { Loading } from '@/shared/components/ui/Loading'
import { useAuth } from '@/features/auth'
import { useAddKanbanItem } from '../hooks/useKanbanItems'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { Plus } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { startUserObjectiveInstance, getUserGoalInstances } from '../api/goalsOkrApi'
import type { ObjectiveDTO } from '../api/goalsOkrApi'

interface NavObjectiveCircleProps {
  readonly goalId: number
  readonly language?: 'nl' | 'en'
}

export function NavObjectiveCircle({ goalId, language = 'en' }: NavObjectiveCircleProps) {
  const router = useRouter()
  const { data: objectives, isLoading } = useObjectivesByGoal(goalId)
  const { userGroup } = useTheme()
  const { user } = useAuth()
  const addKanbanItem = useAddKanbanItem()
  const isWireframeTheme = !userGroup || userGroup === 'universal'
  const queryClient = useQueryClient()
  
  // State for confirmation dialog
  const [selectedObjective, setSelectedObjective] = useState<ObjectiveDTO | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  // Get user goal instances to find the one for this goal
  const { data: userGoalInstances, refetch: refetchUserGoalInstances } = useQuery({
    queryKey: ['goals-okr', 'userGoalInstances', 'user', user?.id],
    queryFn: () => getUserGoalInstances(user?.id || 0),
    enabled: !!user?.id,
  })

  // Refetch userGoalInstances when goalId changes (e.g., after navigation from goal page)
  useEffect(() => {
    if (user?.id && goalId) {
      refetchUserGoalInstances()
    }
  }, [goalId, user?.id, refetchUserGoalInstances])

  // Find UserGoalInstance for this goal
  const userGoalInstance = userGoalInstances?.find(ugi => ugi.goalId === goalId)

  const startObjectiveInstanceMutation = useMutation({
    mutationFn: ({ userId, userGoalInstanceId, objectiveId }: { userId: number; userGoalInstanceId: number; objectiveId: number }) =>
      startUserObjectiveInstance(userId, userGoalInstanceId, objectiveId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'userObjectiveInstances'] })
    },
  })

  // Helper function to get objective title based on language
  const getObjectiveTitle = (objective: ObjectiveDTO): string => {
    if (language === 'nl' && objective.titleNl) {
      return objective.titleNl
    }
    return objective.titleEn || objective.titleNl || `Objective ${objective.id}`
  }

  const handleObjectiveClick = (objectiveId: number) => {
    router.push(`/goals-okr/objectives/${objectiveId}/key-results`)
  }

  const handleAddToKanban = (e: React.MouseEvent, objective: ObjectiveDTO) => {
    e.stopPropagation()
    if (!user?.id) return
    
    // Check if UserGoalInstance exists for this goal
    if (!userGoalInstance) {
      // Show error: user must start goal first
      alert('Please start the goal first by clicking the + button on the goal')
      return
    }
    
    setSelectedObjective(objective)
    setConfirmDialogOpen(true)
  }

  const handleConfirmAddToKanban = async () => {
    if (!user?.id || !selectedObjective || !userGoalInstance) return
    
    try {
      // 1. Start UserObjectiveInstance first
      const userObjectiveInstance = await startObjectiveInstanceMutation.mutateAsync({
        userId: user.id,
        userGoalInstanceId: userGoalInstance.id,
        objectiveId: selectedObjective.id,
      })
      
      // 2. Add to Kanban with the instance ID
      addKanbanItem.mutate({
        userId: user.id,
        itemType: 'OBJECTIVE',
        itemId: userObjectiveInstance.id, // Use instance ID!
      }, {
        onSuccess: () => {
          setConfirmDialogOpen(false)
          setSelectedObjective(null)
          // 3. Navigate to key results page so user can see key results
          router.push(`/goals-okr/objectives/${selectedObjective.id}/key-results`)
        }
      })
    } catch (error) {
      console.error('Failed to start objective instance:', error)
      setConfirmDialogOpen(false)
      setSelectedObjective(null)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="relative w-full aspect-square flex items-center justify-center">
          <Loading />
        </div>
      </div>
    )
  }

  if (!objectives || objectives.length === 0) {
    return (
      <div className="w-full">
        <div className="relative w-full aspect-square flex items-center justify-center">
          <div className="text-muted-foreground text-center">
            <p>No objectives found</p>
            <p className="text-sm mt-2">Objectives will appear here once templates are created</p>
          </div>
        </div>
      </div>
    )
  }

  // Simple grid layout for objectives (similar to goal areas)
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {objectives.map((objective) => (
          <div
            key={objective.id}
            onClick={() => handleObjectiveClick(objective.id)}
            className={`
              p-6 rounded-lg border-2 cursor-pointer transition-all relative
              ${isWireframeTheme 
                ? 'border-border hover:border-foreground hover:bg-accent' 
                : 'border-primary/20 hover:border-primary hover:bg-primary/5'}
            `}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-xl font-bold flex-1">
                {getObjectiveTitle(objective)}
              </h3>
              {user?.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleAddToKanban(e, objective)}
                  className="h-6 w-6 p-0 flex-shrink-0"
                  title="Add to Progress"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            {(language === 'nl' ? objective.descriptionNl : objective.descriptionEn) && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {language === 'nl' ? objective.descriptionNl : objective.descriptionEn}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Objective to Progress</DialogTitle>
            <DialogDescription>
              This will start working on this objective and add it to your progress board.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setConfirmDialogOpen(false)
                setSelectedObjective(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAddToKanban}
              disabled={addKanbanItem.isPending || startObjectiveInstanceMutation.isPending}
            >
              {(addKanbanItem.isPending || startObjectiveInstanceMutation.isPending) ? 'Starting...' : 'Add to Progress'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
