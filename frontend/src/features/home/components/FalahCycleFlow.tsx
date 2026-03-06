'use client'

/**
 * FalahCycleFlow - Visual circular flow of the Falah Growth Cycle
 * Success → Priorities → Goals → Execution → Insight → Success
 */

import Link from 'next/link'
import { Star, ClipboardCheck, Target, TrendingUp, Lightbulb } from 'lucide-react'
import { Card } from '@/shared/components/ui/card'
import { routes } from '@/shared/constants/routes'

const STEPS = [
  { href: routes.success, label: 'Success', icon: Star },
  { href: routes.assessment, label: 'Priorities', icon: ClipboardCheck },
  { href: '/goals-okr', label: 'Goals', icon: Target },
  { href: '/goals-okr/execute', label: 'Execution', icon: TrendingUp },
  { href: '/goals-okr/insight', label: 'Insight', icon: Lightbulb },
] as const

// Positions on circle: 5 points, Success at top (-90°), clockwise
// Center 200,200, radius 150. Angles: -90, -18, 54, 126, 198
const RADIUS = 150
const CX = 200
const CY = 200

function getPoint(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: CX + RADIUS * Math.cos(rad),
    y: CY + RADIUS * Math.sin(rad),
  }
}

const ANGLES = [-90, -18, 54, 126, 198]
const POINTS = ANGLES.map(getPoint)

export function FalahCycleFlow() {
  return (
    <div className="relative w-full max-w-[520px] mx-auto aspect-square overflow-visible">
      {/* Alleen de pijlen draaien, cards blijven stil */}
      <div className="absolute inset-0 falah-cycle-rotate">
        <svg
          className="absolute inset-0 w-full h-full text-primary/40"
          viewBox="0 0 400 400"
          fill="none"
        >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="currentColor" />
          </marker>
          </defs>
          {POINTS.map((start, i) => {
          const end = POINTS[(i + 1) % 5]
          const largeArc = 0
          const sweep = 1
          const d = `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`
            return (
              <path
              key={`${STEPS[i].label}-to-${STEPS[(i + 1) % 5].label}`}
              d={d}
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6 4"
              fill="none"
                markerEnd="url(#arrowhead)"
              />
            )
          })}
        </svg>
      </div>

      {/* Cards positioned on the circle - blijven stil */}
      {STEPS.map((step, i) => {
        const Icon = step.icon
        const p = POINTS[i]
        const xPct = (p.x / 400) * 100
        const yPct = (p.y / 400) * 100

          return (
            <Link
            key={step.href}
            href={step.href}
            className="absolute block w-[clamp(80px,14vw,140px)] h-[clamp(80px,14vw,140px)] -translate-x-1/2 -translate-y-1/2 hover:scale-105 transition-transform duration-200"
            style={{ left: `${xPct}%`, top: `${yPct}%` }}
          >
            <Card className="w-full h-full rounded-full flex flex-col items-center justify-center gap-1.5 py-4 px-3 hover:bg-muted/30 hover:border-primary/50 transition-colors border-2">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/15 border-2 border-primary/50 flex items-center justify-center">
                <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-foreground text-center leading-tight">
                {step.label}
              </span>
            </Card>
            </Link>
          )
        })}
    </div>
  )
}
