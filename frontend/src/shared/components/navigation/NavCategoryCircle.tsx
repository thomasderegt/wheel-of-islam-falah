'use client'

/**
 * NavCategoryCircle Component
 *
 * Donut met twee sectoren: Fiqh en Tazkiyyah (Dunya en Akhirah zijn onderdeel van Falah)
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

// Begin stand configuratie
// SVG rotatie: 0deg (geen rotatie)
// Falah tekst rotatie: 0deg (horizontaal)
// Categorie posities: Tazkiyyah=boven, Fiqh=onder (2 sectoren van 180°)
const INITIAL_SVG_ROTATION = 0
const INITIAL_FALAH_TEXT_ROTATION = 0

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
        {/* SVG Circular Menu - Donut met drie sectoren + Falah in het midden */}
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
            
            {/* ROYGBIV gradient per sector - full spectrum over both segments (like NavOKRLifeDomainCircle) */}
            {!isUniversalTheme &&
              orderedCategories.map((sector, index) => {
                const sectorStartAngle = index === 0 ? 180 : 0
                const sectorEndAngle = index === 0 ? 360 : 180
                const midRadius = 127.5
                const startRad = (sectorStartAngle * Math.PI) / 180
                const endRad = (sectorEndAngle * Math.PI) / 180
                const x1 = round(200 + midRadius * Math.cos(startRad))
                const y1 = round(200 + midRadius * Math.sin(startRad))
                const x2 = round(200 + midRadius * Math.cos(endRad))
                const y2 = round(200 + midRadius * Math.sin(endRad))
                const stops = getGradientStopsForSegment(index, 2)
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
          
          {/* Twee sectoren: Tazkiyyah boven, Fiqh onder */}
          <g>
            {orderedCategories.map((sector, index) => {
              const startAngle = index === 0 ? 180 : 0
              const endAngle = index === 0 ? 360 : 180
              const largeArcFlag = 1
              const outerRadius = 160
              const innerRadius = 95
              
              const startX = round(200 + outerRadius * Math.cos((startAngle * Math.PI) / 180))
              const startY = round(200 + outerRadius * Math.sin((startAngle * Math.PI) / 180))
              const endX = round(200 + outerRadius * Math.cos((endAngle * Math.PI) / 180))
              const endY = round(200 + outerRadius * Math.sin((endAngle * Math.PI) / 180))
              const innerStartX = round(200 + innerRadius * Math.cos((startAngle * Math.PI) / 180))
              const innerStartY = round(200 + innerRadius * Math.sin((startAngle * Math.PI) / 180))
              const innerEndX = round(200 + innerRadius * Math.cos((endAngle * Math.PI) / 180))
              const innerEndY = round(200 + innerRadius * Math.sin((endAngle * Math.PI) / 180))

              const pathData = [
                `M ${startX} ${startY}`,
                `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                `L ${innerEndX} ${innerEndY}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`,
                'Z'
              ].join(' ')

              const textAngle = startAngle + 90
              const textRadius = (outerRadius + innerRadius) / 2
              const textX = round(200 + textRadius * Math.cos((textAngle * Math.PI) / 180))
              const textY = round(200 + textRadius * Math.sin((textAngle * Math.PI) / 180))
              // Tekst horizontaal en leesbaar (niet ondersteboven)
              const textRotation = 0

              return (
                <g key={sector.id}>
                  <path
                    d={pathData}
                    className="stroke-2 cursor-pointer transition-opacity opacity-100"
                    style={{ 
                      fill: isUniversalTheme ? 'transparent' : `url(#category-roygbiv-${index})`,
                      stroke: isUniversalTheme ? 'var(--nav-category-circle-sector-stroke)' : 'oklch(0.7 0 0 / 0.4)',
                      strokeWidth: isUniversalTheme ? 2 : 1.5
                    }}
                    onMouseEnter={(e) => {
                      if (isUniversalTheme) {
                        e.currentTarget.style.fill = 'var(--nav-category-circle-sector-hover)'
                        e.currentTarget.style.stroke = 'var(--nav-category-circle-sector-stroke)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isUniversalTheme) {
                        e.currentTarget.style.fill = 'transparent'
                        e.currentTarget.style.stroke = 'var(--nav-category-circle-sector-stroke)'
                      }
                    }}
                    onClick={() => handleSectorClick(sector.categoryNumber)}
                  />
                  <g
                    style={{ 
                      transform: `rotate(${textRotation}deg)`,
                      transformOrigin: `${textX}px ${textY}px`,
                      pointerEvents: 'none'
                    }}
                  >
                    <text
                      x={textX}
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
                        x={textX}
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
            {/* Center circle background */}
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
            
            {/* Falah text (rotated back to normal orientation to stay horizontal) */}
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
