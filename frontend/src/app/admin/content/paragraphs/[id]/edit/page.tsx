/**
 * Paragraph Edit Page
 * Edit page for editing a paragraph
 * Route: /admin/content/paragraphs/[id]/edit
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
import { useParagraph, updateParagraph } from '@/features/content'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loading } from '@/shared/components/ui/Loading'
import { Error } from '@/shared/components/ui/Error'

export default function ParagraphEditPage() {
  const params = useParams()
  const router = useRouter()
  const paragraphId = Number(params.id)
  const queryClient = useQueryClient()
  
  const { data: paragraph, isLoading, error } = useParagraph(paragraphId)
  const [paragraphNumber, setParagraphNumber] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Initialize form when paragraph data loads
  useEffect(() => {
    if (paragraph) {
      setParagraphNumber(paragraph.paragraphNumber?.toString() || '')
    }
  }, [paragraph])

  const updateMutation = useMutation({
    mutationFn: (data: { paragraphNumber?: number | null }) => 
      updateParagraph(paragraphId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paragraph', paragraphId] })
      queryClient.invalidateQueries({ queryKey: ['contentItems'] })
      router.push(`/admin/content/paragraphs/${paragraphId}`)
    },
    onError: (error: any) => {
      setSubmitError(error.response?.data?.error || error.message || 'Failed to update paragraph')
      setIsSubmitting(false)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    const paragraphNumberValue = paragraphNumber.trim() === '' ? null : parseInt(paragraphNumber, 10)
    
    if (paragraphNumberValue !== null && (isNaN(paragraphNumberValue) || paragraphNumberValue < 1)) {
      setSubmitError('Paragraph number must be a positive number')
      setIsSubmitting(false)
      return
    }

    updateMutation.mutate({ paragraphNumber: paragraphNumberValue })
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
        <Error message="Failed to load paragraph" />
      </div>
    )
  }

  if (!paragraph) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Error message="Paragraph not found" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href={`/admin/content/paragraphs/${paragraphId}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Paragraph Details
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Edit Paragraph</h1>
        <p className="text-muted-foreground mt-1">
          Paragraph ID: {paragraphId}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Paragraph Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paragraphNumber">Paragraph Number</Label>
              <Input
                id="paragraphNumber"
                type="number"
                min="1"
                value={paragraphNumber}
                onChange={(e) => setParagraphNumber(e.target.value)}
                placeholder="Enter paragraph number (must be positive)"
              />
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
              <Link href={`/admin/content/paragraphs/${paragraphId}`}>
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
