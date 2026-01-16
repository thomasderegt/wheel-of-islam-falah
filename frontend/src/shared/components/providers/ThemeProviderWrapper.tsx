'use client'

/**
 * ThemeProviderWrapper.tsx - Client wrapper voor ThemeProvider
 * 
 * Dit component is een client wrapper voor de ThemeProvider.
 * Het is nodig omdat layout.tsx een server component is, maar ThemeProvider
 * een client component is (gebruikt useState, useEffect, etc.).
 * 
 * Dit component wrapt de children met ThemeProvider zodat alle componenten
 * toegang hebben tot de theme context.
 */

import { ReactNode } from 'react'
import { ThemeProvider } from '@/shared/contexts/ThemeContext'

/**
 * ThemeProviderWrapper component
 * 
 * Dit component wrapt children met ThemeProvider.
 * Het is een client component die de ThemeProvider beschikbaar maakt
 * voor alle child componenten.
 * 
 * @param {ReactNode} children - De child componenten die toegang krijgen tot de theme context
 */
export default function ThemeProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}
