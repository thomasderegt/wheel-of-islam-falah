'use client'

/**
 * InitiativeList Component
 * 
 * Lijst van initiatives binnen een user objective instance
 * Met progress tracking en status indicators
 */

import { useRouter } from 'next/navigation'
import { useInitiativesByUserObjectiveInstance } from '../hooks/useInitiativesByUserObjectiveInstance'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Loading } from '@/shared/components/ui/Loading'
import { CheckCircle2, Circle, Archive } from 'lucide-react'
import type { InitiativeDTO } from '../api/goalsOkrApi'

interface InitiativeListProps {
  readonly userObjectiveInstanceId: number
  readonly language?: 'nl' | 'en'
}

export function InitiativeList({ userObjectiveInstanceId, language = 'en' }: InitiativeListProps) {
  const router = useRouter()
  const { data: initiatives, isLoading } = useInitiativesByUserObjectiveInstance(userObjectiveInstanceId)

  const getStatusBadge = (status: InitiativeDTO['status']) => {
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
        <p>No initiatives found</p>
        <p className="text-sm mt-2">Initiatives will appear here once you start working on this objective</p>
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
                <CardTitle>
                  {initiative.title}
                </CardTitle>
                {getStatusBadge(initiative.status)}
              </div>
            </CardHeader>
            <CardContent>
              {initiative.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {initiative.description}
                </p>
              )}
              <div className="flex items-center justify-between text-sm">
                {initiative.targetDate && (
                  <span className="text-muted-foreground">
                    Target: {new Date(initiative.targetDate).toLocaleDateString()}
                  </span>
                )}
                <span className="text-muted-foreground">
                  {initiative.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
