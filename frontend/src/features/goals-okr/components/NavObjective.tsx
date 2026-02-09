'use client'

/**
 * NavObjective Component
 * 
 * Grid navigation voor objectives binnen een goal
 * - Objectives in een grid layout
 * - Click handlers voor navigatie
 */

import { useRouter } from 'next/navigation'
import { useObjectivesByGoal } from '../hooks/useObjectivesByGoal'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { Loading } from '@/shared/components/ui/Loading'
import { useAuth } from '@/features/auth'
import { useOKRCart } from '../contexts/OKRCartContext'
import { Button } from '@/shared/components/ui/button'
import { Plus, ShoppingCart } from 'lucide-react'
import type { ObjectiveDTO } from '../api/goalsOkrApi'

interface NavObjectiveProps {
  readonly goalId: number
  readonly language?: 'nl' | 'en'
}

export function NavObjective({ goalId, language = 'en' }: NavObjectiveProps) {
  const router = useRouter()
  const { data: objectives, isLoading } = useObjectivesByGoal(goalId)
  const { userGroup } = useTheme()
  const { user } = useAuth()
  const { addItem, hasItem } = useOKRCart()
  const isWireframeTheme = !userGroup || userGroup === 'universal'

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

  const handleAddToCart = (e: React.MouseEvent, objective: ObjectiveDTO) => {
    e.stopPropagation()
    if (!user?.id) return
    
    addItem({
      type: 'OBJECTIVE',
      id: objective.id,
      title: getObjectiveTitle(objective),
      description: language === 'nl' ? objective.descriptionNl : objective.descriptionEn,
      parentId: goalId,
    })
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
        {objectives.map((objective) => {
          const inCart = hasItem('OBJECTIVE', objective.id)
          return (
            <div
              key={objective.id}
              onClick={() => handleObjectiveClick(objective.id)}
              className={`
                p-6 rounded-lg border-2 cursor-pointer transition-all relative
                ${isWireframeTheme 
                  ? 'border-border hover:border-foreground hover:bg-accent' 
                  : 'border-primary/20 hover:border-primary hover:bg-primary/5'}
                ${inCart ? 'ring-2 ring-primary' : ''}
              `}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  {objective.number && (
                    <span className="text-xs font-mono text-muted-foreground mb-1 block">
                      {objective.number}
                    </span>
                  )}
                  <h3 className="text-xl font-bold">
                    {getObjectiveTitle(objective)}
                  </h3>
                </div>
                {user?.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleAddToCart(e, objective)}
                    className="h-6 w-6 p-0 flex-shrink-0"
                    title={inCart ? 'Already in cart' : 'Add to Cart'}
                  >
                    {inCart ? (
                      <ShoppingCart className="h-4 w-4 text-primary" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              {(language === 'nl' ? objective.descriptionNl : objective.descriptionEn) && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {language === 'nl' ? objective.descriptionNl : objective.descriptionEn}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
