/**
 * useInitiativeSuggestions Hook
 * React Query hook for fetching initiative suggestions by key result
 */

import { useQuery } from '@tanstack/react-query'
import { getInitiativeSuggestionsByKeyResult } from '../api/goalsOkrApi'
import type { InitiativeSuggestionDTO } from '../api/goalsOkrApi'

export function useInitiativeSuggestions(keyResultId: number | null) {
  return useQuery<InitiativeSuggestionDTO[]>({
    queryKey: ['initiativeSuggestions', keyResultId],
    queryFn: () => getInitiativeSuggestionsByKeyResult(keyResultId!),
    enabled: keyResultId !== null,
  })
}
