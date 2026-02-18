/**
 * Create Template Page
 * Page for creating a new learning flow template
 * Route: /admin/learning/templates/new
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { createTemplate } from '@/features/learning/api/learningApi'
import { getAllCategories, getBooksByCategory, getChaptersByBook, getSectionsByChapter, getSectionPublishedVersion } from '@/features/content/api/contentApi'
import { useAuth } from '@/features/auth'

interface SectionOption {
  id: number
  title: string
}

export default function CreateTemplatePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sections, setSections] = useState<SectionOption[]>([])
  const [loadingSections, setLoadingSections] = useState(true)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [sectionId, setSectionId] = useState<number | null>(null)

  useEffect(() => {
    loadSections()
  }, [])

  const loadSections = async () => {
    try {
      setLoadingSections(true)
      const categories = await getAllCategories()
      const sectionsMap = new Map<number, SectionOption>()

      // Extract all sections from categories
      for (const category of categories) {
        try {
          const books = await getBooksByCategory(category.id)
          for (const book of books) {
            const chapters = await getChaptersByBook(book.id)
            for (const chapter of chapters) {
              const chapterSections = await getSectionsByChapter(chapter.id)
              for (const section of chapterSections) {
                if (!sectionsMap.has(section.id)) {
                  const sectionVersion = await getSectionPublishedVersion(section.id).catch(() => null)
                  const title = sectionVersion
                    ? (sectionVersion.titleNl || sectionVersion.titleEn || `Section ${section.orderIndex}`)
                    : `Section ${section.orderIndex}`
                  sectionsMap.set(section.id, { id: section.id, title })
                }
              }
            }
          }
        } catch (err) {
          console.error(`Failed to load sections for category ${category.id}:`, err)
        }
      }

      setSections(Array.from(sectionsMap.values()))
    } catch (err) {
      console.error('Failed to load sections:', err)
      setError('Failed to load sections')
    } finally {
      setLoadingSections(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Name is required')
      return
    }

    if (!sectionId) {
      setError('Please select a section')
      return
    }

    if (!user?.id) {
      setError('You must be logged in to create a template')
      return
    }

    setLoading(true)
    try {
      const template = await createTemplate({
        name: name.trim(),
        description: description.trim() || null,
        sectionId,
        createdBy: user.id,
      })
      router.push(`/admin/learning/templates/${template.id}`)
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to create template')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/learning/creation">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Templates
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold">Create New Learning Flow Template</h1>

      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive">
          <p className="text-destructive">Error: {error}</p>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Deep Reflection, Quick Practice"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose and approach of this learning flow"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sectionId">Section *</Label>
              {loadingSections ? (
                <p className="text-sm text-muted-foreground">Loading sections...</p>
              ) : (
                <Select
                  value={sectionId?.toString() || ''}
                  onValueChange={(value) => setSectionId(Number.parseInt(value, 10))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id.toString()}>
                        {section.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <p className="text-sm text-muted-foreground">
                Select the section this learning flow template is for
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading || !sectionId || !name.trim()}>
                {loading ? 'Creating...' : 'Create Template'}
              </Button>
              <Link href="/admin/learning/creation">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
