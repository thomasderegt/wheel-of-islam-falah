'use client'

/**
 * Home Page Component - Drie Cirkels Keuzepagina
 * 
 * Protected home page met drie grote cirkels:
 * - Build Your Dunya
 * - Strengthen Your Inner World
 * - Prepare for the Ākhirah
 */

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { ThreeCircleMenu } from '@/shared/components/navigation/ThreeCircleMenu'

export default function HomePage() {
  // TODO: Get from language context
  const language = 'en' as 'nl' | 'en'
  
  const homeTitle = language === 'nl' ? 'Welkom bij Wheel of Islam' : 'Welcome to Wheel of Islam'
  const homeDescription = language === 'nl' 
    ? 'Klik op Falah om te beginnen met jouw reis naar echt succes'
    : 'Click on Falah to begin your journey to real success'

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

            {/* ThreeCircleMenu */}
            <ThreeCircleMenu />
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}

