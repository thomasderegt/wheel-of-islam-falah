'use client'

/**
 * Success Page - Wheel of Falah
 *
 * Shows categories in a circular navigation (Wheel of Islam/Falah).
 * Content: Falah, Tazkiyyah, Fiqh.
 */

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { NavCategoryCircle } from '@/shared/components/navigation/NavCategoryCircle'
import { Switch } from '@/shared/components/ui/switch'
import { Label } from '@/shared/components/ui/label'
import { useModeContext } from '@/shared/hooks/useModeContext'
import { useFitToScreen } from '@/shared/hooks/useFitToScreen'

export default function SuccessPage() {
  const { contentContext } = useModeContext()
  const [fitToScreen, setFitToScreen] = useFitToScreen()

  const showWheelOfIslam = contentContext === 'SUCCESS'

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar variant="landing" />

        <main className="flex-1 flex flex-col p-4">
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
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
