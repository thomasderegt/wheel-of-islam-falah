/**
 * useFalahDashboardData Hook
 * 
 * Aggregeert data uit verschillende modules voor Falah Dashboard:
 * - Learning enrollments (Inner World)
 * - Content progress (alle pijlers)
 * - Goals (nog te implementeren)
 */

import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth'
import { getEnrollmentsForUser } from '@/features/learning/api/learningApi'
import { getPublicBooksByCategory, getPublicChaptersByBook, getCategoryByNumber } from '@/features/content/api/contentApi'

interface DashboardData {
  dunya: {
    chaptersRead: number
    projectsStarted: number
    timeSpent: string
  }
  innerWorld: {
    flowsCompleted: number
    sectionsRead: number
    timeSpent: string
  }
  akhirah: {
    goodDeeds: number
    timeSpent: string
  }
  goals: Array<{
    title: string
    progress?: number
  }>
}

export function useFalahDashboardData() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['falahDashboard', user?.id],
    queryFn: async (): Promise<DashboardData> => {
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      // Load learning enrollments for Inner World
      const enrollments = await getEnrollmentsForUser(user.id)
      
      // Count completed enrollments
      const flowsCompleted = enrollments.filter(e => e.completedAt !== null).length
      
      // Estimate time spent (rough estimate: 30 min per completed enrollment)
      const innerWorldTimeSpent = Math.round(flowsCompleted * 0.5) // hours

      // Load content progress for each category
      // Category #1: Dunya
      const dunyaCategory = await getCategoryByNumber(1)
      const dunyaBooks = await getPublicBooksByCategory(dunyaCategory.id)
      let dunyaChaptersRead = 0
      for (const book of dunyaBooks) {
        const chapters = await getPublicChaptersByBook(book.id)
        dunyaChaptersRead += chapters.length // Simplified: count all chapters as "read"
      }

      // Category #2: Inner World (already have enrollments)
      const innerWorldCategory = await getCategoryByNumber(2)
      const innerWorldBooks = await getPublicBooksByCategory(innerWorldCategory.id)
      let sectionsRead = 0
      for (const enrollment of enrollments) {
        // Each enrollment is for a section, so count unique sections
        sectionsRead++
      }

      // Category #3: Akhirah
      const akhirahCategory = await getCategoryByNumber(3)
      const akhirahBooks = await getPublicBooksByCategory(akhirahCategory.id)
      // TODO: Track good deeds when that module is implemented

      return {
        dunya: {
          chaptersRead: dunyaChaptersRead,
          projectsStarted: 0, // TODO: Implement when project tracking is ready
          timeSpent: `${Math.round(dunyaChaptersRead * 0.5)}h`, // Estimate: 30 min per chapter
        },
        innerWorld: {
          flowsCompleted,
          sectionsRead,
          timeSpent: `${innerWorldTimeSpent}h`,
        },
        akhirah: {
          goodDeeds: 0, // TODO: Implement when good deeds tracking is ready
          timeSpent: '0h',
        },
        goals: [], // TODO: Implement when goals module is ready
      }
    },
    enabled: !!user?.id,
  })
}
