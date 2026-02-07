'use client'

/**
 * Hierarchical Navigation Component
 * 
 * Mobile-first navigation component for hierarchical entities
 * - Up/Down: Navigate between hierarchy levels
 * - Forward/Back: Navigate within the same level (siblings)
 * 
 * Supports:
 * - Content: Category → Book → Chapter → Section → Paragraph
 * - Goals OKR: Life Domain → Goal → Objective → Key Result → Initiative
 */

import { usePathname, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { 
  getBook, 
  getChapter, 
  getSection,
  getChaptersByBook,
  getSectionsByChapter,
  getBooksByCategory
} from '@/features/content/api/contentApi'
import {
  getGoal,
  getObjective,
  getKeyResult,
  getGoalsByLifeDomain,
  getObjectivesByGoal,
  getKeyResultsByObjective,
  getAllLifeDomains
} from '@/features/goals-okr/api/goalsOkrApi'

interface NavigationItem {
  id: number
  route: string
  title: string
}

interface HierarchicalNavigationProps {
  entityType: 'content' | 'goals-okr'
  entityId: number
  parentId?: number
  language?: 'nl' | 'en'
  goalsOkrEntityType?: 'goal' | 'objective' | 'key-result' // Specific type for goals-okr to avoid unnecessary API calls
}

export function HierarchicalNavigation({ 
  entityType, 
  entityId, 
  parentId,
  language = 'en',
  goalsOkrEntityType
}: HierarchicalNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Determine current level and fetch navigation data
  const { data: navData, isLoading } = useQuery({
    queryKey: ['hierarchical-nav', entityType, entityId, parentId, goalsOkrEntityType],
    queryFn: async () => {
      if (entityType === 'content') {
        return await getContentNavigation(entityId, parentId, language)
      } else {
        return await getGoalsOKRNavigation(entityId, parentId, language, goalsOkrEntityType)
      }
    },
    enabled: !!entityId,
  })

  if (isLoading || !navData) {
    return null
  }

  const handleUp = () => {
    if (navData.parent) {
      router.push(navData.parent.route)
    }
  }

  const handleDown = () => {
    if (navData.children && navData.children.length > 0) {
      router.push(navData.children[0].route)
    }
  }


  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {/* Up Button */}
      <button
        onClick={handleUp}
        disabled={!navData.parent}
        className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors ${
          navData.parent
            ? 'bg-muted text-foreground hover:bg-muted/80 cursor-pointer'
            : 'bg-muted/30 text-muted-foreground/30 cursor-not-allowed'
        }`}
        aria-label="Go up"
        title={navData.parent ? `Up to ${navData.parent.title}` : 'No parent'}
      >
        <span className="text-sm font-medium">Up</span>
      </button>

      {/* Down Button */}
      <button
        onClick={handleDown}
        disabled={!navData.children || navData.children.length === 0}
        className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors ${
          navData.children && navData.children.length > 0
            ? 'bg-muted text-foreground hover:bg-muted/80 cursor-pointer'
            : 'bg-muted/30 text-muted-foreground/30 cursor-not-allowed'
        }`}
        aria-label="Go down"
        title={navData.children && navData.children.length > 0 ? `Down to ${navData.children[0].title}` : 'No children'}
      >
        <span className="text-sm font-medium">Down</span>
      </button>
    </div>
  )
}

/**
 * Auto-detect hierarchical navigation component
 * Automatically detects the current entity from pathname and shows navigation
 */
