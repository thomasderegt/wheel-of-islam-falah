'use client'

/**
 * OKR Objective Page - Redirect to key results
 * 
 * Redirects to the key results page for this objective
 */

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function OKRObjectivePage() {
  const params = useParams()
  const router = useRouter()
  const objectiveId = params?.id ? Number(params.id) : null

  useEffect(() => {
    if (objectiveId) {
      router.replace(`/goals-okr/objectives/${objectiveId}/key-results`)
    }
  }, [objectiveId, router])

  return null
}
