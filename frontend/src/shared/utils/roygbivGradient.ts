/**
 * ROYGBIV gradient utilities
 * Maps angle (0-360°) to colors that flow: Red → Orange → Yellow → Green → Blue → Indigo → Violet
 * Used for NavOKRLifeDomainCircle ring - smooth gradient regardless of segment count
 */

export type OklchColor = { L: number; C: number; H: number }

// ROYGBIV color stops (OKLCH) - soft/pastel, evenly spaced around 360°
const ROYGBIV_STOPS: { angle: number; color: OklchColor }[] = [
  { angle: 0, color: { L: 0.65, C: 0.12, H: 25 } },      // Red
  { angle: 51.43, color: { L: 0.72, C: 0.1, H: 55 } },   // Orange
  { angle: 102.86, color: { L: 0.9, C: 0.08, H: 95 } },  // Yellow
  { angle: 154.29, color: { L: 0.68, C: 0.11, H: 140 } }, // Green
  { angle: 205.71, color: { L: 0.6, C: 0.12, H: 250 } },  // Blue
  { angle: 257.14, color: { L: 0.55, C: 0.1, H: 275 } },  // Indigo
  { angle: 308.57, color: { L: 0.6, C: 0.12, H: 310 } },  // Violet
]

function normalizeAngle(angle: number): number {
  let a = angle % 360
  if (a < 0) a += 360
  return a
}

/** Shortest-path hue interpolation */
function interpolateHue(h1: number, h2: number, t: number): number {
  let diff = h2 - h1
  if (diff > 180) diff -= 360
  if (diff < -180) diff += 360
  let h = h1 + diff * t
  if (h < 0) h += 360
  if (h >= 360) h -= 360
  return h
}

/** Interpolate between two OKLCH colors */
function interpolateOklch(a: OklchColor, b: OklchColor, t: number): OklchColor {
  return {
    L: a.L + (b.L - a.L) * t,
    C: a.C + (b.C - a.C) * t,
    H: interpolateHue(a.H, b.H, t),
  }
}

/** Convert OKLCH to oklch() CSS string */
export function oklchToCss(c: OklchColor): string {
  return `oklch(${c.L.toFixed(3)} ${c.C.toFixed(3)} ${c.H.toFixed(1)})`
}

/**
 * Get gradient stops for a segment so the full ROYGBIV spectrum is visible.
 * With few segments (e.g. 2), each segment gets multiple stops to show the spectrum.
 */
export function getGradientStopsForSegment(
  segmentIndex: number,
  totalSegments: number
): { offset: string; color: string }[] {
  const segmentStartAngle = (segmentIndex / totalSegments) * 360
  const segmentEndAngle = ((segmentIndex + 1) / totalSegments) * 360
  const segmentSpan = segmentEndAngle - segmentStartAngle
  const numStops = totalSegments <= 2 ? 5 : Math.max(3, Math.min(6, totalSegments + 2))
  const stops: { offset: string; color: string }[] = []
  for (let i = 0; i < numStops; i++) {
    const t = i / (numStops - 1)
    const angle = segmentStartAngle + t * segmentSpan
    stops.push({
      offset: `${Math.round(t * 100)}%`,
      color: oklchToCss(colorAtAngle(angle)),
    })
  }
  return stops
}

/**
 * Get ROYGBIV color at a given angle (0-360°)
 */
export function colorAtAngle(angleDeg: number): OklchColor {
  const a = normalizeAngle(angleDeg)
  const stops = ROYGBIV_STOPS

  for (let i = 0; i < stops.length; i++) {
    const curr = stops[i]
    const next = stops[(i + 1) % stops.length]
    const startAngle = curr.angle
    const endAngle = next.angle < curr.angle ? next.angle + 360 : next.angle
    const aNorm = a < curr.angle ? a + 360 : a
    if (aNorm >= startAngle && aNorm < endAngle) {
      const range = endAngle - startAngle
      const t = (aNorm - startAngle) / range
      return interpolateOklch(curr.color, next.color, t)
    }
  }
  return stops[0].color
}
