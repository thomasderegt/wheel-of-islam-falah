'use client'

import { useState } from 'react'
import { useAuth } from '@/features/auth'
import { useCreateUserGoal } from '../hooks/useUserGoals'
import { useLifeDomains } from '../hooks/useLifeDomains'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'

interface CreateUserGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lifeDomainId: number
  onSuccess?: () => void
}

export function CreateUserGoalDialog({ 
  open, 
  onOpenChange, 
  lifeDomainId,
  onSuccess 
}: CreateUserGoalDialogProps) {
  const { user } = useAuth()
  const createUserGoal = useCreateUserGoal()
  const { data: lifeDomains } = useLifeDomains()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const currentLifeDomain = lifeDomains?.find(d => d.id === lifeDomainId)
  const lifeDomainName = currentLifeDomain?.titleEn || currentLifeDomain?.titleNl || 'this life domain'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !title.trim()) return

    createUserGoal.mutate(
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
            <DialogTitle>Create Personal Goal</DialogTitle>
            <DialogDescription>
              Create your own personal goal for this life domain.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="life-domain">Life Domain</Label>
              <Input
                id="life-domain"
                value={lifeDomainName}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-title">Title *</Label>
              <Input
                id="goal-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Learn Arabic in 6 months"
                required
                disabled={createUserGoal.isPending}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-description">Description</Label>
              <Textarea
                id="goal-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description of your goal..."
                rows={3}
                disabled={createUserGoal.isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createUserGoal.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createUserGoal.isPending || !title.trim()}
            >
              {createUserGoal.isPending ? 'Creating...' : 'Create Goal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
