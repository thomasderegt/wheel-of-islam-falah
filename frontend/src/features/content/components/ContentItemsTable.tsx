/**
 * ContentItemsTable Component
 * Table for displaying content items
 */

'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { FileText, BookOpen, Layers, AlignLeft, Eye, Edit, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

export interface ContentItem {
  id: number
  type: 'BOOK' | 'CHAPTER' | 'SECTION' | 'PARAGRAPH'
  title?: string
  status?: string
  path?: string // Full hierarchy path (e.g. "Category > Book > Chapter")
  bookId?: number // Book ID for filtering
  categoryId?: number // Category ID for filtering
}

interface ContentItemsTableProps {
  readonly items: ContentItem[]
}

const getTypeIcon = (type: ContentItem['type']) => {
  switch (type) {
    case 'BOOK':
      return <BookOpen className="h-4 w-4" />
    case 'CHAPTER':
      return <FileText className="h-4 w-4" />
    case 'SECTION':
      return <Layers className="h-4 w-4" />
    case 'PARAGRAPH':
      return <AlignLeft className="h-4 w-4" />
  }
}

const getTypeColor = (type: ContentItem['type']) => {
  switch (type) {
    case 'BOOK':
      return 'text-blue-600'
    case 'CHAPTER':
      return 'text-green-600'
    case 'SECTION':
      return 'text-purple-600'
    case 'PARAGRAPH':
      return 'text-orange-600'
  }
}

const getDetailPath = (item: ContentItem) => {
  switch (item.type) {
    case 'BOOK':
      return `/admin/content/books/${item.id}`
    case 'CHAPTER':
      return `/admin/content/chapters/${item.id}`
    case 'SECTION':
      return `/admin/content/sections/${item.id}`
    case 'PARAGRAPH':
      return `/admin/content/paragraphs/${item.id}`
  }
}

const getEditPath = (item: ContentItem) => {
  switch (item.type) {
    case 'BOOK':
      return `/admin/content/books/${item.id}/edit`
    case 'CHAPTER':
      return `/admin/content/chapters/${item.id}/edit`
    case 'SECTION':
      return `/admin/content/sections/${item.id}/edit`
    case 'PARAGRAPH':
      return `/admin/content/paragraphs/${item.id}/edit`
  }
}

type SortDirection = 'asc' | 'desc' | null

export function ContentItemsTable({ items }: ContentItemsTableProps) {
  const router = useRouter()
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const sortedItems = useMemo(() => {
    if (sortDirection === null) {
      return items
    }

    const sorted = [...items].sort((a, b) => {
      const typeOrder = { 'BOOK': 1, 'CHAPTER': 2, 'SECTION': 3, 'PARAGRAPH': 4 }
      const aOrder = typeOrder[a.type] || 0
      const bOrder = typeOrder[b.type] || 0
      
      if (sortDirection === 'asc') {
        return aOrder - bOrder
      } else {
        return bOrder - aOrder
      }
    })

    return sorted
  }, [items, sortDirection])

  const handleSortClick = () => {
    if (sortDirection === null) {
      setSortDirection('asc')
    } else if (sortDirection === 'asc') {
      setSortDirection('desc')
    } else {
      setSortDirection(null)
    }
  }

  const getSortIcon = () => {
    if (sortDirection === null) {
      return <ArrowUpDown className="h-4 w-4" />
    } else if (sortDirection === 'asc') {
      return <ArrowUp className="h-4 w-4" />
    } else {
      return <ArrowDown className="h-4 w-4" />
    }
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No content items found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Items ({items.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">
                  <button
                    onClick={handleSortClick}
                    className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
                  >
                    Type
                    {getSortIcon()}
                  </button>
                </th>
                <th className="text-left p-3 font-semibold">ID</th>
                <th className="text-left p-3 font-semibold">Title</th>
                <th className="text-left p-3 font-semibold">Path</th>
                <th className="text-right p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => (
                <tr key={`${item.type}-${item.id}`} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className={getTypeColor(item.type)}>
                        {getTypeIcon(item.type)}
                      </span>
                      <span className="font-medium">{item.type}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{item.id}</td>
                  <td className="p-3">{item.title || `Untitled ${item.type}`}</td>
                  <td className="p-3">
                    <span className="text-sm text-muted-foreground">
                      {item.path || '—'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(getDetailPath(item))}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(getEditPath(item))}
                        className="gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

