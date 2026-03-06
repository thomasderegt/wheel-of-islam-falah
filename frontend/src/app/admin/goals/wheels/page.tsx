/**
 * Admin Wheels CRUD Page
 * Route: /admin/goals/wheels
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { useWheels, useCreateWheel, useUpdateWheel, useDeleteWheel } from '@/features/goals-okr'
import type { WheelDTO } from '@/features/goals-okr/api/goalsOkrApi'

export default function AdminWheelsPage() {
  const { data: wheels = [], isLoading, error, refetch } = useWheels()
  const createWheel = useCreateWheel()
  const updateWheel = useUpdateWheel()
  const deleteWheel = useDeleteWheel()

  const [createOpen, setCreateOpen] = useState(false)
  const [editWheel, setEditWheel] = useState<WheelDTO | null>(null)
  const [deleteWheelId, setDeleteWheelId] = useState<number | null>(null)

  const [form, setForm] = useState({
    wheelKey: '',
    nameNl: '',
    nameEn: '',
    descriptionNl: '',
    descriptionEn: '',
    displayOrder: 0,
  })

  const resetForm = () => {
    setForm({
      wheelKey: '',
      nameNl: '',
      nameEn: '',
      descriptionNl: '',
      descriptionEn: '',
      displayOrder: 0,
    })
  }

  const openCreate = () => {
    resetForm()
    setCreateOpen(true)
  }

  const openEdit = (w: WheelDTO) => {
    setEditWheel(w)
    setForm({
      wheelKey: w.wheelKey,
      nameNl: w.nameNl ?? '',
      nameEn: w.nameEn ?? '',
      descriptionNl: w.descriptionNl ?? '',
      descriptionEn: w.descriptionEn ?? '',
      displayOrder: w.displayOrder ?? 0,
    })
  }

  const handleCreate = async () => {
    try {
      await createWheel.mutateAsync({
        wheelKey: form.wheelKey.trim(),
        nameNl: form.nameNl.trim() || undefined,
        nameEn: form.nameEn.trim() || undefined,
        descriptionNl: form.descriptionNl.trim() || undefined,
        descriptionEn: form.descriptionEn.trim() || undefined,
        displayOrder: form.displayOrder,
      })
      setCreateOpen(false)
      resetForm()
    } catch (e: any) {
      alert(e?.response?.data?.error ?? e?.message ?? 'Failed to create wheel')
    }
  }

  const handleUpdate = async () => {
    if (!editWheel) return
    try {
      await updateWheel.mutateAsync({
        id: editWheel.id,
        request: {
          wheelKey: form.wheelKey.trim(),
          nameNl: form.nameNl.trim() || undefined,
          nameEn: form.nameEn.trim() || undefined,
          descriptionNl: form.descriptionNl.trim() || undefined,
          descriptionEn: form.descriptionEn.trim() || undefined,
          displayOrder: form.displayOrder,
        },
      })
      setEditWheel(null)
      resetForm()
    } catch (e: any) {
      alert(e?.response?.data?.error ?? e?.message ?? 'Failed to update wheel')
    }
  }

  const handleDelete = async () => {
    if (deleteWheelId == null) return
    try {
      await deleteWheel.mutateAsync(deleteWheelId)
      setDeleteWheelId(null)
    } catch (e: any) {
      alert(e?.response?.data?.error ?? e?.message ?? 'Failed to delete wheel')
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/goals">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Goals
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Wheels</h1>
          <p className="text-muted-foreground mt-2">
            Manage wheels (e.g. Wheel of Life, Wheel of Success)
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            New Wheel
          </Button>
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive">
          <p className="text-destructive">Error: {error.message}</p>
        </Card>
      )}

      {isLoading ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Loading wheels...</p>
        </Card>
      ) : wheels.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No wheels found</p>
          <Button onClick={openCreate} className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Create first wheel
          </Button>
        </Card>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wheels.map((w) => (
                <TableRow key={w.id}>
                  <TableCell className="font-mono text-sm">{w.wheelKey}</TableCell>
                  <TableCell>
                    {w.nameNl || w.nameEn || '—'}
                  </TableCell>
                  <TableCell>{w.displayOrder}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(w)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteWheelId(w.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Wheel</DialogTitle>
            <DialogDescription>
              Add a new wheel. At least one name (NL or EN) is required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="create-wheelKey">Wheel Key *</Label>
              <Input
                id="create-wheelKey"
                value={form.wheelKey}
                onChange={(e) => setForm((f) => ({ ...f, wheelKey: e.target.value }))}
                placeholder="e.g. WHEEL_OF_LIFE"
              />
            </div>
            <div>
              <Label htmlFor="create-nameNl">Name (NL)</Label>
              <Input
                id="create-nameNl"
                value={form.nameNl}
                onChange={(e) => setForm((f) => ({ ...f, nameNl: e.target.value }))}
                placeholder="Wiel van het Leven"
              />
            </div>
            <div>
              <Label htmlFor="create-nameEn">Name (EN)</Label>
              <Input
                id="create-nameEn"
                value={form.nameEn}
                onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
                placeholder="Wheel of Life"
              />
            </div>
            <div>
              <Label htmlFor="create-displayOrder">Display Order</Label>
              <Input
                id="create-displayOrder"
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm((f) => ({ ...f, displayOrder: parseInt(e.target.value, 10) || 0 }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createWheel.isPending || !form.wheelKey.trim()}>
              {createWheel.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editWheel} onOpenChange={(open) => !open && setEditWheel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Wheel</DialogTitle>
            <DialogDescription>
              Update wheel details. At least one name (NL or EN) is required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="edit-wheelKey">Wheel Key *</Label>
              <Input
                id="edit-wheelKey"
                value={form.wheelKey}
                onChange={(e) => setForm((f) => ({ ...f, wheelKey: e.target.value }))}
                placeholder="e.g. WHEEL_OF_LIFE"
              />
            </div>
            <div>
              <Label htmlFor="edit-nameNl">Name (NL)</Label>
              <Input
                id="edit-nameNl"
                value={form.nameNl}
                onChange={(e) => setForm((f) => ({ ...f, nameNl: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-nameEn">Name (EN)</Label>
              <Input
                id="edit-nameEn"
                value={form.nameEn}
                onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-displayOrder">Display Order</Label>
              <Input
                id="edit-displayOrder"
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm((f) => ({ ...f, displayOrder: parseInt(e.target.value, 10) || 0 }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditWheel(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateWheel.isPending || !form.wheelKey.trim()}>
              {updateWheel.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteWheelId != null} onOpenChange={(open) => !open && setDeleteWheelId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Wheel</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this wheel? You must delete all life domains under this wheel first.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteWheelId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteWheel.isPending}>
              {deleteWheel.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
