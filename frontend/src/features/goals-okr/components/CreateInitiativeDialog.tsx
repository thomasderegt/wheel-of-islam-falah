'use client'

/**
 * CreateInitiativeDialog Component
 * 
 * Dialog for creating a new initiative, with suggestions support
 */

import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth'
import { useCreateInitiative } from '../hooks/useCreateInitiative'
import { useInitiativeSuggestions } from '../hooks/useInitiativeSuggestions'
import { useAddKanbanItem } from '../hooks/useKanbanItems'
import { getUserInitiativeInstances } from '../api/goalsOkrApi'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { InitiativeSuggestions } from './InitiativeSuggestions'
import type { InitiativeDTO } from '../api/goalsOkrApi'

interface CreateInitiativeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  keyResultId?: number | null
  userKeyResultInstanceId: number
  language?: 'nl' | 'en'
  onSuccess?: () => void
}

export function CreateInitiativeDialog({ 
  open, 
  onOpenChange, 
  keyResultId,
  userKeyResultInstanceId,
  language = 'en',
  onSuccess 
}: CreateInitiativeDialogProps) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const createInitiative = useCreateInitiative()
  const addKanbanItem = useAddKanbanItem()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [selectedSuggestion, setSelectedSuggestion] = useState<InitiativeDTO | null>(null)

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setTitle('')
      setDescription('')
      setTargetDate('')
      setSelectedSuggestion(null)
    }
  }, [open])

  const handleSelectSuggestion = (suggestion: InitiativeDTO) => {
    setSelectedSuggestion(suggestion)
    setTitle(language === 'nl' ? suggestion.titleNl : suggestion.titleEn)
    setDescription(language === 'nl' ? suggestion.descriptionNl || '' : suggestion.descriptionEn || '')
  }

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
        onSuccess: async (createdInitiative) => {
          // Add to kanban board after creating the initiative
          // The backend creates a UserInitiativeInstance automatically, so we need to find it
          if (user?.id) {
            try {
              // Get all initiative instances for this user key result instance
              const instances = await getUserInitiativeInstances(user.id)
              // Find the instance that matches this initiative
              const instance = instances.find(
                inst => inst.userKeyResultInstanceId === userKeyResultInstanceId &&
                        // The initiativeId in the instance refers to the UserInitiative ID
                        inst.initiativeId === createdInitiative.id
              )
              
              if (instance?.id) {
                await addKanbanItem.mutateAsync({
                  userId: user.id,
                  itemType: 'INITIATIVE',
                  itemId: instance.id, // Use the UserInitiativeInstance ID
                })
                // Invalidate kanban items query
                queryClient.invalidateQueries({ queryKey: ['goals-okr', 'kanban-items', 'user', user.id] })
              }
            } catch (error) {
              console.error('Failed to add initiative to kanban board:', error)
              // Don't fail the whole operation if kanban add fails
            }
          }
          
          setTitle('')
          setDescription('')
          setTargetDate('')
          setSelectedSuggestion(null)
          onOpenChange(false)
          onSuccess?.()
        },
      }
    )
  }

  const handleCancel = () => {
    setTitle('')
    setDescription('')
    setTargetDate('')
    setSelectedSuggestion(null)
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
            {/* Suggestions */}
            {keyResultId && (
              <InitiativeSuggestions
                keyResultId={keyResultId}
                language={language}
                onSelectSuggestion={handleSelectSuggestion}
              />
            )}

            {/* Custom Form */}
            <div className="space-y-4 border-t pt-4">
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
