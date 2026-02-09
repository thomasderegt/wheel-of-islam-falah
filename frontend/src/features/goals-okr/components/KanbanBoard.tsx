'use client'

/**
 * Progress Board Component
 * Displays progress items in 4 columns: TODO, IN_PROGRESS, IN_REVIEW, DONE
 */

import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '@/features/auth'
import { useKanbanItems, useUpdateKanbanItemPosition, useDeleteKanbanItem } from '../hooks/useKanbanItems'
import { getGoal, getObjective, getKeyResult, getInitiative, getUserGoalInstance, getUserObjectiveInstance, getUserKeyResultInstance, getUserInitiativeInstance, getInitiativesByKeyResult } from '../api/goalsOkrApi'
import type { KanbanItemDTO, GoalDTO, ObjectiveDTO, KeyResultDTO, UserInitiativeDTO, InitiativeDTO } from '../api/goalsOkrApi'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter, useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Trash2, GripVertical } from 'lucide-react'
import { Loading } from '@/shared/components/ui/Loading'
import { useTheme } from '@/shared/contexts/ThemeContext'
import type { KanbanFilters } from '../hooks/useKanbanFilters'
import { useWheels } from '../hooks/useWheels'
import { useLifeDomains } from '../hooks/useLifeDomains'

const COLUMNS: Array<{ id: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'; label: string }> = [
  { id: 'TODO', label: 'To Do' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'IN_REVIEW', label: 'In Review' },
  { id: 'DONE', label: 'Done' },
]

interface KanbanCardProps {
  item: KanbanItemDTO
  title: string
  onDelete: () => void
  language?: 'nl' | 'en'
}

function KanbanCard({ item, title, onDelete, language = 'en' }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id.toString(),
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const { userGroup } = useTheme()
  const isWireframeTheme = !userGroup || userGroup === 'universal'

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`
        mb-3 cursor-move opacity-80
        ${isWireframeTheme 
          ? 'border-border hover:border-foreground' 
          : 'border-primary/20 hover:border-primary'}
      `}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1">
            <div
              {...attributes}
              {...listeners}
              data-drag-handle
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="cursor-grab active:cursor-grabbing mt-1"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-medium line-clamp-2">
                {title}
              </CardTitle>
              <div className="mt-1">
                <span className="text-xs text-muted-foreground">
                  {item.itemType}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  )
}

interface KanbanColumnProps {
  columnId: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'
  label: string
  items: KanbanItemDTO[]
  itemTitles: Map<number, string>
  onDelete: (itemId: number) => void
  language?: 'nl' | 'en'
}

