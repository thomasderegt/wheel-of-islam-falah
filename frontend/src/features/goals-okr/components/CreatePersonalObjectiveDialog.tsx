'use client'

import { useState } from 'react'
import { useAuth } from '@/features/auth'
import { useCreatePersonalObjective } from '../hooks/useUserGoals'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'

interface CreatePersonalObjectiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lifeDomainId: number
  onSuccess?: () => void
}

export function CreatePersonalObjectiveDialog({ 
  open, 
  onOpenChange, 
  lifeDomainId,
  onSuccess 
}: CreatePersonalObjectiveDialogProps) {
  const { user } = useAuth()
  const createPersonalObjective = useCreatePersonalObjective()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !title.trim()) return

    createPersonalObjective.mutate(
      {
        userId: user.id,
        lifeDomainId,
        title: title.trim(),
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          setTitle('')
          setDescription('')
          onOpenChange(false)
          onSuccess?.()
        },
      }
    )
  }

  const handleCancel = () => {
    setTitle('')
    setDescription('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Personal Objective</DialogTitle>
            <DialogDescription>
              Create your own personal objective for this life domain.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="objective-title">Title *</Label>
              <Input
                id="objective-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Complete Arabic basics course"
                required
                disabled={createPersonalObjective.isPending}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objective-description">Description</Label>
              <Textarea
                id="objective-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description of your objective..."
                rows={3}
                disabled={createPersonalObjective.isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createPersonalObjective.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createPersonalObjective.isPending || !title.trim()}
            >
              {createPersonalObjective.isPending ? 'Creating...' : 'Create Objective'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
