'use client'

/**
 * KanbanFilterPanel Component
 * Filter panel for filtering kanban items by type and life domain
 */

import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Label } from '@/shared/components/ui/label'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible'
import type { KanbanFilters } from '../hooks/useKanbanFilters'
import { useLifeDomains } from '../hooks/useLifeDomains'

interface KanbanFilterPanelProps {
  readonly value: KanbanFilters
  readonly onChange: (filters: KanbanFilters) => void
  readonly language?: 'nl' | 'en'
}

export function KanbanFilterPanel({ value, onChange, language = 'en' }: KanbanFilterPanelProps) {
  const { userGroup } = useTheme()
  const isWireframeTheme = !userGroup || userGroup === 'universal'
  const { data: lifeDomains } = useLifeDomains()
  const hasActiveFilters = !!value.itemType || !!value.lifeDomainId
  const [isOpen, setIsOpen] = useState(false)

  const handleItemTypeChange = (itemType: string) => {
    onChange({ ...value, itemType: itemType === 'ALL' ? undefined : itemType as KanbanFilters['itemType'] })
  }

  const handleLifeDomainChange = (lifeDomainId: string) => {
    onChange({ ...value, lifeDomainId: lifeDomainId === 'ALL' ? undefined : parseInt(lifeDomainId) })
  }

  const getLifeDomainTitle = (domain: { titleNl: string; titleEn: string }) => {
    return language === 'nl' ? (domain.titleNl || domain.titleEn) : (domain.titleEn || domain.titleNl)
  }

  const clearFilters = () => {
    onChange({})
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
              <h3 className="text-lg font-semibold">Filters</h3>
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
        
        <CollapsibleContent className="relative z-[60]">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
