'use client'

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { getKeyResult } from '@/features/goals-okr/api/goalsOkrApi'
import { getObjective } from '@/features/goals-okr/api/goalsOkrApi'
import { Loading } from '@/shared/components/ui/Loading'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { AutoHierarchicalNavigation } from '@/shared/components/navigation/HierarchicalNavigation'

export default function OKRKeyResultPage() {
  const params = useParams()
  const keyResultId = params?.id ? Number(params.id) : null
  const router = useRouter()
  
  const { data: keyResult, isLoading } = useQuery({
    queryKey: ['goals-okr', 'keyResult', keyResultId],
    queryFn: () => getKeyResult(keyResultId!),
    enabled: keyResultId !== null,
  })

  const objectiveId = keyResult?.objectiveId

  const { data: objective } = useQuery({
    queryKey: ['goals-okr', 'objective', objectiveId],
    queryFn: () => getObjective(objectiveId!),
    enabled: !!objectiveId,
  })

  if (isLoading || !keyResultId) {
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

  if (!keyResult) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-6xl mx-auto">
              <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
                <h1 className="text-2xl font-bold">Key result niet gevonden</h1>
                {objectiveId && (
                  <button
                    onClick={() => router.push(`/goals-okr/objectives/${objectiveId}/key-results`)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Terug naar Objective
                  </button>
                )}
              </div>
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  const title = keyResult.titleEn || keyResult.titleNl
  const description = keyResult.descriptionEn || keyResult.descriptionNl

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar variant="landing" />
        <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-6xl mx-auto">
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                {objectiveId && (
                  <button
                    onClick={() => router.push(`/goals-okr/objectives/${objectiveId}/key-results`)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Terug naar Objective
                  </button>
                )}
                <div className="text-center space-y-2">
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                    {title}
                  </h1>
                  {description && (
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                      {description}
                    </p>
                  )}
                </div>
              </div>

              {/* Hierarchical Navigation */}
              <AutoHierarchicalNavigation />

              {/* Key Result Details */}
              <div className="space-y-6">
                <div className="p-6 bg-muted rounded-lg">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-sm font-medium text-muted-foreground mb-1">
                        Doelstelling
                      </h2>
                      <p className="text-lg font-semibold">
                        {keyResult.targetValue} {keyResult.unit}
                      </p>
                    </div>
                    {description && (
                      <div>
                        <h2 className="text-sm font-medium text-muted-foreground mb-1">
                          Beschrijving
                        </h2>
                        <p className="text-foreground">
                          {description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
