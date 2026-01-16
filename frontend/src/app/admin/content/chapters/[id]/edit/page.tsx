/**
 * Chapter Edit Page
 * Edit page for editing a chapter
 * Route: /admin/content/chapters/[id]/edit
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { useChapter, updateChapter } from '@/features/content'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loading } from '@/shared/components/ui/Loading'
import { Error } from '@/shared/components/ui/Error'

export default function ChapterEditPage() {
  const params = useParams()
  const router = useRouter()
  const chapterId = Number(params.id)
  const queryClient = useQueryClient()
  
  const { data: chapter, isLoading, error } = useChapter(chapterId)
  const [chapterNumber, setChapterNumber] = useState<string>('')
  const [position, setPosition] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Initialize form when chapter data loads
  useEffect(() => {
    if (chapter) {
      setChapterNumber(chapter.chapterNumber?.toString() || '')
      setPosition(chapter.position?.toString() || '0')
    }
  }, [chapter])

  const updateMutation = useMutation({
    mutationFn: (data: { chapterNumber?: number | null; position?: number | null }) => 
      updateChapter(chapterId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapter', chapterId] })
      queryClient.invalidateQueries({ queryKey: ['contentItems'] })
      router.push(`/admin/content/chapters/${chapterId}`)
    },
    onError: (error: any) => {
      setSubmitError(error.response?.data?.error || error.message || 'Failed to update chapter')
      setIsSubmitting(false)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    const chapterNumberValue = chapterNumber.trim() === '' ? null : parseInt(chapterNumber, 10)
    const positionValue = position.trim() === '' ? null : parseInt(position, 10)
    
    if (chapterNumberValue !== null && isNaN(chapterNumberValue)) {
      setSubmitError('Chapter number must be a valid number')
      setIsSubmitting(false)
      return
    }

    if (positionValue !== null && (isNaN(positionValue) || positionValue < 0 || positionValue > 10)) {
      setSubmitError('Position must be a number between 0 and 10')
      setIsSubmitting(false)
      return
    }

    updateMutation.mutate({ 
      chapterNumber: chapterNumberValue,
      position: positionValue
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Error message="Failed to load chapter" />
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Error message="Chapter not found" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href={`/admin/content/chapters/${chapterId}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Chapter Details
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Edit Chapter</h1>
        <p className="text-muted-foreground mt-1">
          Chapter ID: {chapterId}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Chapter Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chapterNumber">Chapter Number</Label>
              <Input
                id="chapterNumber"
                type="number"
                value={chapterNumber}
                onChange={(e) => setChapterNumber(e.target.value)}
                placeholder="Enter chapter number (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position (0-10)</Label>
              <Input
                id="position"
                type="number"
                min="0"
                max="10"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Enter position (0 for center, 1-10 for circular)"
              />
              <p className="text-sm text-muted-foreground">
                0 = center, 1-10 = circular position
              </p>
            </div>

            {submitError && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-sm text-destructive">{submitError}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Link href={`/admin/content/chapters/${chapterId}`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
