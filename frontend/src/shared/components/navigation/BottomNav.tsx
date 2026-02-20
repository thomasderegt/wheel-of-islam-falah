'use client'

/**
 * Bottom Navigation Component
 * 
 * Bottom navigation bar for authenticated users
 * 
 * Navigation logic:
 * - Content Context: always SUCCESS (always active)
 * - Goals-OKR Context: LIFE/WORK/BUSINESS/NONE (via user preference)
 * - If Goals-OKR context is NONE: Show only Succes + MySpace + User + Uitloggen
 * - If Goals-OKR context is LIFE/WORK/BUSINESS: Show Succes + Goal + Execute + Insight + MySpace + User + Uitloggen
 */

import { useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useModeContext } from '@/shared/hooks/useModeContext'
import { Star, Target, TrendingUp, Lightbulb, User, LogOut, UserCircle } from 'lucide-react'

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuth()
  const logout = useLogout()
  const { goalsOkrContext } = useModeContext()

  const handleLogout = () => {
    logout()
    router.push('/')
  }


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

  // Determine if Goal/Execute/Insight should be shown
  // Show them only if Goals-OKR context is LIFE, WORK, or BUSINESS (not NONE)
  // Default is NONE, so by default these items are NOT shown
  const showGoalExecuteInsight = goalsOkrContext !== 'NONE'

  // Bottom navigation items - filtered based on Goals-OKR context
  const bottomNavItems = useMemo(() => {
    const items = [
      { href: '/home', label: 'Succes', icon: Star },
    ]

    // Only add Goal, Execute, Insight if Goals-OKR context is not NONE
    // Default is NONE, so by default these items are NOT shown
    if (showGoalExecuteInsight) {
      items.push(
        { href: '/goals-okr', label: 'Goal', icon: Target },
        { href: '/goals-okr/execute', label: 'Execute', icon: TrendingUp },
        { href: '/goals-okr/insight', label: 'Insight', icon: Lightbulb }
      )
    }

    // MySpace is always shown
    items.push(
      { href: '/mywoispace', label: 'MySpace', icon: User }
    )

    return items
  }, [showGoalExecuteInsight, goalsOkrContext]) // Add goalsOkrContext to dependencies for safety

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

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background backdrop-blur-md border-t border-border z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div
        className="flex items-center flex-nowrap gap-0 px-2 py-2 max-w-6xl mx-auto overflow-x-auto overflow-y-hidden"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {bottomNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-shrink-0 flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] rounded-lg transition-colors hover:bg-muted"
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
          className="flex flex-shrink-0 flex-col items-center justify-center gap-1 px-3 py-2 min-w-[72px] max-w-[140px] rounded-lg transition-colors hover:bg-muted"
        >
          <UserCircle 
            className={`h-5 w-5 flex-shrink-0 transition-colors ${
              pathname === '/user/settings' 
                ? 'text-primary' 
                : 'text-muted-foreground'
            }`} 
          />
          <span 
            className={`text-xs font-medium transition-colors truncate w-full max-w-[120px] text-center block min-w-0 ${
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
          className="flex flex-shrink-0 flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] rounded-lg transition-colors hover:bg-muted"
        >
          <LogOut className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            Uitloggen
          </span>
        </button>
      </div>
    </div>
  )
}
