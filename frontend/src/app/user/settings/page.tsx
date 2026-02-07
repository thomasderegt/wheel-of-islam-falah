'use client'

/**
 * User Settings Page
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
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useTheme } from '@/shared/contexts/ThemeContext'

export default function UserSettingsPage() {
  const { user } = useAuth()
  const { userGroup, setUserGroup, availableGroups } = useTheme()

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
                  User Settings
                </h1>
                <p className="text-muted-foreground text-lg">
                  Manage your account settings and preferences
                </p>
              </div>

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
                        <SelectValue placeholder="Select theme" />
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
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
