'use client'

/**
 * User goal instance – goal layer removed.
 * Redirect to kanban.
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function UserGoalInstanceRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/goals-okr/kanban')
  }, [router])

  return null
}
