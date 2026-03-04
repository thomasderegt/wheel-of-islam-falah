'use client'

import { usePathname } from 'next/navigation'
import { useTheme } from '@/shared/contexts/ThemeContext'

/**
 * Background Overlay Component
 * Adds a white overlay to dim the background image on all pages except the root.
 * Geen overlay bij premium-theme (zwarte achtergrond).
 */
export function BackgroundOverlay() {
  const pathname = usePathname()
  const { userGroup } = useTheme()
  
  // Don't show overlay on root page
  if (pathname === '/') {
    return null
  }

  // Premium: zwarte achtergrond, overlay zou het zwart lichter maken
  if (userGroup === 'premium') {
    return null
  }

  return (
    <div className="fixed inset-0 bg-white/0 -z-10" />
  )
}
