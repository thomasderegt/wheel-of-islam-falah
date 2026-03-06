/**
 * Goals Management Landing Page
 * Route: /admin/goals
 *
 * Landing page for Goals Management with links to Wheels and Life Domains CRUD
 */

'use client'

import Link from 'next/link'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { ArrowLeft, CircleDot, Layers } from 'lucide-react'

export default function GoalsManagementLandingPage() {
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
        {/* Wheels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleDot className="h-5 w-5" />
              Wheels
            </CardTitle>
            <CardDescription>
              Create, edit, and manage wheels (e.g. Wheel of Life, Wheel of Success)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/goals/wheels">
              <Button className="w-full">Manage Wheels</Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Add wheels, edit names and descriptions, reorder display
            </p>
          </CardContent>
        </Card>

        {/* Life Domains */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Life Domains
            </CardTitle>
            <CardDescription>
              Create, edit, and manage life domains per wheel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/goals/life-domains">
              <Button className="w-full">Manage Life Domains</Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Add domains to wheels, edit titles and icons, reorder display
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