export function AutoHierarchicalNavigation({ language = 'en' }: { language?: 'nl' | 'en' }) {
  const pathname = usePathname()

  // Content routes
  if (pathname?.startsWith('/book/')) {
    const bookId = Number(pathname.split('/')[2])
    if (isNaN(bookId)) return null
    return <HierarchicalNavigation entityType="content" entityId={bookId} language={language} />
  }
  if (pathname?.startsWith('/chapter/')) {
    // Handle both /chapter/[id] and /chapter/[id]/overview
    const chapterId = Number(pathname.split('/')[2])
    if (isNaN(chapterId)) return null
    return <HierarchicalNavigation entityType="content" entityId={chapterId} language={language} />
  }
  if (pathname?.startsWith('/section/')) {
    const sectionId = Number(pathname.split('/')[2])
    if (isNaN(sectionId)) return null
    return <HierarchicalNavigation entityType="content" entityId={sectionId} language={language} />
  }

  // Goals OKR routes
  if (pathname === '/goals-okr') {
    return <HomePageNavigation language={language} />
  }
  if (pathname?.startsWith('/goals-okr/life-domains/')) {
    const lifeDomainId = Number(pathname.split('/')[3])
    if (isNaN(lifeDomainId)) return null
    return <LifeDomainNavigation lifeDomainId={lifeDomainId} language={language} />
  }
  if (pathname?.startsWith('/goals-okr/goals/')) {
    const goalId = Number(pathname.split('/')[3])
    if (isNaN(goalId)) return null
    return <HierarchicalNavigation entityType="goals-okr" entityId={goalId} language={language} goalsOkrEntityType="goal" />
  }
  if (pathname?.startsWith('/goals-okr/objectives/')) {
    const objectiveId = Number(pathname.split('/')[3])
    if (isNaN(objectiveId)) return null
    return <HierarchicalNavigation entityType="goals-okr" entityId={objectiveId} language={language} goalsOkrEntityType="objective" />
  }
  if (pathname?.startsWith('/goals-okr/key-results/')) {
    const keyResultId = Number(pathname.split('/')[3])
    if (isNaN(keyResultId)) return null
    return <HierarchicalNavigation entityType="goals-okr" entityId={keyResultId} language={language} goalsOkrEntityType="key-result" />
  }

  return null
}

/**
 * Home Page Navigation
 * No navigation buttons needed on home page
 */
function HomePageNavigation({ language = 'en' }: { language?: 'nl' | 'en' }) {
  return null
}

/**
 * Life Domain Navigation
 * Shows Up to home, Forward/Back between life domains, Down to first goal
 */
