'use client'

/**
 * OKR User Objective Enrollment Page
 * 
 * Shows details for a user objective enrollment
 */

import { ProtectedRoute } from '@/features/auth'
import { Container } from '@/shared/components/ui/container'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getUserObjectiveEnrollment, getKeyResultsByObjective } from '@/features/goals-okr/api/goalsOkrApi'
import { Loading } from '@/shared/components/ui/Loading'
import { AutoHierarchicalNavigation } from '@/shared/components/navigation/HierarchicalNavigation'

export default function OKRUserObjectiveEnrollmentPage() {
  const params = useParams()
  const enrollmentId = Number(params.id)
  const language = 'en' as 'nl' | 'en'

  // Get user objective enrollment to find the objective
  const { data: userEnrollment, isLoading: isLoadingEnrollment } = useQuery({
    queryKey: ['goals-okr', 'userObjectiveEnrollment', enrollmentId],
    queryFn: () => getUserObjectiveEnrollment(enrollmentId),
    enabled: !!enrollmentId,
  })

  // Get key results for this objective
  const { data: keyResults, isLoading: isLoadingKeyResults } = useQuery({
    queryKey: ['goals-okr', 'keyResults', 'objective', userEnrollment?.objectiveId],
    queryFn: () => getKeyResultsByObjective(userEnrollment!.objectiveId),
    enabled: !!userEnrollment?.objectiveId,
  })

  if (isLoadingEnrollment || isLoadingKeyResults) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center min-h-[400px]">
                <Loading />
              </div>
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (!userEnrollment) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-6xl mx-auto">
              <div className="text-center text-muted-foreground py-12">
                <p>Objective enrollment not found</p>
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
        <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-6xl mx-auto">
            <div className="space-y-8">
              {/* Hierarchical Navigation */}
              <AutoHierarchicalNavigation />

              {/* Header */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  {language === 'nl' ? 'Objective Enrollment' : 'Objective Enrollment'}
                </h1>
              </div>

              {/* Key Results */}
              {keyResults && keyResults.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">
                    {language === 'nl' ? 'Key Results' : 'Key Results'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {keyResults.map((keyResult) => (
                      <div
                        key={keyResult.id}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                          <h3 className="font-medium">
                            {language === 'nl' ? keyResult.titleNl : keyResult.titleEn}
                          </h3>
                        {keyResult.descriptionEn && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                            {language === 'nl' ? keyResult.descriptionNl : keyResult.descriptionEn}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
