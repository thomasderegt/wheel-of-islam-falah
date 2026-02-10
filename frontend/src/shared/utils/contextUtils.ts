/**
 * Utilities for working with Context and Wheel mappings
 */

import { Context, GoalsOkrContext } from '@/shared/api/types'

/**
 * Map Context to wheelKey
 */
export function contextToWheelKey(context: Context): string | null {
  switch (context) {
    case 'LIFE':
      return 'WHEEL_OF_LIFE'
    case 'BUSINESS':
      return 'WHEEL_OF_BUSINESS'
    case 'WORK':
      return 'WHEEL_OF_WORK'
    case 'SUCCESS':
      return null // SUCCESS context doesn't use wheels
    default:
      return null
  }
}

/**
 * Map GoalsOkrContext to wheelKey
 */
export function goalsOkrContextToWheelKey(context: GoalsOkrContext): string | null {
  switch (context) {
    case 'LIFE':
      return 'WHEEL_OF_LIFE'
    case 'BUSINESS':
      return 'WHEEL_OF_BUSINESS'
    case 'WORK':
      return 'WHEEL_OF_WORK'
    case 'NONE':
      return null // NONE doesn't use wheels
    case 'ALL':
      return null // ALL shows all wheels, so no specific wheelKey
    default:
      return null
  }
}

/**
 * Map Context to wheelType (for filtering)
 */
export function contextToWheelType(context: Context): 'life' | 'business' | null {
  switch (context) {
    case 'LIFE':
      return 'life'
    case 'BUSINESS':
      return 'business'
    case 'WORK':
      // WORK is not yet supported in wheelType filter, but we can treat it as a separate case
      return null
    case 'SUCCESS':
      return null
    default:
      return null
  }
}

/**
 * Map GoalsOkrContext to wheelType (for filtering)
 */
export function goalsOkrContextToWheelType(context: GoalsOkrContext): 'life' | 'business' | null {
  switch (context) {
    case 'LIFE':
      return 'life'
    case 'BUSINESS':
      return 'business'
    case 'WORK':
      // WORK is not yet supported in wheelType filter, but we can treat it as a separate case
      return null
    case 'NONE':
      return null
    case 'ALL':
      return null // ALL shows all wheels, so no specific wheelType
    default:
      return null
  }
}

/**
 * Get wheelId from context and wheels list
 */
export function getWheelIdFromContext(
  context: Context,
  wheels: Array<{ id: number; wheelKey: string }> | undefined
): number | null {
  if (!wheels) return null
  
  const wheelKey = contextToWheelKey(context)
  if (!wheelKey) return null
  
  const wheel = wheels.find(w => w.wheelKey === wheelKey)
  return wheel?.id ?? null
}

/**
 * Get wheelId from GoalsOkrContext and wheels list
 */
export function getWheelIdFromGoalsOkrContext(
  context: GoalsOkrContext,
  wheels: Array<{ id: number; wheelKey: string }> | undefined
): number | null {
  if (!wheels) return null
  
  const wheelKey = goalsOkrContextToWheelKey(context)
  if (!wheelKey) return null
  
  const wheel = wheels.find(w => w.wheelKey === wheelKey)
  return wheel?.id ?? null
}

/**
 * Get short label for GoalsOkrContext (for display in UI)
 */
export function getGoalsOkrContextShortLabel(context: GoalsOkrContext): string {
  switch (context) {
    case 'LIFE':
      return 'Life'
    case 'BUSINESS':
      return 'Biz'
    case 'WORK':
      return 'Work'
    case 'NONE':
      return 'None'
    case 'ALL':
      return 'All'
    default:
      return context
  }
}
