'use client'

/**
 * OKR Objective Key Results Page – redirects to objective detail
 *
 * Canonical URL for an objective is /goals-okr/objectives/[id].
 * This route redirects there so old links still work.
 */

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function OKRObjectiveKeyResultsPage() {
  const params = useParams()
  const objectiveId = params?.id ? Number(params.id) : null
  const router = useRouter()

  useEffect(() => {
    if (objectiveId) {
      router.replace(`/goals-okr/objectives/${objectiveId}`)
    }
  }, [objectiveId, router])

  return null
}
