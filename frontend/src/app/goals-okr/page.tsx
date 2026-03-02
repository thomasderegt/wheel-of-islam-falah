'use client'

/**
 * Goals OKR Navigator Page - Goal-Mode
 * 
 * Main entry point for the Goal-Mode
 * Shows life domains in a circular navigation
 */

import Link from 'next/link'
import { Suspense, useEffect, useMemo } from 'react'
import { ProtectedRoute, useAuth } from '@/features/auth'
import { useFalahCycles } from '@/features/auth/hooks/useFalahCycles'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { NavOKRLifeDomainCircle } from '@/features/goals-okr/components/NavOKRLifeDomainCircle'
import { useModeContext } from '@/shared/hooks/useModeContext'
import { useWheels } from '@/features/goals-okr/hooks/useWheels'
import { getWheelIdFromGoalsOkrContext } from '@/shared/utils/contextUtils'
import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/components/ui/select'
import { Switch } from '@/shared/components/ui/switch'
import { Label } from '@/shared/components/ui/label'
import { Loading } from '@/shared/components/ui/Loading'
import { useFitToScreen } from '@/shared/hooks/useFitToScreen'
import { Button } from '@/shared/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { routes } from '@/shared/constants/routes'

function GoalsOKRContent() {
  const { user } = useAuth()
  const { data: cycles } = useFalahCycles(user?.id ?? null)
  const activeCycle = cycles?.find((c) => c.active)
  const isInFlow = !!activeCycle && !activeCycle.flowExited

  const { goalsOkrContext } = useModeContext()
  const [fitToScreen, setFitToScreen] = useFitToScreen()
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
              <NavOKRLifeDomainCircle fitToScreen={fitToScreen}>
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
              <div className="flex items-center justify-center gap-2">
                <Switch
                  id="fit-to-screen-goal"
                  checked={fitToScreen}
                  onCheckedChange={setFitToScreen}
                />
                <Label htmlFor="fit-to-screen-goal" className="text-sm text-muted-foreground cursor-pointer">
                  Fit to screen
                </Label>
              </div>

              {isInFlow && (
                <div className="flex justify-between items-center pt-6 border-t border-border">
                  <Link href={routes.assessment}>
                    <Button variant="outline" className="gap-2">
                      <ChevronLeft className="h-4 w-4" />
                      Back
                    </Button>
                  </Link>
                  <Link href="/goals-okr/execute">
                    <Button className="gap-2">
                      Next: Execution
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
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
