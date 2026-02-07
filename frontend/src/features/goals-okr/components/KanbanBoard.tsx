'use client'

/**
 * Progress Board Component
 * Displays progress items in 4 columns: TODO, IN_PROGRESS, IN_REVIEW, DONE
 */

import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '@/features/auth'
import { useKanbanItems, useUpdateKanbanItemPosition, useDeleteKanbanItem } from '../hooks/useKanbanItems'
import { getGoal, getObjective, getKeyResult, getInitiative } from '../api/goalsOkrApi'
import type { KanbanItemDTO, GoalDTO, ObjectiveDTO, KeyResultDTO, InitiativeDTO } from '../api/goalsOkrApi'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter, useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Trash2, GripVertical } from 'lucide-react'
import { Loading } from '@/shared/components/ui/Loading'
import { useTheme } from '@/shared/contexts/ThemeContext'
import type { KanbanFilters } from '../hooks/useKanbanFilters'

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
              sortedItems.map((item) => (
                <KanbanCard
                  key={item.id}
                  item={item}
                  title={itemTitles.get(item.itemId) || `${item.itemType} ${item.itemId}`}
                  onDelete={() => onDelete(item.id)}
                  language={language}
                />
              ))
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
  const updatePositionMutation = useUpdateKanbanItemPosition()
  const deleteMutation = useDeleteKanbanItem()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [itemTitles, setItemTitles] = useState<Map<number, string>>(new Map())
  const [itemLifeDomainIds, setItemLifeDomainIds] = useState<Map<number, number>>(new Map())

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
        const lifeDomainId = itemLifeDomainIds.get(item.itemId)
        return lifeDomainId === filters.lifeDomainId
      })
    }
    
    return filtered
  }, [kanbanItems, filters, itemLifeDomainIds])

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
      const titles = new Map<number, string>()
      const lifeDomainIds = new Map<number, number>()
      
      for (const item of kanbanItems) {
        try {
          let title = ''
          let lifeDomainId: number | undefined
          
          switch (item.itemType) {
            case 'GOAL':
              const goal = await getGoal(item.itemId)
              title = language === 'nl' ? goal.titleNl : goal.titleEn
              lifeDomainId = goal.lifeDomainId
              break
            case 'OBJECTIVE':
              const objective = await getObjective(item.itemId)
              title = language === 'nl' ? objective.titleNl : objective.titleEn
              // Get goal to find lifeDomainId
              if (objective.goalId) {
                const goal = await getGoal(objective.goalId)
                lifeDomainId = goal.lifeDomainId
              }
              break
            case 'KEY_RESULT':
              const keyResult = await getKeyResult(item.itemId)
              title = language === 'nl' ? keyResult.titleNl : keyResult.titleEn
              // Get objective -> goal to find lifeDomainId
              if (keyResult.objectiveId) {
                const objective = await getObjective(keyResult.objectiveId)
                if (objective.goalId) {
                  const goal = await getGoal(objective.goalId)
                  lifeDomainId = goal.lifeDomainId
                }
              }
              break
            case 'INITIATIVE':
              const initiative = await getInitiative(item.itemId)
              title = initiative.title
              // Get keyResult -> objective -> goal to find lifeDomainId
              if (initiative.keyResultId) {
                const keyResult = await getKeyResult(initiative.keyResultId)
                if (keyResult.objectiveId) {
                  const objective = await getObjective(keyResult.objectiveId)
                  if (objective.goalId) {
                    const goal = await getGoal(objective.goalId)
                    lifeDomainId = goal.lifeDomainId
                  }
                }
              }
              break
          }
          titles.set(item.itemId, title)
          if (lifeDomainId) {
            lifeDomainIds.set(item.itemId, lifeDomainId)
          }
        } catch (error) {
          console.error(`Failed to load data for ${item.itemType} ${item.itemId}:`, error)
          titles.set(item.itemId, `${item.itemType} ${item.itemId}`)
        }
      }
      
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
