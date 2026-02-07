'use client'

/**
 * OKR Goal Page - Redirect to objectives
 * 
 * Redirects to the objectives page for this goal
 */

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function OKRGoalPage() {
  const params = useParams()
  const router = useRouter()
  const goalId = params?.id ? Number(params.id) : null

  useEffect(() => {
    if (goalId) {
      router.replace(`/goals-okr/goals/${goalId}/objectives`)
    }
  }, [goalId, router])

  return null
}
