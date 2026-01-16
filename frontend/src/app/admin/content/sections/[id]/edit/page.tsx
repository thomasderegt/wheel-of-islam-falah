/**
 * Section Edit Page
 * Edit page for editing a section
 * Route: /admin/content/sections/[id]/edit
 * 
 * Note: Sections don't have a direct update endpoint.
 * Section content is managed through versions (CreateSectionVersion).
 * Only section metadata (orderIndex) could be updated, but there's no PUT endpoint.
 */

'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

export default function SectionEditPage() {
  const params = useParams()
  const sectionId = Number(params.id)

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href={`/admin/content/sections/${sectionId}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Section Details
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Edit Section</h1>
        <p className="text-muted-foreground mt-1">
          Section ID: {sectionId}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section Editing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Sections don't have a direct update endpoint. Section content is managed through versions.
            To edit section content, create a new section version.
          </p>
          <p className="text-muted-foreground mt-2">
            Use the version history panel on the detail page to create new versions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

