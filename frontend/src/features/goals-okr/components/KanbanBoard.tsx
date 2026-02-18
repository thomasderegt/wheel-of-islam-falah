'use client'

/**
 * Progress Board Component
 * Displays progress items in 4 columns: TODO, IN_PROGRESS, IN_REVIEW, DONE
 */

import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '@/features/auth'
import { useKanbanItems, useTeamKanbanItems, useUpdateKanbanItemPosition, useDeleteKanbanItem } from '../hooks/useKanbanItems'
import { getGoal, getObjective, getKeyResult, getInitiative, getUserGoalInstance, getUserObjectiveInstance, getUserKeyResultInstance, getUserInitiativeInstance, getInitiativesByKeyResult } from '../api/goalsOkrApi'
import type { KanbanItemDTO, GoalDTO, ObjectiveDTO, KeyResultDTO, UserInitiativeDTO, InitiativeDTO, LifeDomainDTO } from '../api/goalsOkrApi'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter, useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Trash2, GripVertical, Loader2 } from 'lucide-react'
import { Loading } from '@/shared/components/ui/Loading'
import { useTheme } from '@/shared/contexts/ThemeContext'
import type { KanbanFilters } from '../hooks/useKanbanFilters'
import { useWheels } from '../hooks/useWheels'
import { useLifeDomains } from '../hooks/useLifeDomains'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { useRouter, useSearchParams } from 'next/navigation'
import { useModeContext } from '@/shared/hooks/useModeContext'
import { getWheelIdFromGoalsOkrContext } from '@/shared/utils/contextUtils'

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
  readOnly?: boolean
}

