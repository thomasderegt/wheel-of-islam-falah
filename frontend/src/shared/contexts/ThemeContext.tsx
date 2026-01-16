"use client"

/**
 * ThemeContext - React Context voor theme management
 * 
 * Dit bestand bevat:
 * - ThemeContext definitie
 * - ThemeProvider component die theme state beheert
 * - useTheme hook voor componenten om theme data op te halen
 * 
 * Het theme system werkt met CSS Custom Properties:
 * - CSS variabelen worden gedefinieerd in themes.css per gebruikersgroep
 * - ThemeContext zet het data-user-group attribute op <html> element
 * - CSS pikt automatisch de juiste kleuren op via [data-user-group="..."] selectors
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeContextType, UserGroup, BackgroundImage } from '@/shared/types/theme'

// Context definitie
const ThemeContext = createContext<ThemeContextType | null>(null)

// Available user groups
const AVAILABLE_GROUPS = ['adult-woman', 'adult-man', 'young-adult-male', 'young-adult-female', 'universal'] as const

// Available background images
const AVAILABLE_BACKGROUNDS: BackgroundImage[] = [
  'BackgroundYoungAdult.png',
  'BackgroundYoungAdultMan.png',
  'BackgroundYoungAdultWoman.png',
  'BackgroundAdult.png',
  'BackgroundAdultWoman.png',
  'picture1.png',
  'picture2.png',
  'picture3.png',
  'picture4.png',
  'picture5.png',
  'picture6.png',
  'picture7.png',
  'picture8.png',
  'picture9.png',
  'picture10.png',
  'picture11.png',
  'picture12.png',
  'picture13.png',
  'picture14.png',
  'picture15.png',
  'picture16.png'
] as const

// Type guard for UserGroup
function isValidUserGroup(value: string | null): value is UserGroup {
  if (!value) return true // null is valid
  return (AVAILABLE_GROUPS as readonly string[]).includes(value)
}

// Type guard for BackgroundImage
function isValidBackgroundImage(value: string | null): value is BackgroundImage {
  if (!value) return true // null is valid
  return (AVAILABLE_BACKGROUNDS as readonly string[]).includes(value)
}

// Function to get default background based on theme
const getDefaultBackground = (userGroup: UserGroup): BackgroundImage => {
  switch (userGroup) {
    case 'adult-woman':
      return 'BackgroundAdultWoman.png'
    case 'adult-man':
      return 'BackgroundAdult.png'
    case 'young-adult-male':
      return 'BackgroundYoungAdultMan.png'
    case 'young-adult-female':
      return 'BackgroundYoungAdultWoman.png'
    case 'universal':
    case null:
    default:
      return 'BackgroundYoungAdult.png'
  }
}

// Function to get the full path for a background image
const getBackgroundImagePath = (image: BackgroundImage): string => {
  // All Background* images are in BackgroundPictures/
  if (image.startsWith('Background')) {
    return `/BackgroundPictures/${image}`
  }
  // picture* images might be in root or another location - adjust if needed
  return `/${image}`
}

/**
 * ThemeProvider component
 * 
 * Deze component:
 * - Beheert de actieve gebruikersgroep state
 * - Zet het data-user-group attribute op <html> element
 * - Slaat de voorkeur op in LocalStorage
 * - Maakt theme data beschikbaar voor alle child componenten
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [userGroup, setUserGroupState] = useState<UserGroup>(null)
  const [backgroundImage, setBackgroundImageState] = useState<BackgroundImage | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()
  
  // Normalize pathname to always be a string for consistent dependency arrays
  const normalizedPathname = pathname ?? '/'

  // Mark as mounted after first render to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Load saved preferences from LocalStorage on mount
  useEffect(() => {
    try {
      const savedGroup = localStorage.getItem('woi-user-group')
      if (savedGroup && isValidUserGroup(savedGroup)) {
        setUserGroupState(savedGroup)
      }
      
      const savedBackground = localStorage.getItem('woi-background-image')
      if (savedBackground && isValidBackgroundImage(savedBackground)) {
        setBackgroundImageState(savedBackground)
      }
    } catch (error) {
      // localStorage might not be available (SSR, private browsing)
      console.warn('Failed to load theme preferences from localStorage:', error)
    }
  }, [])

  // Combined effect: Set data-user-group attribute and background image
  // Only runs after mount to prevent hydration mismatch
  useEffect(() => {
    if (!isMounted) return
    
    const html = document.documentElement
    const isLandingPage = normalizedPathname === '/'
    
    // Set data-user-group attribute
    if (userGroup && userGroup !== 'universal') {
      html.setAttribute('data-user-group', userGroup)
    } else {
      html.removeAttribute('data-user-group')
    }
    
    // Set background image CSS variable
    // Landing page: always set background to none
    if (isLandingPage) {
      html.style.setProperty('--background-image', 'none')
      return
    }
    
    // For universal theme, set background to none (white)
    if (!userGroup || userGroup === 'universal') {
      html.style.setProperty('--background-image', 'none')
      return
    }
    
    // Get current background image (user selected or default based on theme)
    const currentBackground = backgroundImage || getDefaultBackground(userGroup)
    html.style.setProperty('--background-image', `url('${getBackgroundImagePath(currentBackground)}')`)
  }, [userGroup, backgroundImage, normalizedPathname, isMounted])

  // Function to set user group (with LocalStorage persistence)
  const setUserGroup = (group: string) => {
    if (!isValidUserGroup(group)) {
      console.warn(`Invalid user group: ${group}`)
      return
    }
    
    try {
      setUserGroupState(group as UserGroup)
      localStorage.setItem('woi-user-group', group)
      
      // Reset background to default for new theme (always use theme default)
      setBackgroundImageState(null)  // Clear custom background
      localStorage.removeItem('woi-background-image')  // Remove saved custom background
      
      // Apply background immediately
      const html = document.documentElement
      if (group === 'universal') {
        html.style.setProperty('--background-image', 'none')
      } else {
        const defaultBg = getDefaultBackground(group as UserGroup)
        html.style.setProperty('--background-image', `url('${getBackgroundImagePath(defaultBg)}')`)
      }
    } catch (error) {
      console.warn('Failed to save theme preference to localStorage:', error)
    }
  }

  // Function to set background image (with LocalStorage persistence)
  const setBackgroundImage = (image: BackgroundImage) => {
    if (!isValidBackgroundImage(image)) {
      console.warn(`Invalid background image: ${image}`)
      return
    }
    
    try {
      setBackgroundImageState(image)
      localStorage.setItem('woi-background-image', image)
      const html = document.documentElement
      html.style.setProperty('--background-image', `url('${getBackgroundImagePath(image)}')`)
    } catch (error) {
      console.warn('Failed to save background image preference to localStorage:', error)
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        userGroup,
        setUserGroup,
        availableGroups: [...AVAILABLE_GROUPS],
        backgroundImage,
        setBackgroundImage,
        availableBackgrounds: [...AVAILABLE_BACKGROUNDS],
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * useTheme hook
 * 
 * Deze hook geeft toegang tot theme data in componenten.
 * 
 * @returns {ThemeContextType} Theme context met userGroup, setUserGroup, en availableGroups
 * @throws {Error} Als hook wordt gebruikt buiten ThemeProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { userGroup, setUserGroup } = useTheme()
 *   
 *   return (
 *     <button onClick={() => setUserGroup('adult-woman')}>
 *       Current: {userGroup}
 *     </button>
 *   )
 * }
 * ```
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  
  return context
}
