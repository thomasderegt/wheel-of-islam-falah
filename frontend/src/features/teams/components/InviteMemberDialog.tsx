'use client'

/**
 * InviteMemberDialog Component
 * Dialog for inviting a team member
 */

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useInviteTeamMember } from '../hooks/useTeams'
import { Loading } from '@/shared/components/ui/Loading'
import { getErrorMessage } from '@/shared/api/errors'

interface InviteMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teamId: number
  onSuccess?: () => void
}

export function InviteMemberDialog({ open, onOpenChange, teamId, onSuccess }: InviteMemberDialogProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'OWNER' | 'ADMIN' | 'MEMBER'>('MEMBER')
  const [error, setError] = useState<string | null>(null)

  const inviteMutation = useInviteTeamMember()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('Email is verplicht')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Ongeldig email adres')
      return
    }

    try {
      await inviteMutation.mutateAsync({
        teamId,
        email: email.trim().toLowerCase(),
        role,
      })
      
      // Reset form
      setEmail('')
      setRole('MEMBER')
      setError(null)
      
      // Close dialog
      onOpenChange(false)
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const handleClose = () => {
    if (!inviteMutation.isPending) {
      setEmail('')
      setRole('MEMBER')
      setError(null)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Lid Uitnodigen</DialogTitle>
          <DialogDescription>
            Nodig een gebruiker uit om lid te worden van dit team via hun email adres.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="member-email">Email Adres *</Label>
              <Input
                id="member-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gebruiker@example.com"
                disabled={inviteMutation.isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-role">Rol</Label>
              <Select
                value={role}
                onValueChange={(value: 'OWNER' | 'ADMIN' | 'MEMBER') => setRole(value)}
                disabled={inviteMutation.isPending}
              >
                <SelectTrigger id="member-role">
                  <SelectValue placeholder="Selecteer rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">Member</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="OWNER">Owner</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Members kunnen het team bekijken. Admins kunnen leden beheren. Owners hebben volledige controle.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={inviteMutation.isPending}
            >
              Annuleren
            </Button>
            <Button
              type="submit"
              disabled={inviteMutation.isPending || !email.trim()}
            >
              {inviteMutation.isPending ? (
                <>
                  <Loading className="mr-2" />
                  Uitnodigen...
                </>
              ) : (
                'Uitnodigen'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
