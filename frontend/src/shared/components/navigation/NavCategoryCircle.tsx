'use client'

/**
 * NavCategoryCircle Component
 *
 * 3-sector wheel: Aqeedah (top), Tazkiyyah (right-bottom), Fiqh (left-bottom)
 * Falah in het midden
 */

import { useId } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getCategoryByNumber } from '@/features/content/api/contentApi'
import { useContentWheelByKey } from '@/features/content/hooks/useWheels'
import { useCategoriesByWheelId } from '@/features/content/hooks/useCategoriesByWheel'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { useModeContext } from '@/shared/hooks/useModeContext'
import { getGradientStopsForSegment } from '@/shared/utils/roygbivGradient'

interface CircleOption {
  id: string
  titleEn: string
  titleNl: string
  subtitleEn: string | null
  subtitleNl: string | null
  categoryNumber: number
  colorVar: string
}

// 3-sector wheel: 120° per sector, Aqeedah top (270°), Tazkiyyah right-bottom (30°), Fiqh left-bottom (150°)
// Center r=70, sector inner=95 (gap 25, zoals NavOKRLifeDomainCircle)
const INITIAL_SVG_ROTATION = 0
const INITIAL_FALAH_TEXT_ROTATION = 0
const CENTER_RADIUS = 70
const OUTER_RADIUS = 160
const INNER_RADIUS = 95
const RING_INNER = 118
const RING_OUTER = 132
const TICK_COUNT = 12
const TICK_ANGLE = 360 / TICK_COUNT

// Sector arcs: start angle, sweep 120° each. SVG: 0°=right, 90°=bottom, 270°=top
// Aqeedah top (210°-330°), Tazkiyyah right-bottom (330°-90°), Fiqh left-bottom (90°-210°)
const SECTOR_ANGLES: { start: number; sweep: number; labelAngle: number }[] = [
  { start: 210, sweep: 120, labelAngle: 270 }, // Aqeedah (top)
  { start: 330, sweep: 120, labelAngle: 30 },  // Tazkiyyah (right-bottom)
  { start: 90, sweep: 120, labelAngle: 150 },  // Fiqh (left-bottom)
]

interface NavCategoryCircleProps {
  readonly fitToScreen?: boolean
}

