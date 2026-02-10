'use client'

/**
 * Navbar Component (Simplified for v2)
 * 
 * Navigation bar component voor de root/landing pagina.
 * Vereenvoudigde versie die werkt met v2's auth setup.
 */

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/shared/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { Star, Target, TrendingUp, Lightbulb, User, LogOut, UserCircle } from 'lucide-react'

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
    setMobileMenuOpen(false)
  }


  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === '/home') return 'Success-Mode'
    if (pathname.startsWith('/goals-okr/insight')) return 'Insight-Mode'
    if (pathname.startsWith('/goals-okr/execute')) return 'Execute-Mode'
    if (pathname.startsWith('/goals-okr/kanban')) return 'Progress-Mode'
    if (pathname.startsWith('/goals-okr')) return 'Goal-Mode'
    return null
  }

  const pageTitle = getPageTitle()

  // Check if a path is active (including sub-routes)
  const isActive = (path: string) => {
    if (path === '/home') {
      return pathname === '/home'
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

  // Bottom navigation items
  const bottomNavItems = [
    { href: '/home', label: 'Succes', icon: Star },
    { href: '/goals-okr', label: 'Goal', icon: Target },
    { href: '/goals-okr/execute', label: 'Execute', icon: TrendingUp },
    { href: '/goals-okr/insight', label: 'Insight', icon: Lightbulb },
    { href: '/mywoispace', label: 'MySpace', icon: User },
  ]

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

      {/* Bottom Navigation Bar - Always visible */}
      {isAuthenticated && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="flex items-center justify-around px-2 py-2 max-w-6xl mx-auto">
            {bottomNavItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
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
            {/* User settings */}
            <Link
              href="/user/settings"
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] rounded-lg transition-colors hover:bg-muted"
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
                className={`text-xs font-medium transition-colors truncate max-w-[120px] text-center ${
                  pathname === '/user/settings' 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                {user?.email || 'User'}
              </span>
            </Link>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] rounded-lg transition-colors hover:bg-muted"
            >
              <LogOut className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Uitloggen
              </span>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

