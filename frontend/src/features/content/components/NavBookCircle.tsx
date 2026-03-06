'use client'

/**
 * NavBookCircle Component
 * 
 * Circular navigation voor chapters in een book
 * - Outer ring: aantal segmenten = aantal chapters (position 1-10)
 * - Center: chapter met position 0
 * - Geen placeholders - ring past zich aan op werkelijk aantal chapters
 * - Rotatie animaties
 * - Click handlers voor navigatie
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui/button'
import { useChaptersByBook } from '../hooks/useChaptersByBook'
import { usePublicChaptersByBook } from '../hooks/usePublicChaptersByBook'
import { useBookCurrentVersion } from '../hooks/useBookCurrentVersion'
import { getChapterCurrentVersion } from '../api/contentApi'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { getGradientStopsForSegment } from '@/shared/utils/roygbivGradient'

interface Chapter {
  id: number
  position: number
  titleEn?: string | null
  titleNl?: string | null
  descriptionEn?: string | null
  descriptionNl?: string | null
}

interface NavBookCircleProps {
  readonly bookId: number
  readonly language?: 'nl' | 'en'
  readonly fitToScreen?: boolean
  /** When true, only show PUBLISHED chapters (for public pages). Default: false (admin: all chapters) */
  readonly publishedOnly?: boolean
}

const cn = (...classes: (string | undefined | null | false)[]) => 
  classes.filter(Boolean).join(' ')

const round = (num: number, decimals = 10) =>
  Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)

/** Breekt tekst in regels zodat die binnen de middelste cirkel (r=70) passen. */
function wrapCenterText(text: string, maxCharsPerLine = 12): string[] {
  const trimmed = text.trim()
  if (!trimmed) return []
  const words = trimmed.split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length <= maxCharsPerLine) {
      current = next
    } else {
      if (current) lines.push(current)
      current = word.length <= maxCharsPerLine ? word : word.substring(0, maxCharsPerLine)
    }
  }
  if (current) lines.push(current)
  return lines
}

/** Arc path voor textPath: tekst volgt de boog van het segment (zoals NavCategoryCircle). */
function describeTextArc(startAngle: number, sweepAngle: number, radius: number, reverse = false): string {
  const startRad = (startAngle * Math.PI) / 180
  const endRad = ((startAngle + sweepAngle) * Math.PI) / 180
  const x1 = round(200 + radius * Math.cos(startRad))
  const y1 = round(200 + radius * Math.sin(startRad))
  const x2 = round(200 + radius * Math.cos(endRad))
  const y2 = round(200 + radius * Math.sin(endRad))
  const largeArc = sweepAngle > 180 ? 1 : 0
  const sweepFlag = reverse ? 0 : 1
  return reverse
    ? `M ${x2} ${y2} A ${radius} ${radius} 0 ${largeArc} ${sweepFlag} ${x1} ${y1}`
    : `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} ${sweepFlag} ${x2} ${y2}`
}

