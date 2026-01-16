'use client'

/**
 * SectionItem Component
 * 
 * Expandable section card met:
 * - Section titel (van published version)
 * - "Go To Section" button
 * - "Start Learning Flow" button (als template beschikbaar)
 * - Read/Lock status indicators
 */

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { SectionDTO } from '@/shared/api/types'
import { useSectionPublishedVersion } from '../hooks/useSectionPublishedVersion'
import { useTemplatesForSection, useStartEnrollment } from '@/features/learning'
import { useAuth } from '@/features/auth'

interface SectionItemProps {
  readonly section: SectionDTO
  readonly chapterId: number
  readonly isRead?: boolean
  readonly isLocked?: boolean
  readonly isExpanded: boolean
  readonly onToggle: () => void
  readonly language?: 'nl' | 'en'
}

export function SectionItem({
  section,
  chapterId,
  isRead = false,
  isLocked = false,
  isExpanded,
  onToggle,
  language = 'en'
}: SectionItemProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { data: sectionVersion, isLoading: isLoadingVersion } = useSectionPublishedVersion(section.id)
  const { data: templates, isLoading: isLoadingTemplates } = useTemplatesForSection(section.id)
  const { mutate: startEnrollment, isPending: isStartingEnrollment } = useStartEnrollment()

  const hasTemplate = templates && templates.length > 0
  const templateId = templates && templates.length > 0 ? templates[0].id : null

  const handleStartLearningFlow = () => {
    if (!templateId || !section.id || !user?.id) {
      if (!user?.id) {
        alert('You must be logged in to start a learning flow')
        router.push('/login')
      }
      return
    }

    startEnrollment({
      userId: user.id,
      templateId,
      sectionId: section.id,
    })
  }

  // Get section title based on language
  const getSectionTitle = (): string => {
    if (!sectionVersion) {
      return `Section ${section.orderIndex}`
    }
    if (language === 'nl') {
      return sectionVersion.titleNl || sectionVersion.titleEn || `Section ${section.orderIndex}`
    }
    return sectionVersion.titleEn || sectionVersion.titleNl || `Section ${section.orderIndex}`
  }

  const title = getSectionTitle()

  return (
    <Card className="mb-4">
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                {isLoadingVersion ? 'Loading...' : title}
              </CardTitle>
              <div className="flex items-center gap-2">
                {isRead && (
                  <span className="text-sm text-green-600">✓ Read</span>
                )}
                {isLocked && (
                  <span className="text-sm text-muted-foreground">🔒 Locked</span>
                )}
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-3">
            {/* Go To Section Button - always visible */}
            <Button
              onClick={() => router.push(`/section/${section.id}`)}
              className="w-full"
              size="sm"
              variant="outline"
            >
              Go To Section
            </Button>
            
            {/* Learning Flow Button */}
            {(() => {
              if (isLoadingTemplates) {
                return <div className="text-sm text-muted-foreground">Checking...</div>
              }
              if (hasTemplate) {
                return (
                  <Button
                    onClick={handleStartLearningFlow}
                    className="w-full"
                    size="sm"
                    disabled={isStartingEnrollment}
                  >
                    {isStartingEnrollment ? 'Starting...' : 'Start Learning Flow'}
                  </Button>
                )
              }
              return (
                <div className="text-sm text-muted-foreground">
                  No learning flow available for this section
                </div>
              )
            })()}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
