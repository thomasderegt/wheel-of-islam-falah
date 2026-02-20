'use client'

/**
 * NavOKRLifeDomainCircle Component
 * 
 * Circular navigation voor life domains in de OKR Goal Navigator
 * - 10 life domains in een cirkel
 * - Center: Religie (of eerste domain met displayOrder 0)
 * - Ring: Andere domains (displayOrder 1-9)
 * - Click handlers voor navigatie naar /goals-okr
 */

import { useState, useEffect, useMemo, useRef, useCallback, type ReactNode } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useLifeDomains } from '../hooks/useLifeDomains'
import { useWheels } from '../hooks/useWheels'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { Loading } from '@/shared/components/ui/Loading'
import { Button } from '@/shared/components/ui/button'
import type { LifeDomainDTO } from '../api/goalsOkrApi'

interface NavOKRLifeDomainCircleProps {
  readonly language?: 'nl' | 'en'
  readonly children?: ReactNode
}

export function NavOKRLifeDomainCircle({ language = 'en', children }: NavOKRLifeDomainCircleProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: lifeDomains, isLoading: isLoadingDomains } = useLifeDomains()
  const { data: wheels, isLoading: isLoadingWheels } = useWheels()
  const { userGroup } = useTheme()
  const isWireframeTheme = !userGroup || userGroup === 'universal'
  
  // State for selected wheel
  const [selectedWheelId, setSelectedWheelId] = useState<number | null>(null)
  
  const [centerDomain, setCenterDomain] = useState<LifeDomainDTO | null>(null)
  const [ringDomains, setRingDomains] = useState<LifeDomainDTO[]>([])
  const [ringRotation, setRingRotation] = useState(0)
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

  // Extract wheelId from URL to use in dependency array (avoids searchParams object size changes)
  const wheelIdFromUrl = searchParams?.get('wheelId') ?? null
  const hasSearchParams = searchParams !== null

  // Set wheel from URL query parameter or default to Wheel of Life
  useEffect(() => {
    if (!wheels || wheels.length === 0) return
    
    // Check for wheelId in URL query parameter (always respect URL)
    if (wheelIdFromUrl) {
      const wheelId = Number(wheelIdFromUrl)
      const wheel = wheels.find(w => w.id === wheelId)
      if (wheel && selectedWheelId !== wheel.id) {
        setSelectedWheelId(wheel.id)
        return
      }
    } else {
      // Only set default if no wheelId in URL and no wheel selected yet
      // But wait until searchParams is definitely available (not undefined)
      if (hasSearchParams && selectedWheelId === null) {
      // Default to Wheel of Life
      const wheelOfLife = wheels.find(w => w.wheelKey === 'WHEEL_OF_LIFE')
      if (wheelOfLife) {
        setSelectedWheelId(wheelOfLife.id)
      } else if (wheels.length > 0) {
        // Fallback to first wheel if WHEEL_OF_LIFE not found
        setSelectedWheelId(wheels[0].id)
      }
    }
    }
  }, [wheels, wheelIdFromUrl, hasSearchParams, selectedWheelId])

  // Filter life domains by selected wheel
  const filteredDomains = useMemo(() => {
    if (!lifeDomains || !selectedWheelId) return []
    return lifeDomains.filter(d => d.wheelId === selectedWheelId)
  }, [lifeDomains, selectedWheelId])

  // Helper function to get domain title based on language
  const getDomainTitle = (domain: LifeDomainDTO): string => {
    if (language === 'nl' && domain.titleNl) {
      return domain.titleNl
    }
    return domain.titleEn || domain.titleNl || domain.domainKey
  }

  // Helper function to split title into two lines
  const splitTitle = (title: string): { first: string; second: string } | null => {
    // First check for " / " separator (like "Work / Career")
    if (title.includes(' / ')) {
      const [first, ...rest] = title.split(' / ')
      return { first: `${first} /`, second: rest.join(' / ') }
    }
    // Then check for space (like "Personal Growth" or "Social Relationships")
    const words = title.split(' ')
    if (words.length > 1) {
      const lastWord = words[words.length - 1]
      const firstPart = words.slice(0, -1).join(' ')
      return { first: firstPart, second: lastWord }
    }
    return null
  }

  // Process filtered life domains data
  useEffect(() => {
    if (!filteredDomains || filteredDomains.length === 0) {
      setCenterDomain(null)
      setRingDomains([])
      return
    }

    // Sort by displayOrder
    const sorted = [...filteredDomains].sort((a, b) => a.displayOrder - b.displayOrder)
    
    // Find center domain (displayOrder 0, or first one)
    const center = sorted.find(d => d.displayOrder === 0) || sorted[0]
    setCenterDomain(center)
    
    // Rest go in ring
    const ring = sorted.filter(d => d.id !== center.id)
    setRingDomains(ring)
  }, [filteredDomains])

  // Animate ring rotation when navigating to goals-okr page (like NavBookCircle)
  useEffect(() => {
    if (pathname === '/goals-okr' && ringDomains.length > 0) {
      setRingRotation(prev => prev + 360)
    }
  }, [pathname, ringDomains.length])

  // Manual ring rotation functions
  const rotateRingLeft = () => {
    if (ringDomains.length > 0) {
      const angleStep = 360 / ringDomains.length
      setRingRotation(prev => prev - angleStep) // Rotate by one domain
    }
  }

  const rotateRingRight = () => {
    if (ringDomains.length > 0) {
      const angleStep = 360 / ringDomains.length
      setRingRotation(prev => prev + angleStep) // Rotate by one domain
    }
  }

  // Drag-to-rotate: hoek uit pointerpositie t.o.v. wrapper (viewBox 40 40 320 320, center 200,200)
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
      if (ringDomains.length === 0) return
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
      // Geen setPointerCapture hier – pas bij eerste beweging, anders krijgt het segment geen click
    },
    [ringDomains.length, ringRotation, getAngleFromPointer]
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
      setRingRotation(startRotation - delta)
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

  const handleCenterClick = () => {
    if (userJustDraggedRef.current) return
    if (centerDomain) {
      router.push(`/goals-okr/life-domains/${centerDomain.id}?wheelId=${selectedWheelId}`)
    }
  }

  const handleDomainClick = (domainId: number) => {
    if (userJustDraggedRef.current) return
    router.push(`/goals-okr/life-domains/${domainId}?wheelId=${selectedWheelId}`)
  }


  const isLoading = isLoadingDomains || isLoadingWheels

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="relative w-full aspect-square flex items-center justify-center">
          <Loading />
        </div>
      </div>
    )
  }

  if (!lifeDomains || lifeDomains.length === 0) {
    return (
      <div className="w-full">
        <div className="relative w-full aspect-square flex items-center justify-center">
          <div className="text-muted-foreground">No life domains found</div>
        </div>
      </div>
    )
  }

  const round = (num: number, decimals: number = 10) => 
    Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)

  const outerRadius = 160
  const innerRadius = 95
  const centerX = 200
  const centerY = 200

  return (
    <div className="w-full space-y-4">
      <div
        ref={wheelWrapperRef}
        className="relative w-full aspect-square touch-none"
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
          {/* Gradient definitions */}
          <defs>
            {/* Center domain gradient */}
            <radialGradient id="okr-life-domain-center-gradient" cx="50%" cy="50%">
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
          </defs>

          {/* Ring domains */}
          {ringDomains.length > 0 && (
            <g style={{ 
              transform: `rotate(${ringRotation}deg)`, 
              transformOrigin: `${centerX}px ${centerY}px`,
              transition: isDraggingWheel ? 'none' : 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              {ringDomains.map((domain, index) => {
                const angleStep = 360 / ringDomains.length
                const angle = index * angleStep
                const angleRad = (angle * Math.PI) / 180
                
                const outerX = round(centerX + outerRadius * Math.cos(angleRad))
                const outerY = round(centerY + outerRadius * Math.sin(angleRad))
                const innerX = round(centerX + innerRadius * Math.cos(angleRad))
                const innerY = round(centerY + innerRadius * Math.sin(angleRad))
                
                // Next domain position for arc
                const nextAngle = (index + 1) * angleStep
                const nextAngleRad = (nextAngle * Math.PI) / 180
                const nextOuterX = round(centerX + outerRadius * Math.cos(nextAngleRad))
                const nextOuterY = round(centerY + outerRadius * Math.sin(nextAngleRad))
                const nextInnerX = round(centerX + innerRadius * Math.cos(nextAngleRad))
                const nextInnerY = round(centerY + innerRadius * Math.sin(nextAngleRad))
                
                const largeArcFlag = angleStep <= 180 ? 0 : 1
                
                const pathData = [
                  `M ${outerX} ${outerY}`,
                  `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${nextOuterX} ${nextOuterY}`,
                  `L ${nextInnerX} ${nextInnerY}`,
                  `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerX} ${innerY}`,
                  'Z'
                ].join(' ')

                const textAngle = angle + angleStep / 2
                const textRadius = (outerRadius + innerRadius) / 2
                const textX = round(centerX + textRadius * Math.cos((textAngle * Math.PI) / 180))
                const textY = round(centerY + textRadius * Math.sin((textAngle * Math.PI) / 180))

                return (
                  <g key={domain.id}>
                    <path
                      d={pathData}
                      className="stroke-2 cursor-pointer transition-opacity opacity-100"
                      style={{ 
                        fill: isWireframeTheme ? 'transparent' : `var(--circular-menu-chapter-${index % 10})`,
                        stroke: isWireframeTheme ? 'var(--nav-category-circle-sector-stroke)' : `var(--circular-menu-chapter-${index % 10})`,
                        strokeWidth: '2'
                      }}
                      onMouseEnter={(e) => {
                        if (isWireframeTheme) {
                          e.currentTarget.style.fill = 'var(--nav-category-circle-sector-hover)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isWireframeTheme) {
                          e.currentTarget.style.fill = 'transparent'
                        }
                      }}
                      onClick={() => handleDomainClick(domain.id)}
                    />
                    <g
                      style={{ 
                        transform: `rotate(${textAngle + 90}deg)`,
                        transformOrigin: `${textX}px ${textY}px`,
                        pointerEvents: 'none'
                      }}
                    >
                      <text
                        x={textX}
                        y={textY}
                        className="fill-foreground font-bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: '12px', userSelect: 'text', pointerEvents: 'none' }}
                      >
                        {(() => {
                          const title = getDomainTitle(domain)
                          const split = splitTitle(title)
                          if (split) {
                            return (
                              <>
                                <tspan x={textX} dy="0">{split.first}</tspan>
                                <tspan x={textX} dy="14">{split.second}</tspan>
                              </>
                            )
                          }
                          return title
                        })()}
                      </text>
                    </g>
                  </g>
                )
              })}
            </g>
          )}

          {/* Center domain circle */}
          {centerDomain && (
            <g>
              <circle
                cx={centerX}
                cy={centerY}
                r="70"
                className="cursor-pointer transition-opacity opacity-100"
                style={{
                  fill: isWireframeTheme ? 'transparent' : 'url(#okr-life-domain-center-gradient)',
                  stroke: isWireframeTheme ? 'var(--nav-category-circle-falah-stroke)' : 'url(#okr-life-domain-center-gradient)',
                  strokeWidth: 2
                }}
                onMouseEnter={(e) => {
                  if (isWireframeTheme) {
                    e.currentTarget.style.fill = 'var(--nav-category-circle-falah-hover)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (isWireframeTheme) {
                    e.currentTarget.style.fill = 'transparent'
                  }
                }}
                onClick={handleCenterClick}
              />
              
              {/* Center text (rotated back to normal orientation) */}
              <g
                style={{
                  transform: 'rotate(90deg)',
                  transformOrigin: `${centerX}px ${centerY}px`,
                  pointerEvents: 'none'
                }}
              >
                <text
                  x={centerX}
                  y={centerY - 10}
                  className="fill-foreground font-bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: '20px', fontWeight: 'bold', userSelect: 'text', pointerEvents: 'none' }}
                >
                  {(() => {
                    const title = getDomainTitle(centerDomain)
                    const split = splitTitle(title)
                    if (split) {
                      return (
                        <>
                          <tspan x={centerX} dy="0">{split.first}</tspan>
                          <tspan x={centerX} dy="22">{split.second}</tspan>
                        </>
                      )
                    }
                    return title
                  })()}
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Rotation controls - onder de navigatie */}
      {ringDomains.length > 0 && (
        <div className="flex justify-center gap-4 w-full mb-4">
          <Button
            onClick={rotateRingLeft}
            variant="outline"
            className="rounded-full"
            size="sm"
          >
            ← Spin Left
          </Button>
          <Button
            onClick={rotateRingRight}
            variant="outline"
            className="rounded-full"
            size="sm"
          >
            Spin Right →
          </Button>
        </div>
      )}

      {children}
    </div>
  )
}
