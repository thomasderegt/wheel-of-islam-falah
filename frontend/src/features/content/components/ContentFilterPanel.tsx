/**
 * ContentFilterPanel Component
 * Filter panel for content items
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Label } from '@/shared/components/ui/label'
import type { ContentFilters } from '../hooks/useContentItems'
import { useAllBooks } from '../hooks/useAllBooks'
import { getAllCategories } from '../api/contentApi'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { Loading } from '@/shared/components/ui/Loading'

interface ContentFilterPanelProps {
  readonly value: ContentFilters
  readonly onChange: (filters: ContentFilters) => void
}

export function ContentFilterPanel({ value, onChange }: ContentFilterPanelProps) {
  const { data: books, isLoading: isLoadingBooks } = useAllBooks()
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
  })
  const hasActiveFilters = !!value.type || !!value.categoryId || !!value.bookId

  const handleTypeChange = (type: string) => {
    onChange({ ...value, type: type === 'ALL' ? undefined : type as ContentFilters['type'] })
  }

  const handleCategoryChange = (categoryId: string) => {
    onChange({ ...value, categoryId: categoryId === 'ALL' ? undefined : Number(categoryId) })
  }

  const handleBookChange = (bookId: string) => {
    onChange({ ...value, bookId: bookId === 'ALL' ? undefined : Number(bookId) })
  }

  const clearFilters = () => {
    onChange({})
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingBooks || isLoadingCategories ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type-filter">Type</Label>
              <Select
                value={value.type || 'ALL'}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger id="type-filter">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="BOOK">Book</SelectItem>
                  <SelectItem value="CHAPTER">Chapter</SelectItem>
                  <SelectItem value="SECTION">Section</SelectItem>
                  <SelectItem value="PARAGRAPH">Paragraph</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-filter">Category</Label>
              <Select
                value={value.categoryId?.toString() || 'ALL'}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.titleEn || category.titleNl || `Category ${category.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="book-filter">Book</Label>
              <Select
                value={value.bookId?.toString() || 'ALL'}
                onValueChange={handleBookChange}
              >
                <SelectTrigger id="book-filter">
                  <SelectValue placeholder="All Books" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Books</SelectItem>
                  {books?.map((book) => (
                    <SelectItem key={book.id} value={book.id.toString()}>
                      {book.categoryTitle} {'>'} {book.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

