'use client'

import { usePathname } from 'next/navigation'

/**
 * Background Overlay Component
 * Adds a white overlay to dim the background image on all pages except the root
 */
export function BackgroundOverlay() {
  const pathname = usePathname()
  
  // Don't show overlay on root page
  if (pathname === '/') {
    return null
  }

  return (
    <div className="fixed inset-0 bg-white/10 -z-10" />
  )
}