function KanbanCard({ item, title, instanceNumber, domainTitle, onDelete, language = 'en', onNavigate, onNavigateToInstance, readOnly = false }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id.toString(),
    disabled: readOnly, // Disable drag in read-only mode
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
        ${readOnly ? 'cursor-default' : 'cursor-move'} transition-all duration-200
        w-[calc(100%-0.5rem)] self-center
        ${isDragging ? 'opacity-50 shadow-lg scale-105' : 'opacity-100'}
        ${isWireframeTheme 
          ? 'border-border hover:border-foreground hover:shadow-md' 
          : 'border-primary/20 hover:border-primary hover:shadow-md'}
      `}
    >
      <CardHeader className="p-3 pb-3 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          {!readOnly && (
            <div
              {...attributes}
              {...listeners}
              data-drag-handle
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="cursor-grab active:cursor-grabbing flex-shrink-0"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          {readOnly && (
            <div className="text-xs text-muted-foreground italic flex-shrink-0">
              {language === 'nl' ? 'Alleen-lezen' : 'Read-only'}
            </div>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <CardTitle 
            className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors mb-2"
            onClick={onNavigate}
            style={{ cursor: onNavigate ? 'pointer' : 'default' }}
          >
            {title}
          </CardTitle>
          <div className="space-y-0.5 text-xs">
            {domainTitle && (
              <div className="text-muted-foreground truncate text-xs">
                Domain: <span className="font-medium text-foreground">{domainTitle}</span>
              </div>
            )}
            {instanceNumber && (
              <div className="text-muted-foreground text-xs">
                {getItemTypeLabel(item.itemType)}: <span className="font-medium text-foreground">{instanceNumber}</span>
              </div>
            )}
            {!instanceNumber && (
              <div className="text-muted-foreground text-xs">
                <span className="font-medium text-foreground">{getItemTypeLabel(item.itemType)}</span>
              </div>
            )}
            {item.number && (
              <div className="text-muted-foreground text-xs">
                Kanban Item: <span className="font-medium text-foreground">{item.number}</span>
              </div>
            )}
            {item.notes && item.notes.trim() && (
              <div className="text-muted-foreground text-xs mt-1 line-clamp-2">
                {item.notes.trim().length > 80
                  ? `${item.notes.trim().slice(0, 80)}...`
                  : item.notes.trim()}
              </div>
            )}
            {!readOnly && (
              <div className="flex justify-start mt-1">
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
            )}
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
  targetWheelId?: number | null
  readOnly?: boolean
}

function KanbanColumn({ columnId, label, items, itemTitles, itemNumbers, itemLifeDomainIds, lifeDomains, onDelete, language = 'en', onNavigate, onNavigateToInstance, isLoadingTitles = false, wipLimits, wheelIdToType, lifeDomainIdToWheelId, readOnly = false }: KanbanColumnProps) {
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
          </div>
        )}
        <SortableContext items={sortedItems.map(item => item.id.toString())} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2 min-h-[200px]">
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
                    readOnly={item.readOnly ?? false}
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
  
  // Check if team mode
  const teamId = searchParams?.get('teamId') ? parseInt(searchParams.get('teamId')!) : null
  const isTeamMode = searchParams?.get('mode') === 'team' && teamId !== null
  const { goalsOkrContext } = useModeContext()
  
  // Use different hook based on mode
  const { data: personalKanbanItems, isLoading: isLoadingPersonal } = useKanbanItems(isTeamMode ? null : user?.id ?? null)
  const { data: teamKanbanItems, isLoading: isLoadingTeam } = useTeamKanbanItems(isTeamMode ? teamId : null)
  
  const kanbanItems = isTeamMode ? teamKanbanItems : personalKanbanItems
  const isLoading = isTeamMode ? isLoadingTeam : isLoadingPersonal
  
  // Check if read-only (team mode items are always read-only)
  const isReadOnly = isTeamMode && kanbanItems && kanbanItems.length > 0 && kanbanItems[0]?.readOnly === true
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
  
  // Create maps for wheel type filtering (still needed for WIP limits display)
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

  // Get target wheelId from goalsOkrContext
  const targetWheelId = useMemo(() => {
    if (goalsOkrContext === 'NONE' || goalsOkrContext === 'ALL') return null
    return getWheelIdFromGoalsOkrContext(goalsOkrContext, wheels)
  }, [goalsOkrContext, wheels])

  // Filter items based on filters AND goalsOkrContext
  const filteredItems = useMemo(() => {
    if (!kanbanItems) return []
    // Debug: trace kanban filtering for initiatives
    if (process.env.NODE_ENV === 'development') {
      const initiatives = kanbanItems.filter(i => i.itemType === 'INITIATIVE')
      if (initiatives.length > 0) {
        const withoutLifeDomain = initiatives.filter(i => !itemLifeDomainIds.get(`${i.itemType}-${i.itemId}`))
        if (withoutLifeDomain.length > 0) {
          console.log('[KanbanBoard] Initiatives without lifeDomainId (may be filtered out):', withoutLifeDomain.map(i => ({ id: i.id, itemId: i.itemId })))
        }
        console.log('[KanbanBoard] Filter context:', { goalsOkrContext, targetWheelId, totalItems: kanbanItems.length, initiativeCount: initiatives.length })
      }
    }
    // If goalsOkrContext is NONE, show nothing
    if (goalsOkrContext === 'NONE') {
      return []
    }
    
    // If goalsOkrContext is ALL, show items from all wheels (no wheelId filtering)
    
    let filtered = kanbanItems
    
    // Filter by viewMode: 'all' = show everything (default), 'okrs' = only OKR items, 'initiatives' = only initiatives
    const viewMode = filters.viewMode ?? 'all'
    if (viewMode === 'initiatives') {
      filtered = filtered.filter(item => item.itemType === 'INITIATIVE')
    } else if (viewMode === 'okrs') {
      filtered = filtered.filter(item =>
        item.itemType === 'GOAL' ||
        item.itemType === 'OBJECTIVE' ||
        item.itemType === 'KEY_RESULT'
      )
    }
    // viewMode === 'all': no filter by type, show OKRs and initiatives

    // Filter by itemType (only when not in initiatives-only view and itemType is set)
    if (filters.itemType && viewMode !== 'initiatives') {
      filtered = filtered.filter(item => item.itemType === filters.itemType)
    }
    
    // Filter by lifeDomainId (user can still filter by specific domain)
    if (filters.lifeDomainId && itemLifeDomainIds.size > 0) {
      filtered = filtered.filter(item => {
        const compoundKey = `${item.itemType}-${item.itemId}`
        const lifeDomainId = itemLifeDomainIds.get(compoundKey)
        return lifeDomainId === filters.lifeDomainId
      })
    }
    
    // Filter by goalsOkrContext (wheelId) - Skip if ALL (show all wheels)
    if (goalsOkrContext !== 'ALL' && targetWheelId && itemLifeDomainIds.size > 0 && lifeDomainIdToWheelId.size > 0) {
      filtered = filtered.filter(item => {
        const compoundKey = `${item.itemType}-${item.itemId}`
        const lifeDomainId = itemLifeDomainIds.get(compoundKey)
        if (!lifeDomainId) return false
        
        const wheelId = lifeDomainIdToWheelId.get(lifeDomainId)
        if (!wheelId) return false
        
        // Only show items from the target wheel (based on goalsOkrContext)
        return wheelId === targetWheelId
      })
    }
    
    return filtered
  }, [kanbanItems, filters, itemLifeDomainIds, lifeDomainIdToWheelId, goalsOkrContext, targetWheelId])

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
              lifeDomainId = objective.lifeDomainId
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
              // Get objective to find lifeDomainId
              if (keyResult.objectiveId) {
                const objective = await getObjective(keyResult.objectiveId)
                if (isCancelled) return
                lifeDomainId = objective.lifeDomainId
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
                // Get keyResult -> objective to find lifeDomainId (required for wheel/context filtering)
                let keyResultId = userInitiative.keyResultId
                if (!keyResultId) {
                  // Fallback: get keyResultId from userKeyResultInstance (user-created initiatives may not have keyResultId set)
                  const userKeyResultInstance = await getUserKeyResultInstance(userInitiativeInstance.userKeyResultInstanceId)
                  if (isCancelled) return
                  keyResultId = userKeyResultInstance.keyResultId
                }
                if (keyResultId) {
                  const keyResult = await getKeyResult(keyResultId)
                  if (isCancelled) return
                  if (keyResult.objectiveId) {
                    const objective = await getObjective(keyResult.objectiveId)
                    if (isCancelled) return
                    lifeDomainId = objective.lifeDomainId
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
                  
                  // Get keyResult -> objective to find lifeDomainId
                  if (keyResult.objectiveId) {
                    const objective = await getObjective(keyResult.objectiveId)
                    if (isCancelled) return
                    lifeDomainId = objective.lifeDomainId
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
    // Goal layer removed: GOAL items open kanban item detail. Others go to instance page.
    switch (item.itemType) {
      case 'GOAL':
        handleNavigate(item)
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
      {isReadOnly && (
        <div className="bg-muted border border-border rounded-lg p-3 mb-4">
          <p className="text-sm text-muted-foreground">
            {language === 'nl' 
              ? '📖 Team Kanban Board - Alleen-lezen modus. Je bekijkt het board van de team owner.'
              : '📖 Team Kanban Board - Read-only mode. You are viewing the team owner\'s board.'}
          </p>
        </div>
      )}
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COLUMNS.map((column) => {
              // Filter items by columnName filter - if filter is set, only show items in that column
              let items = itemsByColumn[column.id]
              if (filters.columnName && filters.columnName !== column.id) {
                // If a column filter is set and this is not the selected column, show empty array
                items = []
              }
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
                  targetWheelId={targetWheelId}
                  readOnly={isReadOnly}
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
                    {activeItem.notes && activeItem.notes.trim() && (
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {activeItem.notes.trim().length > 80
                          ? `${activeItem.notes.trim().slice(0, 80)}...`
                          : activeItem.notes.trim()}
                      </div>
                    )}
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
