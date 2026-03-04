'use client'

/**
 * Success Page - Wheel of Falah
 *
 * Shows categories in a circular navigation (Wheel of Islam/Falah).
 * Content: Falah, Tazkiyyah, Fiqh.
 * Back/Next buttons shown when user has an active Falah cycle.
 */

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ProtectedRoute, useAuth } from '@/features/auth'
import { useFalahCycles, useExitFalahCycleFlow } from '@/features/auth/hooks/useFalahCycles'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { NavCategoryCircle } from '@/shared/components/navigation/NavCategoryCircle'
import { Switch } from '@/shared/components/ui/switch'
import { Label } from '@/shared/components/ui/label'
import { Button } from '@/shared/components/ui/button'
import { useModeContext } from '@/shared/hooks/useModeContext'
import { useFitToScreen } from '@/shared/hooks/useFitToScreen'
import { routes } from '@/shared/constants/routes'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function SuccessPage() {
  const router = useRouter()
  const { contentContext } = useModeContext()
  const [fitToScreen, setFitToScreen] = useFitToScreen()
  const { user } = useAuth()
  const { data: cycles } = useFalahCycles(user?.id ?? null)
  const exitFlow = useExitFalahCycleFlow(user?.id ?? null)

  const showWheelOfIslam = contentContext === 'SUCCESS'
  const activeCycle = cycles?.find((c) => c.active)
  const isInFlow = !!activeCycle && !activeCycle.flowExited

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar variant="landing" />

        <main className="flex-1 flex flex-col p-4 pb-24">
          <Container className="max-w-6xl mx-auto">
            {showWheelOfIslam ? (
              <div className="space-y-4">
                <NavCategoryCircle fitToScreen={fitToScreen} />
                <div className="flex items-center justify-center gap-2">
                  <Switch
                    id="fit-to-screen"
                    checked={fitToScreen}
                    onCheckedChange={setFitToScreen}
                  />
                  <Label htmlFor="fit-to-screen" className="text-sm text-muted-foreground cursor-pointer">
                    Fit to screen
                  </Label>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Wheel of Islam content is not available.
                </p>
              </div>
            )}

            {isInFlow && (
              <div className="flex justify-between items-center gap-2 mt-8 pt-6 border-t border-border">
                <Link href="/home">
                  <Button variant="outline" className="gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="text-muted-foreground"
                  onClick={() =>
                    activeCycle &&
                    exitFlow.mutate(activeCycle.id, { onSuccess: () => router.push('/home') })
                  }
                >
                  Quit
                </Button>
                <Link href={routes.assessment}>
                  <Button className="gap-2">
                    Next: Priorities
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
