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
import { useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/components/ui/select'

export default function GoalsOKRNavigatorPage() {
  const { goalsOkrContext } = useModeContext()
  const { data: wheels } = useWheels()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get current wheelId from URL
  const currentWheelId = useMemo(() => {
    const wheelIdParam = searchParams?.get('wheelId')
    return wheelIdParam ? Number(wheelIdParam) : null
  }, [searchParams])

  // Sync Goals-OKR context with wheelId in URL (only if not ALL)
  useEffect(() => {
    if (!wheels || goalsOkrContext === 'ALL') return

    const wheelId = getWheelIdFromGoalsOkrContext(goalsOkrContext, wheels)
    const currentWheelId = searchParams?.get('wheelId')

    // Only update if context changed and wheelId doesn't match
    if (wheelId && currentWheelId !== wheelId.toString()) {
      const params = new URLSearchParams(searchParams?.toString() || '')
      params.set('wheelId', wheelId.toString())
      router.replace(`/goals-okr?${params.toString()}`)
    }
  }, [goalsOkrContext, wheels, router, searchParams])

  // Handle wheel selection when ALL is active
  const handleWheelChange = (wheelId: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('wheelId', wheelId)
    router.replace(`/goals-okr?${params.toString()}`)
  }

  // Get available wheels for toggle
  const availableWheels = useMemo(() => {
    if (!wheels) return []
    return wheels.filter(w => 
      w.wheelKey === 'WHEEL_OF_LIFE' || 
      w.wheelKey === 'WHEEL_OF_WORK' || 
      w.wheelKey === 'WHEEL_OF_BUSINESS'
    )
  }, [wheels])

  // Get current wheel name for display
  const currentWheel = useMemo(() => {
    if (!wheels || !currentWheelId) return null
    return wheels.find(w => w.id === currentWheelId)
  }, [wheels, currentWheelId])

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

              {/* Wheel Toggle (only when ALL is active) */}
              {goalsOkrContext === 'ALL' && availableWheels.length > 0 && (
                <div className="flex items-center justify-center gap-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    View Wheel:
                  </label>
                  <Select
                    value={currentWheelId?.toString() || availableWheels[0]?.id.toString() || ''}
                    onValueChange={handleWheelChange}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue>
                        {currentWheel 
                          ? (currentWheel.nameEn || currentWheel.nameNl)
                          : 'Select Wheel'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {availableWheels.map((wheel) => (
                        <SelectItem key={wheel.id} value={wheel.id.toString()}>
                          {wheel.nameEn || wheel.nameNl}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Life Domains Circle */}
              <NavOKRLifeDomainCircle />
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
