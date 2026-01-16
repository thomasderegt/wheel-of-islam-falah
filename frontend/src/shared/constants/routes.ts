/**
 * Route Paths
 */

export const routes = {
  // Public
  landing: '/',
  
  // Auth
  login: '/login',
  register: '/register',
  
  // App (Protected)
  home: '/home',
  
  // Content
  categories: '/categories',
  category: (id: number) => `/categories/${id}`,
  categoryBooks: (categoryId: number) => `/categories/${categoryId}/books`,
  
  books: '/books',
  book: (id: number) => `/books/${id}`,
  bookChapters: (bookId: number) => `/books/${bookId}/chapters`,
  
  chapters: '/chapters',
  chapter: (id: number) => `/chapters/${id}`,
  
  sections: '/sections',
  section: (id: number) => `/sections/${id}`,
  sectionParagraphs: (sectionId: number) => `/sections/${sectionId}/paragraphs`,
  
  paragraphs: '/paragraphs',
  paragraph: (id: number) => `/paragraphs/${id}`,
  
  // Admin
  admin: '/admin',
} as const

