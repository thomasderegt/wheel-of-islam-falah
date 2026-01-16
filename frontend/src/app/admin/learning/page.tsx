/**
 * Learning Management Landing Page
 * Route: /admin/learning
 * 
 * Landing page voor Learning Management met links naar:
 * - Template Creation: Create, edit, and manage learning flow templates
 * - Template Review: Review and approve template submissions
 */

'use client'

import Link from 'next/link'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { ArrowLeft, BookOpen, CheckSquare } from 'lucide-react'

export default function LearningManagementLandingPage() {
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
        {/* Learning Template Creation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Learning Template Creation
            </CardTitle>
            <CardDescription>
              Create, edit, and manage learning flow templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/learning/creation">
              <Button className="w-full">Go to Template Creation</Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              View templates, create new templates, edit existing templates, and submit for review
            </p>
          </CardContent>
        </Card>

        {/* Learning Template Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Learning Template Review
            </CardTitle>
            <CardDescription>
              Review and approve template submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/learning/review">
              <Button className="w-full">Go to Template Review</Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Review submitted template versions, add comments, approve or reject submissions
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

