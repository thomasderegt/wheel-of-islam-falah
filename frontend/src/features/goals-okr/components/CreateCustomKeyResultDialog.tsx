'use client'

import { useState } from 'react'
import { useAuth } from '@/features/auth'
import { useCreateCustomKeyResult } from '../hooks/useUserKeyResults'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'

interface CreateCustomKeyResultDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userObjectiveInstanceId: number
  onSuccess?: () => void
}

export function CreateCustomKeyResultDialog({
  open,
  onOpenChange,
  userObjectiveInstanceId,
  onSuccess,
}: CreateCustomKeyResultDialogProps) {
  const { user } = useAuth()
  const createCustomKeyResult = useCreateCustomKeyResult()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetValue, setTargetValue] = useState('')
  const [unit, setUnit] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !title.trim() || !targetValue || Number(targetValue) <= 0 || !unit.trim()) return

    createCustomKeyResult.mutate(
      {
        userId: user.id,
        userObjectiveInstanceId,
        title: title.trim(),
        description: description.trim() || undefined,
        targetValue: Number(targetValue),
        unit: unit.trim(),
      },
      {
        onSuccess: () => {
          setTitle('')
          setDescription('')
          setTargetValue('')
          setUnit('')
          onOpenChange(false)
          onSuccess?.()
        },
      }
    )
  }

  const handleCancel = () => {
    setTitle('')
    setDescription('')
    setTargetValue('')
    setUnit('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Custom Key Result</DialogTitle>
            <DialogDescription>
              Add your own key result to measure progress on this objective.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="kr-title">Title *</Label>
              <Input
                id="kr-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Complete 10 lessons"
                required
                disabled={createCustomKeyResult.isPending}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kr-description">Description</Label>
              <Textarea
                id="kr-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
                rows={2}
                disabled={createCustomKeyResult.isPending}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kr-target">Target value *</Label>
                <Input
                  id="kr-target"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  placeholder="e.g., 10"
                  required
                  disabled={createCustomKeyResult.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kr-unit">Unit *</Label>
                <Input
                  id="kr-unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g., lessons"
                  required
                  disabled={createCustomKeyResult.isPending}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createCustomKeyResult.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createCustomKeyResult.isPending ||
                !title.trim() ||
                !targetValue ||
                Number(targetValue) <= 0 ||
                !unit.trim()
              }
            >
              {createCustomKeyResult.isPending ? 'Creating...' : 'Create Key Result'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