export function NavCategoryCircle({ fitToScreen = false }: NavCategoryCircleProps) {
  const uniqueId = useId().replace(/:/g, '')
  const router = useRouter()
  const language = 'en' as 'nl' | 'en'
  const { userGroup } = useTheme()
  const isUniversalTheme = !userGroup || userGroup === 'universal'
  const { contentContext } = useModeContext()

  if (contentContext !== 'SUCCESS') {
    return null
  }

  const { data: wheelOfIslam, isLoading: isLoadingWheel } = useContentWheelByKey('WHEEL_OF_ISLAM')
  const { data: categories, isLoading: isLoadingCategories } = useCategoriesByWheelId(wheelOfIslam?.id ?? null)

  const category0 = categories?.find(c => c.categoryNumber === 0)
  const category1 = categories?.find(c => c.categoryNumber === 1)
  const category2 = categories?.find(c => c.categoryNumber === 2)
  const category3 = categories?.find(c => c.categoryNumber === 3)

  const { data: cat1Fallback } = useQuery({
    queryKey: ['categoryByNumber', 1],
    queryFn: () => getCategoryByNumber(1),
    enabled: !category1 && !isLoadingCategories,
  })
  const { data: cat2Fallback } = useQuery({
    queryKey: ['categoryByNumber', 2],
    queryFn: () => getCategoryByNumber(2),
    enabled: !category2 && !isLoadingCategories,
  })
  const { data: cat3Fallback } = useQuery({
    queryKey: ['categoryByNumber', 3],
    queryFn: () => getCategoryByNumber(3),
    enabled: !category3 && !isLoadingCategories,
  })
  const { data: centerFallback } = useQuery({
    queryKey: ['categoryByNumber', 0],
    queryFn: () => getCategoryByNumber(0),
    enabled: !category0 && !isLoadingCategories,
  })

  const final1 = category1 || cat1Fallback
  const final2 = category2 || cat2Fallback
  const final3 = category3 || cat3Fallback
  const finalCenter = category0 || centerFallback

  const round = (num: number, decimals: number = 10) =>
    Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)

  const isLoading = isLoadingWheel || isLoadingCategories || !final1 || !final2 || !final3 || !finalCenter
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="relative w-full aspect-square flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  const orderedCategories: CircleOption[] = [
    {
      id: `category-${final1!.id}`,
      titleEn: final1!.titleEn,
      titleNl: final1!.titleNl,
      subtitleEn: final1!.subtitleEn,
      subtitleNl: final1!.subtitleNl,
      categoryNumber: final1!.categoryNumber ?? 1,
      colorVar: '--circular-menu-chapter-4',
    },
    {
      id: `category-${final2!.id}`,
      titleEn: final2!.titleEn,
      titleNl: final2!.titleNl,
      subtitleEn: final2!.subtitleEn,
      subtitleNl: final2!.subtitleNl,
      categoryNumber: final2!.categoryNumber ?? 2,
      colorVar: '--circular-menu-chapter-4',
    },
    {
      id: `category-${final3!.id}`,
      titleEn: final3!.titleEn,
      titleNl: final3!.titleNl,
      subtitleEn: final3!.subtitleEn,
      subtitleNl: final3!.subtitleNl,
      categoryNumber: final3!.categoryNumber ?? 3,
      colorVar: '--circular-menu-chapter-9',
    },
  ]

  const handleSectorClick = (categoryNumber: number) => {
    router.push(`/category/number/${categoryNumber}`)
  }

  const handleFalahClick = () => {
    router.push(`/category/number/0`)
  }

  const describeArc = (startAngle: number, sweepAngle: number) => {
    const startRad = (startAngle * Math.PI) / 180
    const endRad = ((startAngle + sweepAngle) * Math.PI) / 180
    const x1 = round(200 + OUTER_RADIUS * Math.cos(startRad))
    const y1 = round(200 + OUTER_RADIUS * Math.sin(startRad))
    const x2 = round(200 + OUTER_RADIUS * Math.cos(endRad))
    const y2 = round(200 + OUTER_RADIUS * Math.sin(endRad))
    const x3 = round(200 + INNER_RADIUS * Math.cos(endRad))
    const y3 = round(200 + INNER_RADIUS * Math.sin(endRad))
    const x4 = round(200 + INNER_RADIUS * Math.cos(startRad))
    const y4 = round(200 + INNER_RADIUS * Math.sin(startRad))
    const largeArc = sweepAngle > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArc} 0 ${x4} ${y4} Z`
  }

  const describeTextArc = (startAngle: number, sweepAngle: number, radius: number, reverse = false) => {
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

  return (
    <div className="w-full">
      <div
        className="relative w-full aspect-square"
        style={fitToScreen ? { maxWidth: 'min(100%, min(calc(100vh - 12rem), 72rem))', margin: '0 auto' } : undefined}
      >
        {/* Ring (sectors, ticks) – draait; center blijft stil */}
        <div className="absolute inset-0 falah-cycle-rotate">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="40 40 320 320"
          preserveAspectRatio="xMidYMid meet"
          style={{ transform: `rotate(${INITIAL_SVG_ROTATION}deg)` }}
        >
          <defs>
            {orderedCategories.map((sector, index) => {
              const { start, sweep } = SECTOR_ANGLES[index]
              const textRadius = (INNER_RADIUS + OUTER_RADIUS) / 2
              const reverse = false
              const pathId = `text-path-${uniqueId}-${index}`
              const subPathId = `text-path-sub-${uniqueId}-${index}`
              return (
                <g key={`text-paths-${pathId}`}>
                  <path
                    id={pathId}
                    d={describeTextArc(start, sweep, textRadius, reverse)}
                    fill="none"
                  />
                  <path
                    id={subPathId}
                    d={describeTextArc(start, sweep, textRadius - 16, reverse)}
                    fill="none"
                  />
                </g>
              )
            })}
            {!isUniversalTheme &&
              orderedCategories.map((sector, index) => {
                const angle = SECTOR_ANGLES[index].labelAngle
                const rad = (angle * Math.PI) / 180
                const y1 = 200 - 80 * Math.cos(rad)
                const y2 = 200 + 80 * Math.cos(rad)
                const x1 = 200 + 80 * Math.sin(rad)
                const x2 = 200 - 80 * Math.sin(rad)
                const stops = getGradientStopsForSegment(index, 3)
                return (
                  <linearGradient
                    key={`roygbiv-${sector.id}`}
                    id={`category-roygbiv-${index}`}
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

          <g stroke="white" strokeWidth="1" opacity="0.85">
            <circle cx="200" cy="200" r={RING_INNER} fill="none" />
            <circle cx="200" cy="200" r={RING_OUTER} fill="none" />
            {Array.from({ length: TICK_COUNT }, (_, i) => {
              const angle = (i * TICK_ANGLE * Math.PI) / 180
              const x1 = round(200 + RING_INNER * Math.cos(angle))
              const y1 = round(200 + RING_INNER * Math.sin(angle))
              const x2 = round(200 + RING_OUTER * Math.cos(angle))
              const y2 = round(200 + RING_OUTER * Math.sin(angle))
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
            })}
          </g>

          {orderedCategories.map((sector, index) => {
            const { start, sweep } = SECTOR_ANGLES[index]

            return (
              <g key={sector.id}>
                <path
                  d={describeArc(start, sweep)}
                  className="cursor-pointer transition-opacity opacity-100"
                  style={{
                    fill: isUniversalTheme ? 'transparent' : `url(#category-roygbiv-${index})`,
                    stroke: 'white',
                    strokeWidth: 1,
                  }}
                  onMouseEnter={(e) => {
                    if (isUniversalTheme) {
                      e.currentTarget.style.fill = 'var(--nav-category-circle-sector-hover)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isUniversalTheme) {
                      e.currentTarget.style.fill = 'transparent'
                    }
                  }}
                  onClick={() => handleSectorClick(sector.categoryNumber)}
                />
                <g pointerEvents="none" stroke="none">
                  <text
                    className="fill-foreground font-bold pointer-events-none"
                    style={{ fontSize: '14px' }}
                  >
                    <textPath
                      href={`#text-path-${uniqueId}-${index}`}
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      {language === 'nl' ? sector.titleNl : sector.titleEn}
                    </textPath>
                  </text>
                  {(language === 'nl' ? sector.subtitleNl : sector.subtitleEn) && (
                    <text
                      className="fill-foreground pointer-events-none"
                      style={{ fontSize: '11px', opacity: 0.8 }}
                    >
                      <textPath
                        href={`#text-path-sub-${uniqueId}-${index}`}
                        startOffset="50%"
                        textAnchor="middle"
                      >
                        {language === 'nl' ? sector.subtitleNl : sector.subtitleEn}
                      </textPath>
                    </text>
                  )}
                </g>
              </g>
            )
          })}
        </svg>
        </div>

        {/* Center (Falah) – blijft stil */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="40 40 320 320"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id={`falah-gradient-${uniqueId}`} cx="50%" cy="50%">
              {isUniversalTheme ? (
                <>
                  <stop offset="0%" stopColor="var(--nav-category-circle-falah-start)" />
                  <stop offset="50%" stopColor="var(--nav-category-circle-falah-mid)" />
                  <stop offset="100%" stopColor="var(--nav-category-circle-falah-end)" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="var(--nav-category-circle-falah-start)" />
                  <stop offset="100%" stopColor="var(--nav-category-circle-falah-end)" />
                </>
              )}
            </radialGradient>
          </defs>
          <g>
            <circle
              cx="200"
              cy="200"
              r={CENTER_RADIUS}
              className="cursor-pointer transition-opacity opacity-100"
              style={{
                fill: isUniversalTheme ? 'transparent' : `url(#falah-gradient-${uniqueId})`,
                stroke: 'white',
                strokeWidth: isUniversalTheme ? 2 : 1.5,
              }}
              onMouseEnter={(e) => {
                if (isUniversalTheme) {
                  e.currentTarget.style.fill = 'var(--nav-category-circle-falah-hover)'
                  e.currentTarget.style.stroke = 'var(--nav-category-circle-falah-stroke)'
                }
              }}
              onMouseLeave={(e) => {
                if (isUniversalTheme) {
                  e.currentTarget.style.fill = 'transparent'
                  e.currentTarget.style.stroke = 'var(--nav-category-circle-falah-stroke)'
                }
              }}
              onClick={handleFalahClick}
            />
            <g
              style={{
                transform: `rotate(${INITIAL_FALAH_TEXT_ROTATION}deg)`,
                transformOrigin: '200px 200px',
              }}
            >
              <text
                x="200"
                y="190"
                className="fill-foreground font-bold pointer-events-none"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: '24px', fontWeight: 'bold' }}
              >
                {language === 'nl' ? finalCenter!.titleNl : finalCenter!.titleEn}
              </text>
              {(language === 'nl' ? finalCenter!.subtitleNl : finalCenter!.subtitleEn) && (
                <text
                  x="200"
                  y="210"
                  className="fill-foreground pointer-events-none"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: '14px', opacity: 0.8 }}
                >
                  {language === 'nl' ? finalCenter!.subtitleNl : finalCenter!.subtitleEn}
                </text>
              )}
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}
