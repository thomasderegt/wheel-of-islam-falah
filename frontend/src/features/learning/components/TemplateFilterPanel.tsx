/**
 * TemplateFilterPanel Component
 * Filter panel for filtering templates by name and section
 */

'use client'

import { useEffect, useState } from 'react'
import type { TemplateFilter } from '../hooks/useTemplateFilters'
import { getAllCategories, getBooksByCategory, getChaptersByBook, getSectionsByChapter, getSectionPublishedVersion } from '@/features/content/api/contentApi'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Button } from '@/shared/components/ui/button'

interface TemplateFilterPanelProps {
  readonly value: TemplateFilter
  readonly onChange: (next: TemplateFilter) => void
}

interface SectionOption {
  id: number
  title: string
}

export function TemplateFilterPanel({ value, onChange }: TemplateFilterPanelProps) {
  const [sections, setSections] = useState<SectionOption[]>([])
  const [loading, setLoading] = useState(false)

  // Load all sections on mount
  useEffect(() => {
    setLoading(true)
    const loadSections = async () => {
      try {
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
      } finally {
        setLoading(false)
      }
    }

    loadSections()
  }, [])

  const handleTemplateNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      templateName: e.target.value || undefined,
    })
  }

  const handleSectionChange = (sectionId: string) => {
    onChange({
      ...value,
      sectionId: sectionId && sectionId !== '__all__' ? Number(sectionId) : undefined,
    })
  }

  const handleClearFilters = () => {
    onChange({})
  }

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Template Name Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Template Name</label>
          <Input
            placeholder="Search by template name..."
            value={value.templateName || ''}
            onChange={handleTemplateNameChange}
            disabled={loading}
          />
        </div>

        {/* Section Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Section</label>
          <Select
            value={value.sectionId?.toString() || '__all__'}
            onValueChange={handleSectionChange}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All sections</SelectItem>
              {sections.map((section) => (
                <SelectItem key={section.id} value={section.id.toString()}>
                  {section.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
