'use client'

/**
 * Goals OKR Navigator Page - Goal-Mode
 * 
 * Main entry point for the Goal-Mode
 * Shows life domains in a circular navigation
 */

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { NavOKRLifeDomainCircle } from '@/features/goals-okr/components/NavOKRLifeDomainCircle'
import { AutoHierarchicalNavigation } from '@/shared/components/navigation/HierarchicalNavigation'

export default function GoalsOKRNavigatorPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar variant="landing" />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-6xl mx-auto">
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Goal-Mode
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  Navigate through your life domains to set your goals.
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  Structure: Life Domain → Goal → Objective → Key Result
                </p>
              </div>

              {/* Hierarchical Navigation */}
              <AutoHierarchicalNavigation />

              {/* Life Domains Circle */}
              <NavOKRLifeDomainCircle />
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
