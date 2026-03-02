'use client'

/**
 * HomeNavCircle Component
 *
 * Circular navigation for Home dashboard (like Wheel of Life).
 * Center: 1. Success. Ring: 2. Assessment, 3. Goals, 4. Execute, 5. Insight.
 * Drag to rotate. Uses theme colors (--nav-category-circle-falah, --home-nav-sector-*).
 */

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { routes } from '@/shared/constants/routes'

const round = (num: number, decimals = 10) =>
  Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)

const centerItem = { href: routes.success, label: '1. Success' }

const ringItems = [
  { href: routes.assessment, label: '2. Assessment' },
  { href: '/goals-okr', label: '3. Goals' },
  { href: '/goals-okr/execute', label: '4. Execute' },
  { href: '/goals-okr/insight', label: '5. Insight' },
]

interface HomeNavCircleProps {
  readonly fitToScreen?: boolean
}

export function HomeNavCircle({ fitToScreen = false }: HomeNavCircleProps) {
  const router = useRouter()
  const { userGroup } = useTheme()
  const isUniversalTheme = !userGroup || userGroup === 'universal'

  const [ringRotation, setRingRotation] = useState(0)
  const [isDraggingWheel, setIsDraggingWheel] = useState(false)
  const wheelWrapperRef = useRef<HTMLDivElement>(null)
  const userJustDraggedRef = useRef(false)
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    startAngle: number
    startRotation: number
  } | null>(null)

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
      const angle = getAngleFromPointer(e.clientX, e.clientY)
      dragRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startAngle: angle,
        startRotation: ringRotation,
      }
    },
    [ringRotation, getAngleFromPointer]
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

  const handleSectorClick = (href: string) => {
    if (userJustDraggedRef.current) return
    router.push(href)
  }

  const handleCenterClick = () => {
    if (userJustDraggedRef.current) return
    router.push(centerItem.href)
  }

  const outerRadius = 160
  const innerRadius = 95
  const centerX = 200
  const centerY = 200
  const angleStep = 90
  const sectorOffset = 45

  return (
    <div className="w-full">
      <div
        ref={wheelWrapperRef}
        className="relative w-full aspect-square touch-none"
        style={
          fitToScreen
            ? {
                maxWidth: 'min(100%, min(calc(100vh - 12rem), 72rem))',
                margin: '0 auto',
              }
            : undefined
        }
        onPointerDown={handleWheelPointerDown}
        onPointerMove={handleWheelPointerMove}
        onPointerUp={handleWheelPointerUp}
        onPointerCancel={handleWheelPointerUp}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="40 40 320 320"
          preserveAspectRatio="xMidYMid meet"
          style={{ transform: 'rotate(0deg)' }}
        >
          <defs>
            <radialGradient id="home-nav-center-gradient" cx="50%" cy="50%">
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
            {ringItems.map((item, index) => {
              const sectorStartAngle = index * angleStep + sectorOffset
              const gradientStartX = round(
                centerX + 127.5 * Math.cos((sectorStartAngle * Math.PI) / 180)
              )
              const gradientStartY = round(
                centerY + 127.5 * Math.sin((sectorStartAngle * Math.PI) / 180)
              )
              const gradientEndX = round(
                centerX +
                  127.5 *
                    Math.cos(((sectorStartAngle + angleStep) * Math.PI) / 180)
              )
              const gradientEndY = round(
                centerY +
                  127.5 *
                    Math.sin(((sectorStartAngle + angleStep) * Math.PI) / 180)
              )
              const stops =
                index === 0
                  ? [
                      { offset: '0%', color: 'var(--nav-category-circle-sector-0-start)' },
                      { offset: '33%', color: 'var(--nav-category-circle-sector-0-mid1)' },
                      { offset: '66%', color: 'var(--nav-category-circle-sector-0-mid2)' },
                      { offset: '100%', color: 'var(--nav-category-circle-sector-0-end)' },
                    ]
                  : [
                      { offset: '0%', color: `var(--nav-category-circle-sector-${index}-start)` },
                      { offset: '50%', color: `var(--nav-category-circle-sector-${index}-mid)` },
                      { offset: '100%', color: `var(--nav-category-circle-sector-${index}-end)` },
                    ]
              return (
                <linearGradient
                  key={`gradient-${item.href}`}
                  id={`home-nav-gradient-${item.href.replaceAll('/', '-')}`}
                  x1={gradientStartX}
                  y1={gradientStartY}
                  x2={gradientEndX}
                  y2={gradientEndY}
                  gradientUnits="userSpaceOnUse"
                >
                  {stops.map((stop) => (
                    <stop
                      key={stop.offset}
                      offset={stop.offset}
                      stopColor={stop.color}
                    />
                  ))}
                </linearGradient>
              )
            })}
          </defs>

          <g
            style={{
              transform: `rotate(${ringRotation}deg)`,
              transformOrigin: `${centerX}px ${centerY}px`,
              transition: isDraggingWheel ? 'none' : 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
          {ringItems.map((item, index) => {
            const startAngle = index * angleStep + sectorOffset
            const endAngle = (index + 1) * angleStep + sectorOffset
            const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1

            const startX = round(
              centerX + outerRadius * Math.cos((startAngle * Math.PI) / 180)
            )
            const startY = round(
              centerY + outerRadius * Math.sin((startAngle * Math.PI) / 180)
            )
            const endX = round(
              centerX + outerRadius * Math.cos((endAngle * Math.PI) / 180)
            )
            const endY = round(
              centerY + outerRadius * Math.sin((endAngle * Math.PI) / 180)
            )
            const innerStartX = round(
              centerX + innerRadius * Math.cos((startAngle * Math.PI) / 180)
            )
            const innerStartY = round(
              centerY + innerRadius * Math.sin((startAngle * Math.PI) / 180)
            )
            const innerEndX = round(
              centerX + innerRadius * Math.cos((endAngle * Math.PI) / 180)
            )
            const innerEndY = round(
              centerY + innerRadius * Math.sin((endAngle * Math.PI) / 180)
            )

            const pathData = [
              `M ${startX} ${startY}`,
              `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `L ${innerEndX} ${innerEndY}`,
              `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`,
              'Z',
            ].join(' ')

            const textAngle = startAngle + 45
            const textRadius = (outerRadius + innerRadius) / 2
            const textX = round(
              centerX +
                textRadius * Math.cos((textAngle * Math.PI) / 180)
            )
            const textY = round(
              centerY +
                textRadius * Math.sin((textAngle * Math.PI) / 180)
            )
            const textRotation = textAngle + 90 + (index === 0 ? 180 : 0)

            return (
              <g key={item.href}>
                <path
                  d={pathData}
                  className="stroke-2 cursor-pointer transition-opacity opacity-100"
                  style={{
                    fill: isUniversalTheme
                      ? 'transparent'
                      : `url(#home-nav-gradient-${item.href.replaceAll('/', '-')})`,
                    stroke: isUniversalTheme
                      ? 'var(--nav-category-circle-sector-stroke)'
                      : `url(#home-nav-gradient-${item.href.replaceAll('/', '-')})`,
                    strokeWidth: '2',
                  }}
                  onMouseEnter={(e) => {
                    if (isUniversalTheme) {
                      e.currentTarget.style.fill =
                        'var(--nav-category-circle-sector-hover)'
                      e.currentTarget.style.stroke =
                        'var(--nav-category-circle-sector-stroke)'
                    } else {
                      e.currentTarget.style.opacity = '0.9'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isUniversalTheme) {
                      e.currentTarget.style.fill = 'transparent'
                      e.currentTarget.style.stroke =
                        'var(--nav-category-circle-sector-stroke)'
                    } else {
                      e.currentTarget.style.opacity = '1'
                    }
                  }}
                  onClick={() => handleSectorClick(item.href)}
                />
                <g
                  style={{
                    transform: `rotate(${textRotation}deg)`,
                    transformOrigin: `${textX}px ${textY}px`,
                    pointerEvents: 'none',
                  }}
                >
                  <text
                    x={textX}
                    y={textY}
                    className="fill-foreground font-semibold pointer-events-none"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: '14px' }}
                  >
                    {item.label}
                  </text>
                </g>
              </g>
            )
          })}
          </g>

          {/* Center circle - Success */}
          <g>
            <circle
              cx={centerX}
              cy={centerY}
              r="70"
              className="cursor-pointer transition-opacity opacity-100"
              style={{
                fill: isUniversalTheme ? 'transparent' : 'url(#home-nav-center-gradient)',
                stroke: isUniversalTheme ? 'var(--nav-category-circle-falah-stroke)' : 'url(#home-nav-center-gradient)',
                strokeWidth: 2,
              }}
              onMouseEnter={(e) => {
                if (isUniversalTheme) {
                  e.currentTarget.style.fill = 'var(--nav-category-circle-falah-hover)'
                  e.currentTarget.style.stroke = 'var(--nav-category-circle-falah-stroke)'
                } else {
                  e.currentTarget.style.opacity = '0.9'
                }
              }}
              onMouseLeave={(e) => {
                if (isUniversalTheme) {
                  e.currentTarget.style.fill = 'transparent'
                  e.currentTarget.style.stroke = 'var(--nav-category-circle-falah-stroke)'
                } else {
                  e.currentTarget.style.opacity = '1'
                }
              }}
              onClick={handleCenterClick}
            />
            <g
              style={{
                transform: 'rotate(0deg)',
                transformOrigin: `${centerX}px ${centerY}px`,
                pointerEvents: 'none',
              }}
            >
              <text
                x={centerX}
                y={centerY - 10}
                className="fill-foreground font-bold pointer-events-none"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: '24px', fontWeight: 'bold' }}
              >
                {centerItem.label}
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}
