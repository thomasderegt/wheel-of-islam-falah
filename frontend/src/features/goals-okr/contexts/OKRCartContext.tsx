'use client'

/**
 * OKR Cart Context
 * 
 * Shopping cart-like functionality for collecting OKR items
 * before adding them to the kanban board
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type CartItemType = 'GOAL' | 'OBJECTIVE' | 'KEY_RESULT'

export interface OKRCartItem {
  type: CartItemType
  id: number // Template ID
  title: string
  description?: string
  parentId?: number // For hierarchy validation (goalId for objective, objectiveId for key result, etc.)
  // Additional data for creating new items
  isNew?: boolean
  data?: {
    title: string
    description?: string
    targetValue?: number
    unit?: string
  }
}

interface OKRCartContextValue {
  items: OKRCartItem[]
  addItem: (item: OKRCartItem) => void
  removeItem: (type: CartItemType, id: number) => void
  clearCart: () => void
  getItemCount: () => number
  hasItem: (type: CartItemType, id: number) => boolean
  getValidationErrors: () => string[]
}

const OKRCartContext = createContext<OKRCartContextValue | undefined>(undefined)

export function OKRCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OKRCartItem[]>([])

  const addItem = useCallback((item: OKRCartItem) => {
    setItems((prev) => {
      // Check if item already exists
      const exists = prev.some((i) => i.type === item.type && i.id === item.id)
      if (exists) {
        return prev
      }
      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((type: CartItemType, id: number) => {
    setItems((prev) => prev.filter((item) => !(item.type === type && item.id === id)))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const getItemCount = useCallback(() => {
    return items.length
  }, [items])

  const hasItem = useCallback(
    (type: CartItemType, id: number) => {
      return items.some((item) => item.type === type && item.id === id)
    },
    [items]
  )

  const getValidationErrors = useCallback((): string[] => {
    const errors: string[] = []
    const goals = items.filter((i) => i.type === 'GOAL')
    const objectives = items.filter((i) => i.type === 'OBJECTIVE')
    const keyResults = items.filter((i) => i.type === 'KEY_RESULT')

    // Check hierarchy: Goals must come first
    if (objectives.length > 0 && goals.length === 0) {
      errors.push('Please add at least one Goal before adding Objectives')
    }

    // Check hierarchy: Objectives must come before Key Results
    if (keyResults.length > 0 && objectives.length === 0) {
      errors.push('Please add at least one Objective before adding Key Results')
    }

    // Check parent relationships
    const objectiveParentIds = new Set(objectives.map((o) => o.parentId).filter(Boolean))
    const keyResultParentIds = new Set(keyResults.map((kr) => kr.parentId).filter(Boolean))

    if (objectives.length > 0 && goals.length > 0) {
      const goalIds = new Set(goals.map((g) => g.id))
      objectives.forEach((obj) => {
        if (obj.parentId && !goalIds.has(obj.parentId)) {
          errors.push(`Objective "${obj.title}" requires Goal ${obj.parentId} to be in cart`)
        }
      })
    }

    if (keyResults.length > 0 && objectives.length > 0) {
      const objectiveIds = new Set(objectives.map((o) => o.id))
      keyResults.forEach((kr) => {
        if (kr.parentId && !objectiveIds.has(kr.parentId)) {
          errors.push(`Key Result "${kr.title}" requires Objective ${kr.parentId} to be in cart`)
        }
      })
    }


    return errors
  }, [items])

  return (
    <OKRCartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        getItemCount,
        hasItem,
        getValidationErrors,
      }}
    >
      {children}
    </OKRCartContext.Provider>
  )
}

export function useOKRCart() {
  const context = useContext(OKRCartContext)
  if (context === undefined) {
    throw new Error('useOKRCart must be used within OKRCartProvider')
  }
  return context
}
