/**
 * Content Feature Types
 */

export type EntityType = 'BOOK' | 'CHAPTER' | 'PARAGRAPH' | 'SECTION'

export interface VersionHistoryItem {
  id: number
  versionNumber: number
  createdAt: string
  createdBy?: number | null
  titleEn?: string | null
  titleNl?: string | null
  introEn?: string | null
  introNl?: string | null
  contentEn?: string | null
  contentNl?: string | null
}

