'use client'

/**
 * InitiativeListForKeyResult Component
 * 
 * Lijst van initiatives binnen een user key result instance
 * Met progress tracking en status indicators
 */

import { useRouter } from 'next/navigation'
import { useInitiativesByUserKeyResultInstance } from '../hooks/useInitiativesByUserKeyResultInstance'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Loading } from '@/shared/components/ui/Loading'
import { CheckCircle2, Circle, Archive, BookOpen } from 'lucide-react'
import type { UserInitiativeDTO } from '../api/goalsOkrApi'

interface InitiativeListForKeyResultProps {
  readonly userKeyResultInstanceId: number
  readonly language?: 'nl' | 'en'
}

export function InitiativeListForKeyResult({ userKeyResultInstanceId, language = 'en' }: InitiativeListForKeyResultProps) {
  const router = useRouter()
  const { data: initiatives, isLoading } = useInitiativesByUserKeyResultInstance(userKeyResultInstanceId)

  const getStatusBadge = (status: UserInitiativeDTO['status']) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case 'ARCHIVED':
        return (
          <Badge variant="secondary">
            <Archive className="h-3 w-3 mr-1" />
            Archived
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <Circle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
    }
  }

  const handleInitiativeClick = (initiativeId: number) => {
    // Could navigate to initiative detail page if needed
    // router.push(`/goals-okr/initiatives/${initiativeId}`)
  }

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    )
  }

  if (!initiatives || initiatives.length === 0) {
    return (
      <div className="w-full text-center text-muted-foreground py-12">
        <p>{language === 'nl' ? 'Geen initiatives gevonden' : 'No initiatives found'}</p>
        <p className="text-sm mt-2">
          {language === 'nl' 
            ? 'Initiatives verschijnen hier zodra je begint met werken aan dit key result'
            : 'Initiatives will appear here once you start working on this key result'}
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="space-y-4">
        {initiatives.map((initiative) => (
          <Card
            key={initiative.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleInitiativeClick(initiative.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  {initiative.number && (
                    <span className="text-xs font-mono text-muted-foreground mb-1 block">
                      {initiative.number}
                    </span>
                  )}
                  <CardTitle>
                    {initiative.title}
                  </CardTitle>
                </div>
                {getStatusBadge(initiative.status)}
              </div>
            </CardHeader>
            <CardContent>
              {initiative.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {initiative.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  {initiative.targetDate && (
                    <span className="text-muted-foreground">
                      Target: {new Date(initiative.targetDate).toLocaleDateString()}
                    </span>
                  )}
                  <span className="text-muted-foreground">
                    {initiative.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                {initiative.learningFlowEnrollmentId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/enrollments/${initiative.learningFlowEnrollmentId}/flow`)
                    }}
                    className="gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    {language === 'nl' ? 'Ga naar Learning Flow' : 'Continue Learning Flow'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
