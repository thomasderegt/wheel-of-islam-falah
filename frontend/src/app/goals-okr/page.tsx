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
        <main className="flex-1 flex flex-col p-4 pb-24">
          <Container className="max-w-6xl mx-auto">
            <div className="space-y-4">
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