function LifeDomainNavigation({ lifeDomainId, language = 'en' }: { lifeDomainId: number; language?: 'nl' | 'en' }) {
  const router = useRouter()
  
  const { data: lifeDomains, isLoading: isLoadingDomains } = useQuery({
    queryKey: ['goals-okr', 'lifeDomains'],
    queryFn: getAllLifeDomains,
  })

  const { data: goals, isLoading: isLoadingGoals } = useQuery({
    queryKey: ['goals-okr', 'goals', 'life-domain', lifeDomainId],
    queryFn: () => getGoalsByLifeDomain(lifeDomainId),
    enabled: !!lifeDomainId,
  })

  if (isLoadingDomains || isLoadingGoals || !lifeDomains) {
    return null
  }

  const firstGoal = goals && goals.length > 0 ? goals[0] : null
  const currentDomain = lifeDomains.find(d => d.id === lifeDomainId)

  const handleUp = () => {
    // Pass wheelId as query parameter to preserve wheel selection
    const wheelId = currentDomain?.wheelId
    if (wheelId) {
      router.push(`/goals-okr?wheelId=${wheelId}`)
    } else {
      router.push('/goals-okr')
    }
  }


  const handleDown = () => {
    if (firstGoal) {
      router.push(`/goals-okr/goals/${firstGoal.id}`)
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {/* Up Button */}
      <button
        onClick={handleUp}
        className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors bg-muted text-foreground hover:bg-muted/80 cursor-pointer"
        aria-label="Go up"
        title="Up to Goal-Mode"
      >
        <span className="text-sm font-medium">Up</span>
      </button>

      {/* Down Button */}
      <button
        onClick={handleDown}
        disabled={!firstGoal}
        className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors ${
          firstGoal
            ? 'bg-muted text-foreground hover:bg-muted/80 cursor-pointer'
            : 'bg-muted/30 text-muted-foreground/30 cursor-not-allowed'
        }`}
        aria-label="Go down"
        title={firstGoal ? `Down to ${language === 'nl' ? firstGoal.titleNl : firstGoal.titleEn}` : 'No goals'}
      >
        <span className="text-sm font-medium">Down</span>
      </button>
    </div>
  )
}

// Content navigation helper
async function getContentNavigation(
  entityId: number,
  parentId: number | undefined,
  language: 'nl' | 'en'
) {
  // Try to determine level from entity data
  let parent: NavigationItem | null = null
  let previousSibling: NavigationItem | null = null
  let nextSibling: NavigationItem | null = null
  let children: NavigationItem[] = []

  // Try to fetch as book first
  try {
    const book = await getBook(entityId)
    
    // Get parent (category)
    if (book.categoryId) {
      const books = await getBooksByCategory(book.categoryId)
      const currentIndex = books.findIndex(b => b.id === entityId)
      
      const previousSibling = currentIndex > 0 ? {
        id: books[currentIndex - 1].id,
        route: `/book/${books[currentIndex - 1].id}`,
        title: `Book ${books[currentIndex - 1].id}`,
      } : null
      
      const nextSibling = currentIndex < books.length - 1 && currentIndex >= 0 ? {
        id: books[currentIndex + 1].id,
        route: `/book/${books[currentIndex + 1].id}`,
        title: `Book ${books[currentIndex + 1].id}`,
      } : null
      
      parent = {
        id: book.categoryId,
        route: `/category/number/${book.categoryId}`, // Adjust based on your route structure
        title: `Category ${book.categoryId}`,
      }
    }
    
    // Get children (chapters)
    const chapters = await getChaptersByBook(entityId)
    children = chapters.map(ch => ({
      id: ch.id,
      route: `/chapter/${ch.id}/overview`,
      title: `Chapter ${ch.position || ch.id}`,
    }))
    
    return {
      parent,
      previousSibling,
      nextSibling,
      children,
    }
  } catch {
    // Not a book, try chapter
  }

  // Try to fetch as chapter
  try {
    const chapter = await getChapter(entityId)
    
    // Get parent (book)
    if (chapter.bookId) {
      parent = {
        id: chapter.bookId,
        route: `/book/${chapter.bookId}`,
        title: `Book ${chapter.bookId}`,
      }
      
      // Get siblings (other chapters in same book)
      const chapters = await getChaptersByBook(chapter.bookId)
      const currentIndex = chapters.findIndex(ch => ch.id === entityId)
      
      previousSibling = currentIndex > 0 ? {
        id: chapters[currentIndex - 1].id,
        route: `/chapter/${chapters[currentIndex - 1].id}/overview`,
        title: `Chapter ${chapters[currentIndex - 1].position || chapters[currentIndex - 1].id}`,
      } : null
      
      nextSibling = currentIndex < chapters.length - 1 && currentIndex >= 0 ? {
        id: chapters[currentIndex + 1].id,
        route: `/chapter/${chapters[currentIndex + 1].id}/overview`,
        title: `Chapter ${chapters[currentIndex + 1].position || chapters[currentIndex + 1].id}`,
      } : null
    }
    
    // Get children (sections)
    const sections = await getSectionsByChapter(entityId)
    children = sections.map(sec => ({
      id: sec.id,
      route: `/section/${sec.id}`,
      title: `Section ${sec.orderIndex || sec.id}`,
    }))
    
    return {
      parent,
      previousSibling,
      nextSibling,
      children,
    }
  } catch {
    // Not a chapter, try section
  }

  // Try to fetch as section
  try {
    const section = await getSection(entityId)
    
    // Get parent (chapter)
    if (section.chapterId) {
      parent = {
        id: section.chapterId,
        route: `/chapter/${section.chapterId}/overview`,
        title: `Chapter ${section.chapterId}`,
      }
      
      // Get siblings (other sections in same chapter)
      const sections = await getSectionsByChapter(section.chapterId)
      const currentIndex = sections.findIndex(sec => sec.id === entityId)
      
      previousSibling = currentIndex > 0 ? {
        id: sections[currentIndex - 1].id,
        route: `/section/${sections[currentIndex - 1].id}`,
        title: `Section ${sections[currentIndex - 1].orderIndex || sections[currentIndex - 1].id}`,
      } : null
      
      nextSibling = currentIndex < sections.length - 1 && currentIndex >= 0 ? {
        id: sections[currentIndex + 1].id,
        route: `/section/${sections[currentIndex + 1].id}`,
        title: `Section ${sections[currentIndex + 1].orderIndex || sections[currentIndex + 1].id}`,
      } : null
    }
    
    return {
      parent,
      previousSibling,
      nextSibling,
      children: [], // Sections don't have direct children in this hierarchy
    }
  } catch {
    // Not a section
  }

  return {
    parent: null,
    previousSibling: null,
    nextSibling: null,
    children: [],
  }
}

// Goals OKR navigation helper
async function getGoalsOKRNavigation(
  entityId: number,
  parentId: number | undefined,
  language: 'nl' | 'en',
  entityType?: 'goal' | 'objective' | 'key-result'
) {
  let parent: NavigationItem | null = null
  let previousSibling: NavigationItem | null = null
  let nextSibling: NavigationItem | null = null
  let children: NavigationItem[] = []

  // If we know the entity type, fetch directly. Otherwise, try to determine it.
  if (entityType === 'key-result') {
    // Fetch as key result
    try {
      const keyResult = await getKeyResult(entityId)
      
      // Get parent (objective)
      if (keyResult.objectiveId) {
        try {
          const objective = await getObjective(keyResult.objectiveId)
          parent = {
            id: keyResult.objectiveId,
            route: `/goals-okr/objectives/${keyResult.objectiveId}`,
            title: language === 'nl' ? (objective.titleNl || objective.titleEn) : (objective.titleEn || objective.titleNl),
          }
        } catch {
          // Objective not found, but we can still set parent route
          parent = {
            id: keyResult.objectiveId,
            route: `/goals-okr/objectives/${keyResult.objectiveId}`,
            title: `Objective ${keyResult.objectiveId}`,
          }
        }
        
        // Get siblings (other key results in same objective)
        try {
          const keyResults = await getKeyResultsByObjective(keyResult.objectiveId)
          const currentIndex = keyResults.findIndex(kr => kr.id === entityId)
          
          previousSibling = currentIndex > 0 ? {
            id: keyResults[currentIndex - 1].id,
            route: `/goals-okr/key-results/${keyResults[currentIndex - 1].id}`,
            title: language === 'nl' ? (keyResults[currentIndex - 1].titleNl || keyResults[currentIndex - 1].titleEn) : (keyResults[currentIndex - 1].titleEn || keyResults[currentIndex - 1].titleNl),
          } : null
          
          nextSibling = currentIndex < keyResults.length - 1 && currentIndex >= 0 ? {
            id: keyResults[currentIndex + 1].id,
            route: `/goals-okr/key-results/${keyResults[currentIndex + 1].id}`,
            title: language === 'nl' ? (keyResults[currentIndex + 1].titleNl || keyResults[currentIndex + 1].titleEn) : (keyResults[currentIndex + 1].titleEn || keyResults[currentIndex + 1].titleNl),
          } : null
        } catch {
          // Could not fetch siblings, continue without them
        }
      }
      
      // No children for now (initiatives would go here later)
      children = []
      
      return {
        parent,
        previousSibling,
        nextSibling,
        children,
      }
    } catch {
      // Key result not found, return empty navigation
      return {
        parent: null,
        previousSibling: null,
        nextSibling: null,
        children: [],
      }
    }
  }

  if (entityType === 'objective') {
    // Fetch as objective
    try {
      const objective = await getObjective(entityId)
      
      // Get parent (goal)
      if (objective.goalId) {
        try {
          const goal = await getGoal(objective.goalId)
          parent = {
            id: objective.goalId,
            route: `/goals-okr/goals/${objective.goalId}`,
            title: language === 'nl' ? (goal.titleNl || goal.titleEn) : (goal.titleEn || goal.titleNl),
          }
        } catch {
          // Goal not found, but we can still set parent route
          parent = {
            id: objective.goalId,
            route: `/goals-okr/goals/${objective.goalId}`,
            title: `Goal ${objective.goalId}`,
          }
        }
        
        // Get siblings (other objectives in same goal)
        try {
          const objectives = await getObjectivesByGoal(objective.goalId)
          const currentIndex = objectives.findIndex(obj => obj.id === entityId)
          
          previousSibling = currentIndex > 0 ? {
            id: objectives[currentIndex - 1].id,
            route: `/goals-okr/objectives/${objectives[currentIndex - 1].id}`,
            title: language === 'nl' ? (objectives[currentIndex - 1].titleNl || objectives[currentIndex - 1].titleEn) : (objectives[currentIndex - 1].titleEn || objectives[currentIndex - 1].titleNl),
          } : null
          
          nextSibling = currentIndex < objectives.length - 1 && currentIndex >= 0 ? {
            id: objectives[currentIndex + 1].id,
            route: `/goals-okr/objectives/${objectives[currentIndex + 1].id}`,
            title: language === 'nl' ? (objectives[currentIndex + 1].titleNl || objectives[currentIndex + 1].titleEn) : (objectives[currentIndex + 1].titleEn || objectives[currentIndex + 1].titleNl),
          } : null
        } catch {
          // Could not fetch siblings, continue without them
        }
      }
      
      // Get children (key results)
      try {
        const keyResults = await getKeyResultsByObjective(entityId)
        children = keyResults.map(kr => ({
          id: kr.id,
          route: `/goals-okr/key-results/${kr.id}`,
          title: language === 'nl' ? (kr.titleNl || kr.titleEn) : (kr.titleEn || kr.titleNl),
        }))
      } catch {
        // Could not fetch children, continue without them
      }
      
      return {
        parent,
        previousSibling,
        nextSibling,
        children,
      }
    } catch {
      // Objective not found, return empty navigation
      return {
        parent: null,
        previousSibling: null,
        nextSibling: null,
        children: [],
      }
    }
  }

  if (entityType === 'goal') {
    // Fetch as goal
    try {
      const goal = await getGoal(entityId)
      
      // Get parent (life domain)
      if (goal.lifeDomainId) {
        parent = {
          id: goal.lifeDomainId,
          route: `/goals-okr/life-domains/${goal.lifeDomainId}`,
          title: `Life Domain ${goal.lifeDomainId}`,
        }
        
        // Get siblings (other goals in same life domain)
        try {
          const goals = await getGoalsByLifeDomain(goal.lifeDomainId)
          const currentIndex = goals.findIndex(g => g.id === entityId)
          
          previousSibling = currentIndex > 0 ? {
            id: goals[currentIndex - 1].id,
            route: `/goals-okr/goals/${goals[currentIndex - 1].id}`,
            title: language === 'nl' ? (goals[currentIndex - 1].titleNl || goals[currentIndex - 1].titleEn) : (goals[currentIndex - 1].titleEn || goals[currentIndex - 1].titleNl),
          } : null
          
          nextSibling = currentIndex < goals.length - 1 && currentIndex >= 0 ? {
            id: goals[currentIndex + 1].id,
            route: `/goals-okr/goals/${goals[currentIndex + 1].id}`,
            title: language === 'nl' ? (goals[currentIndex + 1].titleNl || goals[currentIndex + 1].titleEn) : (goals[currentIndex + 1].titleEn || goals[currentIndex + 1].titleNl),
          } : null
        } catch {
          // Could not fetch siblings, continue without them
        }
      }
      
      // Get children (objectives)
      try {
        const objectives = await getObjectivesByGoal(entityId)
        children = objectives.map(obj => ({
          id: obj.id,
          route: `/goals-okr/objectives/${obj.id}`,
          title: language === 'nl' ? (obj.titleNl || obj.titleEn) : (obj.titleEn || obj.titleNl),
        }))
      } catch {
        // Could not fetch children, continue without them
      }
      
      return {
        parent,
        previousSibling,
        nextSibling,
        children,
      }
    } catch {
      // Goal not found, return empty navigation
      return {
        parent: null,
        previousSibling: null,
        nextSibling: null,
        children: [],
      }
    }
  }

  // If entity type is not specified, try to determine it (fallback for backwards compatibility)
  // Try to fetch as key result first (most specific)
  try {
    const keyResult = await getKeyResult(entityId)
    
    // Get parent (objective)
    if (keyResult.objectiveId) {
      try {
        const objective = await getObjective(keyResult.objectiveId)
        parent = {
          id: keyResult.objectiveId,
          route: `/goals-okr/objectives/${keyResult.objectiveId}`,
          title: language === 'nl' ? (objective.titleNl || objective.titleEn) : (objective.titleEn || objective.titleNl),
        }
      } catch {
        // Objective not found, but we can still set parent route
        parent = {
          id: keyResult.objectiveId,
          route: `/goals-okr/objectives/${keyResult.objectiveId}`,
          title: `Objective ${keyResult.objectiveId}`,
        }
      }
      
      // Get siblings (other key results in same objective)
      try {
        const keyResults = await getKeyResultsByObjective(keyResult.objectiveId)
        const currentIndex = keyResults.findIndex(kr => kr.id === entityId)
        
        previousSibling = currentIndex > 0 ? {
          id: keyResults[currentIndex - 1].id,
          route: `/goals-okr/key-results/${keyResults[currentIndex - 1].id}`,
          title: language === 'nl' ? (keyResults[currentIndex - 1].titleNl || keyResults[currentIndex - 1].titleEn) : (keyResults[currentIndex - 1].titleEn || keyResults[currentIndex - 1].titleNl),
        } : null
        
        nextSibling = currentIndex < keyResults.length - 1 && currentIndex >= 0 ? {
          id: keyResults[currentIndex + 1].id,
          route: `/goals-okr/key-results/${keyResults[currentIndex + 1].id}`,
          title: language === 'nl' ? (keyResults[currentIndex + 1].titleNl || keyResults[currentIndex + 1].titleEn) : (keyResults[currentIndex + 1].titleEn || keyResults[currentIndex + 1].titleNl),
        } : null
      } catch {
        // Could not fetch siblings, continue without them
      }
    }
    
    // No children for now (initiatives would go here later)
    children = []
    
    return {
      parent,
      previousSibling,
      nextSibling,
      children,
    }
  } catch {
    // Not a key result, try objective
  }

  // Try to fetch as objective
  try {
    const objective = await getObjective(entityId)
    
    // Get parent (goal)
    if (objective.goalId) {
      try {
        const goal = await getGoal(objective.goalId)
        parent = {
          id: objective.goalId,
          route: `/goals-okr/goals/${objective.goalId}`,
          title: language === 'nl' ? (goal.titleNl || goal.titleEn) : (goal.titleEn || goal.titleNl),
        }
      } catch {
        // Goal not found, but we can still set parent route
        parent = {
          id: objective.goalId,
          route: `/goals-okr/goals/${objective.goalId}`,
          title: `Goal ${objective.goalId}`,
        }
      }
      
      // Get siblings (other objectives in same goal)
      try {
        const objectives = await getObjectivesByGoal(objective.goalId)
        const currentIndex = objectives.findIndex(obj => obj.id === entityId)
        
        previousSibling = currentIndex > 0 ? {
          id: objectives[currentIndex - 1].id,
          route: `/goals-okr/objectives/${objectives[currentIndex - 1].id}`,
          title: language === 'nl' ? (objectives[currentIndex - 1].titleNl || objectives[currentIndex - 1].titleEn) : (objectives[currentIndex - 1].titleEn || objectives[currentIndex - 1].titleNl),
        } : null
        
        nextSibling = currentIndex < objectives.length - 1 && currentIndex >= 0 ? {
          id: objectives[currentIndex + 1].id,
          route: `/goals-okr/objectives/${objectives[currentIndex + 1].id}`,
          title: language === 'nl' ? (objectives[currentIndex + 1].titleNl || objectives[currentIndex + 1].titleEn) : (objectives[currentIndex + 1].titleEn || objectives[currentIndex + 1].titleNl),
        } : null
      } catch {
        // Could not fetch siblings, continue without them
      }
    }
    
    // Get children (key results)
    try {
      const keyResults = await getKeyResultsByObjective(entityId)
      children = keyResults.map(kr => ({
        id: kr.id,
        route: `/goals-okr/key-results/${kr.id}`,
        title: language === 'nl' ? (kr.titleNl || kr.titleEn) : (kr.titleEn || kr.titleNl),
      }))
    } catch {
      // Could not fetch children, continue without them
    }
    
    return {
      parent,
      previousSibling,
      nextSibling,
      children,
    }
  } catch {
    // Not an objective, try goal
  }

  // Try to fetch as goal
  try {
    const goal = await getGoal(entityId)
    
    // Get parent (life domain)
    if (goal.lifeDomainId) {
      parent = {
        id: goal.lifeDomainId,
        route: `/goals-okr/life-domains/${goal.lifeDomainId}`,
        title: `Life Domain ${goal.lifeDomainId}`,
      }
      
      // Get siblings (other goals in same life domain)
      try {
        const goals = await getGoalsByLifeDomain(goal.lifeDomainId)
        const currentIndex = goals.findIndex(g => g.id === entityId)
        
        previousSibling = currentIndex > 0 ? {
          id: goals[currentIndex - 1].id,
          route: `/goals-okr/goals/${goals[currentIndex - 1].id}`,
          title: language === 'nl' ? (goals[currentIndex - 1].titleNl || goals[currentIndex - 1].titleEn) : (goals[currentIndex - 1].titleEn || goals[currentIndex - 1].titleNl),
        } : null
        
        nextSibling = currentIndex < goals.length - 1 && currentIndex >= 0 ? {
          id: goals[currentIndex + 1].id,
          route: `/goals-okr/goals/${goals[currentIndex + 1].id}`,
          title: language === 'nl' ? (goals[currentIndex + 1].titleNl || goals[currentIndex + 1].titleEn) : (goals[currentIndex + 1].titleEn || goals[currentIndex + 1].titleNl),
        } : null
      } catch {
        // Could not fetch siblings, continue without them
      }
    }
    
    // Get children (objectives)
    try {
      const objectives = await getObjectivesByGoal(entityId)
      children = objectives.map(obj => ({
        id: obj.id,
        route: `/goals-okr/objectives/${obj.id}`,
        title: language === 'nl' ? (obj.titleNl || obj.titleEn) : (obj.titleEn || obj.titleNl),
      }))
    } catch {
      // Could not fetch children, continue without them
    }
    
    return {
      parent,
      previousSibling,
      nextSibling,
      children,
    }
  } catch {
    // Not a goal
  }

  return {
    parent: null,
    previousSibling: null,
    nextSibling: null,
    children: [],
  }
}
