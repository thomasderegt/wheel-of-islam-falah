'use client'

/**
 * Bottom Navigation Component
 * 
 * Bottom navigation bar for authenticated users
 */

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useRouter } from 'next/navigation'
import { Home, Target, LayoutGrid, User, LogOut, UserCircle } from 'lucide-react'

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuth()
  const logout = useLogout()

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
    return pathname.startsWith(path)
  }

  // Bottom navigation items
  const bottomNavItems = [
    { href: '/home', label: 'Succes', icon: Home },
    { href: '/goals-okr', label: 'Goal', icon: Target },
    { href: '/goals-okr/kanban', label: 'Focus', icon: LayoutGrid },
    { href: '/mywoispace', label: 'My Space', icon: User },
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

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around px-2 py-2 max-w-7xl mx-auto">
        {bottomNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] rounded-lg transition-colors hover:bg-muted"
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
  )
}
