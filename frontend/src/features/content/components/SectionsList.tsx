'use client'

/**
 * SectionsList Component
 * 
 * Toont een lijst van sections in een chapter met:
 * - SectionList wrapper met title
 * - SectionItem components (expandable)
 * - State management voor expanded sections
 */

import { useState } from 'react'
import { Loading } from '@/shared/components/ui/Loading'
import { Error } from '@/shared/components/ui/Error'
import { usePublicSectionsByChapter } from '../hooks/usePublicSectionsByChapter'
import { SectionList } from './SectionList'
import { SectionItem } from './SectionItem'

interface SectionsListProps {
  readonly chapterId: number
  readonly language?: 'nl' | 'en'
}

export function SectionsList({ chapterId, language = 'en' }: SectionsListProps) {
  const { data: sections, isLoading, error } = usePublicSectionsByChapter(chapterId)
  const [expandedSectionId, setExpandedSectionId] = useState<number | null>(null)

  const handleSectionToggle = (sectionId: number) => {
    if (expandedSectionId === sectionId) {
      setExpandedSectionId(null)
    } else {
      setExpandedSectionId(sectionId)
    }
  }

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Error message="Failed to load sections" />
  }

  if (!sections || sections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No sections available yet.</p>
      </div>
    )
  }

  return (
    <SectionList title="Sections">
      {sections.map((section) => (
        <SectionItem
          key={section.id}
          section={section}
          chapterId={chapterId}
          isRead={false} // TODO: Get from progress tracking
          isLocked={false} // TODO: Implement lock logic
          isExpanded={expandedSectionId === section.id}
          onToggle={() => handleSectionToggle(section.id)}
          language={language}
        />
      ))}
    </SectionList>
  )
}

