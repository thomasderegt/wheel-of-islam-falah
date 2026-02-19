'use client'

/**
 * NavGoalCircle Component
 *
 * Grid navigation voor objectives binnen een life domain (goal layer removed).
 * - Objectives in een grid layout
 * - Create Custom Objective card
 * - Add to Kanban = start user objective instance + add OBJECTIVE item
 */

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useObjectivesByLifeDomain } from '../hooks/useObjectivesByLifeDomain'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { Loading } from '@/shared/components/ui/Loading'
import { useAuth } from '@/features/auth'
import { useAddKanbanItem } from '../hooks/useKanbanItems'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { CreateCustomObjectiveDialog } from './CreateCustomObjectiveDialog'
import { Plus, Trash2 } from 'lucide-react'
import { useDeleteObjective } from '../hooks/useDeleteObjective'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { startUserObjectiveInstance } from '../api/goalsOkrApi'
import type { ObjectiveDTO } from '../api/goalsOkrApi'

interface NavGoalCircleProps {
  readonly lifeDomainId: number
  readonly language?: 'nl' | 'en'
}

export function NavGoalCircle({ lifeDomainId, language = 'en' }: NavGoalCircleProps) {
  const router = useRouter()
  const { data: objectives, isLoading } = useObjectivesByLifeDomain(lifeDomainId)
  const { userGroup } = useTheme()
  const { user } = useAuth()
  const addKanbanItem = useAddKanbanItem()
  const queryClient = useQueryClient()
  const isWireframeTheme = !userGroup || userGroup === 'universal'

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedObjective, setSelectedObjective] = useState<ObjectiveDTO | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [objectiveToDelete, setObjectiveToDelete] = useState<ObjectiveDTO | null>(null)
  const deleteObjectiveMutation = useDeleteObjective()

  const startObjectiveInstanceMutation = useMutation({
    mutationFn: ({ userId, objectiveId }: { userId: number; objectiveId: number }) =>
      startUserObjectiveInstance(userId, objectiveId),
  })

  const getObjectiveTitle = (obj: ObjectiveDTO): string => {
    if (language === 'nl' && obj.titleNl) return obj.titleNl
    return obj.titleEn || obj.titleNl || `Objective ${obj.id}`
  }

  const handleAddToKanbanClick = (e: React.MouseEvent, objective: ObjectiveDTO) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user?.id) return
    setSelectedObjective(objective)
    setConfirmDialogOpen(true)
  }

  const handleConfirmAddToKanban = async () => {
    if (!user?.id || !selectedObjective) return

    try {
      const instance = await startObjectiveInstanceMutation.mutateAsync({
        userId: user.id,
        objectiveId: selectedObjective.id,
      })

      if (!instance?.id) {
        console.error('Failed to get user objective instance ID:', instance)
        alert('Failed to start objective. Please try again.')
        setConfirmDialogOpen(false)
        setSelectedObjective(null)
        return
      }

      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'user-objective-instances'] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'userObjectiveInstances'] })

      addKanbanItem.mutate(
        {
          userId: user.id,
          itemType: 'OBJECTIVE',
          itemId: instance.id,
        },
        {
          onSuccess: () => {
            setConfirmDialogOpen(false)
            setSelectedObjective(null)
            router.push('/goals-okr/kanban')
          },
          onError: (error: unknown) => {
            console.error('Failed to add kanban item:', error)
            const err = error as { response?: { data?: { error?: string }; message?: string }; message?: string }
            alert(err?.response?.data?.error || err?.message || 'Failed to add objective to kanban board')
            setConfirmDialogOpen(false)
            setSelectedObjective(null)
          },
        }
      )
    } catch (error: unknown) {
      console.error('Failed to start objective instance:', error)
      const err = error as { response?: { data?: { error?: string }; message?: string }; message?: string }
      alert(err?.response?.data?.error || err?.message || 'Failed to start objective')
      setConfirmDialogOpen(false)
      setSelectedObjective(null)
    }
  }

  const handleCancelAddToKanban = () => {
    setConfirmDialogOpen(false)
    setSelectedObjective(null)
  }

  const handleDeleteClick = (e: React.MouseEvent, objective: ObjectiveDTO) => {
    e.preventDefault()
    e.stopPropagation()
    setObjectiveToDelete(objective)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!objectiveToDelete) return
    deleteObjectiveMutation.mutate(objectiveToDelete.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false)
        setObjectiveToDelete(null)
        queryClient.invalidateQueries({ queryKey: ['goals-okr', 'objectives', 'lifeDomain', lifeDomainId] })
      },
      onError: (err: unknown) => {
        const message = (err as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error ?? (err as Error).message
        alert(message ?? 'Could not delete objective')
      },
    })
  }

  const handleCreateSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['goals-okr', 'objectives', 'lifeDomain', lifeDomainId] })
    queryClient.invalidateQueries({ queryKey: ['goals-okr', 'user-objective-instances'] })
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="relative w-full aspect-square flex items-center justify-center">
          <Loading />
        </div>
      </div>
    )
  }

  const showEmpty = !objectives || objectives.length === 0

  return (
    <>
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Create Custom Objective Card */}
          {user?.id && (
            <div
              onClick={() => setCreateDialogOpen(true)}
              className={`
                p-6 rounded-lg border-2 border-dashed cursor-pointer transition-all bg-card relative
                ${isWireframeTheme
                  ? 'border-border hover:border-foreground hover:bg-accent'
                  : 'border-primary/40 hover:border-primary hover:bg-primary/10'}
              `}
            >
              <div className="flex flex-col items-center justify-center text-center space-y-2 min-h-[120px]">
                <div
                  className={`
                  p-3 rounded-full
                  ${isWireframeTheme ? 'bg-muted' : 'bg-primary/20'}
                `}
                >
                  <Plus className={isWireframeTheme ? 'text-foreground h-6 w-6' : 'text-primary h-6 w-6'} />
                </div>
                <h3 className="text-xl font-bold">Create Custom Objective</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Add your own objective for this life domain
                </p>
              </div>
            </div>
          )}

          {/* Objective cards - waar je OKRs aanmaakt en weer kunt verwijderen */}
          {objectives?.map((objective) => (
            <Link
              key={objective.id}
              href={`/goals-okr/objectives/${objective.id}`}
              className={`
                block p-6 rounded-lg border-2 cursor-pointer transition-all bg-card relative
                ${isWireframeTheme
                  ? 'border-border hover:border-foreground hover:bg-accent'
                  : 'border-primary/20 hover:border-primary hover:bg-primary/10'}
              `}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  {objective.number && (
                    <span className="text-xs font-mono text-muted-foreground mb-1 block">
                      {objective.number}
                    </span>
                  )}
                  <h3 className="text-xl font-bold">{getObjectiveTitle(objective)}</h3>
                </div>
                {user?.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleAddToKanbanClick(e, objective)}
                    className="h-8 w-8 p-0 flex-shrink-0"
                    title="Add to Progress"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {(language === 'nl' ? objective.descriptionNl : objective.descriptionEn) && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {language === 'nl' ? objective.descriptionNl : objective.descriptionEn}
                </p>
              )}
              {/* Verwijderen-knop: aparte rij zodat hij altijd zichtbaar is */}
              <div onClick={(e) => e.stopPropagation()} className="mt-2 pt-2 border-t border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDeleteClick(e, objective)}
                  className="h-8 px-2 gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-full justify-start"
                  title={language === 'nl' ? 'Objective verwijderen' : 'Remove objective'}
                >
                  <Trash2 className="h-4 w-4 shrink-0" />
                  <span className="text-sm">{language === 'nl' ? 'Objective verwijderen' : 'Remove objective'}</span>
                </Button>
              </div>
            </Link>
          ))}
        </div>

        {showEmpty && !user?.id && (
          <div className="relative w-full aspect-square flex items-center justify-center">
            <div className="text-muted-foreground text-center">
              <p>No objectives found</p>
              <p className="text-sm mt-2">Objectives will appear here once templates are created</p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Objective to Progress</DialogTitle>
            <DialogDescription>
              Add this objective to your kanban board and start tracking progress?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelAddToKanban}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAddToKanban}
              disabled={addKanbanItem.isPending || startObjectiveInstanceMutation.isPending}
            >
              {addKanbanItem.isPending || startObjectiveInstanceMutation.isPending ? 'Adding...' : 'Add to Progress'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateCustomObjectiveDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        lifeDomainId={lifeDomainId}
        onSuccess={handleCreateSuccess}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'nl' ? 'Objective verwijderen?' : 'Remove objective?'}
            </DialogTitle>
            <DialogDescription>
              {language === 'nl'
                ? `Weet je zeker dat je "${objectiveToDelete ? getObjectiveTitle(objectiveToDelete) : ''}" wilt verwijderen? Alle key results, instances en kanban-items onder dit objective worden ook verwijderd.`
                : `Are you sure you want to remove "${objectiveToDelete ? getObjectiveTitle(objectiveToDelete) : ''}"? All key results, instances and kanban items under this objective will also be deleted.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setObjectiveToDelete(null) }} disabled={deleteObjectiveMutation.isPending}>
              {language === 'nl' ? 'Annuleren' : 'Cancel'}
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleteObjectiveMutation.isPending}>
              {deleteObjectiveMutation.isPending ? (language === 'nl' ? 'Verwijderen...' : 'Removing...') : (language === 'nl' ? 'Verwijderen' : 'Remove')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
