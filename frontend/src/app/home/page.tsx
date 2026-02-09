'use client'

/**
 * Home Page Component - Success-Mode
 * 
 * Main entry point for the Success-Mode
 * Shows categories in a circular navigation
 */

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { NavCategoryCircle } from '@/shared/components/navigation/NavCategoryCircle'

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar variant="landing" />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col p-4">
          {/* NavCategoryCircle */}
          <NavCategoryCircle />
        </main>
      </div>
    </ProtectedRoute>
  )
}

