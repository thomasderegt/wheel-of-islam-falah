'use client'

/**
 * CreateTeamDialog Component
 * Dialog for creating a new team
 */

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { useCreateTeam } from '../hooks/useTeams'
import { Loading } from '@/shared/components/ui/Loading'
import { getErrorMessage } from '@/shared/api/errors'

interface CreateTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (teamId: number) => void
}

export function CreateTeamDialog({ open, onOpenChange, onSuccess }: CreateTeamDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  const createTeamMutation = useCreateTeam()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Team naam is verplicht')
      return
    }

    try {
      const team = await createTeamMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
      })
      
      // Reset form
      setName('')
      setDescription('')
      setError(null)
      
      // Close dialog
      onOpenChange(false)
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(team.id)
      }
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const handleClose = () => {
    if (!createTeamMutation.isPending) {
      setName('')
      setDescription('')
      setError(null)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nieuw Team Aanmaken</DialogTitle>
          <DialogDescription>
            Maak een nieuw team aan om samen te werken met anderen.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="team-name">Team Naam *</Label>
              <Input
                id="team-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bijv. Business Team"
                disabled={createTeamMutation.isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-description">Beschrijving (optioneel)</Label>
              <Textarea
                id="team-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Beschrijf het doel van dit team..."
                disabled={createTeamMutation.isPending}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createTeamMutation.isPending}
            >
              Annuleren
            </Button>
            <Button
              type="submit"
              disabled={createTeamMutation.isPending || !name.trim()}
            >
              {createTeamMutation.isPending ? (
                <>
                  <Loading />
                  Aanmaken...
                </>
              ) : (
                'Team Aanmaken'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
