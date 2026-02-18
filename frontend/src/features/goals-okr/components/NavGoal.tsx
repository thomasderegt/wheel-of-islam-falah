'use client'

/**
 * NavGoal Component
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
import { useOKRCart } from '../contexts/OKRCartContext'
import { Button } from '@/shared/components/ui/button'
import { Plus, ShoppingCart } from 'lucide-react'
import type { GoalDTO } from '../api/goalsOkrApi'

interface NavGoalProps {
  readonly lifeDomainId: number
  readonly language?: 'nl' | 'en'
}

export function NavGoal({ lifeDomainId, language = 'en' }: NavGoalProps) {
  const router = useRouter()
  const { data: goals, isLoading } = useGoalsByLifeDomain(lifeDomainId)
  const { userGroup } = useTheme()
  const { user } = useAuth()
  const { addItem, hasItem } = useOKRCart()
  const isWireframeTheme = !userGroup || userGroup === 'universal'

  // Helper function to get goal title based on language
  const getGoalTitle = (goal: GoalDTO): string => {
    if (language === 'nl' && goal.titleNl) {
      return goal.titleNl
    }
    return goal.titleEn || goal.titleNl || `Goal ${goal.id}`
  }

  // Goal layer removed: navigate to life domain (objectives are shown there)
  const handleGoalClick = (_goalId: number) => {
    router.push(`/goals-okr/life-domains/${lifeDomainId}`)
  }

  const handleAddToCart = (e: React.MouseEvent, goal: GoalDTO) => {
    e.stopPropagation()
    if (!user?.id) return
    
    addItem({
      type: 'GOAL',
      id: goal.id,
      title: getGoalTitle(goal),
      description: (language === 'nl' ? goal.descriptionNl : goal.descriptionEn) ?? undefined,
      parentId: lifeDomainId,
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
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Template Goals */}
          {goals.map((goal) => {
            const inCart = hasItem('GOAL', goal.id)
            return (
              <div
                key={goal.id}
                onClick={() => handleGoalClick(goal.id)}
                className={`
                  p-6 rounded-lg border-2 cursor-pointer transition-all bg-card relative
                  ${isWireframeTheme 
                    ? 'border-border hover:border-foreground hover:bg-accent' 
                    : 'border-primary/20 hover:border-primary hover:bg-primary/10'}
                  ${inCart ? 'ring-2 ring-primary' : ''}
                `}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    {goal.number && (
                      <span className="text-xs font-mono text-muted-foreground mb-1 block">
                        {goal.number}
                      </span>
                    )}
                    <h3 className="text-xl font-bold">
                      {getGoalTitle(goal)}
                    </h3>
                  </div>
                  {user?.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleAddToCart(e, goal)}
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
                {(language === 'nl' ? goal.descriptionNl : goal.descriptionEn) && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {language === 'nl' ? goal.descriptionNl : goal.descriptionEn}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
  )
}
