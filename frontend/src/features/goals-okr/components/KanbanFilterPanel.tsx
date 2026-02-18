'use client'

/**
 * KanbanFilterPanel Component
 * Filter panel for filtering kanban items by type and life domain
 */

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Label } from '@/shared/components/ui/label'
import { Input } from '@/shared/components/ui/input'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible'
import { ToggleGroup, ToggleGroupItem } from '@/shared/components/ui/toggle-group'
import type { KanbanFilters, KanbanViewMode } from '../hooks/useKanbanFilters'
import { useLifeDomains } from '../hooks/useLifeDomains'
import { useWheels } from '../hooks/useWheels'
import { useModeContext } from '@/shared/hooks/useModeContext'
import { getWheelIdFromGoalsOkrContext, goalsOkrContextToWheelType } from '@/shared/utils/contextUtils'

const COLUMNS: Array<{ id: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'; label: string }> = [
  { id: 'TODO', label: 'To Do' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'IN_REVIEW', label: 'In Review' },
  { id: 'DONE', label: 'Done' },
]

interface KanbanFilterPanelProps {
  readonly value: KanbanFilters
  readonly onChange: (filters: KanbanFilters) => void
  readonly language?: 'nl' | 'en'
}

export function KanbanFilterPanel({ value, onChange, language = 'en' }: KanbanFilterPanelProps) {
  const { userGroup } = useTheme()
  const isWireframeTheme = !userGroup || userGroup === 'universal'
  const { data: lifeDomains } = useLifeDomains()
  const { data: wheels } = useWheels()
  const { goalsOkrContext } = useModeContext()
  const hasActiveFilters = !!value.itemType || !!value.lifeDomainId || !!value.columnName
  const [isOpen, setIsOpen] = useState(false)

  // Get target wheelId from goalsOkrContext
  const targetWheelId = useMemo(() => {
    if (goalsOkrContext === 'NONE' || goalsOkrContext === 'ALL') return null
    return getWheelIdFromGoalsOkrContext(goalsOkrContext, wheels)
  }, [goalsOkrContext, wheels])

  // Filter life domains by target wheelId (based on goalsOkrContext)
  // If ALL, show all life domains (no filtering)
  const filteredLifeDomains = useMemo(() => {
    if (!lifeDomains) return []
    if (goalsOkrContext === 'ALL') return lifeDomains // Show all domains for ALL
    if (!targetWheelId) return []
    return lifeDomains.filter(domain => domain.wheelId === targetWheelId)
  }, [lifeDomains, targetWheelId, goalsOkrContext])

  // Reset lifeDomainId filter if it's not in the filtered domains
  useEffect(() => {
    if (value.lifeDomainId && filteredLifeDomains.length > 0) {
      const isValid = filteredLifeDomains.some(domain => domain.id === value.lifeDomainId)
      if (!isValid) {
        // Clear the filter if the selected domain is not in the filtered list
        onChange({ ...value, lifeDomainId: undefined })
      }
    }
  }, [filteredLifeDomains, value, onChange])

  const handleItemTypeChange = (itemType: string) => {
    onChange({ ...value, itemType: itemType === 'ALL' ? undefined : itemType as KanbanFilters['itemType'] })
  }

  const handleLifeDomainChange = (lifeDomainId: string) => {
    onChange({ ...value, lifeDomainId: lifeDomainId === 'ALL' ? undefined : parseInt(lifeDomainId) })
  }

  const handleColumnNameChange = (columnName: string) => {
    onChange({ ...value, columnName: columnName === 'ALL' ? undefined : columnName as KanbanFilters['columnName'] })
  }

  const handleViewModeChange = (viewMode: string) => {
    if (viewMode === 'all' || viewMode === 'okrs' || viewMode === 'initiatives') {
      onChange({
        ...value,
        viewMode: viewMode as KanbanViewMode,
      })
    }
  }

  const getLifeDomainTitle = (domain: { titleNl: string; titleEn: string }) => {
    return language === 'nl' ? (domain.titleNl || domain.titleEn) : (domain.titleEn || domain.titleNl)
  }

  // Get wheel type for WIP limits based on goalsOkrContext
  const wipLimitWheelType = useMemo(() => {
    return goalsOkrContextToWheelType(goalsOkrContext)
  }, [goalsOkrContext])

  // Get wheel name for display
  const getWheelName = (wheelType: 'life' | 'business' | null): string => {
    if (!wheelType) return ''
    switch (wheelType) {
      case 'life':
        return language === 'nl' ? 'Wheel of Life' : 'Wheel of Life'
      case 'business':
        return language === 'nl' ? 'Wheel of Business' : 'Wheel of Business'
      default:
        return ''
    }
  }

  const clearFilters = () => {
    onChange({ wipLimits: value.wipLimits }) // Preserve WIP limits when clearing filters
  }

  const handleWipLimitChange = (wheelType: 'life' | 'business', column: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE', limit: string) => {
    const numLimit = limit === '' ? undefined : parseInt(limit)
    if (numLimit !== undefined && (isNaN(numLimit) || numLimit < 0)) return
    
    const newWipLimits = {
      ...value.wipLimits,
      [wheelType]: {
        ...value.wipLimits?.[wheelType],
        [column]: numLimit
      }
    }
    
    // Remove undefined values from wheel type
    if (newWipLimits[wheelType]) {
      Object.keys(newWipLimits[wheelType]!).forEach(key => {
        if (newWipLimits[wheelType]![key as keyof typeof newWipLimits[typeof wheelType]] === undefined) {
          delete newWipLimits[wheelType]![key as keyof typeof newWipLimits[typeof wheelType]]
        }
      })
      
      // Remove wheel type if it has no limits
      if (Object.keys(newWipLimits[wheelType]!).length === 0) {
        delete newWipLimits[wheelType]
      }
    }
    
    // Remove wipLimits entirely if both wheel types are empty
    if (Object.keys(newWipLimits).length === 0) {
      onChange({
        ...value,
        wipLimits: undefined
      })
    } else {
      onChange({
        ...value,
        wipLimits: newWipLimits
      })
    }
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className={`
        rounded-lg border
        ${isWireframeTheme 
          ? 'bg-muted border-border' 
          : 'bg-primary/30 border-primary/40'}
      `}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-2">
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
              <h3 className="text-lg font-semibold">
                {language === 'nl' ? 'Filter en board settings' : 'Filter and board settings'}
              </h3>
              {hasActiveFilters && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
            {hasActiveFilters && !isOpen && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation()
                  clearFilters()
                }} 
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="relative overflow-visible">
          <div className="px-4 pb-4 space-y-4">
            <div className="flex items-center justify-between">
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item-type-filter">Item Type</Label>
                  <Select
                    value={value.itemType || 'ALL'}
                    onValueChange={handleItemTypeChange}
                  >
                    <SelectTrigger id="item-type-filter">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Types</SelectItem>
                      <SelectItem value="GOAL">Goal</SelectItem>
                      <SelectItem value="OBJECTIVE">Objective</SelectItem>
                      <SelectItem value="KEY_RESULT">Key Result</SelectItem>
                      <SelectItem value="INITIATIVE">Initiative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="life-domain-filter">Life Domain</Label>
                  <Select
                    value={value.lifeDomainId?.toString() || 'ALL'}
                    onValueChange={handleLifeDomainChange}
                  >
                    <SelectTrigger id="life-domain-filter" disabled={filteredLifeDomains.length === 0}>
                      <SelectValue placeholder="All Life Domains" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Life Domains</SelectItem>
                      {filteredLifeDomains.map((domain) => (
                        <SelectItem key={domain.id} value={domain.id.toString()}>
                          {getLifeDomainTitle(domain)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="column-filter">Column</Label>
                  <Select
                    value={value.columnName || 'ALL'}
                    onValueChange={handleColumnNameChange}
                  >
                    <SelectTrigger id="column-filter">
                      <SelectValue placeholder="All Columns" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Columns</SelectItem>
                      <SelectItem value="TODO">To Do</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="IN_REVIEW">In Review</SelectItem>
                      <SelectItem value="DONE">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* WIP Limits Section - Only show for active Goals-OKR Context */}
              {wipLimitWheelType && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-semibold mb-3">
                    {language === 'nl' ? 'WIP Limits' : 'WIP Limits'}
                  </h4>
                  <div className="mb-6">
                    <h5 className="text-xs font-medium mb-2 text-muted-foreground uppercase">
                      {getWheelName(wipLimitWheelType)}
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {COLUMNS.map((column) => {
                        const columnId = column.id
                        const currentLimit = value.wipLimits?.[wipLimitWheelType]?.[columnId]
                        return (
                          <div key={`${wipLimitWheelType}-${columnId}`} className="space-y-2">
                            <Label htmlFor={`wip-limit-${wipLimitWheelType}-${columnId}`}>{column.label}</Label>
                            <Input
                              id={`wip-limit-${wipLimitWheelType}-${columnId}`}
                              type="number"
                              min="0"
                              placeholder={language === 'nl' ? 'Geen limit' : 'No limit'}
                              value={currentLimit?.toString() || ''}
                              onChange={(e) => handleWipLimitChange(wipLimitWheelType, columnId, e.target.value)}
                              className="w-full"
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {language === 'nl' 
                      ? 'Stel een maximum aantal items per kolom in. Laat leeg voor geen limit.'
                      : 'Set a maximum number of items per column. Leave empty for no limit.'}
                  </p>
                </div>
              )}

              {/* View Mode: All / OKRs / Initiatives */}
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-semibold mb-3">
                  {language === 'nl' ? 'View Mode' : 'View Mode'}
                </h4>
                <ToggleGroup
                  type="single"
                  value={value.viewMode ?? 'all'}
                  onValueChange={handleViewModeChange}
                  className="bg-muted rounded-full p-1 flex flex-wrap"
                >
                  <ToggleGroupItem
                    value="all"
                    aria-label={language === 'nl' ? 'Alles' : 'All'}
                    className="rounded-full px-4 py-1.5"
                  >
                    {language === 'nl' ? 'Alles' : 'All'}
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="okrs"
                    aria-label={language === 'nl' ? 'OKRs' : 'OKRs'}
                    className="rounded-full px-4 py-1.5"
                  >
                    {language === 'nl' ? 'OKRs' : 'OKRs'}
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="initiatives"
                    aria-label={language === 'nl' ? 'Initiatives' : 'Initiatives'}
                    className="rounded-full px-4 py-1.5"
                  >
                    {language === 'nl' ? 'Initiatives' : 'Initiatives'}
                  </ToggleGroupItem>
                </ToggleGroup>
                <p className="text-xs text-muted-foreground mt-2">
                  {language === 'nl'
                    ? 'Alles: OKRs en initiatives. OKRs: alleen doelen, objectieven en kernresultaten. Initiatives: alleen initiatieven.'
                    : 'All: OKRs and initiatives. OKRs: goals, objectives and key results only. Initiatives: initiatives only.'}
                </p>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
