/**
 * Admin Layout
 * Wraps all admin pages with the Navbar component
 */

'use client'

import Navbar from '@/shared/components/navigation/Navbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar variant="landing" />
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}

