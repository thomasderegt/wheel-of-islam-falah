'use client'

/**
 * Progress Board Component
 * Displays progress items in 4 columns: TODO, IN_PROGRESS, IN_REVIEW, DONE
 */

import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '@/features/auth'
import { useKanbanItems, useUpdateKanbanItemPosition, useDeleteKanbanItem } from '../hooks/useKanbanItems'
import { getGoal, getObjective, getKeyResult, getInitiative, getUserGoalInstance, getUserObjectiveInstance, getUserKeyResultInstance, getUserInitiativeInstance, getInitiativesByKeyResult } from '../api/goalsOkrApi'
import type { KanbanItemDTO, GoalDTO, ObjectiveDTO, KeyResultDTO, UserInitiativeDTO, InitiativeDTO, LifeDomainDTO } from '../api/goalsOkrApi'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter, useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Trash2, GripVertical, ExternalLink, Loader2 } from 'lucide-react'
import { Loading } from '@/shared/components/ui/Loading'
import { useTheme } from '@/shared/contexts/ThemeContext'
import type { KanbanFilters } from '../hooks/useKanbanFilters'
import { useWheels } from '../hooks/useWheels'
import { useLifeDomains } from '../hooks/useLifeDomains'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { useRouter, useSearchParams } from 'next/navigation'

const COLUMNS: Array<{ id: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'; label: string }> = [
  { id: 'TODO', label: 'To Do' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'IN_REVIEW', label: 'In Review' },
  { id: 'DONE', label: 'Done' },
]

interface KanbanCardProps {
  item: KanbanItemDTO
  title: string
  instanceNumber?: string | null
  domainTitle?: string | null
  onDelete: () => void
  language?: 'nl' | 'en'
  onNavigate?: () => void
  onNavigateToInstance?: () => void
}

