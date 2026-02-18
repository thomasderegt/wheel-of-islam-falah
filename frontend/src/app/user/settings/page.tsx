'use client'

/**
 * User Management Page
 * 
 * User settings and profile management page
 * Route: /user/settings
 */

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/components/ui/select'
import { Label } from '@/shared/components/ui/label'
import { Button } from '@/shared/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { useUserPreferences, useUpdateUserPreferences } from '@/features/auth/hooks/useUserPreferences'
import { GoalsOkrContext } from '@/shared/api/types'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, Lock } from 'lucide-react'

export default function UserSettingsPage() {
  const { user } = useAuth()
  const { userGroup, setUserGroup, availableGroups } = useTheme()
  const router = useRouter()
  
  // User preferences
  const { data: preferences, isLoading: preferencesLoading } = useUserPreferences(user?.id ?? null)
  const updatePreferences = useUpdateUserPreferences()
  
  // Local state for form
  const [selectedGoalsOkrContext, setSelectedGoalsOkrContext] = useState<GoalsOkrContext>('NONE')
  const [hasChanges, setHasChanges] = useState(false)

  // Initialize form when preferences load
  useEffect(() => {
    if (preferences) {
      setSelectedGoalsOkrContext(preferences.defaultGoalsOkrContext ?? 'NONE')
      setHasChanges(false)
    }
  }, [preferences])

  // Check for changes
  useEffect(() => {
    if (preferences) {
      const changed = 
        selectedGoalsOkrContext !== (preferences.defaultGoalsOkrContext ?? 'NONE')
      setHasChanges(changed)
    }
  }, [selectedGoalsOkrContext, preferences])

  // Handle save
  const handleSave = async () => {
    if (!user?.id || !hasChanges) return

    try {
      await updatePreferences.mutateAsync({
        userId: user.id,
        data: {
          defaultGoalsOkrContext: selectedGoalsOkrContext,
        },
      })
      setHasChanges(false)
    } catch (error) {
      console.error('Failed to save preferences:', error)
    }
  }

  // Get Goals-OKR context label
  const getGoalsOkrContextLabel = (context: GoalsOkrContext): string => {
    switch (context) {
      case 'NONE':
        return 'Wheel of Success'
      case 'LIFE':
        return 'Wheel of Life'
      case 'BUSINESS':
        return 'Wheel of Business'
      case 'WORK':
        return 'Wheel of Work'
      case 'ALL':
        return 'All Wheels'
      default:
        return context
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar variant="landing" />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  User Management
                </h1>
                <p className="text-muted-foreground text-lg">
                  Manage your account, teams, settings and preferences
                </p>
              </div>

              {/* Cards Grid - 2x2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Your account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <p className="text-foreground mt-1">
                      {user?.email || 'Not available'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Change Password Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Wachtwoord
                  </CardTitle>
                  <CardDescription>
                    Wijzig je wachtwoord. Minimaal 8 tekens.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/user/settings/change-password">
                    <Button variant="outline" className="w-full">
                      <Lock className="mr-2 h-4 w-4" />
                      Verander wachtwoord
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Theme Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Theme Settings</CardTitle>
                  <CardDescription>
                    Choose your preferred theme
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={userGroup || 'universal'}
                      onValueChange={(value) => setUserGroup(value)}
                    >
                      <SelectTrigger id="theme" className="w-full">
                        <SelectValue placeholder="Select theme">
                          {userGroup === 'adult-woman' ? 'Adult Woman' :
                           userGroup === 'adult-man' ? 'Adult Man' :
                           userGroup === 'young-adult-male' ? 'Young Adult Male' :
                           userGroup === 'young-adult-female' ? 'Young Adult Female' :
                           'Universal'}
                        </SelectValue>
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
                </CardContent>
              </Card>

              {/* Teams Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Teams</CardTitle>
                  <CardDescription>
                    Beheer je teams en werk samen met anderen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => router.push('/teams')}
                    className="w-full"
                    variant="outline"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Ga naar Teams
                  </Button>
                </CardContent>
              </Card>

                {/* Context Settings Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Context Settings</CardTitle>
                    <CardDescription className="space-y-1">
                      <div className="text-sm text-muted-foreground">Set a specific Context (Life, Biz or Work), to have full focus on the area</div>
                      <div className="text-sm text-muted-foreground">Set the Context to &quot;All&quot;, in order to have overview of all areas</div>
                      <div className="text-sm text-muted-foreground">Set the Context to &quot;Wheel of Success&quot;, to fully focus on True Success</div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {preferencesLoading ? (
                      <p className="text-muted-foreground">Loading preferences...</p>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="goalsOkrContext">Choose Context</Label>
                          <Select
                            value={selectedGoalsOkrContext || 'NONE'}
                            onValueChange={(value) => setSelectedGoalsOkrContext(value as GoalsOkrContext)}
                          >
                            <SelectTrigger id="goalsOkrContext" className="w-full">
                              <SelectValue placeholder="Select Goals context">
                                {getGoalsOkrContextLabel(selectedGoalsOkrContext || 'NONE')}
                              </SelectValue>
                            </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NONE">Wheel of Success</SelectItem>
                            <SelectItem value="LIFE">Wheel of Life</SelectItem>
                            <SelectItem value="BUSINESS">Wheel of Business</SelectItem>
                            <SelectItem value="WORK">Wheel of Work</SelectItem>
                            <SelectItem value="ALL">All Wheels</SelectItem>
                          </SelectContent>
                          </Select>
                        </div>

                        {hasChanges && (
                          <div className="flex justify-end pt-2">
                            <Button
                              onClick={handleSave}
                              disabled={updatePreferences.isPending}
                            >
                              {updatePreferences.isPending ? 'Saving...' : 'Save Preferences'}
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
