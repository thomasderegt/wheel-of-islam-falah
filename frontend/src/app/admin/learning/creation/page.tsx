/**
 * Learning Template Creation Page
 * Overview page for learning flow templates
 * Route: /admin/learning/creation
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { useTemplateFilters, useTemplates } from '@/features/learning'
import { TemplatesTable } from '@/features/learning/components/TemplatesTable'
import { TemplateFilterPanel } from '@/features/learning/components/TemplateFilterPanel'
import { deleteTemplate } from '@/features/learning/api/learningApi'

export default function LearningTemplateCreationPage() {
  const { filters, setFilters } = useTemplateFilters()
  const [refreshKey, setRefreshKey] = useState(0)
  const { items, loading, error } = useTemplates(filters, refreshKey)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<number | null>(null)

  const handleDelete = async (templateId: number) => {
    try {
      await deleteTemplate(templateId)
      setDeleteDialogOpen(false)
      setTemplateToDelete(null)
      // Trigger refresh by updating key
      setRefreshKey((prev) => prev + 1)
    } catch (err) {
      console.error('Failed to delete template:', err)
      alert(err instanceof Error ? err.message : 'Failed to delete template')
    }
  }

  const openDeleteDialog = (templateId: number) => {
    setTemplateToDelete(templateId)
    setDeleteDialogOpen(true)
  }

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/learning">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Learning Management
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Learning Template Creation</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage learning flow templates for sections
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/learning/templates/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Template
            </Button>
          </Link>
          <Button onClick={handleRefresh} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      <TemplateFilterPanel value={filters} onChange={setFilters} />

      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive">
          <p className="text-destructive">Error: {error.message}</p>
        </Card>
      )}

      {loading ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Loading templates...</p>
        </Card>
      ) : (
        <TemplatesTable items={items} onDelete={openDeleteDialog} />
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
              The template can only be deleted if there are no enrollments.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => templateToDelete && handleDelete(templateToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
