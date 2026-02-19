'use client'

/**
 * CreateInitiativeDialog Component
 * 
 * Dialog for creating a new initiative for a Key Result
 */

import { useState, useEffect } from 'react'
import { useAuth } from '@/features/auth'
import { useCreateInitiative } from '../hooks/useCreateInitiative'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'

interface CreateInitiativeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  keyResultId?: number | null
  keyResultTitle?: string | null
  userKeyResultInstanceId: number
  language?: 'nl' | 'en'
  onSuccess?: () => void
}

export function CreateInitiativeDialog({ 
  open, 
  onOpenChange, 
  keyResultId,
  keyResultTitle,
  userKeyResultInstanceId,
  language = 'en',
  onSuccess 
}: CreateInitiativeDialogProps) {
  const { user } = useAuth()
  const createInitiative = useCreateInitiative()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetDate, setTargetDate] = useState('')

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setTitle('')
      setDescription('')
      setTargetDate('')
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !title.trim()) return

    createInitiative.mutate(
      {
        userId: user.id,
        keyResultId: keyResultId || null,
        userKeyResultInstanceId,
        title: title.trim(),
        description: description.trim() || null,
        targetDate: targetDate || null,
        learningFlowEnrollmentId: null, // Will be set when starting learning flow
      },
      {
        onSuccess: () => {
          setTitle('')
          setDescription('')
          setTargetDate('')
          onOpenChange(false)
          onSuccess?.()
          alert(
            language === 'nl'
              ? 'Initiative aangemaakt en toegevoegd aan je progress board!'
              : 'Initiative created and added to your progress board!'
          )
        },
      }
    )
  }

  const handleCancel = () => {
    setTitle('')
    setDescription('')
    setTargetDate('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {language === 'nl' ? 'Maak Initiative' : 'Create Initiative'}
            </DialogTitle>
            <DialogDescription>
              {language === 'nl' 
                ? 'Maak een nieuwe initiative om dit Key Result te behalen'
                : 'Create a new initiative to achieve this Key Result'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Key Result (read-only) */}
            {(keyResultId != null || keyResultTitle) && (
              <div className="space-y-2">
                <Label>
                  {language === 'nl' ? 'Key Result' : 'Key Result'}
                </Label>
                <div className="rounded-md border bg-muted/50 px-3 py-2 text-sm">
                  {keyResultId != null && (
                    <span className="text-muted-foreground mr-2">ID: {keyResultId}</span>
                  )}
                  {keyResultTitle && (
                    <span className="font-medium">{keyResultTitle}</span>
                  )}
                </div>
              </div>
            )}

            {/* Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="initiative-title">
                  {language === 'nl' ? 'Titel' : 'Title'} *
                </Label>
                <Input
                  id="initiative-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={language === 'nl' ? 'Bijv. Leer Fajr gebed' : 'e.g., Learn Fajr prayer'}
                  required
                  disabled={createInitiative.isPending}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initiative-description">
                  {language === 'nl' ? 'Beschrijving' : 'Description'}
                </Label>
                <Textarea
                  id="initiative-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={language === 'nl' ? 'Optionele beschrijving...' : 'Optional description...'}
                  rows={3}
                  disabled={createInitiative.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initiative-target-date">
                  {language === 'nl' ? 'Doeldatum (optioneel)' : 'Target Date (optional)'}
                </Label>
                <Input
                  id="initiative-target-date"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  disabled={createInitiative.isPending}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createInitiative.isPending}
            >
              {language === 'nl' ? 'Annuleren' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              disabled={createInitiative.isPending || !title.trim()}
            >
              {createInitiative.isPending 
                ? (language === 'nl' ? 'Aanmaken...' : 'Creating...')
                : (language === 'nl' ? 'Maak Initiative' : 'Create Initiative')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