function KanbanColumn({ columnId, label, items, itemTitles, onDelete, language = 'en' }: KanbanColumnProps) {
  const { userGroup } = useTheme()
  const isWireframeTheme = !userGroup || userGroup === 'universal'

  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
  })

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.position - b.position)
  }, [items])

  return (
    <div className="flex-1 min-w-0">
      <div 
        ref={setNodeRef}
        className={`
          p-4 rounded-lg mb-4 transition-colors
          ${isOver ? 'ring-2 ring-primary ring-offset-2' : ''}
          ${isWireframeTheme 
            ? 'bg-muted border border-border' 
            : 'bg-primary/30 border border-primary/40'}
        `}
      >
        <h3 className="font-semibold text-lg mb-4">{label}</h3>
        <SortableContext items={sortedItems.map(item => item.id.toString())} strategy={verticalListSortingStrategy}>
          <div className="space-y-2 min-h-[200px]">
            {sortedItems.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-8">
                No items
              </div>
            ) : (
              sortedItems.map((item) => {
                const compoundKey = `${item.itemType}-${item.itemId}`
                const title = itemTitles.get(compoundKey) || `${item.itemType} ${item.itemId}`
                if (itemTitles.size > 0) {
                  console.log(`[KanbanBoard] Rendering ${item.itemType} ${item.itemId}: title="${title}", itemTitles.has("${compoundKey}")=${itemTitles.has(compoundKey)}`)
                }
                return (
                  <KanbanCard
                    key={item.id}
                    item={item}
                    title={title}
                    onDelete={() => onDelete(item.id)}
                    language={language}
                  />
                )
              })
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}

interface KanbanBoardProps {
  language?: 'nl' | 'en'
  filters: KanbanFilters
}

export function KanbanBoard({ language = 'en', filters }: KanbanBoardProps) {
  const { user } = useAuth()
  const { data: kanbanItems, isLoading } = useKanbanItems(user?.id || null)
  const { data: wheels } = useWheels()
  const { data: lifeDomains } = useLifeDomains()
  const updatePositionMutation = useUpdateKanbanItemPosition()
  const deleteMutation = useDeleteKanbanItem()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [itemTitles, setItemTitles] = useState<Map<string, string>>(new Map()) // Use compound key: "itemType-itemId"
  const [itemLifeDomainIds, setItemLifeDomainIds] = useState<Map<string, number>>(new Map()) // Use compound key: "itemType-itemId"
  
  // Create maps for wheel type filtering
  const wheelIdToType = useMemo(() => {
    if (!wheels) return new Map<number, 'life' | 'business'>()
    const map = new Map<number, 'life' | 'business'>()
    wheels.forEach(wheel => {
      if (wheel.wheelKey === 'WHEEL_OF_LIFE') {
        map.set(wheel.id, 'life')
      } else if (wheel.wheelKey === 'WHEEL_OF_BUSINESS') {
        map.set(wheel.id, 'business')
      }
    })
    return map
  }, [wheels])
  
  const lifeDomainIdToWheelId = useMemo(() => {
    if (!lifeDomains) return new Map<number, number>()
    const map = new Map<number, number>()
    lifeDomains.forEach(domain => {
      if (domain.wheelId) {
        map.set(domain.id, domain.wheelId)
      }
    })
    return map
  }, [lifeDomains])

  // Filter items based on filters
  const filteredItems = useMemo(() => {
    if (!kanbanItems) return []
    
    let filtered = kanbanItems
    
    // Filter by showInitiatives toggle (if enabled, only show INITIATIVE items)
    // If disabled, only show OKR items (GOAL, OBJECTIVE, KEY_RESULT)
    if (filters.showInitiatives) {
      filtered = filtered.filter(item => item.itemType === 'INITIATIVE')
    } else {
      // Show only OKR items (exclude INITIATIVE)
      filtered = filtered.filter(item => 
        item.itemType === 'GOAL' || 
        item.itemType === 'OBJECTIVE' || 
        item.itemType === 'KEY_RESULT'
      )
    }
    
    // Filter by itemType (only if showInitiatives is not enabled and itemType is set)
    if (filters.itemType && !filters.showInitiatives) {
      filtered = filtered.filter(item => item.itemType === filters.itemType)
    }
    
    // Filter by lifeDomainId
    // Only filter if we have loaded life domain IDs, otherwise show all items
    if (filters.lifeDomainId && itemLifeDomainIds.size > 0) {
      filtered = filtered.filter(item => {
        const compoundKey = `${item.itemType}-${item.itemId}`
        const lifeDomainId = itemLifeDomainIds.get(compoundKey)
        return lifeDomainId === filters.lifeDomainId
      })
    }
    
    // Filter by wheelType (life or business)
    if (filters.wheelType && itemLifeDomainIds.size > 0 && wheelIdToType.size > 0 && lifeDomainIdToWheelId.size > 0) {
      filtered = filtered.filter(item => {
        const compoundKey = `${item.itemType}-${item.itemId}`
        const lifeDomainId = itemLifeDomainIds.get(compoundKey)
        if (!lifeDomainId) return false
        
        const wheelId = lifeDomainIdToWheelId.get(lifeDomainId)
        if (!wheelId) return false
        
        const wheelType = wheelIdToType.get(wheelId)
        return wheelType === filters.wheelType
      })
    }
    
    return filtered
  }, [kanbanItems, filters, itemLifeDomainIds, wheelIdToType, lifeDomainIdToWheelId])

  // Group items by column
  const itemsByColumn = useMemo(() => {
    if (!filteredItems || filteredItems.length === 0) return { TODO: [], IN_PROGRESS: [], IN_REVIEW: [], DONE: [] }
    
    const grouped: Record<'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE', KanbanItemDTO[]> = {
      TODO: [],
      IN_PROGRESS: [],
      IN_REVIEW: [],
      DONE: [],
    }

    filteredItems.forEach(item => {
      grouped[item.columnName].push(item)
    })

    return grouped
  }, [filteredItems])

  // Load item titles and life domain IDs
  useEffect(() => {
    if (!kanbanItems || kanbanItems.length === 0) return

    const loadTitlesAndLifeDomains = async () => {
      const titles = new Map<string, string>() // Use compound key: "itemType-itemId"
      const lifeDomainIds = new Map<string, number>() // Use compound key: "itemType-itemId"
      
      // Process items sequentially (one at a time) to avoid race conditions
      for (const item of kanbanItems) {
        try {
          let title = ''
          let lifeDomainId: number | undefined
          
          console.log(`[KanbanBoard] Loading ${item.itemType} with itemId: ${item.itemId}`)
          
          switch (item.itemType) {
            case 'GOAL': {
              // item.itemId is a userGoalInstanceId, not a goalId
              const userGoalInstance = await getUserGoalInstance(item.itemId)
              console.log(`[KanbanBoard] GOAL: userGoalInstance.goalId = ${userGoalInstance.goalId}`)
              const goal = await getGoal(userGoalInstance.goalId)
              title = language === 'nl' ? (goal.titleNl || goal.titleEn) : (goal.titleEn || goal.titleNl)
              lifeDomainId = goal.lifeDomainId
              console.log(`[KanbanBoard] GOAL: title = "${title}"`)
              break
            }
            case 'OBJECTIVE': {
              // item.itemId is a userObjectiveInstanceId, not an objectiveId
              const userObjectiveInstance = await getUserObjectiveInstance(item.itemId)
              console.log(`[KanbanBoard] OBJECTIVE: userObjectiveInstance.objectiveId = ${userObjectiveInstance.objectiveId}`)
              const objective = await getObjective(userObjectiveInstance.objectiveId)
              title = language === 'nl' ? (objective.titleNl || objective.titleEn) : (objective.titleEn || objective.titleNl)
              console.log(`[KanbanBoard] OBJECTIVE: title = "${title}"`)
              // Get goal to find lifeDomainId
              if (objective.goalId) {
                const goal = await getGoal(objective.goalId)
                lifeDomainId = goal.lifeDomainId
              }
              break
            }
            case 'KEY_RESULT': {
              // item.itemId is a userKeyResultInstanceId, not a keyResultId
              const userKeyResultInstance = await getUserKeyResultInstance(item.itemId)
              console.log(`[KanbanBoard] KEY_RESULT: userKeyResultInstance.keyResultId = ${userKeyResultInstance.keyResultId}`)
              const keyResult = await getKeyResult(userKeyResultInstance.keyResultId)
              title = language === 'nl' ? (keyResult.titleNl || keyResult.titleEn) : (keyResult.titleEn || keyResult.titleNl)
              console.log(`[KanbanBoard] KEY_RESULT: title = "${title}"`)
              // Get objective -> goal to find lifeDomainId
              if (keyResult.objectiveId) {
                const objective = await getObjective(keyResult.objectiveId)
                if (objective.goalId) {
                  const goal = await getGoal(objective.goalId)
                  lifeDomainId = goal.lifeDomainId
                }
              }
              break
            }
            case 'INITIATIVE': {
              // item.itemId is a UserInitiativeInstance.id, not an Initiative.id or UserInitiative.id
              // Follow the same pattern as GOAL/OBJECTIVE/KEY_RESULT: get instance first
              const userInitiativeInstance = await getUserInitiativeInstance(item.itemId)
              
              // The initiativeId in UserInitiativeInstance can refer to:
              // 1. Initiative (template) - if it's a template initiative
              // 2. UserInitiative (user-created) - if it's a user-created initiative
              
              // Try to get as UserInitiative first (user-created)
              // If it fails with 404, it's a template Initiative, which is expected
              try {
                const userInitiative = await getInitiative(userInitiativeInstance.initiativeId)
                title = userInitiative.title
                // Get keyResult -> objective -> goal to find lifeDomainId
                if (userInitiative.keyResultId) {
                  const keyResult = await getKeyResult(userInitiative.keyResultId)
                  if (keyResult.objectiveId) {
                    const objective = await getObjective(keyResult.objectiveId)
                    if (objective.goalId) {
                      const goal = await getGoal(objective.goalId)
                      lifeDomainId = goal.lifeDomainId
                    }
                  }
                }
              } catch (userInitiativeError: any) {
                // If not found as UserInitiative (404), it's a template Initiative - this is expected
                // Only log if it's not a 404 error
                if (userInitiativeError?.response?.status !== 404) {
                  console.warn(`[KanbanBoard] Error checking UserInitiative ${userInitiativeInstance.initiativeId}:`, userInitiativeError)
                }
                
                // Get the key result from the userInitiativeInstance to find the template Initiative
                const userKeyResultInstance = await getUserKeyResultInstance(userInitiativeInstance.userKeyResultInstanceId)
                const keyResult = await getKeyResult(userKeyResultInstance.keyResultId)
                const templateInitiatives = await getInitiativesByKeyResult(keyResult.id)
                const templateInitiative = templateInitiatives.find(i => i.id === userInitiativeInstance.initiativeId)
                
                if (templateInitiative) {
                  title = language === 'nl' 
                    ? (templateInitiative.titleNl || templateInitiative.titleEn)
                    : (templateInitiative.titleEn || templateInitiative.titleNl)
                  
                  // Get keyResult -> objective -> goal to find lifeDomainId
                  if (keyResult.objectiveId) {
                    const objective = await getObjective(keyResult.objectiveId)
                    if (objective.goalId) {
                      const goal = await getGoal(objective.goalId)
                      lifeDomainId = goal.lifeDomainId
                    }
                  }
                } else {
                  throw new Error(`Template Initiative ${userInitiativeInstance.initiativeId} not found for key result ${keyResult.id}`)
                }
              }
              break
            }
          }
          
          // Use compound key to avoid collisions (itemId can be the same for different itemTypes)
          const compoundKey = `${item.itemType}-${item.itemId}`
          
          // Only set title if we got a valid one
          if (title) {
            titles.set(compoundKey, title)
            console.log(`[KanbanBoard] Set title for ${item.itemType} ${item.itemId}: "${title}", Map size now: ${titles.size}`)
          } else {
            console.warn(`[KanbanBoard] No title found for ${item.itemType} ${item.itemId}`)
            titles.set(compoundKey, `${item.itemType} ${item.itemId}`)
          }
          if (lifeDomainId) {
            lifeDomainIds.set(compoundKey, lifeDomainId)
          }
        } catch (error) {
          console.error(`[KanbanBoard] Failed to load data for ${item.itemType} ${item.itemId}:`, error)
          const compoundKey = `${item.itemType}-${item.itemId}`
          titles.set(compoundKey, `${item.itemType} ${item.itemId}`)
        }
      }
      
      console.log(`[KanbanBoard] Final titles:`, Array.from(titles.entries()))
      console.log(`[KanbanBoard] Setting ${titles.size} titles and ${lifeDomainIds.size} life domain IDs`)
      setItemTitles(titles)
      setItemLifeDomainIds(lifeDomainIds)
    }

    loadTitlesAndLifeDomains()
  }, [kanbanItems, language])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    
    const { active, over } = event
    if (!over || !user?.id) return

    const activeId = parseInt(active.id as string)
    const item = filteredItems?.find(i => i.id === activeId)
    if (!item) return

    const overId = over.id as string
    
    // Check if dropped directly on a column
    let targetColumn: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | undefined = COLUMNS.find(col => col.id === overId)?.id
    
    // If not dropped on a column, check if dropped on another card and find its column
    if (!targetColumn) {
      const overItemId = parseInt(overId)
      if (!isNaN(overItemId)) {
        const overItem = filteredItems?.find(i => i.id === overItemId)
        if (overItem) {
          targetColumn = overItem.columnName
        }
      }
    }

    if (!targetColumn || targetColumn === item.columnName) return

    // Calculate new position (append to end of target column)
    const targetItems = itemsByColumn[targetColumn]
    const newPosition = targetItems.length

    updatePositionMutation.mutate({
      itemId: item.id,
      columnName: targetColumn,
      position: newPosition,
    })
  }

  const handleDelete = (itemId: number) => {
    if (!user?.id) return
    if (confirm('Are you sure you want to remove this item from your progress board?')) {
      deleteMutation.mutate({ itemId, userId: user.id })
    }
  }

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    )
  }

  if (!kanbanItems || kanbanItems.length === 0) {
    return (
      <div className="w-full text-center text-muted-foreground py-12">
        <p>No items in your progress board</p>
        <p className="text-sm mt-2">Add goals, objectives, key results, or initiatives to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                columnId={column.id}
                label={column.label}
                items={itemsByColumn[column.id]}
                itemTitles={itemTitles}
                onDelete={handleDelete}
                language={language}
              />
            ))}
          </div>
        </div>
        <DragOverlay>
          {activeId && (
            <div className="opacity-50">
              {/* Render dragged item preview */}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
