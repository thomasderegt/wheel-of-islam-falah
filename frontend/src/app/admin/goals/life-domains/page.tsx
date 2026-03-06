/**
 * Admin Life Domains CRUD Page
 * Route: /admin/goals/life-domains
 */

'use client'

import { useState, useMemo } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  useWheels,
  useLifeDomains,
  useCreateLifeDomain,
  useUpdateLifeDomain,
  useDeleteLifeDomain,
} from '@/features/goals-okr'
import type { LifeDomainDTO } from '@/features/goals-okr/api/goalsOkrApi'

export default function AdminLifeDomainsPage() {
  const { data: wheels = [] } = useWheels()
  const { data: lifeDomains = [], isLoading, error, refetch } = useLifeDomains()
  const createLifeDomain = useCreateLifeDomain()
  const updateLifeDomain = useUpdateLifeDomain()
  const deleteLifeDomain = useDeleteLifeDomain()

  const wheelById = useMemo(() => {
    const m = new Map<number, string>()
    wheels.forEach((w) => m.set(w.id, w.nameNl || w.nameEn || w.wheelKey))
    return m
  }, [wheels])

  const [createOpen, setCreateOpen] = useState(false)
  const [editDomain, setEditDomain] = useState<LifeDomainDTO | null>(null)
  const [deleteDomainId, setDeleteDomainId] = useState<number | null>(null)

  const [form, setForm] = useState({
    wheelId: 0,
    titleNl: '',
    titleEn: '',
    descriptionNl: '',
    descriptionEn: '',
    iconName: '',
    displayOrder: 0,
  })

  const resetForm = () => {
    setForm({
      wheelId: wheels[0]?.id ?? 0,
      titleNl: '',
      titleEn: '',
      descriptionNl: '',
      descriptionEn: '',
      iconName: '',
      displayOrder: 0,
    })
  }

  const openCreate = () => {
    resetForm()
    setCreateOpen(true)
  }

  const openEdit = (d: LifeDomainDTO) => {
    setEditDomain(d)
    setForm({
      wheelId: d.wheelId ?? 0,
      titleNl: d.titleNl ?? '',
      titleEn: d.titleEn ?? '',
      descriptionNl: d.descriptionNl ?? '',
      descriptionEn: d.descriptionEn ?? '',
      iconName: d.iconName ?? '',
      displayOrder: d.displayOrder ?? 0,
    })
  }

  const handleCreate = async () => {
    if (!form.wheelId) {
      alert('Please select a wheel')
      return
    }
    try {
      await createLifeDomain.mutateAsync({
        wheelId: form.wheelId,
        titleNl: form.titleNl.trim() || undefined,
        titleEn: form.titleEn.trim() || undefined,
        descriptionNl: form.descriptionNl.trim() || undefined,
        descriptionEn: form.descriptionEn.trim() || undefined,
        iconName: form.iconName.trim() || undefined,
        displayOrder: form.displayOrder,
      })
      setCreateOpen(false)
      resetForm()
    } catch (e: any) {
      alert(e?.response?.data?.error ?? e?.message ?? 'Failed to create life domain')
    }
  }

  const handleUpdate = async () => {
    if (!editDomain) return
    if (!form.wheelId) {
      alert('Please select a wheel')
      return
    }
    try {
      await updateLifeDomain.mutateAsync({
        id: editDomain.id,
        request: {
          wheelId: form.wheelId,
          titleNl: form.titleNl.trim() || undefined,
          titleEn: form.titleEn.trim() || undefined,
          descriptionNl: form.descriptionNl.trim() || undefined,
          descriptionEn: form.descriptionEn.trim() || undefined,
          iconName: form.iconName.trim() || undefined,
          displayOrder: form.displayOrder,
        },
      })
      setEditDomain(null)
      resetForm()
    } catch (e: any) {
      alert(e?.response?.data?.error ?? e?.message ?? 'Failed to update life domain')
    }
  }

  const handleDelete = async () => {
    if (deleteDomainId == null) return
    try {
      await deleteLifeDomain.mutateAsync(deleteDomainId)
      setDeleteDomainId(null)
    } catch (e: any) {
      alert(e?.response?.data?.error ?? e?.message ?? 'Failed to delete life domain')
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
          <h1 className="text-3xl font-bold">Life Domains</h1>
          <p className="text-muted-foreground mt-2">
            Manage life domains per wheel (e.g. Religion, Family, Work)
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openCreate} className="gap-2" disabled={wheels.length === 0}>
            <Plus className="h-4 w-4" />
            New Life Domain
          </Button>
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
      </div>

      {wheels.length === 0 && (
        <Card className="p-4 bg-amber-500/10 border-amber-500/50">
          <p className="text-amber-800 dark:text-amber-200">
            Create at least one wheel first before adding life domains.
          </p>
          <Link href="/admin/goals/wheels">
            <Button variant="outline" className="mt-2">
              Go to Wheels
            </Button>
          </Link>
        </Card>
      )}

      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive">
          <p className="text-destructive">Error: {error.message}</p>
        </Card>
      )}

      {isLoading ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Loading life domains...</p>
        </Card>
      ) : lifeDomains.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No life domains found</p>
          <Button onClick={openCreate} className="mt-4 gap-2" disabled={wheels.length === 0}>
            <Plus className="h-4 w-4" />
            Create first life domain
          </Button>
        </Card>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Wheel</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lifeDomains.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.titleNl || d.titleEn || '—'}</TableCell>
                  <TableCell>{d.wheelId ? wheelById.get(d.wheelId) ?? `Wheel ${d.wheelId}` : '—'}</TableCell>
                  <TableCell>{d.iconName || '—'}</TableCell>
                  <TableCell>{d.displayOrder}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(d)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteDomainId(d.id)}
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
            <DialogTitle>Create Life Domain</DialogTitle>
            <DialogDescription>
              Add a new life domain to a wheel. At least one title (NL or EN) is required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Wheel *</Label>
              <Select
                value={form.wheelId ? String(form.wheelId) : ''}
                onValueChange={(v) => setForm((f) => ({ ...f, wheelId: parseInt(v, 10) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select wheel" />
                </SelectTrigger>
                <SelectContent>
                  {wheels.map((w) => (
                    <SelectItem key={w.id} value={String(w.id)}>
                      {w.nameNl || w.nameEn || w.wheelKey}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="create-titleNl">Title (NL)</Label>
              <Input
                id="create-titleNl"
                value={form.titleNl}
                onChange={(e) => setForm((f) => ({ ...f, titleNl: e.target.value }))}
                placeholder="Religie"
              />
            </div>
            <div>
              <Label htmlFor="create-titleEn">Title (EN)</Label>
              <Input
                id="create-titleEn"
                value={form.titleEn}
                onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))}
                placeholder="Religion"
              />
            </div>
            <div>
              <Label htmlFor="create-iconName">Icon Name</Label>
              <Input
                id="create-iconName"
                value={form.iconName}
                onChange={(e) => setForm((f) => ({ ...f, iconName: e.target.value }))}
                placeholder="e.g. heart"
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
            <Button
              onClick={handleCreate}
              disabled={createLifeDomain.isPending || !form.wheelId || (!form.titleNl.trim() && !form.titleEn.trim())}
            >
              {createLifeDomain.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editDomain} onOpenChange={(open) => !open && setEditDomain(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Life Domain</DialogTitle>
            <DialogDescription>
              Update life domain details. At least one title (NL or EN) is required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Wheel *</Label>
              <Select
                value={form.wheelId ? String(form.wheelId) : ''}
                onValueChange={(v) => setForm((f) => ({ ...f, wheelId: parseInt(v, 10) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select wheel" />
                </SelectTrigger>
                <SelectContent>
                  {wheels.map((w) => (
                    <SelectItem key={w.id} value={String(w.id)}>
                      {w.nameNl || w.nameEn || w.wheelKey}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-titleNl">Title (NL)</Label>
              <Input
                id="edit-titleNl"
                value={form.titleNl}
                onChange={(e) => setForm((f) => ({ ...f, titleNl: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-titleEn">Title (EN)</Label>
              <Input
                id="edit-titleEn"
                value={form.titleEn}
                onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-iconName">Icon Name</Label>
              <Input
                id="edit-iconName"
                value={form.iconName}
                onChange={(e) => setForm((f) => ({ ...f, iconName: e.target.value }))}
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
            <Button variant="outline" onClick={() => setEditDomain(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateLifeDomain.isPending || !form.wheelId || (!form.titleNl.trim() && !form.titleEn.trim())}
            >
              {updateLifeDomain.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDomainId != null} onOpenChange={(open) => !open && setDeleteDomainId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Life Domain</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this life domain? You must delete all objectives under this domain first.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDomainId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLifeDomain.isPending}>
              {deleteLifeDomain.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
