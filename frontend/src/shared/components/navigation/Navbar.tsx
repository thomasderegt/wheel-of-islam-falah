'use client'

/**
 * Navbar Component (Simplified for v2)
 * 
 * Navigation bar component voor de root/landing pagina.
 * Vereenvoudigde versie die werkt met v2's auth setup.
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/shared/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useFalahCycles } from '@/features/auth/hooks/useFalahCycles'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useModeContext } from '@/shared/hooks/useModeContext'
import { Home, Star, ClipboardCheck, Target, TrendingUp, Lightbulb, User, LogOut, UserCircle } from 'lucide-react'

interface NavbarProps {
  variant?: 'default' | 'landing'
}

export default function Navbar({ variant = 'default' }: NavbarProps = {}) {
  const textColor = variant === 'landing' ? 'text-foreground' : 'text-white'
  const hoverBg = variant === 'landing' ? 'hover:bg-muted' : 'hover:bg-white/10'
  const hoverText = variant === 'landing' ? 'hover:text-foreground' : 'hover:text-white'
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuth()
  const logout = useLogout()
  const { goalsOkrContext } = useModeContext()
  const { data: cycles } = useFalahCycles(user?.id ?? null)
  const activeCycle = cycles?.find((c) => c.active)
  const isInFlow = !!activeCycle && !activeCycle.flowExited
  const isOnCyclePage =
    pathname === '/success' ||
    pathname === '/assessment' ||
    (pathname.startsWith('/goals-okr') && !pathname.startsWith('/goals-okr/insight'))
  const navDisabled = isInFlow && isOnCyclePage
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const bottomNavScrollRef = useRef<HTMLDivElement>(null)
  const bottomNavDragRef = useRef({ isDragging: false, startX: 0, startScrollLeft: 0, hasMoved: false })

  const handleLogout = () => {
    logout()
    router.push('/')
    setMobileMenuOpen(false)
  }

  // Mouse wheel: scroll horizontally when user scrolls vertically over bottom nav (desktop UX)
  const handleBottomNavWheel = (e: React.WheelEvent) => {
    const el = bottomNavScrollRef.current
    if (!el) return
    const canScrollLeft = el.scrollLeft > 0
    const canScrollRight = el.scrollLeft < el.scrollWidth - el.clientWidth
    if ((e.deltaY !== 0 && (canScrollLeft || canScrollRight))) {
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
  }

  // Click-and-drag to scroll horizontally (desktop UX)
  const handleBottomNavMouseDown = (e: React.MouseEvent) => {
    const el = bottomNavScrollRef.current
    if (!el) return
    bottomNavDragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      hasMoved: false,
    }
    const onMove = (moveEvent: MouseEvent) => {
      const drag = bottomNavDragRef.current
      if (!drag.isDragging) return
      const dx = drag.startX - moveEvent.clientX
      if (Math.abs(dx) > 3) drag.hasMoved = true
      el.scrollLeft = drag.startScrollLeft + dx
    }
    const onUp = () => {
      bottomNavDragRef.current.isDragging = false
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      // Reset hasMoved after click would have fired
      setTimeout(() => { bottomNavDragRef.current.hasMoved = false }, 0)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  const handleBottomNavClick = (e: React.MouseEvent) => {
    if (bottomNavDragRef.current.hasMoved) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === '/home') return 'Home'
    if (pathname === '/success') return 'Success'
    if (pathname === '/assessment') return 'Assessment'
    if (pathname.startsWith('/goals-okr/insight')) return 'Insight'
    if (pathname.startsWith('/goals-okr/execute')) return 'Execute'
    if (pathname.startsWith('/goals-okr/kanban')) return 'Progress'
    if (pathname === '/goal' || pathname.startsWith('/goals-okr')) return 'Goal'
    return null
  }

  const pageTitle = getPageTitle()

  // Check if a path is active (including sub-routes)
  const isActive = (path: string) => {
    if (path === '/home') {
      return pathname === '/home'
    }
    if (path === '/success') {
      return pathname === '/success'
    }
    if (path === '/assessment') {
      return pathname === '/assessment'
    }
    if (path === '/user/settings') {
      return pathname === '/user/settings'
    }
    if (path === '/goals-okr/insight') {
      return pathname === '/goals-okr/insight'
    }
    if (path === '/goals-okr/execute') {
      return pathname.startsWith('/goals-okr/execute') || pathname.startsWith('/goals-okr/kanban')
    }
    return pathname.startsWith(path)
  }

  // Bottom navigation items - filtered based on Goals-OKR context
  const bottomNavItems = useMemo(() => {
    const items = [
      { href: '/home', label: 'Home', icon: Home },
      { href: '/success', label: 'Succes', icon: Star },
      { href: '/assessment', label: 'Assessment', icon: ClipboardCheck },
    ]

    // Only add Goal, Execute, Insight if Goals-OKR context is not NONE
    if (goalsOkrContext !== 'NONE') {
      items.push(
        { href: '/goals-okr', label: 'Goal', icon: Target },
        { href: '/goals-okr/execute', label: 'Execute', icon: TrendingUp },
        { href: '/goals-okr/insight', label: 'Insight', icon: Lightbulb }
      )
    }

    // MySpace is always shown
    items.push(
      { href: '/mywoispace', label: 'MySpace', icon: User },
    )

    return items
  }, [goalsOkrContext])

  // Add/remove class to body when bottom nav is visible
  useEffect(() => {
    if (isAuthenticated) {
      document.body.classList.add('has-bottom-nav')
      return () => {
        document.body.classList.remove('has-bottom-nav')
      }
    } else {
      document.body.classList.remove('has-bottom-nav')
    }
  }, [isAuthenticated])


  return (
    <nav className="navbar w-full z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link 
            href="/" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/Logo's/WOILogoImage.png"
              alt="Qalbsalim"
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
            <span className="text-xl font-bold text-foreground">
              Qalbsalim
            </span>
            {pageTitle && (
              <span className="text-sm text-muted-foreground font-normal ml-2">
                {pageTitle}
              </span>
            )}
          </Link>

          {/* Desktop Auth - Only show auth buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated && (
              <>
                <Link
                  href="/login"
                >
                  <Button
                    variant="ghost"
                    className={`cursor-pointer bg-transparent ${textColor} border-none ${hoverBg} ${hoverText} transition-colors`}
                  >
                    Inloggen
                  </Button>
                </Link>
                <Link
                  href="/register"
                >
                  <Button
                    variant="ghost"
                    className={`cursor-pointer bg-transparent ${textColor} border-none ${hoverBg} ${hoverText} transition-colors`}
                  >
                    Registreren
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Menu Button - Visible on mobile only */}
          <Button
            variant="ghost"
            size="icon"
            className={`md:hidden bg-transparent ${textColor} border-none ${hoverBg} ${hoverText} transition-colors`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </Button>
        </div>

        {/* Mobile Menu Dropdown - Visible on mobile when open */}
        {/* Only shows auth buttons - Primary nav is in bottom bar */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-2">
              {!isAuthenticated && (
                <>
                  <Link
                    href="/login"
                    className="w-full"
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start bg-transparent ${textColor} border-none ${hoverBg} ${hoverText} transition-colors`}
                    >
                      Inloggen
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    className="w-full"
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start bg-transparent ${textColor} border-none ${hoverBg} ${hoverText} transition-colors`}
                    >
                      Registreren
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar - Always visible, swipeable on mobile when many items */}
      {isAuthenticated && (
        <div className="fixed bottom-0 left-0 right-0 bg-background backdrop-blur-md border-t border-border z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div
            ref={bottomNavScrollRef}
            className="w-full min-w-0 overflow-x-scroll overflow-y-hidden px-2 py-2 select-none cursor-grab active:cursor-grabbing"
            style={{ WebkitOverflowScrolling: 'touch' }}
            onWheel={handleBottomNavWheel}
            onMouseDown={handleBottomNavMouseDown}
            onClickCapture={handleBottomNavClick}
          >
            <div className="flex items-center flex-nowrap gap-0 min-w-max lg:min-w-0 lg:w-full lg:max-w-6xl lg:mx-auto lg:justify-around">
              {bottomNavItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                const disabled = navDisabled
                return (
                  <Link
                    key={item.href}
                    href={disabled ? '#' : item.href}
                    className={`flex flex-shrink-0 flex-col items-center justify-center gap-1 px-3 py-2 min-w-[72px] rounded-lg transition-colors ${
                      disabled ? 'opacity-50 pointer-events-none cursor-not-allowed' : 'hover:bg-muted'
                    }`}
                    onClick={(e) => disabled ? e.preventDefault() : setMobileMenuOpen(false)}
                    aria-disabled={disabled}
                  >
                    <Icon 
                      className={`h-5 w-5 transition-colors ${
                        active 
                          ? 'text-primary' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                    <span 
                      className={`text-xs font-medium transition-colors ${
                        active 
                          ? 'text-primary' 
                          : 'text-muted-foreground'
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                )
              })}
              {/* User settings - always accessible */}
              <Link
                href="/user/settings"
                className="flex flex-shrink-0 flex-col items-center justify-center gap-1 px-3 py-2 min-w-[72px] max-w-[140px] rounded-lg transition-colors hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserCircle 
                  className={`h-5 w-5 transition-colors ${
                    pathname === '/user/settings' 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                  }`} 
                />
                <span 
                  className={`text-xs font-medium transition-colors truncate max-w-[120px] text-center block min-w-0 ${
                    pathname === '/user/settings' 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                  }`}
                >
                  {user?.email || 'User'}
                </span>
              </Link>
              {/* Logout button - always accessible */}
              <button
                onClick={handleLogout}
                className="flex flex-shrink-0 flex-col items-center justify-center gap-1 px-3 py-2 min-w-[72px] rounded-lg transition-colors hover:bg-muted"
              >
                <LogOut className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Uitloggen
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

