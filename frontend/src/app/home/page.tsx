'use client'

/**
 * Home Page Component - Success-Mode
 * 
 * Main entry point for the Success-Mode
 * Shows categories in a circular navigation
 */

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { NavCategoryCircle } from '@/shared/components/navigation/NavCategoryCircle'

export default function HomePage() {
  // TODO: Get from language context
  const language = 'en' as 'nl' | 'en'
  
  const homeTitle = language === 'nl' ? 'Success-Mode' : 'Success-Mode'
  const homeDescription = language === 'nl' 
    ? 'Klik op Falah om te beginnen met jouw reis'
    : 'Click on Falah to regain your journey, discover other areas of the Falah model.'

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar variant="landing" />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-6xl mx-auto">
            {/* Home Header */}
            <div className="mb-8 space-y-4 p-4 rounded-md">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                {homeTitle}
              </h1>
              {homeDescription && (
                <p className="text-muted-foreground text-lg">{homeDescription}</p>
              )}
            </div>

            {/* NavCategoryCircle */}
            <NavCategoryCircle />
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}

