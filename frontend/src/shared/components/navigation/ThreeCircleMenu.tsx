'use client'

/**
 * ThreeCircleMenu Component (Simplified for v2)
 * 
 * Één donut (ring) met drie sectoren
 * Vereenvoudigde versie zonder LanguageContext
 */

import { useRouter } from 'next/navigation'
import { SYSTEM_CATEGORIES } from '@/shared/constants/systemCategories'

interface CircleOption {
  id: string
  titleEn: string
  titleNl: string
  microcopyEn: string
  microcopyNl: string
  categoryNumber: number
  colorVar: string
}

export function ThreeCircleMenu() {
  const router = useRouter()
  const language = 'en' as 'nl' | 'en' // TODO: Add language context later

  // Helper function to round to avoid hydration mismatches
  const round = (num: number, decimals: number = 10) => 
    Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)

  const sectors: CircleOption[] = [
    {
      id: 'dunya',
      titleEn: SYSTEM_CATEGORIES.BUILD_YOUR_DUNYA.titleEn,
      titleNl: SYSTEM_CATEGORIES.BUILD_YOUR_DUNYA.titleNl,
      microcopyEn: 'Build Your Dunya',
      microcopyNl: 'Bouw Je Dunya',
      categoryNumber: SYSTEM_CATEGORIES.BUILD_YOUR_DUNYA.categoryNumber,
      colorVar: '--circular-menu-chapter-0'
    },
    {
      id: 'inner-world',
      titleEn: SYSTEM_CATEGORIES.STRENGTHEN_INNER_WORLD.titleEn,
      titleNl: SYSTEM_CATEGORIES.STRENGTHEN_INNER_WORLD.titleNl,
      microcopyEn: 'Strengthen Your Inner World',
      microcopyNl: 'Versterk Je Innerlijke Wereld',
      categoryNumber: SYSTEM_CATEGORIES.STRENGTHEN_INNER_WORLD.categoryNumber,
      colorVar: '--circular-menu-chapter-4'
    },
    {
      id: 'akhirah',
      titleEn: SYSTEM_CATEGORIES.PREPARE_FOR_AKHIRAH.titleEn,
      titleNl: SYSTEM_CATEGORIES.PREPARE_FOR_AKHIRAH.titleNl,
      microcopyEn: 'Prepare for the Ākhirah',
      microcopyNl: 'Bereid Je Voor op de Ākhirah',
      categoryNumber: SYSTEM_CATEGORIES.PREPARE_FOR_AKHIRAH.categoryNumber,
      colorVar: '--circular-menu-chapter-7'
    }
  ]

  const handleSectorClick = (categoryNumber: number) => {
    router.push(`/category/number/${categoryNumber}`)
  }

  const handleFalahClick = () => {
    router.push(`/category/number/${SYSTEM_CATEGORIES.FALAH.categoryNumber}`)
  }

  return (
    <div className="w-full">
      <div className="relative w-full aspect-square">
        {/* SVG Circular Menu - Donut met drie sectoren + Falah in het midden */}
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="40 40 320 320"
          preserveAspectRatio="xMidYMid meet"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Gradient definitions */}
          <defs>
            {/* Falah gradient */}
            <radialGradient id="falah-gradient" cx="50%" cy="50%">
              <stop offset="0%" stopColor="oklch(0.7 0.15 180)" />
              <stop offset="50%" stopColor="oklch(0.65 0.15 200)" />
              <stop offset="100%" stopColor="oklch(0.6 0.15 220)" />
            </radialGradient>
            
            {/* Regenboog gradient definitions */}
            {sectors.map((sector, index) => {
              const sectorStartAngle = index * 120
              const gradientStartX = round(200 + 127.5 * Math.cos((sectorStartAngle * Math.PI) / 180))
              const gradientStartY = round(200 + 127.5 * Math.sin((sectorStartAngle * Math.PI) / 180))
              const gradientEndX = round(200 + 127.5 * Math.cos(((sectorStartAngle + 120) * Math.PI) / 180))
              const gradientEndY = round(200 + 127.5 * Math.sin(((sectorStartAngle + 120) * Math.PI) / 180))
              
              let stops
              if (index === 0) {
                stops = [
                  { offset: '0%', color: 'oklch(0.65 0.1 0)' },
                  { offset: '33%', color: 'oklch(0.68 0.1 30)' },
                  { offset: '66%', color: 'oklch(0.72 0.1 60)' },
                  { offset: '100%', color: 'oklch(0.68 0.1 90)' }
                ]
              } else if (index === 1) {
                stops = [
                  { offset: '0%', color: 'oklch(0.65 0.1 120)' },
                  { offset: '50%', color: 'oklch(0.6 0.1 150)' },
                  { offset: '100%', color: 'oklch(0.55 0.1 180)' }
                ]
              } else {
                stops = [
                  { offset: '0%', color: 'oklch(0.6 0.1 210)' },
                  { offset: '50%', color: 'oklch(0.65 0.1 240)' },
                  { offset: '100%', color: 'oklch(0.68 0.1 270)' }
                ]
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
          
          {/* Drie sectoren */}
          <g>
            {sectors.map((sector, index) => {
              const startAngle = index * 120
              const endAngle = (index + 1) * 120
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

              const textAngle = startAngle + 60
              const textRadius = (outerRadius + innerRadius) / 2
              const textX = round(200 + textRadius * Math.cos((textAngle * Math.PI) / 180))
              const textY = round(200 + textRadius * Math.sin((textAngle * Math.PI) / 180))

              return (
                <g key={sector.id}>
                  <path
                    d={pathData}
                    className="stroke-2 cursor-pointer transition-opacity opacity-50"
                    style={{ 
                      fill: `url(#gradient-sector-${index})`,
                      stroke: `url(#gradient-sector-${index})`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.7'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.5'
                    }}
                    onClick={() => handleSectorClick(sector.categoryNumber)}
                  />
                  <g
                    style={{ 
                      transform: `rotate(90deg)`,
                      transformOrigin: `${textX}px ${textY}px`
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
                    {sector.microcopyEn && (
                      <text
                        x={textX}
                        y={textY + 12}
                        className="fill-foreground/80 pointer-events-none"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: '11px' }}
                      >
                        {(() => {
                          const text = language === 'nl' ? sector.microcopyNl : sector.microcopyEn
                          return text.length > 25 ? text.substring(0, 22) + '...' : text
                        })()}
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
              r="95"
              className="cursor-pointer transition-opacity opacity-60 hover:opacity-80"
              style={{
                fill: 'url(#falah-gradient)',
                stroke: 'url(#falah-gradient)',
                strokeWidth: 2
              }}
              onClick={handleFalahClick}
            />
            
            {/* Falah text (rotated back to normal orientation) */}
            <g
              style={{
                transform: 'rotate(90deg)',
                transformOrigin: '200px 200px'
              }}
            >
              <text
                x="200"
                y="195"
                className="fill-foreground font-bold pointer-events-none"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: '24px', fontWeight: 'bold' }}
              >
                {language === 'nl' ? SYSTEM_CATEGORIES.FALAH.titleNl : SYSTEM_CATEGORIES.FALAH.titleEn}
              </text>
              <text
                x="200"
                y="215"
                className="fill-foreground/70 pointer-events-none"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: '12px' }}
              >
                {language === 'nl' ? 'Jouw Reis naar Echt Succes' : 'Your Journey to Real Success'}
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}

