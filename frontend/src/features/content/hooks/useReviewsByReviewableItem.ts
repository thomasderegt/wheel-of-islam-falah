/**
 * useReviewsByReviewableItem Hook
 * Fetches reviews for a content item (section, chapter, book, paragraph).
 * Use to check if a review is already in progress (SUBMITTED) before allowing submit.
 */

import { useQuery } from '@tanstack/react-query'
import { getReviewsByReviewableItem, type ReviewDTO } from '../api/contentApi'

type ReviewableType = 'BOOK' | 'CHAPTER' | 'SECTION' | 'PARAGRAPH'

export function useReviewsByReviewableItem(type: ReviewableType | null, referenceId: number | null) {
  return useQuery<ReviewDTO[]>({
    queryKey: ['reviewsByItem', type, referenceId],
    queryFn: async () => {
      if (!type || referenceId == null) return []
      return getReviewsByReviewableItem(type, referenceId)
    },
    enabled: !!type && !!referenceId,
  })
}

/** True if the item has at least one review with status SUBMITTED (review in progress). */
export function hasReviewInProgress(reviews: ReviewDTO[] | undefined): boolean {
  return (reviews ?? []).some((r) => r.status === 'SUBMITTED')
}
