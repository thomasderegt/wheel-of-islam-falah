/**
 * Admin Dashboard Page
 * Main admin overview page with links to different admin sections
 * Route: /admin
 */

'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { FileText, BookOpen, Users } from 'lucide-react'

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Content Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Management
            </CardTitle>
            <CardDescription>
              Create and edit content structure and versions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Link href="/admin/content">
                <Button className="w-full">Go to Content Dashboard</Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-2">
                Edit content, create new versions, and submit for review
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Learning Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Learning Management
            </CardTitle>
            <CardDescription>
              Create and manage learning flow templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/learning">
              <Button className="w-full">Go to Learning Management</Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Design learning paths and reflection questions for sections
            </p>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>
              Manage users and their roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/user">
              <Button className="w-full">Go to User Management</Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              View users, assign roles, and manage permissions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="flex gap-4 flex-wrap">
          <Link href="/admin/content">
            <Button variant="outline">Content Management</Button>
          </Link>
          <Link href="/admin/learning">
            <Button variant="outline">Learning Management</Button>
          </Link>
          <Link href="/admin/user">
            <Button variant="outline">User Management</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

