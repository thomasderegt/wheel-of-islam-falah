'use client'

/**
 * Progress Board Page
 * Displays user's progress board for OKR items
 */

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { KanbanBoard } from '@/features/goals-okr/components/KanbanBoard'
import { KanbanFilterPanel } from '@/features/goals-okr/components/KanbanFilterPanel'
import { useKanbanFilters } from '@/features/goals-okr/hooks/useKanbanFilters'
import { ToggleGroup, ToggleGroupItem } from '@/shared/components/ui/toggle-group'
import { useState } from 'react'

export default function KanbanPage() {
  // TODO: Get from language context
  const language = 'en' as 'nl' | 'en'
  const { filters, setFilters } = useKanbanFilters()
  // Initialize viewMode based on filters.showInitiatives
  const [viewMode, setViewMode] = useState<'OKRs' | 'Initiatives'>(
    filters.showInitiatives ? 'Initiatives' : 'OKRs'
  )

  const handleViewModeChange = (value: string) => {
    if (value === 'OKRs' || value === 'Initiatives') {
      setViewMode(value)
      // Update filters: if Initiatives, set showInitiatives to true, otherwise false
      if (value === 'Initiatives') {
        setFilters({ ...filters, showInitiatives: true })
      } else {
        setFilters({ ...filters, showInitiatives: false })
      }
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col relative">
        {/* Navbar */}
        <Navbar variant="landing" />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col p-8 relative z-0">
          <Container className="max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="mb-8 space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Progress Board
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Organize and track your goals, objectives, key results, and initiatives.
              </p>
            </div>

            {/* Filter Panel */}
            <div className="mb-6">
              <KanbanFilterPanel value={filters} onChange={setFilters} language={language} />
            </div>

            {/* View Mode Toggle - tussen filter en kanban board (OKRs vs Initiatives) */}
            <div className="mb-6 flex justify-end">
              <ToggleGroup
                type="single"
                value={viewMode}
                onValueChange={handleViewModeChange}
                className="bg-muted rounded-full p-1"
              >
                <ToggleGroupItem
                  value="OKRs"
                  aria-label={language === 'nl' ? 'OKRs' : 'OKRs'}
                  className="rounded-full px-4 py-1.5"
                >
                  {language === 'nl' ? 'OKRs' : 'OKRs'}
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="Initiatives"
                  aria-label={language === 'nl' ? 'Initiatives' : 'Initiatives'}
                  className="rounded-full px-4 py-1.5"
                >
                  {language === 'nl' ? 'Initiatives' : 'Initiatives'}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Progress Board */}
            <KanbanBoard language={language} filters={filters} />
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
