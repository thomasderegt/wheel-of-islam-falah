'use client'

/**
 * CircularMenu Component
 * 
 * Circular menu voor chapters in een book
 * - 9 chapters in een ring (position 1-9)
 * - 1 center chapter (position 0)
 * - Rotatie animaties
 * - Click handlers voor navigatie
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui/button'
import { useChaptersByBook } from '../hooks/useChaptersByBook'
import { getChapterCurrentVersion } from '../api/contentApi'

interface Chapter {
  id: number
  position: number
  titleEn?: string | null
  titleNl?: string | null
  descriptionEn?: string | null
  descriptionNl?: string | null
}

interface CircularMenuProps {
  readonly bookId: number
  readonly language?: 'nl' | 'en'
}

const cn = (...classes: (string | undefined | null | false)[]) => 
  classes.filter(Boolean).join(' ')

export function CircularMenu({ bookId, language = 'en' }: CircularMenuProps) {
  const router = useRouter()
  const { data: chaptersData, isLoading } = useChaptersByBook(bookId)
  
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [centerChapter, setCenterChapter] = useState<Chapter | null>(null)
  const [ringRotation, setRingRotation] = useState(0)
  const [centerExpanded, setCenterExpanded] = useState(false)

  // Helper function to get chapter title based on language
  const getChapterTitle = (chapter: Chapter): string => {
    if (!chapter) return ''
    if (language === 'nl' && chapter.titleNl) {
      return chapter.titleNl
    }
    if (chapter.titleEn) {
      return chapter.titleEn
    }
    return ''
  }

  // Helper function to get chapter description based on language
  const getChapterDescription = (chapter: Chapter): string => {
    if (!chapter) return ''
    if (language === 'nl' && chapter.descriptionNl) {
      return chapter.descriptionNl || ''
    }
    if (chapter.descriptionEn) {
      return chapter.descriptionEn || ''
    }
    return ''
  }

  // Function to translate chapter titles with line breaks
  const translateChapterTitle = (title: string): string => {
    if (!title) return ''
    const translations: Record<string, { nl: string; en: string }> = {
      'Qalb': { nl: 'Het Hart', en: 'The Heart' },
      'The Heart': { nl: 'Het Hart', en: 'The Heart' },
      'God': { nl: 'God', en: 'God' },
      'Prophet': { nl: 'Profeet', en: 'Prophet' },
      'Prophet\'s family': { nl: 'Familie van\nde Profeet', en: 'Prophet\'s\nfamily' },
      'Prophet\'s friends': { nl: 'Vrienden van\nde Profeet', en: 'Prophet\'s\nfriends' },
      'Being muslim': { nl: 'Moslim\nzijn', en: 'Being\nmuslim' },
      'Your family': { nl: 'Jouw\nfamilie', en: 'Your\nfamily' },
      'Good character': { nl: 'Goed\nkarakter', en: 'Good\ncharacter' },
      'Good deeds': { nl: 'Goede\ndaden', en: 'Good\ndeeds' },
      'Worship': { nl: 'Aanbidding', en: 'Worship' },
      'Doubts': { nl: 'Twijfels', en: 'Doubts' },
      'Envy': { nl: 'Afgunst', en: 'Envy' },
      'Anger': { nl: 'Woede', en: 'Anger' },
      'Pride': { nl: 'Hoogmoed', en: 'Pride' },
      'Greed': { nl: 'Hebzucht', en: 'Greed' },
      'Hatred': { nl: 'Haat', en: 'Hatred' },
      'Backbiting': { nl: 'Kwaadspreken', en: 'Backbiting' },
      'Showing off': { nl: 'Pronken', en: 'Showing off' },
      'Love of this world': { nl: 'Liefde voor\ndeze wereld', en: 'Love of\nthis world' },
      'Arrogance': { nl: 'Hoogmoed', en: 'Arrogance' },
      'Suspicion': { nl: 'Verdacht', en: 'Suspicion' },
      'Remembrance': { nl: 'Herinnering', en: 'Remembrance' },
      'Regret': { nl: 'Berouw', en: 'Regret' },
      'Thankfulness': { nl: 'Dankbaarheid', en: 'Thankfulness' },
      'Patience': { nl: 'Geduld', en: 'Patience' },
      'Love': { nl: 'Liefde', en: 'Love' },
      'Trust': { nl: 'Vertrouwen', en: 'Trust' },
      'Awakening': { nl: 'Ontwaken', en: 'Awakening' },
    }
    
    return translations[title]?.[language] || title
  }

  // Manual ring rotation functions
  const rotateRingLeft = () => {
    setRingRotation(prev => prev - 40) // Rotate by one chapter (40° for 9 chapters)
  }

  const rotateRingRight = () => {
    setRingRotation(prev => prev + 40) // Rotate by one chapter (40° for 9 chapters)
  }

  const handleCenterClick = async () => {
    if (centerChapter) {
      router.push(`/chapter/${centerChapter.id}/overview`)
    }
  }

  const handleChapterClick = async (chapterId: number) => {
    router.push(`/chapter/${chapterId}/overview`)
  }

  // Process chapters data and fetch versions
  useEffect(() => {
    if (!chaptersData) return

    const loadChaptersWithVersions = async () => {
      // Find center chapter (position 0)
      const centerChapterData = chaptersData.find(ch => ch.position === 0)
      let centerChapter: Chapter | null = null
      
      if (centerChapterData) {
        // Fetch version for center chapter
        const centerVersion = await getChapterCurrentVersion(centerChapterData.id).catch(() => null)
        centerChapter = {
          id: centerChapterData.id,
          position: centerChapterData.position,
          titleEn: centerVersion?.titleEn || null,
          titleNl: centerVersion?.titleNl || null,
          descriptionEn: centerVersion?.introEn || null,
          descriptionNl: centerVersion?.introNl || null,
        }
      }
      setCenterChapter(centerChapter)

      // Find circular chapters (position 1-9)
      const circularChaptersData = chaptersData
        .filter(ch => ch.position >= 1 && ch.position <= 9)
        .sort((a, b) => a.position - b.position)

      // Fetch versions for all circular chapters in parallel
      const chapterVersionPromises = circularChaptersData.map(async (chapterData) => {
        const version = await getChapterCurrentVersion(chapterData.id).catch(() => null)
        return {
          id: chapterData.id,
          position: chapterData.position,
          titleEn: version?.titleEn || null,
          titleNl: version?.titleNl || null,
          descriptionEn: version?.introEn || null,
          descriptionNl: version?.introNl || null,
        } as Chapter
      })

      const circularChapters = await Promise.all(chapterVersionPromises)

      // Always show 9 chapters - fill with placeholders if needed
      const filledChapters: Chapter[] = []
      for (let i = 1; i <= 9; i++) {
        const chapter = circularChapters.find(c => c.position === i)
        if (chapter) {
          filledChapters.push(chapter)
        } else {
          // Create placeholder chapter with negative id
          filledChapters.push({
            id: -i,
            position: i,
            titleEn: '',
            titleNl: '',
          } as Chapter)
        }
      }

      setChapters(filledChapters)
      
      // Animate ring rotation when data changes
      setRingRotation(prev => prev + 360)
    }

    loadChaptersWithVersions()
  }, [chaptersData])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading chapters...</div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full aspect-square">
        {/* SVG Circular Menu */}
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="40 40 320 320"
          preserveAspectRatio="xMidYMid meet"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Chapters - Rotating Ring */}
          <g 
            style={{ 
              transform: `rotate(${ringRotation}deg)`,
              transformOrigin: '200px 200px',
              transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
          {chapters.map((chapter, index) => {
            const startAngle = index * 40  // 360 / 9 = 40 degrees per chapter
            const endAngle = (index + 1) * 40
            const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1
            
            const startX = 200 + 160 * Math.cos((startAngle * Math.PI) / 180)
            const startY = 200 + 160 * Math.sin((startAngle * Math.PI) / 180)
            const endX = 200 + 160 * Math.cos((endAngle * Math.PI) / 180)
            const endY = 200 + 160 * Math.sin((endAngle * Math.PI) / 180)
            
            const innerStartX = 200 + 95 * Math.cos((startAngle * Math.PI) / 180)
            const innerStartY = 200 + 95 * Math.sin((startAngle * Math.PI) / 180)
            const innerEndX = 200 + 95 * Math.cos((endAngle * Math.PI) / 180)
            const innerEndY = 200 + 95 * Math.sin((endAngle * Math.PI) / 180)

            const pathData = [
              `M ${startX} ${startY}`,
              `A 160 160 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `L ${innerEndX} ${innerEndY}`,
              `A 95 95 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`,
              'Z'
            ].join(' ')

            const isPlaceholder = chapter.id < 0 || (!chapter.titleEn && !chapter.titleNl)
            
            // Use chapter position (1-9) to determine color
            const chapterPosition = chapter.position || (index + 1)
            const colorIndex = (chapterPosition - 1) % 10

            return (
              <g key={chapter.id || `placeholder-${index}`}>
                <path
                  d={pathData}
                  className={cn(
                    "stroke-2 transition-colors opacity-50",
                    isPlaceholder ? "cursor-default" : "cursor-pointer"
                  )}
                  style={{ 
                    fill: `var(--circular-menu-chapter-${colorIndex})`,
                    stroke: `var(--circular-menu-chapter-${colorIndex})`
                  }}
                  onMouseEnter={(e) => {
                    if (!isPlaceholder) {
                      e.currentTarget.style.fill = `var(--circular-menu-chapter-hover)`
                      e.currentTarget.style.stroke = `var(--circular-menu-chapter-hover)`
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isPlaceholder) {
                      e.currentTarget.style.fill = `var(--circular-menu-chapter-${colorIndex})`
                      e.currentTarget.style.stroke = `var(--circular-menu-chapter-${colorIndex})`
                    }
                  }}
                  onClick={() => {
                    if (!isPlaceholder && chapter.id > 0) {
                      handleChapterClick(chapter.id)
                    }
                  }}
                />
                {/* Text label in chapter - only show if not placeholder */}
                {!isPlaceholder && (
                  <g
                    style={{ 
                      transform: `rotate(${startAngle + 20 + 90}deg)`,
                      transformOrigin: `${200 + 127.5 * Math.cos(((startAngle + 20) * Math.PI) / 180)}px ${200 + 127.5 * Math.sin(((startAngle + 20) * Math.PI) / 180)}px`
                    }}
                  >
                    {(() => {
                      const fullTitle = translateChapterTitle(getChapterTitle(chapter)).replace(/\n/g, ' ')
                      const maxLength = 15
                      const truncatedTitle = fullTitle.length > maxLength 
                        ? fullTitle.substring(0, maxLength - 3) + '...'
                        : fullTitle
                      
                      return (
                        <text
                          key={chapter.id}
                          x={200 + 127.5 * Math.cos(((startAngle + 20) * Math.PI) / 180)}
                          y={200 + 127.5 * Math.sin(((startAngle + 20) * Math.PI) / 180)}
                          className="fill-circular-menu-chapter-text text-[0.5rem] sm:text-[0.6rem] md:text-xs font-medium pointer-events-none"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {truncatedTitle}
                        </text>
                      )
                    })()}
                  </g>
                )}
              </g>
            )
          })}
          </g>
          
          {/* Outer circle border - blue */}
          <circle
            cx="200"
            cy="200"
            r="160"
            className="stroke-2 fill-none pointer-events-none opacity-0"
          />
          
          {/* Center circle */}
          <circle
            cx="200"
            cy="200"
            r="70"
            className={cn(
              "transition-all duration-300 stroke-circular-menu-center-stroke stroke-2",
              centerChapter 
                ? cn(
                    "cursor-pointer",
                    centerExpanded ? "fill-circular-menu-center-fill-expanded" : "fill-circular-menu-center-fill hover:fill-circular-menu-center-fill-expanded"
                  )
                : "fill-none cursor-default"
            )}
            onClick={centerChapter ? handleCenterClick : undefined}
          />
          
          {/* Center text - only show when collapsed and centerChapter exists */}
          {!centerExpanded && centerChapter && (
            <text
              x="200"
              y="200"
              className="fill-circular-menu-center-text text-[0.5rem] sm:text-[0.6rem] md:text-xs font-medium pointer-events-none"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ transform: 'rotate(90deg)', transformOrigin: '200px 200px' }}
            >
              {translateChapterTitle(getChapterTitle(centerChapter)).replace(/\n/g, ' ')}
            </text>
          )}
        </svg>

        {/* Collapsible Center Content */}
        {centerExpanded && centerChapter && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-card rounded-2xl p-6 shadow-lg border max-w-xs sm:max-w-sm pointer-events-auto">
              <div className="text-center space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  {translateChapterTitle(getChapterTitle(centerChapter))}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {getChapterDescription(centerChapter)}
                </p>
                <Button
                  onClick={() => {
                    setCenterExpanded(false)
                    handleCenterClick()
                  }}
                  className="mt-4"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ring Rotation Controls - Outside the circle */}
      <div className="flex gap-2 mt-4">
        <Button
          onClick={rotateRingLeft}
          className="rounded-full"
          size="sm"
        >
          Spin Left
        </Button>
        <Button
          onClick={rotateRingRight}
          className="rounded-full"
          size="sm"
        >
          Spin Right
        </Button>
      </div>
    </div>
  )
}

