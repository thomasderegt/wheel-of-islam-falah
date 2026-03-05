'use client'

/**
 * NavCategoryCircle Component
 *
 * 8-punts compass rose: Tazkiyyah (bovenste 4 punten), Fiqh (onderste 4 punten)
 * Falah in het midden
 */

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

// Compass rose: 8 punten, top 4 = Tazkiyyah, bottom 4 = Fiqh
const INITIAL_SVG_ROTATION = 0
const INITIAL_FALAH_TEXT_ROTATION = 0
const OUTER_RADIUS = 160
const INNER_RADIUS = 70 // Rand van Falah center
const POINT_SPAN = 22.5 // Kardinaal: halve hoek (45° totaal)
const ORDINAL_POINT_SPAN = 11.25 // Ordinaal: 50% kleiner (22.5° totaal)
const ORDINAL_OUTER_RADIUS = 115 // Ordinaal: 50% korter (70 + 45)
const RING_INNER = 118
const RING_OUTER = 132
const TICK_COUNT = 16
const TICK_ANGLE = 360 / TICK_COUNT
// Hoeken: 0=E, 45=SE, 90=S, 135=SW, 180=W, 225=NW, 270=N, 315=NE
const TAZKIYYAH_ANGLES = [180, 225, 270, 315] // Bovenste helft
const FIQH_ANGLES = [0, 45, 90, 135] // Onderste helft

interface NavCategoryCircleProps {
  readonly fitToScreen?: boolean
}

