'use client'

/**
 * OKR Goal Page – goal layer removed.
 * Redirect to kanban (objectives are now the main unit).
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OKRGoalPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/goals-okr/kanban')
  }, [router])

  return null
}
