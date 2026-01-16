'use client'

/**
 * SectionList Component
 * 
 * Wrapper component voor een lijst van sections met een title
 */

import { type ReactNode } from 'react'

interface SectionListProps {
  readonly title: string
  readonly children: ReactNode
}

export function SectionList({ title, children }: SectionListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}
