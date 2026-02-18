'use client'

/**
 * InitiativeList Component
 * 
 * Lijst van initiatives binnen een user objective instance
 * Met progress tracking en status indicators
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useInitiativesByUserObjectiveInstance } from '../hooks/useInitiativesByUserObjectiveInstance'
import { useDeleteInitiative } from '../hooks/useDeleteInitiative'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Loading } from '@/shared/components/ui/Loading'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { CheckCircle2, Circle, Archive, BookOpen, Trash2 } from 'lucide-react'
import type { UserInitiativeDTO } from '../api/goalsOkrApi'

interface InitiativeListProps {
  readonly userObjectiveInstanceId: number
  readonly language?: 'nl' | 'en'
}

export function InitiativeList({ userObjectiveInstanceId, language = 'en' }: InitiativeListProps) {
  const router = useRouter()
  const { data: initiatives, isLoading } = useInitiativesByUserObjectiveInstance(userObjectiveInstanceId)
  const deleteInitiativeMutation = useDeleteInitiative()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [initiativeToDelete, setInitiativeToDelete] = useState<UserInitiativeDTO | null>(null)

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

  const handleInitiativeClick = (_initiativeId: number) => {
    // Could navigate to initiative detail page if needed
  }

  const handleDeleteClick = (e: React.MouseEvent, initiative: UserInitiativeDTO) => {
    e.stopPropagation()
    setInitiativeToDelete(initiative)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!initiativeToDelete) return
    deleteInitiativeMutation.mutate(initiativeToDelete.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false)
        setInitiativeToDelete(null)
      },
    })
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
                <div className="flex items-center gap-2">
                  {getStatusBadge(initiative.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteClick(e, initiative)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    title={language === 'nl' ? 'Initiatief verwijderen' : 'Remove initiative'}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'nl' ? 'Initiatief verwijderen?' : 'Remove initiative?'}
            </DialogTitle>
            <DialogDescription>
              {language === 'nl'
                ? `Weet je zeker dat je "${initiativeToDelete?.title ?? ''}" wilt verwijderen? Dit verwijdert het initiatief en het van je progress board.`
                : `Are you sure you want to remove "${initiativeToDelete?.title ?? ''}"? This will delete the initiative and remove it from your progress board.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setInitiativeToDelete(null)
              }}
              disabled={deleteInitiativeMutation.isPending}
            >
              {language === 'nl' ? 'Annuleren' : 'Cancel'}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteInitiativeMutation.isPending}
            >
              {deleteInitiativeMutation.isPending
                ? (language === 'nl' ? 'Verwijderen...' : 'Removing...')
                : (language === 'nl' ? 'Verwijderen' : 'Remove')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
