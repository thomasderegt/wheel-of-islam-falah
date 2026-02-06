'use client'

/**
 * OKR User Objective Instance Page - TEMPORARILY DISABLED
 * 
 * This page is temporarily disabled during backend refactoring.
 */

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'

export default function OKRUserObjectiveInstancePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar variant="landing" />
        <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center justify-center min-h-[600px] space-y-6">
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Under Construction
                </h1>
                <p className="text-muted-foreground text-lg">
                  This page is temporarily unavailable during backend refactoring.
                </p>
              </div>
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
