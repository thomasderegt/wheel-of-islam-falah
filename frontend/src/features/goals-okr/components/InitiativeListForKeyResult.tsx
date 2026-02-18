'use client'

/**
 * InitiativeListForKeyResult Component
 *
 * Lijst van initiatives binnen een user key result instance:
 * - User-created initiatives (UserInitiative) met delete
 * - Gestarte template initiatives (UserInitiativeInstance) met remove
 */

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useInitiativesByUserKeyResultInstance } from '../hooks/useInitiativesByUserKeyResultInstance'
import { useDeleteInitiative } from '../hooks/useDeleteInitiative'
import { useDeleteUserInitiativeInstance } from '../hooks/useDeleteUserInitiativeInstance'
import { useAddKanbanItem } from '../hooks/useKanbanItems'
import { useAuth } from '@/features/auth'
import {
  getUserInitiativeInstancesByUserKeyResultInstance,
  getInitiativesByKeyResult,
} from '../api/goalsOkrApi'
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
import { CheckCircle2, Circle, Archive, BookOpen, Trash2, Plus } from 'lucide-react'
import type { UserInitiativeDTO, UserInitiativeInstanceDTO } from '../api/goalsOkrApi'

interface InitiativeListForKeyResultProps {
  readonly userKeyResultInstanceId: number
  readonly keyResultId?: number | null
  readonly language?: 'nl' | 'en'
}

type DeleteTarget =
  | { type: 'initiative'; initiative: UserInitiativeDTO }
  | { type: 'instance'; instance: UserInitiativeInstanceDTO; title: string }

