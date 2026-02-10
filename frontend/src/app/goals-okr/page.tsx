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
import { useModeContext } from '@/shared/hooks/useModeContext'
import { useWheels } from '@/features/goals-okr/hooks/useWheels'
import { getWheelIdFromGoalsOkrContext } from '@/shared/utils/contextUtils'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function GoalsOKRNavigatorPage() {
  const { goalsOkrContext } = useModeContext()
  const { data: wheels } = useWheels()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Sync Goals-OKR context with wheelId in URL
  useEffect(() => {
    if (!wheels) return

    const wheelId = getWheelIdFromGoalsOkrContext(goalsOkrContext, wheels)
    const currentWheelId = searchParams?.get('wheelId')

    // Only update if context changed and wheelId doesn't match
    if (wheelId && currentWheelId !== wheelId.toString()) {
      const params = new URLSearchParams(searchParams?.toString() || '')
      params.set('wheelId', wheelId.toString())
      router.replace(`/goals-okr?${params.toString()}`)
    }
  }, [goalsOkrContext, wheels, router, searchParams])

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
