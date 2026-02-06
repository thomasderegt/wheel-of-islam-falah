'use client'

/**
 * Navbar Component (Simplified for v2)
 * 
 * Navigation bar component voor de root/landing pagina.
 * Vereenvoudigde versie die werkt met v2's auth setup.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/shared/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/components/ui/select'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useTheme } from '@/shared/contexts/ThemeContext'

interface NavbarProps {
  variant?: 'default' | 'landing'
}

export default function Navbar({ variant = 'default' }: NavbarProps = {}) {
  const textColor = variant === 'landing' ? 'text-foreground' : 'text-white'
  const hoverBg = variant === 'landing' ? 'hover:bg-muted' : 'hover:bg-white/10'
  const hoverText = variant === 'landing' ? 'hover:text-foreground' : 'hover:text-white'
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const logout = useLogout()
  const { userGroup, setUserGroup, availableGroups } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
    setMobileMenuOpen(false)
  }

  const handleNavigation = (path: string) => {
    router.push(path)
    setMobileMenuOpen(false)
  }

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
          </Link>

          {/* Desktop Navigation Menu - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
            {/* Temporary Theme Switcher */}
            <Select
              value={userGroup || 'universal'}
              onValueChange={(value) => setUserGroup(value)}
            >
              <SelectTrigger className="w-[180px] h-9 bg-background text-foreground border border-border hover:bg-accent">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                {availableGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group === 'adult-woman' ? 'Adult Woman' :
                     group === 'adult-man' ? 'Adult Man' :
                     group === 'young-adult-male' ? 'Young Adult Male' :
                     group === 'young-adult-female' ? 'Young Adult Female' :
                     'Universal'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/home')}
                  className={`cursor-pointer bg-transparent ${textColor} border-none ${hoverBg} ${hoverText} transition-colors`}
                >
                  Succes
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/goals-okr')}
                  className={`cursor-pointer bg-transparent ${textColor} border-none ${hoverBg} ${hoverText} transition-colors`}
                >
                  Goal
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/goals-okr/kanban')}
                  className={`cursor-pointer bg-transparent ${textColor} border-none ${hoverBg} ${hoverText} transition-colors`}
                >
                  Kanban
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/mywoispace')}
                  className={`cursor-pointer bg-transparent ${textColor} border-none ${hoverBg} ${hoverText} transition-colors`}
                >
                  My Space
                </Button>
                <span className={`text-sm ${textColor} px-3 py-2 rounded-md transition-colors ${hoverBg} cursor-default`}>
                  {user?.email}
                </span>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className={`cursor-pointer bg-transparent ${textColor} border-none ${hoverBg} ${hoverText} transition-colors`}
                >
                  Uitloggen
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/login')}
                  className={`cursor-pointer bg-transparent ${textColor} border-none ${hoverBg} ${hoverText} transition-colors`}
                >
                  Inloggen
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/register')}
                  className={`cursor-pointer bg-transparent ${textColor} border-none ${hoverBg} ${hoverText} transition-colors`}
                >
                  Registreren
                </Button>
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
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-2">
              {/* Temporary Theme Switcher - Mobile */}
              <div className="px-2 py-2">
                <Select
                  value={userGroup || 'universal'}
                  onValueChange={(value) => setUserGroup(value)}
                >
                  <SelectTrigger className="w-full h-9 bg-background text-foreground border border-border">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group === 'adult-woman' ? 'Adult Woman' :
                         group === 'adult-man' ? 'Adult Man' :
                         group === 'young-adult-male' ? 'Young Adult Male' :
                         group === 'young-adult-female' ? 'Young Adult Female' :
                         'Universal'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation('/home')}
                    className={`w-full justify-start bg-transparent ${textColor} border-none ${hoverBg} ${hoverText} transition-colors`}
                  >
                    Succes
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation('/goals-okr')}
                    className={`w-full justify-start bg-transparent ${textColor} border-none ${hoverBg} ${hoverText} transition-colors`}
                  >
                    Goal
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation('/goals-okr/kanban')}
                    className={`w-full justify-start bg-transparent ${textColor} border-none ${hoverBg} ${hoverText} transition-colors`}
                  >
                    Kanban
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation('/mywoispace')}
                    className={`w-full justify-start bg-transparent ${textColor} border-none ${hoverBg} ${hoverText} transition-colors`}
                  >
                    My Space
                  </Button>
                  <div className={`px-3 py-2 text-sm ${textColor}`}>
                    {user?.email}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className={`w-full justify-start bg-transparent ${textColor} border-none ${hoverBg} ${hoverText} transition-colors`}
                  >
                    Uitloggen
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation('/login')}
                    className={`w-full justify-start bg-transparent ${textColor} border-none ${hoverBg} ${hoverText} transition-colors`}
                  >
                    Inloggen
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation('/register')}
                    className={`w-full justify-start bg-transparent ${textColor} border-none ${hoverBg} ${hoverText} transition-colors`}
                  >
                    Registreren
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