function KanbanCard({ item, title, instanceNumber, domainTitle, onDelete, language = 'en', onNavigate, onNavigateToInstance }: KanbanCardProps) {
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

  const getItemTypeLabel = (itemType: string) => {
    const labels: Record<string, { en: string; nl: string }> = {
      GOAL: { en: 'Goal', nl: 'Doel' },
      OBJECTIVE: { en: 'Objective', nl: 'Objectief' },
      KEY_RESULT: { en: 'Key Result', nl: 'Kernresultaat' },
      INITIATIVE: { en: 'Initiative', nl: 'Initiatief' },
    }
    return labels[itemType]?.[language] || itemType
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`
        mb-3 cursor-move transition-all duration-200
        ${isDragging ? 'opacity-50 shadow-lg scale-105' : 'opacity-100'}
        ${isWireframeTheme 
          ? 'border-border hover:border-foreground hover:shadow-md' 
          : 'border-primary/20 hover:border-primary hover:shadow-md'}
      `}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div
              {...attributes}
              {...listeners}
              data-drag-handle
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="cursor-grab active:cursor-grabbing mt-1 flex-shrink-0"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle 
                className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors"
                onClick={onNavigate}
                style={{ cursor: onNavigate ? 'pointer' : 'default' }}
              >
                {title}
              </CardTitle>
              <div className="mt-2 space-y-1 text-xs">
                {domainTitle && (
                  <div className="text-muted-foreground">
                    Domain: <span className="font-medium text-foreground">{domainTitle}</span>
                  </div>
                )}
                <div className="text-muted-foreground">
                  Item Type: <span className="font-medium text-foreground">{getItemTypeLabel(item.itemType)}</span>
                </div>
                {instanceNumber && (
                  <div className="text-muted-foreground">
                    {getItemTypeLabel(item.itemType)} nr: <span className="font-mono font-medium text-foreground">{instanceNumber}</span>
                  </div>
                )}
                {item.number && (
                  <div className="text-muted-foreground">
                    Kanban Item nr: <span className="font-mono font-medium text-foreground">{item.number}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {onNavigateToInstance && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onNavigateToInstance()
                }}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                title={language === 'nl' ? 'Bekijk instance' : 'View instance'}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              title={language === 'nl' ? 'Verwijderen' : 'Delete'}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

interface KanbanColumnProps {
  columnId: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'
  label: string
  items: KanbanItemDTO[]
  itemTitles: Map<string, string>
  itemNumbers: Map<string, string>
  itemLifeDomainIds: Map<string, number>
  lifeDomains?: LifeDomainDTO[]
  onDelete: (itemId: number) => void
  language?: 'nl' | 'en'
  onNavigate?: (item: KanbanItemDTO) => void
  onNavigateToInstance?: (item: KanbanItemDTO) => void
  isLoadingTitles?: boolean
  wipLimits?: {
    life?: number
    business?: number
  }
  wheelIdToType?: Map<number, 'life' | 'business'>
  lifeDomainIdToWheelId?: Map<number, number>
}

function KanbanColumn({ columnId, label, items, itemTitles, itemNumbers, itemLifeDomainIds, lifeDomains, onDelete, language = 'en', onNavigate, onNavigateToInstance, isLoadingTitles = false, wipLimits, wheelIdToType, lifeDomainIdToWheelId }: KanbanColumnProps) {
  const { userGroup } = useTheme()
  const isWireframeTheme = !userGroup || userGroup === 'universal'

  // Calculate counts per wheel type
  const countsByWheelType = useMemo(() => {
    const counts: { life: number; business: number } = { life: 0, business: 0 }
    
    if (!wheelIdToType || !lifeDomainIdToWheelId) {
      return counts
    }
    
    items.forEach(item => {
      const compoundKey = `${item.itemType}-${item.itemId}`
      const lifeDomainId = itemLifeDomainIds.get(compoundKey)
      if (!lifeDomainId) return
      
      const wheelId = lifeDomainIdToWheelId.get(lifeDomainId)
      if (!wheelId) return
      
      const wheelType = wheelIdToType.get(wheelId)
      if (wheelType === 'life' || wheelType === 'business') {
        counts[wheelType]++
      }
    })
    
    return counts
  }, [items, itemLifeDomainIds, wheelIdToType, lifeDomainIdToWheelId])

  // Check if any WIP limit is reached
  const isWipLimitReached = useMemo(() => {
    if (!wipLimits) return false
    return (
      (wipLimits.life !== undefined && countsByWheelType.life >= wipLimits.life) ||
      (wipLimits.business !== undefined && countsByWheelType.business >= wipLimits.business)
    )
  }, [wipLimits, countsByWheelType])

  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
    disabled: isWipLimitReached && columnId !== 'DONE', // Disable dropping when limit reached (except for DONE column)
  })

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.position - b.position)
  }, [items])

  const itemCount = sortedItems.length
  const showWipLimits = wipLimits && (wipLimits.life !== undefined || wipLimits.business !== undefined)

  return (
    <div className="flex-1 min-w-0">
      <div 
        ref={setNodeRef}
        className={`
          p-4 rounded-lg mb-4 transition-all duration-200
          ${isOver ? 'ring-2 ring-primary ring-offset-2 bg-primary/40' : ''}
          ${isWipLimitReached ? 'ring-2 ring-destructive ring-offset-2 bg-destructive/10' : ''}
          ${isWireframeTheme 
            ? 'bg-muted border border-border' 
            : 'bg-primary/30 border border-primary/40'}
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">{label}</h3>
          <div className="flex items-center gap-2">
            {showWipLimits && (
              <div className="flex items-center gap-1">
                {wipLimits.life !== undefined && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    countsByWheelType.life >= wipLimits.life
                      ? 'bg-destructive/20 text-destructive font-semibold' 
                      : 'bg-muted text-muted-foreground'
                  }`} title={language === 'nl' ? 'Wheel of Life' : 'Wheel of Life'}>
                    L: {countsByWheelType.life}/{wipLimits.life}
                  </span>
                )}
                {wipLimits.business !== undefined && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    countsByWheelType.business >= wipLimits.business
                      ? 'bg-destructive/20 text-destructive font-semibold' 
                      : 'bg-muted text-muted-foreground'
                  }`} title={language === 'nl' ? 'Wheel of Business' : 'Wheel of Business'}>
                    B: {countsByWheelType.business}/{wipLimits.business}
                  </span>
                )}
              </div>
            )}
            <span className={`text-sm px-2 py-1 rounded-full ${
              isWipLimitReached 
                ? 'bg-destructive/20 text-destructive' 
                : 'text-muted-foreground bg-background/50'
            }`}>
              {itemCount}
            </span>
          </div>
        </div>
        {isWipLimitReached && (
          <div className="mb-2 text-xs text-destructive font-medium">
            {language === 'nl' 
              ? `WIP limit bereikt` 
              : `WIP limit reached`}
            {wipLimits.life !== undefined && countsByWheelType.life >= wipLimits.life && (
              <span className="ml-1">
                ({language === 'nl' ? 'Life' : 'Life'}: {countsByWheelType.life}/{wipLimits.life})
              </span>
            )}
            {wipLimits.business !== undefined && countsByWheelType.business >= wipLimits.business && (
              <span className="ml-1">
                ({language === 'nl' ? 'Business' : 'Business'}: {countsByWheelType.business}/{wipLimits.business})
              </span>
            )}
          </div>
        )}
        <SortableContext items={sortedItems.map(item => item.id.toString())} strategy={verticalListSortingStrategy}>
          <div className="space-y-2 min-h-[200px]">
            {isLoadingTitles && sortedItems.length > 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : sortedItems.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed rounded-lg border-muted-foreground/20">
                {language === 'nl' ? 'Geen items' : 'No items'}
              </div>
            ) : (
              sortedItems.map((item) => {
                const compoundKey = `${item.itemType}-${item.itemId}`
                const title = itemTitles.get(compoundKey) || `${item.itemType} ${item.itemId}`
                const instanceNumber = itemNumbers.get(compoundKey)
                const lifeDomainId = itemLifeDomainIds.get(compoundKey)
                const domain = lifeDomains?.find(d => d.id === lifeDomainId)
                const domainTitle = domain 
                  ? (language === 'nl' ? (domain.titleNl || domain.titleEn) : (domain.titleEn || domain.titleNl))
                  : null
                return (
                  <KanbanCard
                    key={item.id}
                    item={item}
                    title={title}
                    instanceNumber={instanceNumber}
                    domainTitle={domainTitle}
                    onDelete={() => onDelete(item.id)}
                    onNavigate={onNavigate ? () => onNavigate(item) : undefined}
                    onNavigateToInstance={onNavigateToInstance ? () => onNavigateToInstance(item) : undefined}
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: kanbanItems, isLoading } = useKanbanItems(user?.id || null)
  const { data: wheels } = useWheels()
  const { data: lifeDomains } = useLifeDomains()
  const updatePositionMutation = useUpdateKanbanItemPosition()
  const deleteMutation = useDeleteKanbanItem()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeItem, setActiveItem] = useState<KanbanItemDTO | null>(null)
  const [itemTitles, setItemTitles] = useState<Map<string, string>>(new Map()) // Use compound key: "itemType-itemId"
  const [itemLifeDomainIds, setItemLifeDomainIds] = useState<Map<string, number>>(new Map()) // Use compound key: "itemType-itemId"
  const [itemNumbers, setItemNumbers] = useState<Map<string, string>>(new Map()) // Use compound key: "itemType-itemId" - User instance numbers
  const [isLoadingTitles, setIsLoadingTitles] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: number; title: string } | null>(null)
  
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
    if (!kanbanItems || kanbanItems.length === 0) {
      setItemTitles(new Map())
      setItemLifeDomainIds(new Map())
      setItemNumbers(new Map())
      setIsLoadingTitles(false)
      return
    }

    let isCancelled = false

    const loadTitlesAndLifeDomains = async () => {
      const titles = new Map<string, string>() // Use compound key: "itemType-itemId"
      const lifeDomainIds = new Map<string, number>() // Use compound key: "itemType-itemId"
      const numbers = new Map<string, string>() // Use compound key: "itemType-itemId" - User instance numbers
      
      // Process items sequentially (one at a time) to avoid race conditions
      // This prevents multiple parallel requests from interfering with each other
      for (const item of kanbanItems) {
        // Check if this effect was cancelled (e.g., kanbanItems changed)
        if (isCancelled) {
          return
        }

        try {
          let title = ''
          let lifeDomainId: number | undefined
          
          switch (item.itemType) {
            case 'GOAL': {
              // item.itemId is a userGoalInstanceId, not a goalId
              const userGoalInstance = await getUserGoalInstance(item.itemId)
              if (isCancelled) return
              const goal = await getGoal(userGoalInstance.goalId)
              if (isCancelled) return
              title = language === 'nl' ? (goal.titleNl || goal.titleEn) : (goal.titleEn || goal.titleNl)
              lifeDomainId = goal.lifeDomainId
              // Store user instance number
              if (userGoalInstance.number) {
                numbers.set(`${item.itemType}-${item.itemId}`, userGoalInstance.number)
              }
              break
            }
            case 'OBJECTIVE': {
              // item.itemId is a userObjectiveInstanceId, not an objectiveId
              const userObjectiveInstance = await getUserObjectiveInstance(item.itemId)
              if (isCancelled) return
              const objective = await getObjective(userObjectiveInstance.objectiveId)
              if (isCancelled) return
              title = language === 'nl' ? (objective.titleNl || objective.titleEn) : (objective.titleEn || objective.titleNl)
              // Get goal to find lifeDomainId
              if (objective.goalId) {
                const goal = await getGoal(objective.goalId)
                if (isCancelled) return
                lifeDomainId = goal.lifeDomainId
              }
              // Store user instance number
              if (userObjectiveInstance.number) {
                numbers.set(`${item.itemType}-${item.itemId}`, userObjectiveInstance.number)
              }
              break
            }
            case 'KEY_RESULT': {
              // item.itemId is a userKeyResultInstanceId, not a keyResultId
              const userKeyResultInstance = await getUserKeyResultInstance(item.itemId)
              if (isCancelled) return
              const keyResult = await getKeyResult(userKeyResultInstance.keyResultId)
              if (isCancelled) return
              title = language === 'nl' ? (keyResult.titleNl || keyResult.titleEn) : (keyResult.titleEn || keyResult.titleNl)
              // Get objective -> goal to find lifeDomainId
              if (keyResult.objectiveId) {
                const objective = await getObjective(keyResult.objectiveId)
                if (isCancelled) return
                if (objective.goalId) {
                  const goal = await getGoal(objective.goalId)
                  if (isCancelled) return
                  lifeDomainId = goal.lifeDomainId
                }
              }
              // Store user instance number
              if (userKeyResultInstance.number) {
                numbers.set(`${item.itemType}-${item.itemId}`, userKeyResultInstance.number)
              }
              break
            }
            case 'INITIATIVE': {
              // item.itemId is a UserInitiativeInstance.id, not an Initiative.id or UserInitiative.id
              // Follow the same pattern as GOAL/OBJECTIVE/KEY_RESULT: get instance first
              const userInitiativeInstance = await getUserInitiativeInstance(item.itemId)
              if (isCancelled) return
              
              // The initiativeId in UserInitiativeInstance can refer to:
              // 1. Initiative (template) - if it's a template initiative
              // 2. UserInitiative (user-created) - if it's a user-created initiative
              
              // Try to get as UserInitiative first (user-created)
              // If it fails with 404, it's a template Initiative, which is expected
              try {
                const userInitiative = await getInitiative(userInitiativeInstance.initiativeId)
                if (isCancelled) return
                title = userInitiative.title
                // Get keyResult -> objective -> goal to find lifeDomainId
                if (userInitiative.keyResultId) {
                  const keyResult = await getKeyResult(userInitiative.keyResultId)
                  if (isCancelled) return
                  if (keyResult.objectiveId) {
                    const objective = await getObjective(keyResult.objectiveId)
                    if (isCancelled) return
                    if (objective.goalId) {
                      const goal = await getGoal(objective.goalId)
                      if (isCancelled) return
                      lifeDomainId = goal.lifeDomainId
                    }
                  }
                }
              } catch (userInitiativeError: any) {
                if (isCancelled) return
                // If not found as UserInitiative (404), it's a template Initiative - this is expected
                // Only log if it's not a 404 error
                if (userInitiativeError?.response?.status !== 404) {
                  console.warn(`[KanbanBoard] Error checking UserInitiative ${userInitiativeInstance.initiativeId}:`, userInitiativeError)
                }
                
                // Get the key result from the userInitiativeInstance to find the template Initiative
                const userKeyResultInstance = await getUserKeyResultInstance(userInitiativeInstance.userKeyResultInstanceId)
                if (isCancelled) return
                const keyResult = await getKeyResult(userKeyResultInstance.keyResultId)
                if (isCancelled) return
                const templateInitiatives = await getInitiativesByKeyResult(keyResult.id)
                if (isCancelled) return
                const templateInitiative = templateInitiatives.find(i => i.id === userInitiativeInstance.initiativeId)
                
                if (templateInitiative) {
                  title = language === 'nl' 
                    ? (templateInitiative.titleNl || templateInitiative.titleEn)
                    : (templateInitiative.titleEn || templateInitiative.titleNl)
                  
                  // Get keyResult -> objective -> goal to find lifeDomainId
                  if (keyResult.objectiveId) {
                    const objective = await getObjective(keyResult.objectiveId)
                    if (isCancelled) return
                    if (objective.goalId) {
                      const goal = await getGoal(objective.goalId)
                      if (isCancelled) return
                      lifeDomainId = goal.lifeDomainId
                    }
                  }
                } else {
                  throw new Error(`Template Initiative ${userInitiativeInstance.initiativeId} not found for key result ${keyResult.id}`)
                }
              }
              // Store user instance number
              if (userInitiativeInstance.number) {
                numbers.set(`${item.itemType}-${item.itemId}`, userInitiativeInstance.number)
              }
              break
            }
          }
          
          if (isCancelled) return
          
          // Use compound key to avoid collisions (itemId can be the same for different itemTypes)
          const compoundKey = `${item.itemType}-${item.itemId}`
          
          // Only set title if we got a valid one
          if (title) {
            titles.set(compoundKey, title)
          } else {
            titles.set(compoundKey, `${item.itemType} ${item.itemId}`)
          }
          if (lifeDomainId) {
            lifeDomainIds.set(compoundKey, lifeDomainId)
          }
        } catch (error) {
          if (isCancelled) return
          console.error(`[KanbanBoard] Failed to load data for ${item.itemType} ${item.itemId}:`, error)
          const compoundKey = `${item.itemType}-${item.itemId}`
          titles.set(compoundKey, `${item.itemType} ${item.itemId}`)
        }
      }
      
      // Only update state if this effect wasn't cancelled
      if (!isCancelled) {
        setItemTitles(titles)
        setItemLifeDomainIds(lifeDomainIds)
        setItemNumbers(numbers)
        setIsLoadingTitles(false)
      }
    }

    setIsLoadingTitles(true)
    loadTitlesAndLifeDomains()

    // Cleanup: cancel if kanbanItems or language changes
    return () => {
      isCancelled = true
    }
  }, [kanbanItems, language])

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id as string
    setActiveId(activeId)
    const item = filteredItems?.find(i => i.id.toString() === activeId)
    setActiveItem(item || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    setActiveItem(null)
    
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

    // Determine wheel type of the item being moved
    const compoundKey = `${item.itemType}-${item.itemId}`
    const lifeDomainId = itemLifeDomainIds.get(compoundKey)
    let itemWheelType: 'life' | 'business' | undefined = undefined
    
    if (lifeDomainId && lifeDomainIdToWheelId.size > 0 && wheelIdToType.size > 0) {
      const wheelId = lifeDomainIdToWheelId.get(lifeDomainId)
      if (wheelId) {
        itemWheelType = wheelIdToType.get(wheelId)
      }
    }

    // Check WIP limit for target column and wheel type
    if (itemWheelType) {
      const wipLimit = filters.wipLimits?.[itemWheelType]?.[targetColumn]
      if (wipLimit !== undefined) {
        // Count only items of the same wheel type in the target column
        const targetColumnItems = itemsByColumn[targetColumn]
        const itemsOfSameWheelType = targetColumnItems.filter(targetItem => {
          const targetCompoundKey = `${targetItem.itemType}-${targetItem.itemId}`
          const targetLifeDomainId = itemLifeDomainIds.get(targetCompoundKey)
          if (!targetLifeDomainId) return false
          
          const targetWheelId = lifeDomainIdToWheelId.get(targetLifeDomainId)
          if (!targetWheelId) return false
          
          const targetWheelType = wheelIdToType.get(targetWheelId)
          return targetWheelType === itemWheelType
        })
        
        const currentCount = itemsOfSameWheelType.length
        
        // If the item is already in the target column, we're just reordering, so allow it
        // Otherwise, check if adding this item would exceed the limit
        if (item.columnName !== targetColumn && currentCount >= wipLimit) {
          // Show alert to user
          const columnLabel = COLUMNS.find(c => c.id === targetColumn)?.label || targetColumn
          const wheelLabel = itemWheelType === 'life' 
            ? (language === 'nl' ? 'Wheel of Life' : 'Wheel of Life')
            : (language === 'nl' ? 'Wheel of Business' : 'Wheel of Business')
          alert(language === 'nl' 
            ? `WIP limit bereikt voor ${wheelLabel}! Maximum ${wipLimit} items in "${columnLabel}". Verplaats eerst een item naar een andere kolom.`
            : `WIP limit reached for ${wheelLabel}! Maximum ${wipLimit} items in "${columnLabel}". Please move an item to another column first.`
          )
          return // Block the drag operation
        }
      }
    }

    // Calculate new position (append to end of target column)
    const targetItems = itemsByColumn[targetColumn]
    const newPosition = targetItems.length

    updatePositionMutation.mutate({
      itemId: item.id,
      columnName: targetColumn,
      position: newPosition,
    })
  }

  const handleDeleteClick = (itemId: number) => {
    const compoundKey = Array.from(itemTitles.entries()).find(([key]) => {
      const [type, id] = key.split('-')
      return parseInt(id) === itemId
    })
    const title = compoundKey ? compoundKey[1] : 'this item'
    setItemToDelete({ id: itemId, title })
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!user?.id || !itemToDelete) return
    deleteMutation.mutate({ itemId: itemToDelete.id, userId: user.id })
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const handleNavigate = (item: KanbanItemDTO) => {
    // Navigate to kanban item detail page with current filter query parameters
    const queryString = searchParams?.toString()
    const url = queryString 
      ? `/goals-okr/kanban/items/${item.id}?returnTo=${encodeURIComponent(`/goals-okr/kanban${queryString ? `?${queryString}` : ''}`)}`
      : `/goals-okr/kanban/items/${item.id}?returnTo=${encodeURIComponent('/goals-okr/kanban')}`
    router.push(url)
  }

  const handleNavigateToInstance = (item: KanbanItemDTO) => {
    // Navigate to the actual instance page (goal/objective/key result)
    switch (item.itemType) {
      case 'GOAL':
        router.push(`/goals-okr/user-goal-instances/${item.itemId}`)
        break
      case 'OBJECTIVE':
        router.push(`/goals-okr/user-objective-instances/${item.itemId}`)
        break
      case 'KEY_RESULT':
        router.push(`/goals-okr/user-key-result-instances/${item.itemId}`)
        break
      case 'INITIATIVE':
        // For initiatives, we need to get the key result instance first
        // For now, just navigate to the key result instance
        // This could be improved by storing the key result instance ID
        break
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
        <p className="text-lg font-medium">{language === 'nl' ? 'Geen items in je progress board' : 'No items in your progress board'}</p>
        <p className="text-sm mt-2">
          {language === 'nl' 
            ? 'Voeg doelen, objectieven, kernresultaten of initiatieven toe om te beginnen'
            : 'Add goals, objectives, key results, or initiatives to get started'}
        </p>
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
            {COLUMNS.map((column) => {
              const items = itemsByColumn[column.id]
              const wipLimits = filters.wipLimits ? {
                life: filters.wipLimits.life?.[column.id],
                business: filters.wipLimits.business?.[column.id]
              } : undefined
              
              return (
                <KanbanColumn
                  key={column.id}
                  columnId={column.id}
                  label={column.label}
                  items={items}
                  itemTitles={itemTitles}
                  itemNumbers={itemNumbers}
                  itemLifeDomainIds={itemLifeDomainIds}
                  lifeDomains={lifeDomains}
                  onDelete={handleDeleteClick}
                  onNavigate={handleNavigate}
                  onNavigateToInstance={handleNavigateToInstance}
                  isLoadingTitles={isLoadingTitles}
                  language={language}
                  wipLimits={wipLimits}
                  wheelIdToType={wheelIdToType}
                  lifeDomainIdToWheelId={lifeDomainIdToWheelId}
                />
              )
            })}
          </div>
        </div>
        <DragOverlay>
          {activeId && activeItem && (
            <Card className="opacity-90 shadow-xl border-2 border-primary w-64">
              <CardHeader className="pb-2">
                <div className="flex items-start gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-medium line-clamp-2">
                      {itemTitles.get(`${activeItem.itemType}-${activeItem.itemId}`) || `${activeItem.itemType} ${activeItem.itemId}`}
                    </CardTitle>
                    <div className="mt-1">
                      <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">
                        {activeItem.itemType}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}
        </DragOverlay>
      </DndContext>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'nl' ? 'Item verwijderen?' : 'Remove item?'}
            </DialogTitle>
            <DialogDescription>
              {language === 'nl' 
                ? `Weet je zeker dat je "${itemToDelete?.title || 'dit item'}" wilt verwijderen van je progress board?`
                : `Are you sure you want to remove "${itemToDelete?.title || 'this item'}" from your progress board?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setItemToDelete(null)
              }}
              disabled={deleteMutation.isPending}
            >
              {language === 'nl' ? 'Annuleren' : 'Cancel'}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending 
                ? (language === 'nl' ? 'Verwijderen...' : 'Removing...')
                : (language === 'nl' ? 'Verwijderen' : 'Remove')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
