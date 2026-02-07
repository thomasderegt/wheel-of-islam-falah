'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { BackgroundOverlay } from '@/shared/components/BackgroundOverlay'

interface ProvidersProps {
  children: ReactNode
}

/**
 * App providers wrapper
 * Combines all context providers (React Query, etc.)
 */
export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <BackgroundOverlay />
      {children}
    </QueryClientProvider>
  )
}

