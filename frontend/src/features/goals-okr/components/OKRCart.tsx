'use client'

/**
 * OKR Cart Component
 * 
 * Shopping cart sidebar for collecting OKR items
 */

import { useState } from 'react'
import { useOKRCart } from '../contexts/OKRCartContext'
import { useAuth } from '@/features/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetFooter } from '@/shared/components/ui/sheet'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Loading } from '@/shared/components/ui/Loading'
import { AlertCircle, ShoppingCart, X, CheckCircle2 } from 'lucide-react'
import {
  createObjective,
  getObjectivesByLifeDomain,
  createKeyResult,
  getKeyResultsByObjective,
  startUserObjectiveInstance,
  startUserKeyResultInstance,
  addKanbanItem,
} from '../api/goalsOkrApi'
import { useRouter } from 'next/navigation'

interface OKRCartProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OKRCart({ open, onOpenChange }: OKRCartProps) {
  const { user } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { items, removeItem, clearCart, getValidationErrors } = useOKRCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const validationErrors = getValidationErrors()

  // Group items by type for better display (goal layer removed – cart uses objective + key result)
  const goals = items.filter((i) => i.type === 'GOAL')
  const objectives = items.filter((i) => i.type === 'OBJECTIVE')
  const keyResults = items.filter((i) => i.type === 'KEY_RESULT')

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not found')

      // Hierarchy: Objective (+ optional Key Result). lifeDomainId from first objective's parentId.
      const objective = objectives[0]
      if (!objective) throw new Error('Add at least one Objective')

      const lifeDomainId = objective.parentId
      if (!lifeDomainId) {
        throw new Error('Objective must have a life domain (add from a life domain view)')
      }

      const keyResult = keyResults.find((kr) => kr.parentId === objective.id) || keyResults[0]
      if (!keyResult) throw new Error('Add at least one Key Result')

      // Step 1: Create templates if needed
      let finalObjectiveId: number
      if (objective.isNew && objective.data) {
        // Create new objective template (under life domain)
        const existingObjectives = await getObjectivesByLifeDomain(lifeDomainId)
        const newObjective = await createObjective({
          lifeDomainId,
          titleEn: objective.data.title || objective.title,
          descriptionEn: objective.data.description || objective.description,
          orderIndex: existingObjectives.length + 1,
        })
        finalObjectiveId = newObjective.id
      } else if (objective.id) {
        finalObjectiveId = objective.id
      } else {
        throw new Error('Objective ID is required')
      }

      let finalKeyResultId: number
      if (keyResult.isNew && keyResult.data) {
        // Create new key result template
        const existingKeyResults = await getKeyResultsByObjective(finalObjectiveId)
        const newKeyResult = await createKeyResult({
          objectiveId: finalObjectiveId,
          titleEn: keyResult.data.title || keyResult.title,
          descriptionEn: keyResult.data.description || keyResult.description,
          targetValue: keyResult.data.targetValue || 0,
          unit: keyResult.data.unit || '',
          orderIndex: existingKeyResults.length + 1,
        })
        finalKeyResultId = newKeyResult.id
      } else if (keyResult.id) {
        finalKeyResultId = keyResult.id
      } else {
        throw new Error('Key Result ID is required')
      }

      // Step 2: Start instances (goal layer removed – start objective and key result only)
      const userObjectiveInstance = await startUserObjectiveInstance(
        user.id,
        finalObjectiveId
      )
      const userKeyResultInstance = await startUserKeyResultInstance(
        user.id,
        userObjectiveInstance.id,
        finalKeyResultId
      )

      // Step 3: Add to kanban (no GOAL item – goal layer removed)
      await addKanbanItem({
        userId: user.id,
        itemType: 'OBJECTIVE',
        itemId: userObjectiveInstance.id,
      })
      await addKanbanItem({
        userId: user.id,
        itemType: 'KEY_RESULT',
        itemId: userKeyResultInstance.id,
      })

