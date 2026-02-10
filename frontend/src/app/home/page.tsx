'use client'

/**
 * Home Page Component - Success-Mode
 * 
 * Main entry point for the Success-Mode
 * Shows categories in a circular navigation (Wheel of Islam)
 */

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { NavCategoryCircle } from '@/shared/components/navigation/NavCategoryCircle'
import { useModeContext } from '@/shared/hooks/useModeContext'

export default function HomePage() {
  const { contentContext } = useModeContext()
  
  // Content Context is always SUCCESS, so always show NavCategoryCircle
  // This page is for Content (Wheel of Islam)
  const showWheelOfIslam = contentContext === 'SUCCESS'
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar variant="landing" />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col p-4">
          <Container className="max-w-6xl mx-auto">
            {showWheelOfIslam ? (
              <NavCategoryCircle />
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

