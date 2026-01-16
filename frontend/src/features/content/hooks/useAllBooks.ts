/**
 * useAllBooks Hook
 * React Query hook for fetching all books with their titles
 */

import { useQuery } from '@tanstack/react-query'
import { getAllCategories, getBooksByCategory, getBookCurrentVersion } from '../api/contentApi'

export interface BookOption {
  id: number
  title: string
  categoryTitle: string
}

async function fetchAllBooks(): Promise<BookOption[]> {
  const books: BookOption[] = []
  const categories = await getAllCategories()
  
  for (const category of categories) {
    const categoryTitle = category.titleEn || category.titleNl || `Category ${category.id}`
    const categoryBooks = await getBooksByCategory(category.id)
    
    const bookVersionPromises = categoryBooks.map(book => 
      getBookCurrentVersion(book.id).catch(() => null)
    )
    const bookVersions = await Promise.all(bookVersionPromises)
    
    for (let i = 0; i < categoryBooks.length; i++) {
      const book = categoryBooks[i]
      const bookVersion = bookVersions[i]
      const bookTitle = bookVersion 
        ? (bookVersion.titleNl || bookVersion.titleEn || `Book ${book.id}`)
        : `Book ${book.id}`
      
      books.push({
        id: book.id,
        title: bookTitle,
        categoryTitle,
      })
    }
  }
  
  return books.sort((a, b) => {
    // Sort by category title first, then by book title
    if (a.categoryTitle !== b.categoryTitle) {
      return a.categoryTitle.localeCompare(b.categoryTitle)
    }
    return a.title.localeCompare(b.title)
  })
}

export function useAllBooks() {
  return useQuery({
    queryKey: ['allBooks'],
    queryFn: fetchAllBooks,
  })
}
