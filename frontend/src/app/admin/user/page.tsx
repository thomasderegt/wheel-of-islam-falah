/**
 * User Management Landing Page
 * Route: /admin/user
 *
 * Lists all users (admin only). Assign roles / permissions can be added later.
 */

'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { ChevronLeft, Users } from 'lucide-react'
import { authApi } from '@/features/auth/api/authApi'

export default function UserManagementPage() {
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => authApi.getAdminUsers(),
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon" aria-label="Back to Admin">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            Manage users, assign roles, and manage permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground">Gebruikers laden...</p>
          )}
          {error && (
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : 'Kon gebruikers niet laden. Alleen admins hebben toegang.'}
            </p>
          )}
          {!isLoading && !error && users.length === 0 && (
            <p className="text-sm text-muted-foreground">Er zijn nog geen gebruikers.</p>
          )}
          {!isLoading && !error && users.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Naam</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rollen</TableHead>
                  <TableHead>Aangemaakt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-mono text-muted-foreground">{u.id}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.profileName ?? '—'}</TableCell>
                    <TableCell>{u.status}</TableCell>
                    <TableCell>{u.roles?.length ? u.roles.join(', ') : '—'}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('nl-NL') : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
