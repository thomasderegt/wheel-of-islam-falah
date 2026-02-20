'use client'

/**
 * Goals OKR Navigator Page - Goal-Mode
 * 
 * Main entry point for the Goal-Mode
 * Shows life domains in a circular navigation
 */

import { Suspense, useEffect, useMemo } from 'react'
import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { NavOKRLifeDomainCircle } from '@/features/goals-okr/components/NavOKRLifeDomainCircle'
import { useModeContext } from '@/shared/hooks/useModeContext'
import { useWheels } from '@/features/goals-okr/hooks/useWheels'
import { getWheelIdFromGoalsOkrContext } from '@/shared/utils/contextUtils'
import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/components/ui/select'
import { Loading } from '@/shared/components/ui/Loading'

function GoalsOKRContent() {
  const { goalsOkrContext } = useModeContext()
  const { data: wheels } = useWheels()
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentWheelId = useMemo(() => {
    const wheelIdParam = searchParams?.get('wheelId')
    return wheelIdParam ? Number(wheelIdParam) : null
  }, [searchParams])

  useEffect(() => {
    if (!wheels || goalsOkrContext === 'ALL') return

    const wheelId = getWheelIdFromGoalsOkrContext(goalsOkrContext, wheels)
    const currentWheelIdParam = searchParams?.get('wheelId')

    if (wheelId && currentWheelIdParam !== wheelId.toString()) {
      const params = new URLSearchParams(searchParams?.toString() || '')
      params.set('wheelId', wheelId.toString())
      router.replace(`/goals-okr?${params.toString()}`)
    }
  }, [goalsOkrContext, wheels, router, searchParams])

  const handleWheelChange = (wheelId: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('wheelId', wheelId)
    router.replace(`/goals-okr?${params.toString()}`)
  }

  const availableWheels = useMemo(() => {
    if (!wheels) return []
    return wheels.filter(
      (w) =>
        w.wheelKey === 'WHEEL_OF_LIFE' ||
        w.wheelKey === 'WHEEL_OF_WORK' ||
        w.wheelKey === 'WHEEL_OF_BUSINESS'
    )
  }, [wheels])

  const currentWheel = useMemo(() => {
    if (!wheels || !currentWheelId) return null
    return wheels.find((w) => w.id === currentWheelId)
  }, [wheels, currentWheelId])

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar variant="landing" />

        <main className="flex-1 flex flex-col p-4 pb-24">
          <Container className="max-w-6xl mx-auto">
            <div className="space-y-4">
              <NavOKRLifeDomainCircle>
                {goalsOkrContext === 'ALL' && availableWheels.length > 0 && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      View Wheel:
                    </label>
                    <Select
                      value={
                        currentWheelId?.toString() ||
                        availableWheels[0]?.id.toString() ||
                        ''
                      }
                      onValueChange={handleWheelChange}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue>
                          {currentWheel
                            ? currentWheel.nameEn || currentWheel.nameNl
                            : 'Select Wheel'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {availableWheels.map((wheel) => (
                          <SelectItem
                            key={wheel.id}
                            value={wheel.id.toString()}
                          >
                            {wheel.nameEn || wheel.nameNl}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </NavOKRLifeDomainCircle>
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default function GoalsOKRNavigatorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex items-center justify-center p-8">
            <Loading />
          </main>
        </div>
      }
    >
      <GoalsOKRContent />
    </Suspense>
  )
}
