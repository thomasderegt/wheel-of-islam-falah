/**
 * Book Edit Page
 * Edit page for editing a book
 * Route: /admin/content/books/[id]/edit
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
import { useBook, updateBook } from '@/features/content'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loading } from '@/shared/components/ui/Loading'
import { Error } from '@/shared/components/ui/Error'

export default function BookEditPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = Number(params.id)
  const queryClient = useQueryClient()
  
  const { data: book, isLoading, error } = useBook(bookId)
  const [bookNumber, setBookNumber] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Initialize form when book data loads
  useEffect(() => {
    if (book) {
      setBookNumber(book.bookNumber?.toString() || '')
    }
  }, [book])

  const updateMutation = useMutation({
    mutationFn: (data: { bookNumber?: number | null }) => updateBook(bookId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book', bookId] })
      queryClient.invalidateQueries({ queryKey: ['contentItems'] })
      router.push(`/admin/content/books/${bookId}`)
    },
    onError: (error: any) => {
      setSubmitError(error.response?.data?.error || error.message || 'Failed to update book')
      setIsSubmitting(false)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    const bookNumberValue = bookNumber.trim() === '' ? null : parseInt(bookNumber, 10)
    
    if (bookNumberValue !== null && isNaN(bookNumberValue)) {
      setSubmitError('Book number must be a valid number')
      setIsSubmitting(false)
      return
    }

    updateMutation.mutate({ bookNumber: bookNumberValue })
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
        <Error message="Failed to load book" />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Error message="Book not found" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href={`/admin/content/books/${bookId}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Book Details
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Edit Book</h1>
        <p className="text-muted-foreground mt-1">
          Book ID: {bookId}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Book Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bookNumber">Book Number</Label>
              <Input
                id="bookNumber"
                type="number"
                value={bookNumber}
                onChange={(e) => setBookNumber(e.target.value)}
                placeholder="Enter book number (optional)"
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
              <Link href={`/admin/content/books/${bookId}`}>
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
