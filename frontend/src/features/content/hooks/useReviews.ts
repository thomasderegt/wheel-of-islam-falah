/**
 * useReviews Hook
 * React Query hook for fetching reviews by status
 */

import { useQuery } from '@tanstack/react-query'
import { getReviewsByStatus, type ReviewDTO } from '../api/contentApi'

export function useReviews(status: 'SUBMITTED' | 'APPROVED' | 'REJECTED') {
  return useQuery<ReviewDTO[]>({
    queryKey: ['reviews', status],
    queryFn: () => getReviewsByStatus(status),
  })
}

