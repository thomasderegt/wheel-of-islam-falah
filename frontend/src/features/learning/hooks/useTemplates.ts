/**
 * Hook for fetching templates with filters
 */

import { useEffect, useState } from 'react'
import { getAllTemplates, getStepsForTemplate } from '../api/learningApi'
import type { LearningFlowTemplateDTO, LearningFlowStepDTO } from '@/shared/api/types'
import { getAllCategories, getBooksByCategory, getChaptersByBook, getSectionsByChapter, getBookCurrentVersion, getChapterCurrentVersion, getSectionPublishedVersion } from '@/features/content/api/contentApi'
import type { TemplateFilter } from './useTemplateFilters'

export interface TemplateItemSummary {
  id: number
  name: string
  description: string | null
  sectionId: number
  sectionTitle?: string
  bookTitle?: string
  chapterTitle?: string
  createdAt: string
  createdBy: number | null
  stepCount: number
  steps: LearningFlowStepDTO[]
}

export function useTemplates(filters: TemplateFilter, refreshKey?: number) {
  const [items, setItems] = useState<TemplateItemSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    ;(async () => {
      try {
        const [templates, categories] = await Promise.all([
          getAllTemplates(),
          getAllCategories(),
        ])

        if (cancelled) return

        // Build a map of sectionId -> section info with book/chapter path
        const sectionMap = new Map<
          number,
          { sectionTitle?: string; bookTitle?: string; chapterTitle?: string }
        >()

        // Extract sections from categories by fetching books, chapters, and sections
        for (const category of categories) {
          try {
            const books = await getBooksByCategory(category.id)
            for (const book of books) {
              const bookVersion = await getBookCurrentVersion(book.id).catch(() => null)
              const bookTitle = bookVersion
                ? (bookVersion.titleNl || bookVersion.titleEn || `Book ${book.id}`)
                : `Book ${book.id}`

              const chapters = await getChaptersByBook(book.id)
              for (const chapter of chapters) {
                const chapterVersion = await getChapterCurrentVersion(chapter.id).catch(() => null)
                const chapterTitle = chapterVersion
                  ? (chapterVersion.titleNl || chapterVersion.titleEn || `Chapter ${chapter.id}`)
                  : `Chapter ${chapter.id}`

                const sections = await getSectionsByChapter(chapter.id)
                for (const section of sections) {
                  if (!sectionMap.has(section.id)) {
                    const sectionVersion = await getSectionPublishedVersion(section.id).catch(() => null)
                    const sectionTitle = sectionVersion
                      ? (sectionVersion.titleNl || sectionVersion.titleEn || `Section ${section.orderIndex}`)
                      : `Section ${section.orderIndex}`

                    sectionMap.set(section.id, {
                      sectionTitle,
                      bookTitle,
                      chapterTitle,
                    })
                  }
                }
              }
            }
          } catch (err) {
            console.error(`Failed to load sections for category ${category.id}:`, err)
          }
        }

        // Get steps for all templates
        const stepsPromises = templates.map((template) =>
          getStepsForTemplate(template.id)
            .then((steps) => ({ templateId: template.id, steps }))
            .catch(() => ({ templateId: template.id, steps: [] as LearningFlowStepDTO[] }))
        )

        const stepsData = await Promise.all(stepsPromises)
        const stepsMap = new Map(stepsData.map((sd) => [sd.templateId, sd.steps]))

        let filteredTemplates = templates.map((template) => {
          const sectionInfo = sectionMap.get(template.sectionId) || {}
          const steps = stepsMap.get(template.id) || []
          return {
            id: template.id,
            name: template.name,
            description: template.description,
            sectionId: template.sectionId,
            sectionTitle: sectionInfo.sectionTitle,
            bookTitle: sectionInfo.bookTitle,
            chapterTitle: sectionInfo.chapterTitle,
            createdAt: template.createdAt,
            createdBy: template.createdBy,
            stepCount: steps.length,
            steps,
          }
        })

        // Apply filters
        if (filters.templateName) {
          const searchTerm = filters.templateName.toLowerCase()
          filteredTemplates = filteredTemplates.filter((t) =>
            t.name.toLowerCase().includes(searchTerm)
          )
        }
        if (filters.sectionId) {
          filteredTemplates = filteredTemplates.filter((t) => t.sectionId === filters.sectionId)
        }

        setItems(filteredTemplates)
        setLoading(false)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [filters.sectionId, filters.templateName, refreshKey])

  return { items, loading, error }
}
