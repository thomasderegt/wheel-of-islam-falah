/**
 * Content Creation Page
 * Main dashboard page for content creators to view and edit content
 * Route: /admin/content/creation
 */

'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { ContentItemsTable } from '@/features/content'
import { ContentFilterPanel } from '@/features/content'
import { CreateContentDialog } from '@/features/content'
import { useContentItems, useContentFilters } from '@/features/content'

export default function ContentCreationPage() {
  const { filters, setFilters, clearFilters } = useContentFilters()
  const { data: items, isLoading, error } = useContentItems(filters)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/content">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Content Management
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content Creation</h1>
        <div className="flex gap-2">
          <CreateContentDialog filters={filters} />
          <Button onClick={() => {}} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      <ContentFilterPanel value={filters} onChange={setFilters} />

      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive">
          <p className="text-destructive">Error: {error.message}</p>
        </Card>
      )}

      {isLoading ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Loading content items...</p>
        </Card>
      ) : (
        <ContentItemsTable items={items || []} />
      )}
    </div>
  )
}

