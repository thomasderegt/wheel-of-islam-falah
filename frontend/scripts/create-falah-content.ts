/**
 * Script to create Falah Book and Chapter 0 (Dashboard)
 * 
 * This script uses the API to create:
 * 1. Falah Book in Category #0
 * 2. Chapter 0 (Dashboard) with position=0
 * 3. ChapterVersion with title "Dashboard"
 * 
 * Usage:
 *   - Make sure you're logged in (token in localStorage)
 *   - Run: npx tsx scripts/create-falah-content.ts
 * 
 * Or use the SQL migration V8__Create_falah_book_and_dashboard_chapter.sql instead
 */

import axios from 'axios'
import { config } from '../src/shared/constants/config'
import { SYSTEM_CATEGORIES } from '../src/shared/constants/systemCategories'

const API_BASE_URL = config.api.baseUrl

// Get auth token from localStorage (if running in browser context)
// Or set it as environment variable
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return process.env.AUTH_TOKEN || null
}

async function createFalahContent() {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error('No auth token found. Please log in first or set AUTH_TOKEN environment variable.')
  }

  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  try {
    console.log('🚀 Starting Falah content creation...\n')

    // Step 1: Get Falah Category (Category #0)
    console.log('📂 Step 1: Fetching Falah category...')
    const categoryResponse = await apiClient.get(
      `/api/v2/content/categories/${SYSTEM_CATEGORIES.FALAH.categoryNumber}?byNumber=true`
    )
    const falahCategory = categoryResponse.data
    console.log(`✅ Found Falah category: ${falahCategory.titleEn} (ID: ${falahCategory.id})\n`)

    // Step 2: Check if Falah Book already exists
    console.log('📚 Step 2: Checking for existing Falah book...')
    const booksResponse = await apiClient.get(
      `/api/v2/content/categories/${falahCategory.id}/books`
    )
    const existingBooks = booksResponse.data || []
    
    let falahBook
    if (existingBooks.length > 0) {
      falahBook = existingBooks[0]
      console.log(`✅ Falah book already exists (ID: ${falahBook.id})\n`)
    } else {
      // Create Falah Book
      console.log('📚 Step 2: Creating Falah book...')
      const bookResponse = await apiClient.post('/api/v2/content/books', {
        categoryId: falahCategory.id,
      })
      falahBook = bookResponse.data
      console.log(`✅ Created Falah book (ID: ${falahBook.id})\n`)
      
      // Create BookVersion
      console.log('📝 Creating BookVersion...')
      await apiClient.post(`/api/v2/content/books/${falahBook.id}/versions`, {
        titleEn: 'Falah',
        titleNl: 'Falah',
        introEn: 'The central place where you learn what Falah is, set goals, and track your progress.',
        introNl: 'De centrale plek waar je leert wat Falah is, doelen stelt en je voortgang volgt.',
        userId: 1, // TODO: Get from auth context
      })
      console.log('✅ Created BookVersion\n')
    }

    // Step 3: Check if Dashboard Chapter (position=0) already exists
    console.log('📖 Step 3: Checking for existing Dashboard chapter...')
    const chaptersResponse = await apiClient.get(
      `/api/v2/content/books/${falahBook.id}/chapters`
    )
    const existingChapters = chaptersResponse.data || []
    const dashboardChapter = existingChapters.find((ch: any) => ch.position === 0)
    
    if (dashboardChapter) {
      console.log(`✅ Dashboard chapter already exists (ID: ${dashboardChapter.id})\n`)
      console.log('🎉 Falah content setup complete!')
      console.log(`\n📊 Dashboard URL: /chapter/${dashboardChapter.id}/overview`)
      return
    }

    // Create Dashboard Chapter (position = 0)
    console.log('📖 Step 3: Creating Dashboard chapter (position=0)...')
    const chapterResponse = await apiClient.post('/api/v2/content/chapters', {
      bookId: falahBook.id,
      position: 0,
    })
    const dashboardChapter = chapterResponse.data
    console.log(`✅ Created Dashboard chapter (ID: ${dashboardChapter.id})\n`)

    // Step 4: Create ChapterVersion
    console.log('📝 Step 4: Creating ChapterVersion...')
    await apiClient.post(`/api/v2/content/chapters/${dashboardChapter.id}/versions`, {
      titleEn: 'Dashboard',
      titleNl: 'Dashboard',
      introEn: 'Your central dashboard to track progress across all three pillars: Dunya, Inner World, and Akhirah.',
      introNl: 'Jouw centrale dashboard om voortgang te volgen over alle drie pijlers: Dunya, Innerlijke Wereld en Ākhirah.',
      userId: 1, // TODO: Get from auth context
    })
    console.log('✅ Created ChapterVersion\n')

    console.log('🎉 Falah content setup complete!')
    console.log(`\n📊 Dashboard URL: /chapter/${dashboardChapter.id}/overview`)
  } catch (error: any) {
    console.error('❌ Error creating Falah content:')
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', JSON.stringify(error.response.data, null, 2))
    } else {
      console.error('Error:', error.message)
    }
    process.exit(1)
  }
}

// Run script
if (require.main === module) {
  createFalahContent()
    .then(() => {
      console.log('\n✅ Script completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error)
      process.exit(1)
    })
}

export { createFalahContent }