export function NavCategoryCircle({ fitToScreen = false }: NavCategoryCircleProps) {
  const router = useRouter()
  const language = 'en' as 'nl' | 'en' // TODO: Add language context later
  const { userGroup } = useTheme()
  const isUniversalTheme = !userGroup || userGroup === 'universal'
  const { contentContext } = useModeContext()

  // Content Context is always SUCCESS, so always show
  // This component is for Content (Wheel of Islam)
  if (contentContext !== 'SUCCESS') {
    return null
  }

  // Get Wheel of Islam
  const { data: wheelOfIslam, isLoading: isLoadingWheel } = useContentWheelByKey('WHEEL_OF_ISLAM')
  
  // Get categories by wheel ID
  const { data: categories, isLoading: isLoadingCategories } = useCategoriesByWheelId(wheelOfIslam?.id ?? null)

  // Find categories by number (fallback if wheel not found)
  const category0 = categories?.find(c => c.categoryNumber === 0)
  const category2 = categories?.find(c => c.categoryNumber === 2)
  const category4 = categories?.find(c => c.categoryNumber === 4)

  const { data: category2Fallback, isLoading: isLoading2 } = useQuery({
    queryKey: ['categoryByNumber', 2],
    queryFn: () => getCategoryByNumber(2),
    enabled: !category2 && !isLoadingCategories,
  })

  const { data: category4Fallback, isLoading: isLoading4 } = useQuery({
    queryKey: ['categoryByNumber', 4],
    queryFn: () => getCategoryByNumber(4),
    enabled: !category4 && !isLoadingCategories,
  })

  const { data: centerCategoryFallback, isLoading: isLoadingFalah } = useQuery({
    queryKey: ['categoryByNumber', 0],
    queryFn: () => getCategoryByNumber(0),
    enabled: !category0 && !isLoadingCategories,
  })

  const finalCategory2 = category2 || category2Fallback
  const finalCategory4 = category4 || category4Fallback
  const finalCenterCategory = category0 || centerCategoryFallback

  // Helper function to round to avoid hydration mismatches
  const round = (num: number, decimals: number = 10) => 
    Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)

  const isLoading = isLoadingWheel || isLoadingCategories || isLoading2 || isLoading4 || isLoadingFalah
  if (isLoading || !finalCategory2 || !finalCategory4 || !finalCenterCategory) {
    return (
      <div className="w-full">
        <div className="relative w-full aspect-square flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  // Twee sectoren: Tazkiyyah boven, Fiqh onder (Dunya en Akhirah zijn onderdeel van Falah)
  const orderedCategories: CircleOption[] = [
    {
      id: `category-${finalCategory2.id}`,
      titleEn: finalCategory2.titleEn,
      titleNl: finalCategory2.titleNl,
      subtitleEn: finalCategory2.subtitleEn,
      subtitleNl: finalCategory2.subtitleNl,
      categoryNumber: finalCategory2.categoryNumber ?? 2,
      colorVar: '--circular-menu-chapter-4'
    },
    {
      id: `category-${finalCategory4.id}`,
      titleEn: finalCategory4.titleEn,
      titleNl: finalCategory4.titleNl,
      subtitleEn: finalCategory4.subtitleEn,
      subtitleNl: finalCategory4.subtitleNl,
      categoryNumber: finalCategory4.categoryNumber ?? 4,
      colorVar: '--circular-menu-chapter-9'
    }
  ]
  // index 0 = Tazkiyyah (boven, 180°-360°), index 1 = Fiqh (onder, 0°-180°)

  const handleSectorClick = (categoryNumber: number) => {
    router.push(`/category/number/${categoryNumber}`)
  }

  const handleFalahClick = () => {
    router.push(`/category/number/0`)
  }

  return (
    <div className="w-full">
      <div
        className="relative w-full aspect-square"
        style={fitToScreen ? { maxWidth: 'min(100%, min(calc(100vh - 12rem), 72rem))', margin: '0 auto' } : undefined}
      >
        {/* SVG Compass Rose - 8 punten + Falah in het midden */}
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="40 40 320 320"
          preserveAspectRatio="xMidYMid meet"
          style={{ transform: `rotate(${INITIAL_SVG_ROTATION}deg)` }}
        >
          {/* Gradient definitions */}
          <defs>
            {/* Falah gradient */}
            <radialGradient id="falah-gradient" cx="50%" cy="50%">
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
            
            {/* ROYGBIV gradient per sector - top-to-bottom voor compass punten */}
            {!isUniversalTheme &&
              orderedCategories.map((sector, index) => {
                const y1 = index === 0 ? 40 : 200
                const y2 = index === 0 ? 200 : 360
                const stops = getGradientStopsForSegment(index, 2)
                return (
                  <linearGradient
                    key={`roygbiv-${sector.id}`}
                    id={`category-roygbiv-${index}`}
                    x1="200"
                    y1={y1}
                    x2="200"
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

          {/* Ronde ring met streepjes - onder de compass punten */}
          <g
            stroke="var(--nav-category-circle-sector-stroke)"
            strokeWidth="1"
            opacity="0.85"
          >
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
          
          {/* 8-punts compass rose: 4 punten Tazkiyyah (boven), 4 punten Fiqh (onder) */}
          <g stroke="var(--nav-category-circle-sector-stroke)">
            {orderedCategories.map((sector, index) => {
              const angles = index === 0 ? TAZKIYYAH_ANGLES : FIQH_ANGLES
              // Tazkiyyah bij N-punt (y≈55), Fiqh bij S-punt (y≈345)
              const textY = index === 0 ? 55 : 345

              return (
                <g key={sector.id}>
                  {angles.map((angle) => {
                    const isCardinal = angle % 90 === 0
                    const pointSpan = isCardinal ? POINT_SPAN : ORDINAL_POINT_SPAN
                    const outerR = isCardinal ? OUTER_RADIUS : ORDINAL_OUTER_RADIUS
                    const rad = (angle * Math.PI) / 180
                    const radLo = ((angle - pointSpan) * Math.PI) / 180
                    const radHi = ((angle + pointSpan) * Math.PI) / 180
                    const apexX = round(200 + outerR * Math.cos(rad))
                    const apexY = round(200 + outerR * Math.sin(rad))
                    const baseLoX = round(200 + INNER_RADIUS * Math.cos(radLo))
                    const baseLoY = round(200 + INNER_RADIUS * Math.sin(radLo))
                    const baseHiX = round(200 + INNER_RADIUS * Math.cos(radHi))
                    const baseHiY = round(200 + INNER_RADIUS * Math.sin(radHi))
                    const pathData = `M ${apexX} ${apexY} L ${baseLoX} ${baseLoY} L ${baseHiX} ${baseHiY} Z`

                    return (
                      <path
                        key={angle}
                        d={pathData}
                        className="cursor-pointer transition-opacity opacity-100"
                        style={{
                          fill: isUniversalTheme ? 'transparent' : `url(#category-roygbiv-${index})`,
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
                    )
                  })}
                  {/* Sector labels - geen border */}
                  <g pointerEvents="none" stroke="none">
                    <text
                      x="200"
                      y={textY - 8}
                      className="fill-foreground font-bold pointer-events-none"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: '14px' }}
                    >
                      {language === 'nl' ? sector.titleNl : sector.titleEn}
                    </text>
                    {(language === 'nl' ? sector.subtitleNl : sector.subtitleEn) && (
                      <text
                        x="200"
                        y={textY + 10}
                        className="fill-foreground pointer-events-none"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: '11px', opacity: 0.8 }}
                      >
                        {language === 'nl' ? sector.subtitleNl : sector.subtitleEn}
                      </text>
                    )}
                  </g>
                </g>
              )
            })}
          </g>
          
          {/* Falah center circle */}
          <g>
            <circle
              cx="200"
              cy="200"
              r="70"
              className="cursor-pointer transition-opacity opacity-100"
              style={{
                fill: isUniversalTheme ? 'transparent' : 'url(#falah-gradient)',
                stroke: isUniversalTheme ? 'var(--nav-category-circle-falah-stroke)' : 'oklch(0.7 0 0 / 0.4)',
                strokeWidth: isUniversalTheme ? 2 : 1.5
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
                transformOrigin: '200px 200px'
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
              {language === 'nl' 
                ? finalCenterCategory.titleNl
                : finalCenterCategory.titleEn}
            </text>
            {(language === 'nl' ? finalCenterCategory.subtitleNl : finalCenterCategory.subtitleEn) && (
              <text
                x="200"
                y="210"
                className="fill-foreground pointer-events-none"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: '14px', opacity: 0.8 }}
              >
                {language === 'nl' 
                  ? finalCenterCategory.subtitleNl
                  : finalCenterCategory.subtitleEn}
              </text>
            )}
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}
