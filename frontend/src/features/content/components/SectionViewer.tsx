'use client'

/**
 * SectionViewer Component
 * 
 * Toont de content van een section
 * - Published version (als beschikbaar)
 * - Paragraphs in volgorde
 * - Markdown/HTML rendering
 */

import { useSectionPublishedVersion } from '../hooks/useSectionPublishedVersion'
import { usePublicParagraphsBySection } from '../hooks/usePublicParagraphsBySection'
import { Loading } from '@/shared/components/ui/Loading'
import { Error } from '@/shared/components/ui/Error'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

interface SectionViewerProps {
  readonly sectionId: number
  readonly language?: 'nl' | 'en'
}

export function SectionViewer({ sectionId, language = 'en' }: SectionViewerProps) {
  const { data: sectionVersion, isLoading: isLoadingVersion, error: versionError } = useSectionPublishedVersion(sectionId)
  const { data: paragraphs, isLoading: isLoadingParagraphs, error: paragraphsError } = usePublicParagraphsBySection(sectionId)

  if (isLoadingVersion || isLoadingParagraphs) {
    return <Loading />
  }

  if (versionError || paragraphsError) {
    return <Error message="Failed to load section content" />
  }

  if (!sectionVersion) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">This section is not yet published.</p>
      </div>
    )
  }

  const title = language === 'nl' ? sectionVersion.titleNl : sectionVersion.titleEn
  const intro = language === 'nl' ? sectionVersion.introNl : sectionVersion.introEn

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{title || 'Untitled Section'}</CardTitle>
        </CardHeader>
        {intro && (
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{intro}</p>
          </CardContent>
        )}
      </Card>

      {paragraphs && paragraphs.length > 0 && (
        <div className="space-y-4">
          {paragraphs.map((paragraph: any, index: number) => {
            const paragraphTitle = language === 'nl' ? paragraph.titleNl : paragraph.titleEn
            const paragraphContent = language === 'nl' ? paragraph.contentNl : paragraph.contentEn

            return (
              <Card key={paragraph.id || index}>
                {paragraphTitle && (
                  <CardHeader>
                    <CardTitle className="text-xl">{paragraphTitle}</CardTitle>
                  </CardHeader>
                )}
                {paragraphContent && (
                  <CardContent>
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: paragraphContent }}
                    />
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