export function InitiativeListForKeyResult({
  userKeyResultInstanceId,
  keyResultId,
  language = 'en',
}: InitiativeListForKeyResultProps) {
  const router = useRouter()
  const { user } = useAuth()
  const addKanbanItem = useAddKanbanItem()
  const { data: initiatives = [], isLoading: isLoadingInitiatives } = useInitiativesByUserKeyResultInstance(userKeyResultInstanceId)
  const { data: instances = [], isLoading: isLoadingInstances } = useQuery({
    queryKey: ['goals-okr', 'userInitiativeInstances', 'userKeyResultInstance', userKeyResultInstanceId],
    queryFn: () => getUserInitiativeInstancesByUserKeyResultInstance(userKeyResultInstanceId),
    enabled: !!userKeyResultInstanceId,
  })
  const { data: templates = [] } = useQuery({
    queryKey: ['initiativeTemplates', keyResultId],
    queryFn: () => getInitiativesByKeyResult(keyResultId!),
    enabled: !!keyResultId,
  })
  const deleteInitiativeMutation = useDeleteInitiative()
  const deleteInstanceMutation = useDeleteUserInitiativeInstance()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)

  const userInitiativeIds = useMemo(() => new Set(initiatives.map((i) => i.id)), [initiatives])
  const templateInstances = useMemo(
    () => instances.filter((inst) => !userInitiativeIds.has(inst.initiativeId)),
    [instances, userInitiativeIds]
  )
  const getInstanceForUserInitiative = (initiative: UserInitiativeDTO) =>
    instances.find((i) => i.initiativeId === initiative.id)

  const handleAddToKanban = (e: React.MouseEvent, instanceId: number) => {
    e.stopPropagation()
    if (!user?.id) return
    addKanbanItem.mutate(
      { userId: user.id, itemType: 'INITIATIVE', itemId: instanceId },
      {
        onSuccess: () => {
          if (language === 'nl') {
            alert('Toegevoegd aan kanban board')
          } else {
            alert('Added to kanban board')
          }
        },
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? (err as Error).message
          const isDuplicate = /already exists|Item already exists/i.test(msg ?? '')
          if (isDuplicate) {
            alert(language === 'nl' ? 'Staat al op kanban board' : 'Already on kanban board')
          } else {
            alert(msg ?? (language === 'nl' ? 'Kon niet toevoegen' : 'Could not add'))
          }
        },
      }
    )
  }
  const getTemplateTitle = (initiativeId: number) => {
    const t = templates.find((x) => x.id === initiativeId)
    if (!t) return null
    return language === 'nl' ? (t.titleNl || t.titleEn) : (t.titleEn || t.titleNl)
  }

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

  const handleDeleteInitiativeClick = (e: React.MouseEvent, initiative: UserInitiativeDTO) => {
    e.stopPropagation()
    setDeleteTarget({ type: 'initiative', initiative })
    setDeleteDialogOpen(true)
  }

  const handleDeleteInstanceClick = (e: React.MouseEvent, instance: UserInitiativeInstanceDTO) => {
    e.stopPropagation()
    const title = getTemplateTitle(instance.initiativeId) ?? instance.number ?? String(instance.id)
    setDeleteTarget({ type: 'instance', instance, title })
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    if (deleteTarget.type === 'initiative') {
      deleteInitiativeMutation.mutate(deleteTarget.initiative.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setDeleteTarget(null)
        },
      })
    } else {
      deleteInstanceMutation.mutate(deleteTarget.instance.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setDeleteTarget(null)
        },
      })
    }
  }

  const isDeleting = deleteInitiativeMutation.isPending || deleteInstanceMutation.isPending

  if (isLoadingInitiatives || isLoadingInstances) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    )
  }

  const hasAny = initiatives.length > 0 || templateInstances.length > 0
  if (!hasAny) {
    return (
      <div className="w-full text-center text-muted-foreground py-12">
        <p>{language === 'nl' ? 'Geen initiatives gevonden' : 'No initiatives found'}</p>
        <p className="text-sm mt-2">
          {language === 'nl'
            ? 'Start een initiative uit de suggesties hierboven of maak een nieuw initiative aan.'
            : 'Start an initiative from the suggestions above or create a new initiative.'}
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
                  {getInstanceForUserInitiative(initiative) && user?.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleAddToKanban(e, getInstanceForUserInitiative(initiative)!.id)}
                      disabled={addKanbanItem.isPending}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                      title={language === 'nl' ? 'Toevoegen aan kanban' : 'Add to kanban'}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteInitiativeClick(e, initiative)}
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
        {templateInstances.map((instance) => {
          const title = getTemplateTitle(instance.initiativeId) ?? instance.number ?? `Initiative ${instance.id}`
          return (
            <Card
              key={`instance-${instance.id}`}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    {instance.number && (
                      <span className="text-xs font-mono text-muted-foreground mb-1 block">
                        {instance.number}
                      </span>
                    )}
                    <CardTitle>{title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      <Circle className="h-3 w-3 mr-1" />
                      {instance.completedAt ? 'Completed' : 'Active'}
                    </Badge>
                    {user?.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleAddToKanban(e, instance.id)}
                        disabled={addKanbanItem.isPending}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                        title={language === 'nl' ? 'Toevoegen aan kanban' : 'Add to kanban'}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteInstanceClick(e, instance)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      title={language === 'nl' ? 'Initiatief verwijderen' : 'Remove initiative'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'nl' ? 'Initiatief verwijderen?' : 'Remove initiative?'}
            </DialogTitle>
            <DialogDescription>
              {deleteTarget &&
                (language === 'nl'
                  ? `Weet je zeker dat je "${deleteTarget.type === 'initiative' ? deleteTarget.initiative.title : deleteTarget.title}" wilt verwijderen? Dit verwijdert het initiatief en het van je progress board.`
                  : `Are you sure you want to remove "${deleteTarget.type === 'initiative' ? deleteTarget.initiative.title : deleteTarget.title}"? This will delete the initiative and remove it from your progress board.`)}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setDeleteTarget(null)
              }}
              disabled={isDeleting}
            >
              {language === 'nl' ? 'Annuleren' : 'Cancel'}
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting
                ? (language === 'nl' ? 'Verwijderen...' : 'Removing...')
                : (language === 'nl' ? 'Verwijderen' : 'Remove')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
