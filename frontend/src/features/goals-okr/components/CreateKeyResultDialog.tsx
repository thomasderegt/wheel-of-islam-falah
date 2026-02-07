'use client'

/**
 * CreateKeyResultDialog Component
 * 
 * Dialog for creating a new key result
 */

import { useState, useEffect } from 'react'
import { useCreateKeyResult } from '../hooks/useCreateKeyResult'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'

interface CreateKeyResultDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  objectiveId: number
  defaultOrderIndex?: number
  language?: 'nl' | 'en'
  onSuccess?: () => void
}

export function CreateKeyResultDialog({ 
  open, 
  onOpenChange, 
  objectiveId,
  defaultOrderIndex = 1,
  language = 'en',
  onSuccess 
}: CreateKeyResultDialogProps) {
  const createKeyResult = useCreateKeyResult()
  const [titleEn, setTitleEn] = useState('')
  const [titleNl, setTitleNl] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [descriptionNl, setDescriptionNl] = useState('')
  const [targetValue, setTargetValue] = useState('')
  const [unit, setUnit] = useState('')
  const [orderIndex, setOrderIndex] = useState(String(defaultOrderIndex))

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setTitleEn('')
      setTitleNl('')
      setDescriptionEn('')
      setDescriptionNl('')
      setTargetValue('')
      setUnit('')
      setOrderIndex(String(defaultOrderIndex))
    } else {
      // Update order index when dialog opens
      setOrderIndex(String(defaultOrderIndex))
    }
  }, [open, defaultOrderIndex])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // At least one title is required
    if (!titleEn.trim() && !titleNl.trim()) {
      return
    }
    
    // Target value and unit are required
    if (!targetValue.trim() || !unit.trim()) {
      return
    }

    const targetValueNum = parseFloat(targetValue)
    if (isNaN(targetValueNum) || targetValueNum <= 0) {
      return
    }

    const orderIndexNum = parseInt(orderIndex, 10)
    if (isNaN(orderIndexNum) || orderIndexNum < 1) {
      return
    }

    createKeyResult.mutate(
      {
        objectiveId,
        titleEn: titleEn.trim() || undefined,
        titleNl: titleNl.trim() || undefined,
        descriptionEn: descriptionEn.trim() || undefined,
        descriptionNl: descriptionNl.trim() || undefined,
        targetValue: targetValueNum,
        unit: unit.trim(),
        orderIndex: orderIndexNum,
      },
      {
        onSuccess: () => {
          setTitleEn('')
          setTitleNl('')
          setDescriptionEn('')
          setDescriptionNl('')
          setTargetValue('')
          setUnit('')
          setOrderIndex('1')
          onOpenChange(false)
          onSuccess?.()
        },
      }
    )
  }

  const handleCancel = () => {
    setTitleEn('')
    setTitleNl('')
    setDescriptionEn('')
    setDescriptionNl('')
    setTargetValue('')
    setUnit('')
    setOrderIndex('1')
    onOpenChange(false)
  }

  const isFormValid = (titleEn.trim() || titleNl.trim()) && targetValue.trim() && unit.trim() && orderIndex.trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {language === 'nl' ? 'Maak Key Result' : 'Create Key Result'}
            </DialogTitle>
            <DialogDescription>
              {language === 'nl' 
                ? 'Maak een nieuwe key result voor dit objective'
                : 'Create a new key result for this objective'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="key-result-title-en">
                {language === 'nl' ? 'Titel (Engels)' : 'Title (English)'} *
              </Label>
              <Input
                id="key-result-title-en"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder={language === 'nl' ? 'Bijv. Read Quran 7 days per week' : 'e.g., Read Quran 7 days per week'}
                disabled={createKeyResult.isPending}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="key-result-title-nl">
                {language === 'nl' ? 'Titel (Nederlands)' : 'Title (Dutch)'}
              </Label>
              <Input
                id="key-result-title-nl"
                value={titleNl}
                onChange={(e) => setTitleNl(e.target.value)}
                placeholder={language === 'nl' ? 'Bijv. Lees Quran 7 dagen per week' : 'e.g., Lees Quran 7 dagen per week'}
                disabled={createKeyResult.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="key-result-description-en">
                {language === 'nl' ? 'Beschrijving (Engels)' : 'Description (English)'}
              </Label>
              <Textarea
                id="key-result-description-en"
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder={language === 'nl' ? 'Optionele beschrijving...' : 'Optional description...'}
                rows={3}
                disabled={createKeyResult.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="key-result-description-nl">
                {language === 'nl' ? 'Beschrijving (Nederlands)' : 'Description (Dutch)'}
              </Label>
              <Textarea
                id="key-result-description-nl"
                value={descriptionNl}
                onChange={(e) => setDescriptionNl(e.target.value)}
                placeholder={language === 'nl' ? 'Optionele beschrijving...' : 'Optional description...'}
                rows={3}
                disabled={createKeyResult.isPending}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="key-result-target-value">
                  {language === 'nl' ? 'Doelwaarde' : 'Target Value'} *
                </Label>
                <Input
                  id="key-result-target-value"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  placeholder="7"
                  required
                  disabled={createKeyResult.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-result-unit">
                  {language === 'nl' ? 'Eenheid' : 'Unit'} *
                </Label>
                <Input
                  id="key-result-unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder={language === 'nl' ? 'Bijv. dagen/week' : 'e.g., days/week'}
                  required
                  disabled={createKeyResult.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="key-result-order-index">
                {language === 'nl' ? 'Volgorde' : 'Order Index'} *
              </Label>
              <Input
                id="key-result-order-index"
                type="number"
                min="1"
                value={orderIndex}
                onChange={(e) => setOrderIndex(e.target.value)}
                placeholder="1"
                required
                disabled={createKeyResult.isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createKeyResult.isPending}
            >
              {language === 'nl' ? 'Annuleren' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              disabled={createKeyResult.isPending || !isFormValid}
            >
              {createKeyResult.isPending 
                ? (language === 'nl' ? 'Aanmaken...' : 'Creating...')
                : (language === 'nl' ? 'Maak Key Result' : 'Create Key Result')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
