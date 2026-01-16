/**
 * Content Management Landing Page
 * Landing page for Content Management with links to Creation and Review
 * Route: /admin/content
 */

'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { FileText, CheckSquare, ArrowLeft } from 'lucide-react'

export default function ContentManagementLandingPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Content Creation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Creation
            </CardTitle>
            <CardDescription>
              Create, edit, and manage content structure and versions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/content/creation">
              <Button className="w-full">Go to Content Creation</Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              View content items, create new content, edit existing content, and submit for review
            </p>
          </CardContent>
        </Card>

        {/* Content Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Content Review
            </CardTitle>
            <CardDescription>
              Review and approve content versions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/content/review">
              <Button className="w-full">Go to Content Review</Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Review submitted content, approve or reject versions, and manage publication status
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
