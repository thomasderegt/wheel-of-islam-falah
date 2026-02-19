'use client'

import { useState } from 'react'
import { useAuth } from '@/features/auth'
import { useCreateCustomObjective } from '../hooks/useUserGoals'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'

interface CreateCustomObjectiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lifeDomainId: number
  onSuccess?: () => void
}

export function CreateCustomObjectiveDialog({
  open,
  onOpenChange,
  lifeDomainId,
  onSuccess,
}: CreateCustomObjectiveDialogProps) {
  const { user } = useAuth()
  const createCustomObjective = useCreateCustomObjective()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) {
      alert('Please log in to create a custom objective.')
      return
    }
    if (!title.trim()) return

    createCustomObjective.mutate(
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
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { error?: string }; message?: string }; message?: string }
          alert(err?.response?.data?.error || err?.message || 'Failed to create objective. Please try again.')
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
            <DialogTitle>Create Custom Objective</DialogTitle>
            <DialogDescription>
              Create your own custom objective for this life domain.
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
                disabled={createCustomObjective.isPending}
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
                disabled={createCustomObjective.isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createCustomObjective.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createCustomObjective.isPending || !title.trim()}
            >
              {createCustomObjective.isPending ? 'Creating...' : 'Create Objective'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