      return {
        userObjectiveInstanceId: userObjectiveInstance.id,
        userKeyResultInstanceId: userKeyResultInstance.id,
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr'] })
      clearCart()
      onOpenChange(false)
      alert('Your Goal set is added to focus mode for tracking')
      router.push('/goals-okr/kanban')
    },
    onError: (error: any) => {
      console.error('Checkout failed:', error)
      alert(error?.message || 'Failed to add items to kanban. Please try again.')
    },
    onSettled: () => {
      setIsCheckingOut(false)
    },
  })

  const handleCheckout = () => {
    if (validationErrors.length > 0) {
      return
    }
    setIsCheckingOut(true)
    checkoutMutation.mutate()
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'GOAL':
        return 'Goal'
      case 'OBJECTIVE':
        return 'Objective'
      case 'KEY_RESULT':
        return 'Key Result'
      default:
        return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'GOAL':
        return 'bg-blue-500'
      case 'OBJECTIVE':
        return 'bg-green-500'
      case 'KEY_RESULT':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <SheetTitle>Cart</SheetTitle>
          </div>
        </SheetHeader>

        <SheetBody>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <ShoppingCart className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <Card className="border-destructive">
                  <CardContent className="p-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-destructive text-xs mb-1">Errors</p>
                        <ul className="list-disc list-inside space-y-0.5 text-xs">
                          {validationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Goals */}
              {goals.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Goals ({goals.length})</h3>
                  {goals.map((item) => (
                    <Card key={`${item.type}-${item.id}`}>
                      <CardContent className="p-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <Badge className={`${getTypeColor(item.type)} text-[10px] px-1.5 py-0`} variant="default">{getTypeLabel(item.type)}</Badge>
                              {item.isNew && <Badge variant="outline" className="text-[10px] px-1.5 py-0">New</Badge>}
                            </div>
                            <p className="font-medium text-sm truncate">{item.title}</p>
                            {item.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.type, item.id)}
                            className="h-5 w-5 p-0 flex-shrink-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Objectives */}
              {objectives.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Objectives ({objectives.length})</h3>
                  {objectives.map((item) => (
                    <Card key={`${item.type}-${item.id}`}>
                      <CardContent className="p-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <Badge className={`${getTypeColor(item.type)} text-[10px] px-1.5 py-0`} variant="default">{getTypeLabel(item.type)}</Badge>
                              {item.isNew && <Badge variant="outline" className="text-[10px] px-1.5 py-0">New</Badge>}
                            </div>
                            <p className="font-medium text-sm truncate">{item.title}</p>
                            {item.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.type, item.id)}
                            className="h-5 w-5 p-0 flex-shrink-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Key Results */}
              {keyResults.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Key Results ({keyResults.length})</h3>
                  {keyResults.map((item) => (
                    <Card key={`${item.type}-${item.id}`}>
                      <CardContent className="p-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <Badge className={`${getTypeColor(item.type)} text-[10px] px-1.5 py-0`} variant="default">{getTypeLabel(item.type)}</Badge>
                              {item.isNew && <Badge variant="outline" className="text-[10px] px-1.5 py-0">New</Badge>}
                            </div>
                            <p className="font-medium text-sm truncate">{item.title}</p>
                            {item.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>
                            )}
                            {item.data?.targetValue && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {item.data.targetValue} {item.data.unit}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.type, item.id)}
                            className="h-5 w-5 p-0 flex-shrink-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

            </div>
          )}
        </SheetBody>

        {items.length > 0 && (
          <SheetFooter className="flex-col gap-1.5">
            <div className="flex items-center justify-between w-full text-xs">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">{items.length}</span>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={validationErrors.length > 0 || isCheckingOut || checkoutMutation.isPending}
              className="w-full gap-2"
              size="sm"
            >
              {isCheckingOut || checkoutMutation.isPending ? (
                <>
                  <Loading />
                  <span className="text-sm">Finishing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm">Finish</span>
                </>
              )}
            </Button>
            {validationErrors.length > 0 && (
              <p className="text-[10px] text-destructive text-center">
                Fix errors first
              </p>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
