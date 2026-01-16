/**
 * Falah Dashboard Component
 * 
 * Dashboard voor Falah (Chapter 0 in Falah Book)
 * Toont voortgang over alle drie pijlers:
 * - Dunya (Category #1)
 * - Inner World (Category #2) 
 * - Akhirah (Category #3)
 * 
 * En doelen tracking
 */

'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { ChapterHeader } from '@/features/content'
import type { ChapterDTO, BookDTO, CategoryDTO } from '@/shared/api/types'
import { useFalahDashboardData } from '../hooks/useFalahDashboardData'
import { Loading } from '@/shared/components/ui/Loading'
import { Error } from '@/shared/components/ui/Error'

interface FalahDashboardProps {
  chapter: ChapterDTO
  book: BookDTO
  category: CategoryDTO
  language: 'nl' | 'en'
}

export function FalahDashboard({ chapter, book, category, language }: FalahDashboardProps) {
  const { data: dashboardData, isLoading, error } = useFalahDashboardData()

  if (isLoading) {
    return (
      <div className="space-y-8">
        <ChapterHeader 
          chapter={chapter} 
          chapterVersion={null}
          language={language}
        />
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <ChapterHeader 
          chapter={chapter} 
          chapterVersion={null}
          language={language}
        />
        <Error message={error.message || 'Failed to load dashboard data'} />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Chapter Header */}
      <ChapterHeader 
        chapter={chapter} 
        chapterVersion={null}
        language={language}
      />

      {/* Dashboard Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Dunya Progress */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'nl' ? 'Bouw Je Dunya' : 'Build Your Dunya'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'nl' ? 'Gelezen chapters' : 'Chapters read'}
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboardData.dunya.chaptersRead || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'nl' ? 'Projecten gestart' : 'Projects started'}
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboardData.dunya.projectsStarted || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'nl' ? 'Tijd besteed' : 'Time spent'}
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboardData.dunya.timeSpent || '0h'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                {language === 'nl' ? 'Geen data beschikbaar' : 'No data available'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Inner World Progress */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'nl' ? 'Versterk Je Innerlijke Wereld' : 'Strengthen Your Inner World'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'nl' ? 'Learning flows voltooid' : 'Learning flows completed'}
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboardData.innerWorld.flowsCompleted || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'nl' ? 'Sections gelezen' : 'Sections read'}
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboardData.innerWorld.sectionsRead || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'nl' ? 'Tijd besteed' : 'Time spent'}
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboardData.innerWorld.timeSpent || '0h'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                {language === 'nl' ? 'Geen data beschikbaar' : 'No data available'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Akhirah Progress */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'nl' ? 'Bereid Je Voor op de Ākhirah' : 'Prepare for the Ākhirah'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'nl' ? 'Goede werken' : 'Good deeds'}
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboardData.akhirah.goodDeeds || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'nl' ? 'Tijd besteed' : 'Time spent'}
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboardData.akhirah.timeSpent || '0h'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                {language === 'nl' ? 'Geen data beschikbaar' : 'No data available'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Goals Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'nl' ? 'Jouw Doelen' : 'Your Goals'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData?.goals && dashboardData.goals.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.goals.map((goal, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <p className="font-medium">{goal.title}</p>
                  {goal.progress !== undefined && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Voortgang</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              {language === 'nl' 
                ? 'Nog geen doelen gesteld. Ga naar de andere chapters om doelen te stellen.' 
                : 'No goals set yet. Go to other chapters to set goals.'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
