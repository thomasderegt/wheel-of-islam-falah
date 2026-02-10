'use client'

import { useUserPreferences } from '@/features/auth/hooks/useUserPreferences'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Context, GoalsOkrContext } from '@/shared/api/types'
import { useMemo, useEffect } from 'react'
import { useUpdateUserPreferences } from '@/features/auth/hooks/useUserPreferences'

/**
 * Hook to manage Context
 * 
 * Context Management:
 * - Content Context: always SUCCESS (always active, not switchable)
 * - Goals-OKR Context: LIFE/WORK/BUSINESS/NONE (switchable via user preferences)
 */
export function useModeContext() {
  const { user } = useAuth()
  const { data: preferences } = useUserPreferences(user?.id ?? null)
  const updatePreferences = useUpdateUserPreferences()

  // Content Context: always SUCCESS
  const contentContext: Context = 'SUCCESS'

  // Goals-OKR Context: from preferences (defaults to NONE if not set)
  const goalsOkrContext = useMemo<GoalsOkrContext>(() => {
    return preferences?.defaultGoalsOkrContext ?? 'NONE'
  }, [preferences])

  // Set Goals-OKR Context (updates user preferences)
  const setGoalsOkrContext = async (newContext: GoalsOkrContext) => {
    if (!user?.id) return
    
    try {
      await updatePreferences.mutateAsync({
        userId: user.id,
        data: {
          defaultGoalsOkrContext: newContext,
        },
      })
    } catch (error) {
      console.error('Failed to update Goals-OKR context:', error)
    }
  }

  // Available Goals-OKR contexts
  const availableGoalsOkrContexts: GoalsOkrContext[] = ['LIFE', 'BUSINESS', 'WORK', 'NONE', 'ALL']

  return {
    contentContext,  // Always SUCCESS
    goalsOkrContext, // LIFE/WORK/BUSINESS/NONE from preferences
    setGoalsOkrContext, // Function to update Goals-OKR context
    availableGoalsOkrContexts, // All available Goals-OKR contexts
  }
}
