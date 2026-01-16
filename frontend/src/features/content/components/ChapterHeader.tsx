'use client'

/**
 * ChapterHeader Component
 * 
 * Toont chapter informatie in een collapsible card:
 * - Chapter titel (titleNl/titleEn)
 * - Chapter beschrijving/content (introNl/introEn)
 * - Category nummer (optioneel)
 */

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { ChapterDTO, ChapterVersionDTO } from '@/shared/api/types'

interface ChapterHeaderProps {
  readonly chapter: ChapterDTO | null
  readonly chapterVersion: ChapterVersionDTO | null
  readonly language?: 'nl' | 'en'
}

export function ChapterHeader({ chapter, chapterVersion, language = 'en' }: ChapterHeaderProps) {
  const [isExpanded, setIsExpanded] = useState(true) // Default expanded

  if (!chapter) {
    return null
  }

  // Get chapter title based on language
  const getChapterTitle = (): string => {
    if (!chapterVersion) {
      return `Chapter ${chapter.id}`
    }
    if (language === 'nl') {
      return chapterVersion.titleNl || chapterVersion.titleEn || `Chapter ${chapter.id}`
    }
    return chapterVersion.titleEn || chapterVersion.titleNl || `Chapter ${chapter.id}`
  }

  // Get chapter description/intro based on language
  // Priority: introEn/introNl (from version) > fallback to empty
  const getChapterDescription = (): string | null => {
    if (!chapterVersion) {
      return null
    }
    if (language === 'nl') {
      return chapterVersion.introNl || chapterVersion.introEn || null
    }
    return chapterVersion.introEn || chapterVersion.introNl || null
  }

  const title = getChapterTitle()
  const description = getChapterDescription()

  return (
    <Card className="mb-6">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">{title}</CardTitle>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            {description && (
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">{description}</p>
            )}
            {!description && (
              <p className="text-muted-foreground text-sm">No description available.</p>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
