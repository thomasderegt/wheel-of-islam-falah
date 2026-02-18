/**
 * CreateContentDialog Component
 * Dialog for creating new content items
 */

'use client'

import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { createCategory, createBook, createChapter, createSection, createParagraph, getAllCategories, getBooksByCategory, getChaptersByBook, getSectionsByChapter } from '../api/contentApi'
import { useRouter } from 'next/navigation'
import type { ContentFilters } from '../hooks/useContentItems'

type ContentType = 'CATEGORY' | 'BOOK' | 'CHAPTER' | 'SECTION' | 'PARAGRAPH'

interface CreateContentDialogProps {
  readonly filters?: ContentFilters
}

export function CreateContentDialog({ filters }: CreateContentDialogProps = {}) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<ContentType>('CATEGORY')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const router = useRouter()

  // Form state
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [bookId, setBookId] = useState<number | null>(null)
  const [chapterId, setChapterId] = useState<number | null>(null)
  const [sectionId, setSectionId] = useState<number | null>(null)
  const [position, setPosition] = useState<number>(0)
  const [orderIndex, setOrderIndex] = useState<number>(0)
  const [paragraphNumber, setParagraphNumber] = useState<number>(1)
  const [titleNl, setTitleNl] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [descriptionNl, setDescriptionNl] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')

  // Fetch categories - needed for BOOK, CHAPTER, SECTION, and PARAGRAPH types
  // Always fetch when dialog is open
  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    enabled: open,
  })

  // Fetch books for CHAPTER, SECTION, and PARAGRAPH types
  const { data: books } = useQuery({
    queryKey: ['booksByCategory', categoryId],
    queryFn: () => getBooksByCategory(categoryId!),
    enabled: open && (type === 'CHAPTER' || type === 'SECTION' || type === 'PARAGRAPH') && !!categoryId,
  })

  // Fetch chapters for SECTION and PARAGRAPH types
  const { data: chapters } = useQuery({
    queryKey: ['chaptersByBook', bookId],
    queryFn: () => getChaptersByBook(bookId!),
    enabled: open && (type === 'SECTION' || type === 'PARAGRAPH') && !!bookId,
  })

  // Fetch sections for PARAGRAPH type
  const { data: sections } = useQuery({
    queryKey: ['sectionsByChapter', chapterId],
    queryFn: () => getSectionsByChapter(chapterId!),
    enabled: open && type === 'PARAGRAPH' && !!chapterId,
  })

  // Initialize form with filter values when dialog opens or filters change
  useEffect(() => {
    if (open && filters) {
      // Set type if filter is set
      if (filters.type) {
        setType(filters.type)
      }
      
      // Set categoryId if filter is set
      if (filters.categoryId) {
        setCategoryId(filters.categoryId)
      }
      
      // Set bookId if filter is set
      if (filters.bookId) {
        setBookId(filters.bookId)
      }
    }
  }, [open, filters])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let result: any

      switch (type) {
        case 'CATEGORY':
          if (!titleNl && !titleEn) {
            setError('At least one title (NL or EN) is required')
            setLoading(false)
            return
          }
          result = await createCategory({
            titleNl: titleNl || null,
            titleEn: titleEn || null,
            descriptionNl: descriptionNl || null,
            descriptionEn: descriptionEn || null,
          })
          break

        case 'BOOK':
          if (!categoryId) {
            setError('Category is required')
            setLoading(false)
            return
          }
          result = await createBook({ categoryId })
          break

        case 'CHAPTER':
          if (!bookId) {
            setError('Book is required')
            setLoading(false)
            return
          }
          result = await createChapter({
            bookId,
            position: position || null,
          })
          break

        case 'SECTION':
          if (!chapterId) {
            setError('Chapter is required')
            setLoading(false)
            return
          }
          result = await createSection({
            chapterId,
            orderIndex,
          })
          break

        case 'PARAGRAPH':
          if (!sectionId) {
            setError('Section is required')
            setLoading(false)
            return
          }
          result = await createParagraph({
            sectionId,
            paragraphNumber,
          })
          break
      }

      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['contentItems'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['booksByCategory'] })
      queryClient.invalidateQueries({ queryKey: ['chaptersByBook'] })
      queryClient.invalidateQueries({ queryKey: ['sectionsByChapter'] })

      // Reset form and close dialog
      resetForm()
      setOpen(false)

      // Navigate to the created item
      if (result) {
        const path = getDetailPath(type, result.id)
        if (path) {
          router.push(path)
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to create content')
    } finally {
      setLoading(false)
    }
  }

  const getDetailPath = (contentType: ContentType, id: number): string | null => {
    switch (contentType) {
      case 'BOOK':
        return `/admin/content/books/${id}`
      case 'CHAPTER':
        return `/admin/content/chapters/${id}`
      case 'SECTION':
        return `/admin/content/sections/${id}`
      case 'PARAGRAPH':
        return `/admin/content/paragraphs/${id}`
      default:
        return null
    }
  }

  const resetForm = () => {
    setType('CATEGORY')
    setCategoryId(null)
    setBookId(null)
    setChapterId(null)
    setSectionId(null)
    setPosition(0)
    setOrderIndex(0)
    setParagraphNumber(1)
    setTitleNl('')
    setTitleEn('')
    setDescriptionNl('')
    setDescriptionEn('')
    setError(null)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      resetForm()
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create Content</Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Content</DialogTitle>
            <DialogDescription>
              Create a new content item. Select the type and fill in the required fields.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Content Type Selection */}
            <div className="space-y-2">
              <Label>Content Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as ContentType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CATEGORY">Category</SelectItem>
                  <SelectItem value="BOOK">Book</SelectItem>
                  <SelectItem value="CHAPTER">Chapter</SelectItem>
                  <SelectItem value="SECTION">Section</SelectItem>
                  <SelectItem value="PARAGRAPH">Paragraph</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category fields */}
            {type === 'CATEGORY' && (
              <>
                <div className="space-y-2">
                  <Label>Title (NL)</Label>
                  <Input
                    value={titleNl}
                    onChange={(e) => setTitleNl(e.target.value)}
                    placeholder="Dutch title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title (EN) *</Label>
                  <Input
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="English title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (NL)</Label>
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={descriptionNl}
                    onChange={(e) => setDescriptionNl(e.target.value)}
                    placeholder="Dutch description"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (EN)</Label>
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    placeholder="English description"
                  />
                </div>
              </>
            )}

            {/* Book fields */}
            {type === 'BOOK' && (
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={categoryId?.toString() || ''}
                  onValueChange={(value) => setCategoryId(Number(value))}
                >
                  <SelectTrigger disabled={isLoadingCategories}>
                    <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select a category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingCategories ? (
                      <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                    ) : categoriesError ? (
                      <SelectItem value="error" disabled>Error loading categories</SelectItem>
                    ) : categories && categories.length > 0 ? (
                      categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.titleEn || cat.titleNl || `Category ${cat.id}`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-categories" disabled>No categories available (found: {categories ? categories.length : 'null'})</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Chapter fields */}
            {type === 'CHAPTER' && (
              <>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={categoryId?.toString() || ''}
                    onValueChange={(value) => {
                      setCategoryId(Number(value))
                      setBookId(null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.titleEn || cat.titleNl || `Category ${cat.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {categoryId && (
                  <div className="space-y-2">
                    <Label>Book *</Label>
                    <Select
                      value={bookId?.toString() || ''}
                      onValueChange={(value) => setBookId(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a book" />
                      </SelectTrigger>
                      <SelectContent>
                        {books?.map((book) => (
                          <SelectItem key={book.id} value={book.id.toString()}>
                            Book {book.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Position (0 = center, 1-10 = circular)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={position}
                    onChange={(e) => setPosition(Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </>
            )}

            {/* Section fields */}
            {type === 'SECTION' && (
              <>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={categoryId?.toString() || ''}
                    onValueChange={(value) => {
                      setCategoryId(Number(value))
                      setBookId(null)
                      setChapterId(null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.titleEn || cat.titleNl || `Category ${cat.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {categoryId && (
                  <div className="space-y-2">
                    <Label>Book *</Label>
                    <Select
                      value={bookId?.toString() || ''}
                      onValueChange={(value) => {
                        setBookId(Number(value))
                        setChapterId(null)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a book" />
                      </SelectTrigger>
                      <SelectContent>
                        {books?.map((book) => (
                          <SelectItem key={book.id} value={book.id.toString()}>
                            Book {book.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {bookId && (
                  <div className="space-y-2">
                    <Label>Chapter *</Label>
                    <Select
                      value={chapterId?.toString() || ''}
                      onValueChange={(value) => setChapterId(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a chapter" />
                      </SelectTrigger>
                      <SelectContent>
                        {chapters?.map((chapter) => (
                          <SelectItem key={chapter.id} value={chapter.id.toString()}>
                            Chapter {chapter.id} (Position: {chapter.position})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Order Index *</Label>
                  <Input
                    type="number"
                    min="0"
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(Number(e.target.value))}
                    placeholder="0"
                    required
                  />
                </div>
              </>
            )}

            {/* Paragraph fields */}
            {type === 'PARAGRAPH' && (
              <>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={categoryId?.toString() || ''}
                    onValueChange={(value) => {
                      setCategoryId(Number(value))
                      setBookId(null)
                      setChapterId(null)
                      setSectionId(null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.titleEn || cat.titleNl || `Category ${cat.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {categoryId && (
                  <div className="space-y-2">
                    <Label>Book *</Label>
                    <Select
                      value={bookId?.toString() || ''}
                      onValueChange={(value) => {
                        setBookId(Number(value))
                        setChapterId(null)
                        setSectionId(null)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a book" />
                      </SelectTrigger>
                      <SelectContent>
                        {books?.map((book) => (
                          <SelectItem key={book.id} value={book.id.toString()}>
                            Book {book.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {bookId && (
                  <div className="space-y-2">
                    <Label>Chapter *</Label>
                    <Select
                      value={chapterId?.toString() || ''}
                      onValueChange={(value) => {
                        setChapterId(Number(value))
                        setSectionId(null)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a chapter" />
                      </SelectTrigger>
                      <SelectContent>
                        {chapters?.map((chapter) => (
                          <SelectItem key={chapter.id} value={chapter.id.toString()}>
                            Chapter {chapter.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {chapterId && (
                  <div className="space-y-2">
                    <Label>Section *</Label>
                    <Select
                      value={sectionId?.toString() || ''}
                      onValueChange={(value) => setSectionId(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a section" />
                      </SelectTrigger>
                      <SelectContent>
                        {sections?.map((section) => (
                          <SelectItem key={section.id} value={section.id.toString()}>
                            Section {section.orderIndex}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Paragraph Number *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={paragraphNumber}
                    onChange={(e) => setParagraphNumber(Number(e.target.value))}
                    placeholder="1"
                    required
                  />
                </div>
              </>
            )}

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

