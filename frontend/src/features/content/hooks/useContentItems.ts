/**
 * useContentItems Hook
 * React Query hook for fetching content items list
 */

import { useQuery } from '@tanstack/react-query'
import { getAllCategories, getBooksByCategory, getChaptersByBook, getSectionsByChapter, getParagraphsBySection, getBookCurrentVersion, getChapterCurrentVersion } from '../api/contentApi'
import type { ContentItem } from '../components/ContentItemsTable'

export interface ContentFilters {
  type?: 'BOOK' | 'CHAPTER' | 'SECTION' | 'PARAGRAPH'
  bookId?: number
  categoryId?: number
}

/**
 * Flatten all content items from the hierarchy
 */
async function fetchAllContentItems(): Promise<ContentItem[]> {
  const items: ContentItem[] = []
  
  // Get all categories
  const categories = await getAllCategories()
  
  for (const category of categories) {
    // Get category title for path
    const categoryTitle = category.titleEn || category.titleNl || `Category ${category.id}`
    
    // Get all books in category
    const books = await getBooksByCategory(category.id)
    
    // Fetch all book versions in parallel for better performance
    const bookVersionPromises = books.map(book => 
      getBookCurrentVersion(book.id).catch(() => null)
    )
    const bookVersions = await Promise.all(bookVersionPromises)
    
    for (let i = 0; i < books.length; i++) {
      const book = books[i]
      const bookVersion = bookVersions[i]
      const bookTitle = bookVersion 
        ? (bookVersion.titleNl || bookVersion.titleEn || `Book ${book.id}`)
        : `Book ${book.id}`
      
      items.push({
        id: book.id,
        type: 'BOOK',
        title: bookTitle,
        path: categoryTitle,
        bookId: book.id,
        categoryId: category.id,
      })
      
      // Get all chapters in book
      const chapters = await getChaptersByBook(book.id)
      
      // Fetch all chapter versions in parallel for better performance
      const chapterVersionPromises = chapters.map(chapter =>
        getChapterCurrentVersion(chapter.id).catch(() => null)
      )
      const chapterVersions = await Promise.all(chapterVersionPromises)
      
      for (let j = 0; j < chapters.length; j++) {
        const chapter = chapters[j]
        const chapterVersion = chapterVersions[j]
        const chapterTitle = chapterVersion
          ? (chapterVersion.titleNl || chapterVersion.titleEn || `Chapter ${chapter.id}`)
          : `Chapter ${chapter.id} (Position: ${chapter.position})`
        
        items.push({
          id: chapter.id,
          type: 'CHAPTER',
          title: chapterTitle,
          path: `${categoryTitle} > ${bookTitle}`,
          bookId: book.id,
          categoryId: category.id,
        })
        
        // Get all sections in chapter
        const sections = await getSectionsByChapter(chapter.id)
        
        for (const section of sections) {
          items.push({
            id: section.id,
            type: 'SECTION',
            title: `Section ${section.orderIndex}`,
            path: `${categoryTitle} > ${bookTitle} > ${chapterTitle}`,
            bookId: book.id,
            categoryId: category.id,
          })
          
          // Get all paragraphs in section
          const paragraphs = await getParagraphsBySection(section.id)
          
          for (const paragraph of paragraphs) {
            items.push({
              id: paragraph.id,
              type: 'PARAGRAPH',
              title: `Paragraph ${paragraph.paragraphNumber || paragraph.id}`,
              path: `${categoryTitle} > ${bookTitle} > ${chapterTitle} > Section ${section.orderIndex}`,
              bookId: book.id,
              categoryId: category.id,
            })
          }
        }
      }
    }
  }
  
  return items
}

export function useContentItems(filters?: ContentFilters) {
  return useQuery({
    queryKey: ['contentItems', filters],
    queryFn: async () => {
      const allItems = await fetchAllContentItems()
      
      // Apply filters
      let filtered = allItems
      
      if (filters?.type) {
        filtered = filtered.filter(item => item.type === filters.type)
      }
      
      if (filters?.bookId) {
        filtered = filtered.filter(item => item.bookId === filters.bookId)
      }
      
      if (filters?.categoryId) {
        filtered = filtered.filter(item => item.categoryId === filters.categoryId)
      }
      
      return filtered
    },
  })
}

