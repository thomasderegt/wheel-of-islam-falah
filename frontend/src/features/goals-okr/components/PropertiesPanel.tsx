'use client'

/**
 * Properties Panel Component
 * Displays the OKR hierarchy for a selected kanban item
 * Similar to Azure DevOps properties panel
 */

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Loading } from '@/shared/components/ui/Loading'
import { 
  getGoal, 
  getObjective, 
  getKeyResult, 
  getInitiative,
  getAllLifeDomains,
  type GoalDTO,
  type ObjectiveDTO,
  type KeyResultDTO,
  type InitiativeDTO,
  type LifeDomainDTO,
  type KanbanItemDTO
} from '../api/goalsOkrApi'
import { X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { useTheme } from '@/shared/contexts/ThemeContext'

interface PropertiesPanelProps {
  item: KanbanItemDTO | null
  language?: 'nl' | 'en'
  onClose: () => void
}

interface HierarchyData {
  lifeDomain?: LifeDomainDTO
  goal?: GoalDTO
  objective?: ObjectiveDTO
  keyResult?: KeyResultDTO
  initiative?: InitiativeDTO
}

export function PropertiesPanel({ item, language = 'en', onClose }: PropertiesPanelProps) {
  const [hierarchy, setHierarchy] = useState<HierarchyData>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { userGroup } = useTheme()
  const isWireframeTheme = !userGroup || userGroup === 'universal'

  useEffect(() => {
    if (!item) {
      setHierarchy({})
      return
    }

    const loadHierarchy = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const data: HierarchyData = {}
        
        // Load the selected item first
        try {
          switch (item.itemType) {
            case 'GOAL':
              data.goal = await getGoal(item.itemId)
              break
            case 'OBJECTIVE':
              data.objective = await getObjective(item.itemId)
              break
            case 'KEY_RESULT':
              data.keyResult = await getKeyResult(item.itemId)
              break
            case 'INITIATIVE':
              data.initiative = await getInitiative(item.itemId)
              break
            default:
              console.warn(`Unknown item type: ${item.itemType}`)
              setError(`Unknown item type: ${item.itemType}`)
              setIsLoading(false)
              return
          }
        } catch (err: any) {
          console.error(`Failed to load ${item.itemType} ${item.itemId}:`, err)
          const errorMessage = err?.response?.data?.error || err?.message || `Failed to load ${item.itemType} details`
          setError(errorMessage)
          setIsLoading(false)
          return
        }

        // Load parent hierarchy (only if we successfully loaded the item)
        if (data.initiative && data.initiative.keyResultId) {
          // Initiative → KeyResult → Objective → Goal → LifeDomain
          try {
            data.keyResult = await getKeyResult(data.initiative.keyResultId)
            if (data.keyResult && data.keyResult.objectiveId) {
              data.objective = await getObjective(data.keyResult.objectiveId)
              if (data.objective && data.objective.goalId) {
                data.goal = await getGoal(data.objective.goalId)
              }
            }
          } catch (err: any) {
            console.error('Failed to load initiative hierarchy:', err)
            // Don't fail completely, just log the error
          }
        } else if (data.keyResult && data.keyResult.objectiveId) {
          // KeyResult → Objective → Goal → LifeDomain
          try {
            data.objective = await getObjective(data.keyResult.objectiveId)
            if (data.objective && data.objective.goalId) {
              data.goal = await getGoal(data.objective.goalId)
            }
          } catch (err: any) {
            console.error('Failed to load key result hierarchy:', err)
            // Don't fail completely, just log the error
          }
        } else if (data.objective && data.objective.goalId) {
          // Objective → Goal → LifeDomain
          try {
            data.goal = await getGoal(data.objective.goalId)
          } catch (err: any) {
            console.error('Failed to load objective hierarchy:', err)
            // Don't fail completely, just log the error
          }
        }

        // Load Life Domain
        if (data.goal && data.goal.lifeDomainId) {
          try {
            const lifeDomains = await getAllLifeDomains()
            if (lifeDomains && lifeDomains.length > 0) {
              data.lifeDomain = lifeDomains.find(ld => ld.id === data.goal!.lifeDomainId)
            }
          } catch (err: any) {
            console.error('Failed to load life domains:', err)
            // Don't fail completely, just log the error
          }
        }

        setHierarchy(data)
      } catch (err: any) {
        console.error('Failed to load hierarchy:', err)
        const errorMessage = err?.response?.data?.error || err?.message || 'Failed to load item details'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadHierarchy()
  }, [item])

  if (!item) {
    return null
  }

  const getTitle = (textNl?: string | null, textEn?: string | null) => {
    if (language === 'nl') {
      return textNl || textEn || ''
    }
    return textEn || textNl || ''
  }

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className="fixed inset-0 bg-black/50 z-[100] md:hidden"
        onClick={onClose}
      />
      
      {/* Properties Panel */}
      <div className={`
        fixed right-0 top-0 h-full w-full md:w-96 z-[100]
        ${isWireframeTheme 
          ? 'bg-background border-l border-border' 
          : 'bg-primary/5 border-l border-primary/20'}
        shadow-lg overflow-y-auto
      `}>
      <div className="sticky top-0 z-10 p-4 border-b border-border bg-background">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Properties</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{item.itemType}</Badge>
          <span className="text-sm text-muted-foreground">
            Column: {item.columnName}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loading />
          </div>
        ) : error ? (
          <div className="space-y-2 py-4">
            <div className="text-sm font-semibold text-destructive">Error loading details</div>
            <div className="text-sm text-muted-foreground">{error}</div>
            <div className="text-xs text-muted-foreground">
              Please check the browser console for more details.
            </div>
          </div>
        ) : (
          <>
            {/* Life Domain */}
            {hierarchy.lifeDomain && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Life Domain
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <h3 className="font-semibold">
                      {getTitle(hierarchy.lifeDomain.titleNl, hierarchy.lifeDomain.titleEn)}
                    </h3>
                    {hierarchy.lifeDomain.descriptionNl || hierarchy.lifeDomain.descriptionEn ? (
                      <p className="text-sm text-muted-foreground">
                        {getTitle(hierarchy.lifeDomain.descriptionNl, hierarchy.lifeDomain.descriptionEn)}
                      </p>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Goal */}
            {hierarchy.goal && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Goal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <h3 className="font-semibold">
                      {getTitle(hierarchy.goal.titleNl, hierarchy.goal.titleEn)}
                    </h3>
                    {hierarchy.goal.descriptionNl || hierarchy.goal.descriptionEn ? (
                      <p className="text-sm text-muted-foreground">
                        {getTitle(hierarchy.goal.descriptionNl, hierarchy.goal.descriptionEn)}
                      </p>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Objective */}
            {hierarchy.objective && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Objective
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <h3 className="font-semibold">
                      {getTitle(hierarchy.objective.titleNl, hierarchy.objective.titleEn)}
                    </h3>
                    {hierarchy.objective.descriptionNl || hierarchy.objective.descriptionEn ? (
                      <p className="text-sm text-muted-foreground">
                        {getTitle(hierarchy.objective.descriptionNl, hierarchy.objective.descriptionEn)}
                      </p>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Key Result */}
            {hierarchy.keyResult && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Key Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <h3 className="font-semibold">
                      {getTitle(hierarchy.keyResult.titleNl, hierarchy.keyResult.titleEn)}
                    </h3>
                    {hierarchy.keyResult.descriptionNl || hierarchy.keyResult.descriptionEn ? (
                      <p className="text-sm text-muted-foreground">
                        {getTitle(hierarchy.keyResult.descriptionNl, hierarchy.keyResult.descriptionEn)}
                      </p>
                    ) : null}
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        Target: {hierarchy.keyResult.targetValue} {hierarchy.keyResult.unit}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Initiative */}
            {hierarchy.initiative && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Initiative
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <h3 className="font-semibold">{hierarchy.initiative.title}</h3>
                    {hierarchy.initiative.description ? (
                      <p className="text-sm text-muted-foreground">
                        {hierarchy.initiative.description}
                      </p>
                    ) : null}
                    <div className="mt-2 flex items-center gap-2">
                      <Badge 
                        variant={hierarchy.initiative.status === 'COMPLETED' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {hierarchy.initiative.status}
                      </Badge>
                      {hierarchy.initiative.targetDate && (
                        <span className="text-xs text-muted-foreground">
                          Target: {new Date(hierarchy.initiative.targetDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {item.notes && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{item.notes}</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
      </div>
    </>
  )
}
