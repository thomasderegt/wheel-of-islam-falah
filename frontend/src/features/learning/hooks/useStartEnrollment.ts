/**
 * useStartEnrollment Hook
 * React Query mutation for starting a new enrollment
 */

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { startEnrollment } from '../api/learningApi'
import type { StartEnrollmentRequest } from '@/shared/api/types'

export function useStartEnrollment() {
  const router = useRouter()

  return useMutation({
    mutationFn: (request: StartEnrollmentRequest) => startEnrollment(request),
    onSuccess: (enrollment) => {
      // Navigate to enrollment flow page
      router.push(`/enrollments/${enrollment.id}/flow`)
    },
  })
}