export function NavBookCircle({ bookId, language = 'en', fitToScreen = false, publishedOnly = false }: NavBookCircleProps) {
  const router = useRouter()
  const allChapters = useChaptersByBook(bookId)
  const publicChapters = usePublicChaptersByBook(bookId)
  const { data: chaptersData, isLoading } = publishedOnly ? publicChapters : allChapters
  const { data: bookVersion } = useBookCurrentVersion(bookId)
  const { userGroup } = useTheme()
  const isWireframeTheme = !userGroup || userGroup === 'universal'
  
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [centerChapter, setCenterChapter] = useState<Chapter | null>(null)
  const [ringRotation, setRingRotation] = useState(0)
  const [centerExpanded, setCenterExpanded] = useState(false)
  const [isDraggingWheel, setIsDraggingWheel] = useState(false)

  const wheelWrapperRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    startAngle: number
    startRotation: number
  } | null>(null)
  const userJustDraggedRef = useRef(false)

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

  // Dynamic angle per chapter based on actual count
  const anglePerChapter = chapters.length > 0 ? 360 / chapters.length : 0

  // Drag-to-rotate: angle from pointer position relative to wheel center
  const getAngleFromPointer = useCallback((clientX: number, clientY: number): number => {
    const el = wheelWrapperRef.current
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    const scale = Math.min(rect.width / 320, rect.height / 320)
    const svgX = 200 + (clientX - rect.left - rect.width / 2) / scale
    const svgY = 200 + (clientY - rect.top - rect.height / 2) / scale
    return (Math.atan2(svgY - 200, svgX - 200) * 180) / Math.PI
  }, [])

  const normalizeAngleDelta = (delta: number): number => {
    let d = delta
    while (d > 180) d -= 360
    while (d < -180) d += 360
    return d
  }

  const DRAG_THRESHOLD_PX = 10

  const handleWheelPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (chapters.length === 0) return
      const el = wheelWrapperRef.current
      if (!el) return
      const angle = getAngleFromPointer(e.clientX, e.clientY)
      dragRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startAngle: angle,
        startRotation: ringRotation,
      }
    },
    [chapters.length, ringRotation, getAngleFromPointer]
  )

  const handleWheelPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return
      const { pointerId, startX, startY, startAngle, startRotation } = dragRef.current
      const distance = Math.hypot(e.clientX - startX, e.clientY - startY)
      if (!isDraggingWheel && distance < DRAG_THRESHOLD_PX) return
      if (!isDraggingWheel) {
        setIsDraggingWheel(true)
        wheelWrapperRef.current?.setPointerCapture(pointerId)
      }
      const currentAngle = getAngleFromPointer(e.clientX, e.clientY)
      const delta = normalizeAngleDelta(currentAngle - startAngle)
      setRingRotation(startRotation + delta)
    },
    [isDraggingWheel, getAngleFromPointer]
  )

  const handleWheelPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (dragRef.current && isDraggingWheel) {
        userJustDraggedRef.current = true
        setTimeout(() => {
          userJustDraggedRef.current = false
        }, 150)
      }
      dragRef.current = null
      setIsDraggingWheel(false)
      try {
        wheelWrapperRef.current?.releasePointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
    },
    [isDraggingWheel]
  )

  const handleCenterClick = async () => {
    if (userJustDraggedRef.current) return
    if (centerChapter) {
      router.push(`/chapter/${centerChapter.id}/overview`)
    }
  }

  const handleChapterClick = async (chapterId: number) => {
    if (userJustDraggedRef.current) return
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

      // Find circular chapters (position 1-10) - outer ring based on actual chapters
      const circularChaptersData = chaptersData
        .filter(ch => ch.position >= 1 && ch.position <= 10)
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

      // Show only actual chapters - no placeholders; ring size = number of chapters
      setChapters(circularChapters)
      
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
      <div
        ref={wheelWrapperRef}
        className="relative w-full aspect-square touch-none"
        style={fitToScreen ? { maxWidth: 'min(100%, min(calc(100vh - 12rem), 72rem))', margin: '0 auto' } : undefined}
        onPointerDown={handleWheelPointerDown}
        onPointerMove={handleWheelPointerMove}
        onPointerUp={handleWheelPointerUp}
        onPointerCancel={handleWheelPointerUp}
      >
        {/* SVG Circular Menu */}
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="40 40 320 320"
          preserveAspectRatio="xMidYMid meet"
          style={{ transform: 'rotate(-90deg)' }}
        >
          <defs>
            {/* Center gradient (like NavCategoryCircle falah) */}
            <radialGradient id="book-circle-center-gradient" cx="50%" cy="50%">
              {isWireframeTheme ? (
                <>
                  <stop offset="0%" stopColor="var(--nav-category-circle-falah-start)" />
                  <stop offset="100%" stopColor="var(--nav-category-circle-falah-end)" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="var(--nav-category-circle-falah-start)" />
                  <stop offset="50%" stopColor="var(--nav-category-circle-falah-mid)" />
                  <stop offset="100%" stopColor="var(--nav-category-circle-falah-end)" />
                </>
              )}
            </radialGradient>
            {/* ROYGBIV gradient per chapter segment (like NavCategoryCircle) */}
            {!isWireframeTheme &&
              chapters.map((chapter, index) => {
                const startAngle = index * anglePerChapter
                let endAngle = (index + 1) * anglePerChapter
                // For single chapter (360°), gradient would have zero length; use 180° so it's visible
                if (chapters.length === 1) endAngle = 180
                const midRadius = 127.5
                const startRad = (startAngle * Math.PI) / 180
                const endRad = (endAngle * Math.PI) / 180
                const x1 = round(200 + midRadius * Math.cos(startRad))
                const y1 = round(200 + midRadius * Math.sin(startRad))
                const x2 = round(200 + midRadius * Math.cos(endRad))
                const y2 = round(200 + midRadius * Math.sin(endRad))
                const stops = getGradientStopsForSegment(index, Math.max(chapters.length, 2))
                return (
                  <linearGradient
                    key={`roygbiv-${chapter.id}`}
                    id={`book-chapter-roygbiv-${chapter.id}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    gradientUnits="userSpaceOnUse"
                  >
                    {stops.map((s) => (
                      <stop key={s.offset} offset={s.offset} stopColor={s.color} />
                    ))}
                  </linearGradient>
                )
              })}
          </defs>
          {/* Chapters - Rotating Ring: langzame draai + drag */}
          <g className="book-wheel-slow-rotate">
          <g 
            style={{ 
              transform: `rotate(${ringRotation}deg)`,
              transformOrigin: '200px 200px'
            }}
          >
          {chapters.map((chapter, index) => {
            const startAngle = index * anglePerChapter
            const endAngle = (index + 1) * anglePerChapter
            const sweep = endAngle - startAngle

            // One chapter = full 360° ring: SVG arc with start===end is undefined, so draw full donut explicitly
            const pathData =
              sweep >= 360
                ? [
                    `M ${round(200 + 160)} ${round(200)}`,
                    `A 160 160 0 0 1 ${round(200 - 160)} ${round(200)}`,
                    `A 160 160 0 0 1 ${round(200 + 160)} ${round(200)}`,
                    `L ${round(200 + 95)} ${round(200)}`,
                    `A 95 95 0 0 0 ${round(200 - 95)} ${round(200)}`,
                    `A 95 95 0 0 0 ${round(200 + 95)} ${round(200)}`,
                    'Z',
                  ].join(' ')
                : (() => {
                    const largeArcFlag = sweep <= 180 ? 0 : 1
                    const startX = round(200 + 160 * Math.cos((startAngle * Math.PI) / 180))
                    const startY = round(200 + 160 * Math.sin((startAngle * Math.PI) / 180))
                    const endX = round(200 + 160 * Math.cos((endAngle * Math.PI) / 180))
                    const endY = round(200 + 160 * Math.sin((endAngle * Math.PI) / 180))
                    const innerStartX = round(200 + 95 * Math.cos((startAngle * Math.PI) / 180))
                    const innerStartY = round(200 + 95 * Math.sin((startAngle * Math.PI) / 180))
                    const innerEndX = round(200 + 95 * Math.cos((endAngle * Math.PI) / 180))
                    const innerEndY = round(200 + 95 * Math.sin((endAngle * Math.PI) / 180))
                    return [
                      `M ${startX} ${startY}`,
                      `A 160 160 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                      `L ${innerEndX} ${innerEndY}`,
                      `A 95 95 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`,
                      'Z',
                    ].join(' ')
                  })()

            const isPlaceholder = !chapter.titleEn && !chapter.titleNl

            return (
              <g key={chapter.id || `placeholder-${index}`}>
                <path
                  d={pathData}
                  className={cn(
                    "opacity-100",
                    isPlaceholder ? "cursor-default" : "cursor-pointer"
                  )}
                  style={{ 
                    fill: isWireframeTheme ? 'transparent' : `url(#book-chapter-roygbiv-${chapter.id})`,
                    stroke: 'white',
                    strokeWidth: 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isPlaceholder) {
                      e.currentTarget.style.fill = 'var(--nav-category-circle-sector-hover)'
                      e.currentTarget.style.stroke = 'white'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isPlaceholder) {
                      e.currentTarget.style.fill = isWireframeTheme ? 'transparent' : `url(#book-chapter-roygbiv-${chapter.id})`
                      e.currentTarget.style.stroke = 'white'
                    }
                  }}
                  onClick={() => {
                    if (!isPlaceholder && chapter.id > 0) {
                      handleChapterClick(chapter.id)
                    }
                  }}
                />
                {/* Curved text along segment arc (like NavCategoryCircle) */}
                {!isPlaceholder && (() => {
                  const textRadius = 127.5
                  const sweepForPath = sweep >= 360 ? 360 : sweep
                  const pathId = `book-text-path-${bookId}-${chapter.id}`
                  const rawTitle = getChapterTitle(chapter)
                  const fullTitle = (translateChapterTitle(rawTitle) || rawTitle || `Chapter ${chapter.position}`).replace(/\n/g, ' ').trim()
                  const maxLength = 18
                  const truncatedTitle = fullTitle.length > maxLength 
                    ? fullTitle.substring(0, maxLength - 3) + '...'
                    : fullTitle
                  return (
                    <g pointerEvents="none">
                      <path id={pathId} d={describeTextArc(startAngle, sweepForPath, textRadius)} fill="none" />
                      <text
                        className="font-medium pointer-events-none"
                        style={{
                          fill: 'var(--circular-menu-chapter-text, oklch(0.25 0 0))',
                          fontSize: 'clamp(0.6rem, 2.2vw, 0.75rem)'
                        }}
                      >
                        <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
                          {truncatedTitle}
                        </textPath>
                      </text>
                    </g>
                  )
                })()}
              </g>
            )
          })}
          </g>
          </g>
          
          {/* Outer ring border - white (match NavCategoryCircle) */}
          <circle
            cx="200"
            cy="200"
            r="160"
            className="fill-none pointer-events-none"
            style={{ stroke: 'white', strokeWidth: 1 }}
          />
          
          {/* Center circle - gradient like NavCategoryCircle */}
          <circle
            cx="200"
            cy="200"
            r="70"
            className={cn(
              centerChapter 
                ? cn(
                    "cursor-pointer",
                    centerExpanded ? "fill-circular-menu-center-fill-expanded" : "hover:fill-circular-menu-center-fill-expanded"
                  )
                : "fill-none cursor-default"
            )}
            style={{
              fill: centerChapter
                ? (isWireframeTheme ? 'transparent' : 'url(#book-circle-center-gradient)')
                : undefined,
              stroke: 'white',
              strokeWidth: isWireframeTheme ? 2 : 1.5
            }}
            onMouseEnter={(e) => {
              if (centerChapter && isWireframeTheme) {
                e.currentTarget.style.fill = 'var(--nav-category-circle-falah-hover)'
                e.currentTarget.style.stroke = 'var(--nav-category-circle-falah-stroke)'
              }
            }}
            onMouseLeave={(e) => {
              if (centerChapter && isWireframeTheme) {
                e.currentTarget.style.fill = 'transparent'
                e.currentTarget.style.stroke = 'var(--nav-category-circle-falah-stroke)'
              }
            }}
            onClick={centerChapter ? handleCenterClick : undefined}
          />
          
          {/* Center text - meerdere regels zodat binnen de cirkel past */}
          {!centerExpanded && centerChapter && (() => {
            const rawTitle =
              translateChapterTitle(getChapterTitle(centerChapter)).replace(/\n/g, ' ') ||
              (language === 'nl' ? bookVersion?.titleNl : bookVersion?.titleEn) ||
              (language === 'nl' ? bookVersion?.titleEn : bookVersion?.titleNl) ||
              'Add title'
            const lines = wrapCenterText(rawTitle)
            const lineHeight = 22
            const startY = 200 - ((lines.length - 1) * lineHeight) / 2
            return (
              <text
                x="200"
                className="fill-foreground font-bold pointer-events-none"
                textAnchor="middle"
                style={{ transform: 'rotate(90deg)', transformOrigin: '200px 200px', fontSize: '18px' }}
              >
                {lines.map((line, i) => (
                  <tspan key={`${i}-${line}`} x="200" y={startY + i * lineHeight}>
                    {line}
                  </tspan>
                ))}
              </text>
            )
          })()}
        </svg>

        {/* Collapsible Center Content */}
        {centerExpanded && centerChapter && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-card rounded-2xl p-6 shadow-lg border max-w-xs sm:max-w-sm pointer-events-auto">
              <div className="text-center space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  {translateChapterTitle(getChapterTitle(centerChapter)) ||
                    (language === 'nl' ? bookVersion?.titleNl : bookVersion?.titleEn) ||
                    (language === 'nl' ? bookVersion?.titleEn : bookVersion?.titleNl) ||
                    'Add title'}
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

    </div>
  )
}
