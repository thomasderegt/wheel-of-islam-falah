'use client'

/**
 * SectionViewer Component
 *
 * Toont de content van een section
 * - Published version (als beschikbaar)
 * - Paragraphs in volgorde
 * - Witregels en alinea's worden bewaard (plain text) of als HTML gerenderd
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

/** Bepaalt of de string op HTML lijkt (bevat tags). */
function looksLikeHtml(text: string): boolean {
  return /<[a-z][\s\S]*>/i.test(text)
}

/** Escaped HTML voor veilige weergave. */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replaceAll(/[&<>"']/g, (ch) => map[ch] ?? ch)
}

/**
 * Rendert content met behoud van witregels en alinea's.
 * - Als de content op HTML lijkt: render als HTML (dangerouslySetInnerHTML).
 * - Anders: plain text, \n\n = nieuwe alinea, \n = nieuwe regel.
 */
function renderContent(content: string) {
  if (!content) return null
  if (looksLikeHtml(content)) {
    return (
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }
  const paragraphs = content.split(/\n\n+/)
  return (
    <div className="prose prose-sm max-w-none space-y-3">
      {paragraphs.map((para, i) => (
        <p key={i} className="leading-relaxed">
          {para.split('\n').map((line, j) => (
            <span key={j}>
              {escapeHtml(line)}
              {j < para.split('\n').length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </div>
  )
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
            <div className="text-muted-foreground leading-relaxed">
              {renderContent(intro)}
            </div>
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
                    {renderContent(paragraphContent)}
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

