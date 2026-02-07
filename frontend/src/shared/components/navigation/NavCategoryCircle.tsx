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
import { useTheme } from '@/shared/contexts/ThemeContext'

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

  const { data: category1, isLoading: isLoading1 } = useQuery({
    queryKey: ['categoryByNumber', 1],
    queryFn: () => getCategoryByNumber(1),
  })

  const { data: category2, isLoading: isLoading2 } = useQuery({
    queryKey: ['categoryByNumber', 2],
    queryFn: () => getCategoryByNumber(2),
  })

  const { data: category3, isLoading: isLoading3 } = useQuery({
    queryKey: ['categoryByNumber', 3],
    queryFn: () => getCategoryByNumber(3),
  })

  const { data: category4, isLoading: isLoading4 } = useQuery({
    queryKey: ['categoryByNumber', 4],
    queryFn: () => getCategoryByNumber(4),
  })

  const { data: centerCategory, isLoading: isLoadingFalah } = useQuery({
    queryKey: ['categoryByNumber', 0],
    queryFn: () => getCategoryByNumber(0),
  })

  // Helper function to round to avoid hydration mismatches
  const round = (num: number, decimals: number = 10) => 
    Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)

  // Don't render until all categories are loaded
  if (isLoading1 || isLoading2 || isLoading3 || isLoading4 || isLoadingFalah || !category1 || !category2 || !category3 || !category4 || !centerCategory) {
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
      id: `category-${category4.id}`,
      titleEn: category4.titleEn,
      titleNl: category4.titleNl,
      subtitleEn: category4.subtitleEn,
      subtitleNl: category4.subtitleNl,
      categoryNumber: category4.categoryNumber ?? 4,
      colorVar: '--circular-menu-chapter-9'
    },
    {
      id: `category-${category3.id}`,
      titleEn: category3.titleEn,
      titleNl: category3.titleNl,
      subtitleEn: category3.subtitleEn,
      subtitleNl: category3.subtitleNl,
      categoryNumber: category3.categoryNumber ?? 3,
      colorVar: '--circular-menu-chapter-7'
    },
    {
      id: `category-${category2.id}`,
      titleEn: category2.titleEn,
      titleNl: category2.titleNl,
      subtitleEn: category2.subtitleEn,
      subtitleNl: category2.subtitleNl,
      categoryNumber: category2.categoryNumber ?? 2,
      colorVar: '--circular-menu-chapter-4'
    },
    {
      id: `category-${category1.id}`,
      titleEn: category1.titleEn,
      titleNl: category1.titleNl,
      subtitleEn: category1.subtitleEn,
      subtitleNl: category1.subtitleNl,
      categoryNumber: category1.categoryNumber ?? 1,
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
                  ? centerCategory.titleNl
                  : centerCategory.titleEn}
              </text>
              {(language === 'nl' ? centerCategory.subtitleNl : centerCategory.subtitleEn) && (
                <text
                  x="200"
                  y="210"
                  className="fill-foreground pointer-events-none"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: '14px', opacity: 0.8 }}
                >
                  {language === 'nl' 
                    ? centerCategory.subtitleNl
                    : centerCategory.subtitleEn}
                </text>
              )}
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}
