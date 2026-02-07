/**
 * useInitiativesByKeyResult Hook
 * React Query hook for fetching initiative templates by key result
 */

import { useQuery } from '@tanstack/react-query'
import { getInitiativesByKeyResult } from '../api/goalsOkrApi'
import type { InitiativeDTO } from '../api/goalsOkrApi'

export function useInitiativeSuggestions(keyResultId: number | null) {
  return useQuery<InitiativeDTO[]>({
    queryKey: ['initiativeTemplates', keyResultId],
    queryFn: () => getInitiativesByKeyResult(keyResultId!),
    enabled: keyResultId !== null,
  })
}
