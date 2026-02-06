'use client'

/**
 * Progress Board Page
 * Displays user's progress board for OKR items
 */

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { KanbanBoard } from '@/features/goals-okr/components/KanbanBoard'

export default function KanbanPage() {
  // TODO: Get from language context
  const language = 'en' as 'nl' | 'en'

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

            {/* Progress Board */}
            <KanbanBoard language={language} />
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
