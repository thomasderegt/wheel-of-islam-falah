'use client'

/**
 * OKR User Key Result Enrollment Page
 * 
 * Shows details for a user key result enrollment
 */

import { ProtectedRoute } from '@/features/auth'
import { Container } from '@/shared/components/ui/container'
import { Button } from '@/shared/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getUserKeyResultEnrollment, getKeyResult } from '@/features/goals-okr/api/goalsOkrApi'
import { Loading } from '@/shared/components/ui/Loading'

export default function OKRUserKeyResultEnrollmentPage() {
  const params = useParams()
  const enrollmentId = Number(params.id)
  const router = useRouter()
  const language = 'en' as 'nl' | 'en'

  // Get user key result enrollment to find the key result
  const { data: userEnrollment, isLoading: isLoadingEnrollment } = useQuery({
    queryKey: ['goals-okr', 'userKeyResultEnrollment', enrollmentId],
    queryFn: () => getUserKeyResultEnrollment(enrollmentId),
    enabled: !!enrollmentId,
  })

  // Get key result details
  const { data: keyResult, isLoading: isLoadingKeyResult } = useQuery({
    queryKey: ['goals-okr', 'keyResult', userEnrollment?.keyResultId],
    queryFn: () => getKeyResult(userEnrollment!.keyResultId),
    enabled: !!userEnrollment?.keyResultId,
  })

  if (isLoadingEnrollment || isLoadingKeyResult) {
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

  if (!userEnrollment || !keyResult) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-6xl mx-auto">
              <div className="text-center text-muted-foreground py-12">
                <p>Key result enrollment not found</p>
              </div>
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  const keyResultTitle = language === 'nl' ? (keyResult.titleNl || keyResult.titleEn) : (keyResult.titleEn || keyResult.titleNl)
  const keyResultDescription = language === 'nl' ? (keyResult.descriptionNl || keyResult.descriptionEn) : (keyResult.descriptionEn || keyResult.descriptionNl)

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-6xl mx-auto">
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                {keyResult.objectiveId && (
                  <button
                    onClick={() => router.push(`/goals-okr/objectives/${keyResult.objectiveId}/key-results`)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← {language === 'nl' ? 'Terug naar Key Results' : 'Back to Key Results'}
                  </button>
                )}
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">
                    {language === 'nl' ? 'Key Result' : 'Key Result'}
                  </p>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                    {keyResultTitle}
                  </h1>
                  {keyResultDescription && (
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                      {keyResultDescription}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
