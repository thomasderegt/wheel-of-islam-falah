'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'wheel-fit-to-screen'

export function useFitToScreen() {
  const [fitToScreen, setFitToScreenState] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored !== null) {
        setFitToScreenState(stored === 'true')
      }
    } catch {
      // localStorage unavailable (e.g. private mode)
    }
  }, [])

  const setFitToScreen = useCallback((value: boolean) => {
    setFitToScreenState(value)
    try {
      localStorage.setItem(STORAGE_KEY, String(value))
    } catch {
      // ignore
    }
  }, [])

  return [fitToScreen, setFitToScreen] as const
}
