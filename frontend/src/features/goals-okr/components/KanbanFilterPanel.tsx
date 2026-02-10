'use client'

/**
 * KanbanFilterPanel Component
 * Filter panel for filtering kanban items by type and life domain
 */

import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Label } from '@/shared/components/ui/label'
import { Input } from '@/shared/components/ui/input'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible'
import type { KanbanFilters } from '../hooks/useKanbanFilters'
import { useLifeDomains } from '../hooks/useLifeDomains'

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
  const hasActiveFilters = !!value.itemType || !!value.lifeDomainId || !!value.wheelType
  const [isOpen, setIsOpen] = useState(false)

  const handleItemTypeChange = (itemType: string) => {
    onChange({ ...value, itemType: itemType === 'ALL' ? undefined : itemType as KanbanFilters['itemType'] })
  }

  const handleLifeDomainChange = (lifeDomainId: string) => {
    onChange({ ...value, lifeDomainId: lifeDomainId === 'ALL' ? undefined : parseInt(lifeDomainId) })
  }

  const handleWheelTypeChange = (wheelType: string) => {
    onChange({ ...value, wheelType: wheelType === 'ALL' ? undefined : wheelType as 'life' | 'business' })
  }

  const getLifeDomainTitle = (domain: { titleNl: string; titleEn: string }) => {
    return language === 'nl' ? (domain.titleNl || domain.titleEn) : (domain.titleEn || domain.titleNl)
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
                  <Label htmlFor="wheel-type-filter">{language === 'nl' ? 'Type' : 'Type'}</Label>
                  <Select
                    value={value.wheelType || 'ALL'}
                    onValueChange={handleWheelTypeChange}
                  >
                    <SelectTrigger id="wheel-type-filter">
                      <SelectValue placeholder={language === 'nl' ? 'Alle Types' : 'All Types'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">{language === 'nl' ? 'Alle Types' : 'All Types'}</SelectItem>
                      <SelectItem value="life">{language === 'nl' ? 'Leven' : 'Life'}</SelectItem>
                      <SelectItem value="business">{language === 'nl' ? 'Zakelijk' : 'Business'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="life-domain-filter">Life Domain</Label>
                  <Select
                    value={value.lifeDomainId?.toString() || 'ALL'}
                    onValueChange={handleLifeDomainChange}
                  >
                    <SelectTrigger id="life-domain-filter">
                      <SelectValue placeholder="All Life Domains" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Life Domains</SelectItem>
                      {lifeDomains?.map((domain) => (
                        <SelectItem key={domain.id} value={domain.id.toString()}>
                          {getLifeDomainTitle(domain)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* WIP Limits Section */}
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-semibold mb-3">
                  {language === 'nl' ? 'WIP Limits per wheel type' : 'WIP Limits per wheel type'}
                </h4>
                {(['life', 'business'] as const).map((wheelType) => (
                  <div key={wheelType} className="mb-6">
                    <h5 className="text-xs font-medium mb-2 text-muted-foreground uppercase">
                      {wheelType === 'life' 
                        ? (language === 'nl' ? 'Wheel of Life' : 'Wheel of Life')
                        : (language === 'nl' ? 'Wheel of Business' : 'Wheel of Business')}
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {COLUMNS.map((column) => {
                        const columnId = column.id
                        const currentLimit = value.wipLimits?.[wheelType]?.[columnId]
                        return (
                          <div key={`${wheelType}-${columnId}`} className="space-y-2">
                            <Label htmlFor={`wip-limit-${wheelType}-${columnId}`}>{column.label}</Label>
                            <Input
                              id={`wip-limit-${wheelType}-${columnId}`}
                              type="number"
                              min="0"
                              placeholder={language === 'nl' ? 'Geen limit' : 'No limit'}
                              value={currentLimit?.toString() || ''}
                              onChange={(e) => handleWipLimitChange(wheelType, columnId, e.target.value)}
                              className="w-full"
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground mt-2">
                  {language === 'nl' 
                    ? 'Stel een maximum aantal items per kolom per wheel type in. Laat leeg voor geen limit.'
                    : 'Set a maximum number of items per column per wheel type. Leave empty for no limit.'}
                </p>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
