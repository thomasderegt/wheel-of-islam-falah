'use client'

/**
 * NavCategoryCircle Component
 * 
 * Één donut (ring) met vier sectoren voor de homepage
 * Toont de vier categorieën: Fiqh, Dunya, Tazkiyyah, Akhirah
 * Met Falah in het midden
 */

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getCategoryByNumber } from '@/features/content/api/contentApi'
import { useContentWheelByKey } from '@/features/content/hooks/useWheels'
import { useCategoriesByWheelId } from '@/features/content/hooks/useCategoriesByWheel'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { useModeContext } from '@/shared/hooks/useModeContext'

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
// Categorie posities: Fiqh=boven, Akhirah=rechts, Tazkiyyah=onder, Dunya=links
const INITIAL_SVG_ROTATION = 0
const INITIAL_FALAH_TEXT_ROTATION = 0

export function NavCategoryCircle() {
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

  // Find categories by number (fallback to old method if wheel not found)
  const category0 = categories?.find(c => c.categoryNumber === 0)
  const category1 = categories?.find(c => c.categoryNumber === 1)
  const category2 = categories?.find(c => c.categoryNumber === 2)
  const category3 = categories?.find(c => c.categoryNumber === 3)
  const category4 = categories?.find(c => c.categoryNumber === 4)

  // Fallback: use old method if wheel not loaded yet
  const { data: category1Fallback, isLoading: isLoading1 } = useQuery({
    queryKey: ['categoryByNumber', 1],
    queryFn: () => getCategoryByNumber(1),
    enabled: !category1 && !isLoadingCategories,
  })

  const { data: category2Fallback, isLoading: isLoading2 } = useQuery({
    queryKey: ['categoryByNumber', 2],
    queryFn: () => getCategoryByNumber(2),
    enabled: !category2 && !isLoadingCategories,
  })

  const { data: category3Fallback, isLoading: isLoading3 } = useQuery({
    queryKey: ['categoryByNumber', 3],
    queryFn: () => getCategoryByNumber(3),
    enabled: !category3 && !isLoadingCategories,
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

  // Use wheel categories if available, otherwise fallback
  const finalCategory1 = category1 || category1Fallback
  const finalCategory2 = category2 || category2Fallback
  const finalCategory3 = category3 || category3Fallback
  const finalCategory4 = category4 || category4Fallback
  const finalCenterCategory = category0 || centerCategoryFallback

  // Helper function to round to avoid hydration mismatches
  const round = (num: number, decimals: number = 10) => 
    Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)

  // Don't render until all categories are loaded
  const isLoading = isLoadingWheel || isLoadingCategories || isLoading1 || isLoading2 || isLoading3 || isLoading4 || isLoadingFalah
  if (isLoading || !finalCategory1 || !finalCategory2 || !finalCategory3 || !finalCategory4 || !finalCenterCategory) {
    return (
      <div className="w-full">
        <div className="relative w-full aspect-square flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  const ringCategories: CircleOption[] = [
    {
      id: `category-${finalCategory4.id}`,
      titleEn: finalCategory4.titleEn,
      titleNl: finalCategory4.titleNl,
      subtitleEn: finalCategory4.subtitleEn,
      subtitleNl: finalCategory4.subtitleNl,
      categoryNumber: finalCategory4.categoryNumber ?? 4,
      colorVar: '--circular-menu-chapter-9'
    },
    {
      id: `category-${finalCategory3.id}`,
      titleEn: finalCategory3.titleEn,
      titleNl: finalCategory3.titleNl,
      subtitleEn: finalCategory3.subtitleEn,
      subtitleNl: finalCategory3.subtitleNl,
      categoryNumber: finalCategory3.categoryNumber ?? 3,
      colorVar: '--circular-menu-chapter-7'
    },
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
      id: `category-${finalCategory1.id}`,
      titleEn: finalCategory1.titleEn,
      titleNl: finalCategory1.titleNl,
      subtitleEn: finalCategory1.subtitleEn,
      subtitleNl: finalCategory1.subtitleNl,
      categoryNumber: finalCategory1.categoryNumber ?? 1,
      colorVar: '--circular-menu-chapter-0'
    }
  ]
  
  // Reorder: Fiqh boven, Akhirah rechts, Tazkiyyah onder, Dunya links
  // Met +45° offset en -90° SVG rotatie: index 0 = boven, index 1 = rechts, index 2 = onder, index 3 = links
  // ringCategories: [0]=Fiqh(4), [1]=Akhirah(3), [2]=Tazkiyyah(2), [3]=Dunya(1)
  // Gewenste posities: Fiqh=boven(0), Akhirah=rechts(1), Tazkiyyah=onder(2), Dunya=links(3)
  const orderedCategories: CircleOption[] = [
    ringCategories[0], // Fiqh (category4) - index 0 = boven (top)
    ringCategories[1], // Akhirah (category3) - index 1 = rechts (right)
    ringCategories[2], // Tazkiyyah (category2) - index 2 = onder (bottom)
    ringCategories[3]  // Dunya (category1) - index 3 = links (left)
  ]

  const handleSectorClick = (categoryNumber: number) => {
    router.push(`/category/number/${categoryNumber}`)
  }

  const handleFalahClick = () => {
    router.push(`/category/number/0`)
  }

  return (
    <div className="w-full">
      <div className="relative w-full aspect-square">
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
            
            {/* Regenboog gradient definitions */}
            {orderedCategories.map((sector, index) => {
              // Add 45° offset to align sectors
              const sectorStartAngle = index * 90 + 45
              const gradientStartX = round(200 + 127.5 * Math.cos((sectorStartAngle * Math.PI) / 180))
              const gradientStartY = round(200 + 127.5 * Math.sin((sectorStartAngle * Math.PI) / 180))
              const gradientEndX = round(200 + 127.5 * Math.cos(((sectorStartAngle + 90) * Math.PI) / 180))
              const gradientEndY = round(200 + 127.5 * Math.sin(((sectorStartAngle + 90) * Math.PI) / 180))
              
              let stops
              if (isUniversalTheme) {
                // Zwart-wit gradients voor universal theme
                if (index === 0) {
                  stops = [
                    { offset: '0%', color: 'var(--nav-category-circle-sector-0-start)' },
                    { offset: '33%', color: 'var(--nav-category-circle-sector-0-mid1)' },
                    { offset: '66%', color: 'var(--nav-category-circle-sector-0-mid2)' },
                    { offset: '100%', color: 'var(--nav-category-circle-sector-0-end)' }
                  ]
                } else if (index === 1) {
                  stops = [
                    { offset: '0%', color: 'var(--nav-category-circle-sector-1-start)' },
                    { offset: '50%', color: 'var(--nav-category-circle-sector-1-mid)' },
                    { offset: '100%', color: 'var(--nav-category-circle-sector-1-end)' }
                  ]
                } else if (index === 2) {
                  stops = [
                    { offset: '0%', color: 'var(--nav-category-circle-sector-2-start)' },
                    { offset: '50%', color: 'var(--nav-category-circle-sector-2-mid)' },
                    { offset: '100%', color: 'var(--nav-category-circle-sector-2-end)' }
                  ]
                } else {
                  stops = [
                    { offset: '0%', color: 'var(--nav-category-circle-sector-3-start)' },
                    { offset: '50%', color: 'var(--nav-category-circle-sector-3-mid)' },
                    { offset: '100%', color: 'var(--nav-category-circle-sector-3-end)' }
                  ]
                }
              } else {
                // Kleurrijke gradients voor andere themes
                if (index === 0) {
                  stops = [
                    { offset: '0%', color: 'var(--nav-category-circle-sector-0-start)' },
                    { offset: '33%', color: 'var(--nav-category-circle-sector-0-mid1)' },
                    { offset: '66%', color: 'var(--nav-category-circle-sector-0-mid2)' },
                    { offset: '100%', color: 'var(--nav-category-circle-sector-0-end)' }
                  ]
                } else if (index === 1) {
                  stops = [
                    { offset: '0%', color: 'var(--nav-category-circle-sector-1-start)' },
                    { offset: '50%', color: 'var(--nav-category-circle-sector-1-mid)' },
                    { offset: '100%', color: 'var(--nav-category-circle-sector-1-end)' }
                  ]
                } else if (index === 2) {
                  stops = [
                    { offset: '0%', color: 'var(--nav-category-circle-sector-2-start)' },
                    { offset: '50%', color: 'var(--nav-category-circle-sector-2-mid)' },
                    { offset: '100%', color: 'var(--nav-category-circle-sector-2-end)' }
                  ]
                } else {
                  stops = [
                    { offset: '0%', color: 'var(--nav-category-circle-sector-3-start)' },
                    { offset: '50%', color: 'var(--nav-category-circle-sector-3-mid)' },
                    { offset: '100%', color: 'var(--nav-category-circle-sector-3-end)' }
                  ]
                }
              }
              
              return (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`gradient-sector-${index}`}
                  x1={gradientStartX}
                  y1={gradientStartY}
                  x2={gradientEndX}
                  y2={gradientEndY}
                  gradientUnits="userSpaceOnUse"
                >
                  {stops.map((stop, stopIndex) => (
                    <stop
                      key={stopIndex}
                      offset={stop.offset}
                      stopColor={stop.color}
                    />
                  ))}
                </linearGradient>
              )
            })}
          </defs>
          
          {/* Outer wrapper circle - border around the entire wheel */}
          <circle
            cx="200"
            cy="200"
            r="160"
            fill="none"
            stroke="red"
            strokeWidth="2"
          />
          
          {/* Vier sectoren */}
          <g>
            {orderedCategories.map((sector, index) => {
              // Add 45° offset to align sectors: boven, rechts, onder, links
              const startAngle = index * 90 + 45
              const endAngle = (index + 1) * 90 + 45
              const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1
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

              const textAngle = startAngle + 45
              const textRadius = (outerRadius + innerRadius) / 2
              const textX = round(200 + textRadius * Math.cos((textAngle * Math.PI) / 180))
              const textY = round(200 + textRadius * Math.sin((textAngle * Math.PI) / 180))
              // Tekst rotatie: 90 graden om horizontaal te blijven, ongeacht de positie op de ring
              // Fiqh (index 0) krijgt 180 graden extra rotatie zodat het niet op zijn kop staat
              const textRotation = textAngle + 90 + (index === 0 ? 180 : 0)

              return (
                <g key={sector.id}>
                  <path
                    d={pathData}
                    className="stroke-2 cursor-pointer transition-opacity opacity-100"
                    style={{ 
                      fill: isUniversalTheme ? 'transparent' : `url(#gradient-sector-${index})`,
                      stroke: isUniversalTheme ? 'var(--nav-category-circle-sector-stroke)' : `url(#gradient-sector-${index})`,
                      strokeWidth: '2'
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
                stroke: isUniversalTheme ? 'var(--nav-category-circle-falah-stroke)' : 'url(#falah-gradient)',
                strokeWidth: 2
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
