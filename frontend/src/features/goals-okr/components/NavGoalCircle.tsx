'use client'

/**
 * NavGoalCircle Component
 * 
 * Grid navigation voor goals binnen een life domain
 * - Goals in een grid layout
 * - Click handlers voor navigatie naar objectives
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGoalsByLifeDomain } from '../hooks/useGoalsByLifeDomain'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { Loading } from '@/shared/components/ui/Loading'
import { useAuth } from '@/features/auth'
import { useAddKanbanItem } from '../hooks/useKanbanItems'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { CreateUserGoalDialog } from './CreateUserGoalDialog'
import { Plus } from 'lucide-react'
import type { GoalDTO } from '../api/goalsOkrApi'

interface NavGoalCircleProps {
  readonly lifeDomainId: number
  readonly language?: 'nl' | 'en'
}

export function NavGoalCircle({ lifeDomainId, language = 'en' }: NavGoalCircleProps) {
  const router = useRouter()
  const { data: goals, isLoading } = useGoalsByLifeDomain(lifeDomainId)
  const { userGroup } = useTheme()
  const { user } = useAuth()
  const addKanbanItem = useAddKanbanItem()
  const isWireframeTheme = !userGroup || userGroup === 'universal'
  
  // Modal state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<GoalDTO | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Helper function to get goal title based on language
  const getGoalTitle = (goal: GoalDTO): string => {
    if (language === 'nl' && goal.titleNl) {
      return goal.titleNl
    }
    return goal.titleEn || goal.titleNl || `Goal ${goal.id}`
  }

  const handleGoalClick = (goalId: number) => {
    router.push(`/goals-okr/goals/${goalId}`)
  }

  const handleAddToKanbanClick = (e: React.MouseEvent, goal: GoalDTO) => {
    e.stopPropagation()
    if (!user?.id) return
    setSelectedGoal(goal)
    setConfirmDialogOpen(true)
  }

  const handleConfirmAddToKanban = () => {
    if (!user?.id || !selectedGoal) return
    
    addKanbanItem.mutate({
      userId: user.id,
      itemType: 'GOAL',
      itemId: selectedGoal.id,
    }, {
      onSuccess: () => {
        setConfirmDialogOpen(false)
        setSelectedGoal(null)
      }
    })
  }

  const handleCancelAddToKanban = () => {
    setConfirmDialogOpen(false)
    setSelectedGoal(null)
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

  if (!goals || goals.length === 0) {
    return (
      <div className="w-full">
        <div className="relative w-full aspect-square flex items-center justify-center">
          <div className="text-muted-foreground text-center">
            <p>No goals found</p>
            <p className="text-sm mt-2">Goals will appear here once templates are created</p>
          </div>
        </div>
      </div>
    )
  }

  // Simple grid layout for goals
  return (
    <>
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Create Personal Goal Card - First in grid */}
          {user?.id && (
            <div
              onClick={() => setCreateDialogOpen(true)}
              className={`
                p-6 rounded-lg border-2 border-dashed cursor-pointer transition-all bg-card relative
                ${isWireframeTheme 
                  ? 'border-border hover:border-foreground hover:bg-accent' 
                  : 'border-primary/40 hover:border-primary hover:bg-primary/10'}
              `}
            >
              <div className="flex flex-col items-center justify-center text-center space-y-2 min-h-[120px]">
                <div className={`
                  p-3 rounded-full
                  ${isWireframeTheme 
                    ? 'bg-muted' 
                    : 'bg-primary/20'}
                `}>
                  <Plus className={`
                    h-6 w-6
                    ${isWireframeTheme 
                      ? 'text-foreground' 
                      : 'text-primary'}
                  `} />
                </div>
                <h3 className="text-xl font-bold">
                  Create Personal Goal
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Add your own goal for this life domain
                </p>
              </div>
            </div>
          )}

          {/* Template Goals */}
          {goals.map((goal) => (
            <div
              key={goal.id}
              onClick={() => handleGoalClick(goal.id)}
              className={`
                p-6 rounded-lg border-2 cursor-pointer transition-all bg-card relative
                ${isWireframeTheme 
                  ? 'border-border hover:border-foreground hover:bg-accent' 
                  : 'border-primary/20 hover:border-primary hover:bg-primary/10'}
              `}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-xl font-bold flex-1">
                  {getGoalTitle(goal)}
                </h3>
                {user?.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleAddToKanbanClick(e, goal)}
                    className="h-6 w-6 p-0 flex-shrink-0"
                    title="Add to Progress"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {(language === 'nl' ? goal.descriptionNl : goal.descriptionEn) && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {language === 'nl' ? goal.descriptionNl : goal.descriptionEn}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Goal to Progress</DialogTitle>
            <DialogDescription>
              Are you sure you want to add this goal to your progress board?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelAddToKanban}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAddToKanban}
              disabled={addKanbanItem.isPending}
            >
              {addKanbanItem.isPending ? 'Adding...' : 'Add to Progress'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Personal Goal Dialog */}
      <CreateUserGoalDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        lifeDomainId={lifeDomainId}
      />
    </>
  )
}
