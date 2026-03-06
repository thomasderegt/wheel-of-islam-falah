'use client'

/**
 * OKR Life Domain Page
 * 
 * Shows goals for a specific life domain
 * Navigation: Life Domain → Goals
 */

import Link from 'next/link'
import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { Button } from '@/shared/components/ui/button'
import { NavGoalCircle } from '@/features/goals-okr/components/NavGoalCircle'
import { useLifeDomains } from '@/features/goals-okr/hooks/useLifeDomains'
import { Loading } from '@/shared/components/ui/Loading'
import { useParams, useSearchParams } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function OKRLifeDomainPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const lifeDomainId = params?.id ? Number(params.id) : null
  const { data: lifeDomains, isLoading: isLoadingDomains } = useLifeDomains()
  const wheelId = searchParams?.get('wheelId')
  const backHref = wheelId ? `/goals-okr?wheelId=${wheelId}` : '/goals-okr'
  
  const currentDomain = lifeDomains?.find(d => d.id === lifeDomainId)

  if (isLoadingDomains || !lifeDomainId) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center min-h-[600px]">
                <Loading />
              </div>
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-6xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <Link href={backHref}>
                  <Button variant="ghost" size="icon" aria-label="Back">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  {currentDomain?.titleEn || currentDomain?.titleNl || 'Goals'}
                </h1>
              </div>
              {/* Header */}
              <div className="text-center space-y-2">
                {currentDomain?.descriptionEn && (
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    {currentDomain.descriptionEn}
                  </p>
                )}
              </div>

              {/* Goals Grid - Includes Create Custom Objective card */}
              <NavGoalCircle lifeDomainId={lifeDomainId} />
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
