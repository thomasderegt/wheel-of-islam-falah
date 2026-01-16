/**
 * CreateVersionDialog Component
 * Dialog for creating new versions of content items
 * Supports: Section, Book, Chapter
 */

'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { createSectionVersion, createBookVersion, createChapterVersion } from '../api/contentApi'
import { Plus } from 'lucide-react'

interface CreateVersionDialogProps {
  readonly entityType: 'SECTION' | 'BOOK' | 'CHAPTER'
  readonly entityId: number
  readonly trigger?: React.ReactNode
}

export function CreateVersionDialog({ entityType, entityId, trigger }: CreateVersionDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Form state
  const [titleNl, setTitleNl] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [introNl, setIntroNl] = useState('')
  const [introEn, setIntroEn] = useState('')
  const [userId, setUserId] = useState<number>(1) // TODO: Get from auth context

  const resetForm = () => {
    setTitleNl('')
    setTitleEn('')
    setIntroNl('')
    setIntroEn('')
    setError(null)
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      resetForm()
    }
  }

  const createVersionMutation = useMutation({
    mutationFn: async () => {
      const versionData = {
        titleNl: titleNl || null,
        titleEn: titleEn || null,
        introNl: introNl || null,
        introEn: introEn || null,
        userId,
      }
      
      // Log request for debugging
      const url = entityType === 'SECTION' 
        ? `/api/v2/content/sections/${entityId}/versions`
        : entityType === 'BOOK'
        ? `/api/v2/content/books/${entityId}/versions`
        : `/api/v2/content/chapters/${entityId}/versions`
      
      console.log('Creating version:', {
        entityType,
        entityId,
        versionData,
        url,
      })
      
      try {
        if (entityType === 'SECTION') {
          return await createSectionVersion(entityId, versionData)
        } else if (entityType === 'BOOK') {
          return await createBookVersion(entityId, versionData)
        } else if (entityType === 'CHAPTER') {
          return await createChapterVersion(entityId, versionData)
        }
        throw new Error(`Unsupported entity type: ${entityType}`)
      } catch (err: any) {
        // Enhanced error logging
        console.error('Create version error:', {
          entityType,
          entityId,
          error: err,
          response: err.response,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          message: err.message,
          stack: err.stack
        })
        throw err // Re-throw to be handled by onError
      }
    },
    onSuccess: async () => {
      // Invalidate relevant queries based on entity type
      if (entityType === 'SECTION') {
        queryClient.invalidateQueries({ queryKey: ['sectionVersionHistory', entityId] })
        queryClient.invalidateQueries({ queryKey: ['section', entityId] })
      } else if (entityType === 'BOOK') {
        queryClient.invalidateQueries({ queryKey: ['bookVersionHistory', entityId] })
        queryClient.invalidateQueries({ queryKey: ['book', entityId] })
        // Explicitly refetch to ensure UI updates immediately
        await queryClient.refetchQueries({ queryKey: ['book', entityId] })
      } else if (entityType === 'CHAPTER') {
        queryClient.invalidateQueries({ queryKey: ['chapterVersionHistory', entityId] })
        queryClient.invalidateQueries({ queryKey: ['chapter', entityId] })
        // Explicitly refetch to ensure UI updates immediately
        await queryClient.refetchQueries({ queryKey: ['chapter', entityId] })
      }
      queryClient.invalidateQueries({ queryKey: ['contentItems'] })
      setOpen(false)
      resetForm()
    },
    onError: (err: any) => {
      // Enhanced error message extraction
      let errorMessage = 'Failed to create version'
      
      // Try to extract error message from various sources
      if (err.response) {
        const { status, statusText, data } = err.response
        
        // Log full error context
        console.error('Create version failed:', {
          status,
          statusText,
          data,
          entityType,
          entityId,
          url: err.config?.url,
          method: err.config?.method
        })
        
        // Try to get error message from response data
        if (data) {
          if (typeof data === 'string') {
            errorMessage = data
          } else if (data.error) {
            errorMessage = data.error
          } else if (data.message) {
            errorMessage = data.message
          } else if (typeof data === 'object') {
            // Try to stringify if it's an object
            try {
              errorMessage = JSON.stringify(data)
            } catch {
              errorMessage = 'Unknown error format'
            }
          }
        }
        
        // Add status code specific messages
        if (!data || (!data.error && !data.message)) {
          if (status === 400) {
            errorMessage = 'Bad request. Please check your input.'
          } else if (status === 401) {
            errorMessage = 'Unauthorized. Please log in again.'
          } else if (status === 403) {
            errorMessage = 'Access denied. You may not have permission to create versions.'
          } else if (status === 404) {
            errorMessage = `${entityType} not found.`
          } else if (status === 500) {
            errorMessage = 'Internal server error. Please try again later.'
          } else {
            errorMessage = `Request failed (HTTP ${status}): ${statusText || errorMessage}`
          }
        }
      } else if (err.message) {
        errorMessage = err.message
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.'
        console.error('Network error details:', err.request)
      }
      
      setError(errorMessage)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation: at least one title must be provided
    if (!titleNl.trim() && !titleEn.trim()) {
      setError('At least one title (NL or EN) is required')
      return
    }

    createVersionMutation.mutate()
  }

  const defaultTrigger = (
    <Button onClick={() => setOpen(true)} className="gap-2">
      <Plus className="h-4 w-4" />
      Create Version
    </Button>
  )

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        defaultTrigger
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New {entityType} Version</DialogTitle>
            <DialogDescription>
              Add a new version with title and intro content. At least one title (NL or EN) is required.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titleNl">Title (Dutch)</Label>
                <Input
                  id="titleNl"
                  value={titleNl}
                  onChange={(e) => setTitleNl(e.target.value)}
                  placeholder="Dutch title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titleEn">Title (English)</Label>
                <Input
                  id="titleEn"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="English title"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="introNl">Intro (Dutch)</Label>
                <Textarea
                  id="introNl"
                  value={introNl}
                  onChange={(e) => setIntroNl(e.target.value)}
                  placeholder="Dutch intro text"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="introEn">Intro (English)</Label>
                <Textarea
                  id="introEn"
                  value={introEn}
                  onChange={(e) => setIntroEn(e.target.value)}
                  placeholder="English intro text"
                  rows={4}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || createVersionMutation.isPending}>
                {loading || createVersionMutation.isPending ? 'Creating...' : 'Create Version'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

