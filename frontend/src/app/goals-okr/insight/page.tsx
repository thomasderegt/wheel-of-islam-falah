'use client'

/**
 * Kanban Dashboard Page
 * Shows statistics about kanban items
 */

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useAuth } from '@/features/auth'
import { useKanbanItems } from '@/features/goals-okr/hooks/useKanbanItems'
import { Loading } from '@/shared/components/ui/Loading'
import { useModeContext } from '@/shared/hooks/useModeContext'
import { useWheels } from '@/features/goals-okr/hooks/useWheels'
import { useLifeDomains } from '@/features/goals-okr/hooks/useLifeDomains'
import { goalsOkrContextToWheelKey, getWheelIdFromGoalsOkrContext } from '@/shared/utils/contextUtils'
import { useMemo, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart'
import { Pie, PieChart, Cell } from 'recharts'
import { getGoal, getObjective, getKeyResult, getInitiative, getUserObjectiveInstance, getUserKeyResultInstance, getUserInitiativeInstance, getUserGoalInstance, getAllLifeDomains, getAllWheels, getInitiativesByKeyResult } from '@/features/goals-okr/api/goalsOkrApi'

export default function KanbanDashboardPage() {
  const { user } = useAuth()
  const { goalsOkrContext } = useModeContext()
  const { data: kanbanItems, isLoading } = useKanbanItems(user?.id || null)
  const { data: wheels } = useWheels()
  const { data: lifeDomains } = useLifeDomains()
  const language = 'en' as 'nl' | 'en'
  const router = useRouter()
  
  // Redirect if Goals-OKR context is NONE
  useEffect(() => {
    if (goalsOkrContext === 'NONE') {
      router.push('/home')
    }
  }, [goalsOkrContext, router])

  // Get target wheelKey from goalsOkrContext
  const targetWheelKey = useMemo(() => {
    if (goalsOkrContext === 'NONE' || goalsOkrContext === 'ALL') return null
    return goalsOkrContextToWheelKey(goalsOkrContext)
  }, [goalsOkrContext])

  // Filter kanbanItems by Goals-OKR context
  const filteredKanbanItems = useMemo(() => {
    if (!kanbanItems || goalsOkrContext === 'NONE') {
      return []
    }
    
    if (!wheels || !lifeDomains) {
      return kanbanItems
    }
    
    const targetWheelKey = goalsOkrContextToWheelKey(goalsOkrContext)
    if (!targetWheelKey) {
      return kanbanItems
    }
    
    const targetWheelId = getWheelIdFromGoalsOkrContext(goalsOkrContext, wheels)
    if (!targetWheelId) {
      return kanbanItems
    }
    
    // Create mapping from life domain ID to wheel ID
    const domainToWheelMap = new Map<number, number>()
    lifeDomains.forEach(domain => {
      if (domain.wheelId) {
        domainToWheelMap.set(domain.id, domain.wheelId)
      }
    })
    
    // We can't filter here directly because we need to load goal data to get lifeDomainId
    // So we'll filter in the useEffect hooks that process the items
    return kanbanItems
  }, [kanbanItems, goalsOkrContext, wheels, lifeDomains])
  const [piStats, setPiStats] = useState<Map<string, Array<{
    kanbanItemId: number
    userInstanceId: number
    templateId: number
    itemTitle: string
    itemNumber?: string | null
    columnName: string
    wheelKey: string
    wheelName: string
    lifeDomainName: string
    itemType: 'GOAL' | 'OBJECTIVE' | 'KEY_RESULT' | 'INITIATIVE'
  }>>>(new Map())
  const [isLoadingPI, setIsLoadingPI] = useState(false)
  const [goalStatsByWheel, setGoalStatsByWheel] = useState<Map<string, {
    todo: number
    inProgress: number
    inReview: number
    done: number
    wheelName: string
  }>>(new Map())
  const [isLoadingGoalStats, setIsLoadingGoalStats] = useState(false)
  const [quarterlyGoalsByDomain, setQuarterlyGoalsByDomain] = useState<Map<string, Map<number, {
    domainName: string
    count: number
  }>>>(new Map())
  const [quarterlyObjectivesByDomain, setQuarterlyObjectivesByDomain] = useState<Map<string, Map<number, {
    domainName: string
    count: number
  }>>>(new Map())
  const [quarterlyKeyResultsByDomain, setQuarterlyKeyResultsByDomain] = useState<Map<string, Map<number, {
    domainName: string
    count: number
  }>>>(new Map())
  const [lifeDomainsByWheel, setLifeDomainsByWheel] = useState<Map<string, Array<{
    id: number
    nameNl: string
    nameEn: string
  }>>>(new Map())
  const [isLoadingQuarterlyGoals, setIsLoadingQuarterlyGoals] = useState(false)
  const [isLoadingQuarterlyObjectives, setIsLoadingQuarterlyObjectives] = useState(false)
  const [isLoadingQuarterlyKeyResults, setIsLoadingQuarterlyKeyResults] = useState(false)
  const languageRef = useRef<'nl' | 'en'>('en')

  // Update language ref when language changes (though it's constant for now)
  languageRef.current = language

  const stats = useMemo(() => {
    if (!filteredKanbanItems || filteredKanbanItems.length === 0) {
      return {
        todo: { total: 0, goals: 0, objectives: 0, keyResults: 0, initiatives: 0 },
        inProgress: { total: 0, goals: 0, objectives: 0, keyResults: 0, initiatives: 0 },
        inReview: { total: 0, goals: 0, objectives: 0, keyResults: 0, initiatives: 0 },
        done: { total: 0, goals: 0, objectives: 0, keyResults: 0, initiatives: 0 },
        started: { total: 0, goals: 0, objectives: 0, keyResults: 0, initiatives: 0 },
      }
    }

    const countByType = (items: typeof filteredKanbanItems, columnName: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE') => {
      if (!items || !Array.isArray(items)) {
        return {
          total: 0,
          goals: 0,
          objectives: 0,
          keyResults: 0,
          initiatives: 0,
        }
      }
      const filtered = items.filter(item => item.columnName === columnName)
      return {
        total: filtered.length,
        goals: filtered.filter(item => item.itemType === 'GOAL').length,
        objectives: filtered.filter(item => item.itemType === 'OBJECTIVE').length,
        keyResults: filtered.filter(item => item.itemType === 'KEY_RESULT').length,
        initiatives: filtered.filter(item => item.itemType === 'INITIATIVE').length,
      }
    }

    const todo = countByType(filteredKanbanItems, 'TODO')
    const inProgress = countByType(filteredKanbanItems, 'IN_PROGRESS')
    const inReview = countByType(filteredKanbanItems, 'IN_REVIEW')
    const done = countByType(filteredKanbanItems, 'DONE')
    const started = {
      total: inProgress.total + inReview.total + done.total,
      goals: inProgress.goals + inReview.goals + done.goals,
      objectives: inProgress.objectives + inReview.objectives + done.objectives,
      keyResults: inProgress.keyResults + inReview.keyResults + done.keyResults,
      initiatives: inProgress.initiatives + inReview.initiatives + done.initiatives,
    }

    return {
      todo,
      inProgress,
      inReview,
      done,
      started,
    }
  }, [filteredKanbanItems])

  // Load Goal statistics by wheel type
  useEffect(() => {
    if (!filteredKanbanItems || filteredKanbanItems.length === 0 || !user?.id) {
      setGoalStatsByWheel(new Map())
      return
    }
    
    // Filter by Goals-OKR context if not NONE or ALL
    const targetWheelKey = (goalsOkrContext !== 'NONE' && goalsOkrContext !== 'ALL') ? goalsOkrContextToWheelKey(goalsOkrContext) : null

    setIsLoadingGoalStats(true)
    const loadGoalStatsByWheel = async () => {
      const wheelStatsMap = new Map<string, {
        todo: number
        inProgress: number
        inReview: number
        done: number
        wheelName: string
      }>()

      // Load wheels and life domains for mapping
      const [wheels, lifeDomains] = await Promise.all([
        getAllWheels(),
        getAllLifeDomains()
      ])
      
      // Create wheel map
      const wheelMap = new Map<number, { wheelKey: string; nameNl: string; nameEn: string }>()
      wheels.forEach(wheel => {
        wheelMap.set(wheel.id, { wheelKey: wheel.wheelKey, nameNl: wheel.nameNl, nameEn: wheel.nameEn })
      })
      
      // Create life domain to wheel mapping
      const domainToWheelMap = new Map<number, number>()
      lifeDomains.forEach(domain => {
        if (domain.wheelId) {
          domainToWheelMap.set(domain.id, domain.wheelId)
        }
      })

      // Process only GOAL kanban items
      for (const item of filteredKanbanItems) {
        if (item.itemType !== 'GOAL') continue

        try {
          const userGoalInstance = await getUserGoalInstance(item.itemId)
          const goal = await getGoal(userGoalInstance.goalId)
          
          // Get wheel info via life domain
          const wheelId = domainToWheelMap.get(goal.lifeDomainId)
          const wheel = wheelId ? wheelMap.get(wheelId) : null
          const wheelKey = wheel?.wheelKey || 'UNKNOWN'
          
          // Filter by context if specified
          if (targetWheelKey && wheelKey !== targetWheelKey) {
            continue
          }
          
          const currentLanguage = languageRef.current
          const wheelName = wheel 
            ? (currentLanguage === 'nl' ? wheel.nameNl : wheel.nameEn)
            : 'Unknown'
          
          // Initialize wheel stats if not exists
          if (!wheelStatsMap.has(wheelKey)) {
            wheelStatsMap.set(wheelKey, {
              todo: 0,
              inProgress: 0,
              inReview: 0,
              done: 0,
              wheelName: wheelName,
            })
          }

          const wheelStats = wheelStatsMap.get(wheelKey)!
          
          // Count by column
          if (item.columnName === 'TODO') {
            wheelStats.todo++
          } else if (item.columnName === 'IN_PROGRESS') {
            wheelStats.inProgress++
          } else if (item.columnName === 'IN_REVIEW') {
            wheelStats.inReview++
          } else if (item.columnName === 'DONE') {
            wheelStats.done++
          }
        } catch (error) {
          console.error(`Error loading goal stats for kanban item ${item.id}:`, error)
        }
      }

      setGoalStatsByWheel(wheelStatsMap)
      setIsLoadingGoalStats(false)
      console.log('Goal stats by wheel loaded:', Array.from(wheelStatsMap.entries()))
    }

    loadGoalStatsByWheel().catch(error => {
      console.error('Error loading goal stats by wheel:', error)
      setIsLoadingGoalStats(false)
    })
  }, [filteredKanbanItems, user?.id, goalsOkrContext])

  // Load Quarterly Goals by Domain for both Wheel of Life and Wheel of Business
  useEffect(() => {
    setIsLoadingQuarterlyGoals(true)
    setIsLoadingQuarterlyObjectives(true)
    setIsLoadingQuarterlyKeyResults(true)
    const loadQuarterlyGoalsByDomain = async () => {
      const wheelStatsMap = new Map<string, Map<number, {
        domainName: string
        count: number
      }>>()

      // Load wheels and life domains for mapping
      const [wheels, lifeDomains] = await Promise.all([
        getAllWheels(),
        getAllLifeDomains()
      ])
      
      // Find wheel IDs
      const wheelOfLife = wheels.find(w => w.wheelKey === 'WHEEL_OF_LIFE')
      const wheelOfBusiness = wheels.find(w => w.wheelKey === 'WHEEL_OF_BUSINESS')
      
      if (!wheelOfLife && !wheelOfBusiness) {
        setIsLoadingQuarterlyGoals(false)
        return
      }

      // Create life domain to wheel mapping
      const domainToWheelMap = new Map<number, number>()
      lifeDomains.forEach(domain => {
        if (domain.wheelId) {
          domainToWheelMap.set(domain.id, domain.wheelId)
        }
      })

      // Create life domain name mapping
      const domainNameMap = new Map<number, { nameNl: string; nameEn: string }>()
      lifeDomains.forEach(domain => {
        domainNameMap.set(domain.id, { nameNl: domain.titleNl, nameEn: domain.titleEn })
      })

      // Create map of all life domains per wheel (for showing domains with 0 goals)
      const allDomainsByWheel = new Map<string, Array<{ id: number; nameNl: string; nameEn: string }>>()
      if (wheelOfLife) {
        const lifeDomainsForLife = lifeDomains
          .filter(domain => domain.wheelId === wheelOfLife.id)
          .map(domain => ({ id: domain.id, nameNl: domain.titleNl, nameEn: domain.titleEn }))
        allDomainsByWheel.set('WHEEL_OF_LIFE', lifeDomainsForLife)
      }
      if (wheelOfBusiness) {
        const lifeDomainsForBusiness = lifeDomains
          .filter(domain => domain.wheelId === wheelOfBusiness.id)
          .map(domain => ({ id: domain.id, nameNl: domain.titleNl, nameEn: domain.titleEn }))
        allDomainsByWheel.set('WHEEL_OF_BUSINESS', lifeDomainsForBusiness)
      }
      setLifeDomainsByWheel(allDomainsByWheel)

      // If no kanban items, just set empty stats and return
      if (!filteredKanbanItems || filteredKanbanItems.length === 0 || !user?.id) {
        setQuarterlyGoalsByDomain(new Map())
        setQuarterlyObjectivesByDomain(new Map())
        setQuarterlyKeyResultsByDomain(new Map())
        setIsLoadingQuarterlyGoals(false)
        setIsLoadingQuarterlyObjectives(false)
        setIsLoadingQuarterlyKeyResults(false)
        return
      }
      
      // Filter by Goals-OKR context if not NONE
      const targetWheelKey = goalsOkrContext !== 'NONE' ? goalsOkrContextToWheelKey(goalsOkrContext) : null

      // Process GOAL, OBJECTIVE, and KEY_RESULT kanban items that have quarter and year
      const objectivesStatsMap = new Map<string, Map<number, {
        domainName: string
        count: number
      }>>()
      const keyResultsStatsMap = new Map<string, Map<number, {
        domainName: string
        count: number
      }>>()

      for (const item of filteredKanbanItems) {
        if (item.itemType !== 'GOAL' && item.itemType !== 'OBJECTIVE' && item.itemType !== 'KEY_RESULT') continue

        try {
          let goal: any = null
          let lifeDomainId: number | null = null
          
          if (item.itemType === 'GOAL') {
            const userGoalInstance = await getUserGoalInstance(item.itemId)
            goal = await getGoal(userGoalInstance.goalId)
            lifeDomainId = goal.lifeDomainId
          } else if (item.itemType === 'OBJECTIVE') {
            const userObjectiveInstance = await getUserObjectiveInstance(item.itemId)
            const objective = await getObjective(userObjectiveInstance.objectiveId)
            goal = await getGoal(objective.goalId)
            lifeDomainId = goal.lifeDomainId
          } else if (item.itemType === 'KEY_RESULT') {
            const userKeyResultInstance = await getUserKeyResultInstance(item.itemId)
            const keyResult = await getKeyResult(userKeyResultInstance.keyResultId)
            const objective = await getObjective(keyResult.objectiveId)
            goal = await getGoal(objective.goalId)
            lifeDomainId = goal.lifeDomainId
          }
          
          if (!goal || !lifeDomainId) continue
          
          // Check if goal has quarter and year (is quarterly)
          if (!goal.quarter || !goal.year) continue
          
          // Get wheel ID for this goal's domain
          const wheelId = domainToWheelMap.get(lifeDomainId)
          if (!wheelId) continue
          
          // Determine which wheel this belongs to
          let wheelKey: string | null = null
          if (wheelId === wheelOfLife?.id) {
            wheelKey = 'WHEEL_OF_LIFE'
          } else if (wheelId === wheelOfBusiness?.id) {
            wheelKey = 'WHEEL_OF_BUSINESS'
          }
          
          if (!wheelKey) continue
          
          // Filter by context if specified
          if (targetWheelKey && wheelKey !== targetWheelKey) {
            continue
          }
          
          // Get domain name
          const domainInfo = domainNameMap.get(lifeDomainId)
          if (!domainInfo) continue
          
          const currentLanguage = languageRef.current
          const domainName = currentLanguage === 'nl' ? domainInfo.nameNl : domainInfo.nameEn
          
          // Process based on item type
          if (item.itemType === 'GOAL') {
            // Initialize wheel map if not exists
            if (!wheelStatsMap.has(wheelKey)) {
              wheelStatsMap.set(wheelKey, new Map())
            }
            
            const domainStatsMap = wheelStatsMap.get(wheelKey)!
            
            // Initialize or increment count for this domain
            if (!domainStatsMap.has(lifeDomainId)) {
              domainStatsMap.set(lifeDomainId, {
                domainName: domainName,
                count: 0
              })
            }
            
            const domainStats = domainStatsMap.get(lifeDomainId)!
            domainStats.count++
          } else if (item.itemType === 'OBJECTIVE') {
            // Initialize wheel map if not exists
            if (!objectivesStatsMap.has(wheelKey)) {
              objectivesStatsMap.set(wheelKey, new Map())
            }
            
            const domainStatsMap = objectivesStatsMap.get(wheelKey)!
            
            // Initialize or increment count for this domain
            if (!domainStatsMap.has(lifeDomainId)) {
              domainStatsMap.set(lifeDomainId, {
                domainName: domainName,
                count: 0
              })
            }
            
            const domainStats = domainStatsMap.get(lifeDomainId)!
            domainStats.count++
          } else if (item.itemType === 'KEY_RESULT') {
            // Initialize wheel map if not exists
            if (!keyResultsStatsMap.has(wheelKey)) {
              keyResultsStatsMap.set(wheelKey, new Map())
            }
            
            const domainStatsMap = keyResultsStatsMap.get(wheelKey)!
            
            // Initialize or increment count for this domain
            if (!domainStatsMap.has(lifeDomainId)) {
              domainStatsMap.set(lifeDomainId, {
                domainName: domainName,
                count: 0
              })
            }
            
            const domainStats = domainStatsMap.get(lifeDomainId)!
            domainStats.count++
          }
        } catch (error) {
          console.error(`Error loading quarterly item for kanban item ${item.id}:`, error)
        }
      }

      setQuarterlyGoalsByDomain(wheelStatsMap)
      setQuarterlyObjectivesByDomain(objectivesStatsMap)
      setQuarterlyKeyResultsByDomain(keyResultsStatsMap)
      setLifeDomainsByWheel(allDomainsByWheel)
      setIsLoadingQuarterlyGoals(false)
      setIsLoadingQuarterlyObjectives(false)
      setIsLoadingQuarterlyKeyResults(false)
      
      console.log('Quarterly Goals by Domain:', Array.from(wheelStatsMap.entries()))
      console.log('Quarterly Objectives by Domain:', Array.from(objectivesStatsMap.entries()))
      console.log('Quarterly Key-Results by Domain:', Array.from(keyResultsStatsMap.entries()))
    }

    loadQuarterlyGoalsByDomain().catch(error => {
      console.error('Error loading quarterly goals by domain:', error)
      setIsLoadingQuarterlyGoals(false)
    })
  }, [filteredKanbanItems, user?.id, goalsOkrContext])

  // Load PI statistics
  useEffect(() => {
    if (!filteredKanbanItems || filteredKanbanItems.length === 0 || !user?.id) {
      setPiStats(new Map())
      return
    }
    
    // Filter by Goals-OKR context if not NONE or ALL
    const targetWheelKey = (goalsOkrContext !== 'NONE' && goalsOkrContext !== 'ALL') ? goalsOkrContextToWheelKey(goalsOkrContext) : null

    setIsLoadingPI(true)
    const loadPIStats = async () => {
      const piMap = new Map<string, Array<{
        kanbanItemId: number
        userGoalInstanceId: number
        goalId: number
        goalTitle: string
        goalNumber?: string | null
        columnName: string
        wheelKey: string
        wheelName: string
      }>>()

      // Load wheels and life domains for mapping
      const [wheels, lifeDomains] = await Promise.all([
        getAllWheels(),
        getAllLifeDomains()
      ])
      
      // Create wheel map
      const wheelMap = new Map<number, { wheelKey: string; nameNl: string; nameEn: string }>()
      wheels.forEach(wheel => {
        wheelMap.set(wheel.id, { wheelKey: wheel.wheelKey, nameNl: wheel.nameNl, nameEn: wheel.nameEn })
      })
      
      // Create life domain to wheel mapping
      const domainToWheelMap = new Map<number, number>()
      lifeDomains.forEach(domain => {
        if (domain.wheelId) {
          domainToWheelMap.set(domain.id, domain.wheelId)
        }
      })
      
      // Create life domain name mapping
      const domainNameMap = new Map<number, { nameNl: string; nameEn: string }>()
      lifeDomains.forEach(domain => {
        domainNameMap.set(domain.id, { nameNl: domain.titleNl, nameEn: domain.titleEn })
      })

      // Helper to get PI label from quarter and year
      const getPILabel = (quarter: number | null | undefined, year: number | null | undefined): string | null => {
        if (!quarter || !year) return null
        return `Q${quarter} ${year}`
      }

      // Helper to get Goal's quarter/year for different item types
      // Note: For kanban items, itemId refers to UserInstances, not templates
      const getGoalPI = async (itemType: string, itemId: number): Promise<{ quarter: number | null; year: number | null }> => {
        try {
          if (itemType === 'GOAL') {
            // For GOAL items, itemId is a UserGoalInstanceId
            const userGoalInstance = await getUserGoalInstance(itemId)
            const goal = await getGoal(userGoalInstance.goalId)
            return { quarter: goal.quarter ?? null, year: goal.year ?? null }
          } else if (itemType === 'OBJECTIVE') {
            // For OBJECTIVE items, itemId is a UserObjectiveInstanceId
            const userObjectiveInstance = await getUserObjectiveInstance(itemId)
            const objective = await getObjective(userObjectiveInstance.objectiveId)
            const goal = await getGoal(objective.goalId)
            return { quarter: goal.quarter ?? null, year: goal.year ?? null }
          } else if (itemType === 'KEY_RESULT') {
            // For KEY_RESULT items, itemId is a UserKeyResultInstanceId
            const userKeyResultInstance = await getUserKeyResultInstance(itemId)
            const keyResult = await getKeyResult(userKeyResultInstance.keyResultId)
            const objective = await getObjective(keyResult.objectiveId)
            const goal = await getGoal(objective.goalId)
            return { quarter: goal.quarter ?? null, year: goal.year ?? null }
          } else if (itemType === 'INITIATIVE') {
            // For INITIATIVE items, itemId is a UserInitiativeInstanceId
            const userInitiative = await getUserInitiativeInstance(itemId)
            const userKeyResultInstance = await getUserKeyResultInstance(userInitiative.userKeyResultInstanceId)
            const keyResult = await getKeyResult(userKeyResultInstance.keyResultId)
            const objective = await getObjective(keyResult.objectiveId)
            const goal = await getGoal(objective.goalId)
            return { quarter: goal.quarter ?? null, year: goal.year ?? null }
          }
        } catch (error) {
          console.error(`Error loading PI for ${itemType} ${itemId}:`, error)
        }
        return { quarter: null, year: null }
      }

      // Process all kanban items (filtering happens in UI based on selectedItemTypeByWheel)
      for (const item of filteredKanbanItems) {
        // Process all item types - we'll filter by wheel and item type in the UI

        const { quarter, year } = await getGoalPI(item.itemType, item.itemId)
        const piLabel = getPILabel(quarter, year)
        
        if (!piLabel) continue // Skip items without PI
        
        // Get wheel info early to filter by context
        let itemWheelKey: string | null = null
        try {
          let lifeDomainId: number | null = null
          
          if (item.itemType === 'GOAL') {
            const userGoalInstance = await getUserGoalInstance(item.itemId)
            const goal = await getGoal(userGoalInstance.goalId)
            lifeDomainId = goal.lifeDomainId
          } else if (item.itemType === 'OBJECTIVE') {
            const userObjectiveInstance = await getUserObjectiveInstance(item.itemId)
            const objective = await getObjective(userObjectiveInstance.objectiveId)
            const goal = await getGoal(objective.goalId)
            lifeDomainId = goal.lifeDomainId
          } else if (item.itemType === 'KEY_RESULT') {
            const userKeyResultInstance = await getUserKeyResultInstance(item.itemId)
            const keyResult = await getKeyResult(userKeyResultInstance.keyResultId)
            const objective = await getObjective(keyResult.objectiveId)
            const goal = await getGoal(objective.goalId)
            lifeDomainId = goal.lifeDomainId
          } else if (item.itemType === 'INITIATIVE') {
            const userInitiativeInstance = await getUserInitiativeInstance(item.itemId)
            try {
              const userInitiative = await getInitiative(userInitiativeInstance.initiativeId)
              const userKeyResultInstance = await getUserKeyResultInstance(userInitiativeInstance.userKeyResultInstanceId)
              const keyResult = await getKeyResult(userKeyResultInstance.keyResultId)
              const objective = await getObjective(keyResult.objectiveId)
              const goal = await getGoal(objective.goalId)
              lifeDomainId = goal.lifeDomainId
            } catch {
              const userKeyResultInstance = await getUserKeyResultInstance(userInitiativeInstance.userKeyResultInstanceId)
              const keyResult = await getKeyResult(userKeyResultInstance.keyResultId)
              const objective = await getObjective(keyResult.objectiveId)
              const goal = await getGoal(objective.goalId)
              lifeDomainId = goal.lifeDomainId
            }
          }
          
          if (lifeDomainId) {
            const wheelId = domainToWheelMap.get(lifeDomainId)
            const wheel = wheelId ? wheelMap.get(wheelId) : null
            itemWheelKey = wheel?.wheelKey || null
          }
        } catch (error) {
          // Continue processing even if we can't get wheel info
        }
        
        // Filter by context if specified
        if (targetWheelKey && itemWheelKey !== targetWheelKey) {
          continue
        }

        if (!piMap.has(piLabel)) {
          piMap.set(piLabel, [])
        }

        // Get item details based on type
        try {
          const currentLanguage = languageRef.current
          let templateId: number
          let itemTitle: string
          let itemNumber: string | null = null
          let lifeDomainId: number
          
          if (item.itemType === 'GOAL') {
            const userGoalInstance = await getUserGoalInstance(item.itemId)
            const goal = await getGoal(userGoalInstance.goalId)
            templateId = goal.id
            itemTitle = currentLanguage === 'nl' ? (goal.titleNl || goal.titleEn) : (goal.titleEn || goal.titleNl)
            itemNumber = goal.number
            lifeDomainId = goal.lifeDomainId
          } else if (item.itemType === 'OBJECTIVE') {
            const userObjectiveInstance = await getUserObjectiveInstance(item.itemId)
            const objective = await getObjective(userObjectiveInstance.objectiveId)
            templateId = objective.id
            itemTitle = currentLanguage === 'nl' ? (objective.titleNl || objective.titleEn) : (objective.titleEn || objective.titleNl)
            itemNumber = objective.number
            const goal = await getGoal(objective.goalId)
            lifeDomainId = goal.lifeDomainId
          } else if (item.itemType === 'KEY_RESULT') {
            const userKeyResultInstance = await getUserKeyResultInstance(item.itemId)
            const keyResult = await getKeyResult(userKeyResultInstance.keyResultId)
            templateId = keyResult.id
            itemTitle = currentLanguage === 'nl' ? (keyResult.titleNl || keyResult.titleEn) : (keyResult.titleEn || keyResult.titleNl)
            itemNumber = keyResult.number
            const objective = await getObjective(keyResult.objectiveId)
            const goal = await getGoal(objective.goalId)
            lifeDomainId = goal.lifeDomainId
          } else if (item.itemType === 'INITIATIVE') {
            const userInitiativeInstance = await getUserInitiativeInstance(item.itemId)
            try {
              const userInitiative = await getInitiative(userInitiativeInstance.initiativeId)
              templateId = userInitiative.id
              itemTitle = userInitiative.title
              const userKeyResultInstance = await getUserKeyResultInstance(userInitiativeInstance.userKeyResultInstanceId)
              const keyResult = await getKeyResult(userKeyResultInstance.keyResultId)
              const objective = await getObjective(keyResult.objectiveId)
              const goal = await getGoal(objective.goalId)
              lifeDomainId = goal.lifeDomainId
            } catch {
              // Try template initiative
              const userKeyResultInstance = await getUserKeyResultInstance(userInitiativeInstance.userKeyResultInstanceId)
              const keyResult = await getKeyResult(userKeyResultInstance.keyResultId)
              const templateInitiatives = await getInitiativesByKeyResult(keyResult.id)
              const templateInitiative = templateInitiatives.find(i => i.id === userInitiativeInstance.initiativeId)
              if (templateInitiative) {
                templateId = templateInitiative.id
                itemTitle = currentLanguage === 'nl' 
                  ? (templateInitiative.titleNl || templateInitiative.titleEn)
                  : (templateInitiative.titleEn || templateInitiative.titleNl)
                const objective = await getObjective(keyResult.objectiveId)
                const goal = await getGoal(objective.goalId)
                lifeDomainId = goal.lifeDomainId
              } else {
                continue
              }
            }
          } else {
            continue
          }
          
          // Get wheel info via life domain
          const wheelId = domainToWheelMap.get(lifeDomainId)
          const wheel = wheelId ? wheelMap.get(wheelId) : null
          const wheelName = wheel 
            ? (currentLanguage === 'nl' ? wheel.nameNl : wheel.nameEn)
            : 'Unknown'
          const wheelKey = wheel?.wheelKey || 'UNKNOWN'
          
          // Get life domain name
          const domainInfo = domainNameMap.get(lifeDomainId)
          const lifeDomainName = domainInfo
            ? (currentLanguage === 'nl' ? domainInfo.nameNl : domainInfo.nameEn)
            : 'Unknown'
          
          const itemInstance = {
            kanbanItemId: item.id,
            userInstanceId: item.itemId,
            templateId: templateId,
            itemTitle: itemTitle,
            itemNumber: itemNumber,
            columnName: item.columnName,
            wheelKey: wheelKey,
            wheelName: wheelName,
            lifeDomainName: lifeDomainName,
            itemType: item.itemType as 'GOAL' | 'OBJECTIVE' | 'KEY_RESULT' | 'INITIATIVE',
          }

          piMap.get(piLabel)!.push(itemInstance)
        } catch (error) {
          console.error(`Error loading ${item.itemType} instance for kanban item ${item.id}:`, error)
        }
      }

      setPiStats(piMap)
      setIsLoadingPI(false)
    }

    loadPIStats().catch(error => {
      console.error('Error loading PI stats:', error)
      setIsLoadingPI(false)
    })
  }, [filteredKanbanItems, user?.id, goalsOkrContext])

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8 pb-24">
            <Container className="max-w-6xl mx-auto">
              <Loading />
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  // Don't render if Goals-OKR context is NONE
  if (goalsOkrContext === 'NONE') {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar variant="landing" />
        <main className="flex-1 flex flex-col p-8 pb-24">
          <Container className="max-w-6xl mx-auto">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Insight</h1>
              
              {/* Helper function to render pie chart card */}
              {(() => {
                const renderPieChartCard = (
                  title: string,
                  domainStatsMap: Map<number, { domainName: string; count: number }>,
                  allDomainsForWheel: Array<{ id: number; nameNl: string; nameEn: string }>,
                  isLoading: boolean,
                  wheelKey: string
                ) => {
                  if (isLoading) {
                    return (
                      <Card key={wheelKey}>
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-center py-8">
                            <Loading className="h-6 w-6" />
                          </div>
                        </CardContent>
                      </Card>
                    )
                  }

                  if (allDomainsForWheel.length === 0) {
                    return (
                      <Card key={wheelKey}>
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-muted-foreground">
                            {language === 'nl' ? 'Geen life domains gevonden' : 'No life domains found'}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  }

                  const currentLanguage = languageRef.current
                  const colors = [
                    "oklch(0.646 0.222 41.116)",   // Orange
                    "oklch(0.6 0.118 184.704)",    // Blue
                    "oklch(0.398 0.07 227.392)",   // Purple
                    "oklch(0.828 0.189 84.429)",   // Yellow
                    "oklch(0.5 0.15 280)",         // Magenta
                    "oklch(0.7 0.2 120)",          // Green
                    "oklch(0.55 0.18 200)",        // Cyan
                    "oklch(0.65 0.16 320)",        // Pink
                    "oklch(0.58 0.18 15)",         // Red
                    "oklch(0.72 0.16 160)",        // Teal
                    "oklch(0.62 0.14 250)",        // Indigo
                    "oklch(0.75 0.17 60)",         // Lime
                    "oklch(0.48 0.12 300)",        // Violet
                    "oklch(0.68 0.15 180)",        // Aqua
                    "oklch(0.52 0.16 20)",         // Coral
                    "oklch(0.64 0.13 140)",        // Mint
                  ]
                  
                  const pieData = allDomainsForWheel.map((domain, index) => {
                    const stats = domainStatsMap.get(domain.id)
                    const count = stats?.count || 0
                    const domainName = currentLanguage === 'nl' ? domain.nameNl : domain.nameEn
                    
                    return {
                      name: domainName,
                      value: count,
                      fill: colors[index % colors.length],
                      domainId: domain.id
                    }
                  })
                  
                  const total = pieData.reduce((sum, item) => sum + item.value, 0)
                  
                  const pieDataWithPercentage = pieData.map(item => ({
                    ...item,
                    percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'
                  }))

                  const filteredData = pieDataWithPercentage.filter(item => item.value > 0)

                  // Split title to make "Pie Chart" or "List" italic
                  const titleParts = title.split(' Pie Chart')
                  const isPieChart = titleParts.length > 1
                  const titlePartsList = title.split(' List')
                  const isList = titlePartsList.length > 1
                  
                  return (
                    <Card key={wheelKey}>
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                          {isPieChart ? (
                            <>
                              {titleParts[0]} <span className="italic">Pie Chart</span>
                            </>
                          ) : isList ? (
                            <>
                              {titlePartsList[0]} <span className="italic">List</span>
                            </>
                          ) : (
                            title
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                              {language === 'nl' ? 'Totaal' : 'Total'}: {total} {title.toLowerCase().includes('goal') ? (language === 'nl' ? 'quarterly goals' : 'quarterly goals') : title.toLowerCase().includes('objective') ? (language === 'nl' ? 'quarterly objectives' : 'quarterly objectives') : (language === 'nl' ? 'quarterly key results' : 'quarterly key results')}
                            </p>
                          </div>
                          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                            <div className="flex-shrink-0">
                              {filteredData.length === 0 ? (
                                <div className="flex items-center justify-center w-[200px] h-[200px] text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                                  {language === 'nl' ? 'Geen data' : 'No data'}
                                </div>
                              ) : (
                                <ChartContainer
                                  config={Object.fromEntries(
                                    filteredData.map(item => [
                                      item.name,
                                      {
                                        label: item.name,
                                        color: item.fill,
                                      }
                                    ])
                                  )}
                                  className="mx-auto aspect-square w-[200px] h-[200px]"
                                >
                                  <PieChart>
                                    <ChartTooltip
                                      cursor={false}
                                      content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Pie
                                      data={filteredData}
                                      dataKey="value"
                                      nameKey="name"
                                      outerRadius={90}
                                      strokeWidth={5}
                                    >
                                      {filteredData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                      ))}
                                    </Pie>
                                  </PieChart>
                                </ChartContainer>
                              )}
                            </div>
                            {pieDataWithPercentage.length > 0 && (
                              <div className="space-y-2 text-sm">
                                {pieDataWithPercentage
                                  .sort((a, b) => b.value - a.value)
                                  .map((entry) => (
                                    <div key={entry.domainId} className="flex items-center gap-2">
                                      <div 
                                        className={`h-3 w-3 rounded-full ${entry.value === 0 ? 'opacity-30' : ''}`} 
                                        style={{ backgroundColor: entry.fill }} 
                                      />
                                      <span className={`text-muted-foreground ${entry.value === 0 ? 'opacity-50' : ''}`}>
                                        {entry.name}: {entry.value} ({entry.percentage}%)
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                }

                // Only show wheel for current Goals-OKR context
                const wheelOrder = targetWheelKey ? [targetWheelKey] : []
                const wheelNames: Record<string, string> = {
                  'WHEEL_OF_LIFE': 'Wheel of Life',
                  'WHEEL_OF_BUSINESS': 'Wheel of Business',
                  'WHEEL_OF_WORK': 'Wheel of Work'
                }

                // Helper to get domain stats map and loading state for each item type
                const getDomainStatsForType = (itemType: string) => {
                  switch (itemType) {
                    case 'GOAL':
                      return {
                        domainStatsMap: quarterlyGoalsByDomain,
                        isLoading: isLoadingQuarterlyGoals,
                        label: 'Goals'
                      }
                    case 'OBJECTIVE':
                      return {
                        domainStatsMap: quarterlyObjectivesByDomain,
                        isLoading: isLoadingQuarterlyObjectives,
                        label: 'Objectives'
                      }
                    case 'KEY_RESULT':
                      return {
                        domainStatsMap: quarterlyKeyResultsByDomain,
                        isLoading: isLoadingQuarterlyKeyResults,
                        label: 'Key Results'
                      }
                    default:
                      return null
                  }
                }

                // Item types in order: GOAL, OBJECTIVE, KEY_RESULT
                const itemTypeOrder = ['GOAL', 'OBJECTIVE', 'KEY_RESULT']
                const allCards: JSX.Element[] = []

                // Helper to get item type label
                const getItemTypeLabel = (itemType: string) => {
                  const labels: Record<string, string> = {
                    'GOAL': 'Goals',
                    'OBJECTIVE': 'Objectives',
                    'KEY_RESULT': 'Key Results',
                    'INITIATIVE': 'Initiatives'
                  }
                  return labels[itemType] || itemType
                }

                // Group PI stats by wheel type and item type (if piStats is available)
                const piStatsByWheelAndType = new Map<string, Map<string, Map<string, Array<{
                  kanbanItemId: number
                  userInstanceId: number
                  templateId: number
                  itemTitle: string
                  itemNumber?: string | null
                  columnName: string
                  wheelKey: string
                  wheelName: string
                  lifeDomainName: string
                  itemType: 'GOAL' | 'OBJECTIVE' | 'KEY_RESULT' | 'INITIATIVE'
                }>>>>()
                
                const wheelNamesFromPI = new Map<string, string>()
                
                if (piStats && piStats.size > 0) {
                  // Collect wheel names
                  piStats.forEach((itemInstances) => {
                    itemInstances.forEach(item => {
                      if (!wheelNamesFromPI.has(item.wheelKey)) {
                        wheelNamesFromPI.set(item.wheelKey, item.wheelName)
                      }
                    })
                  })

                  // Group PI stats by wheel and item type
                  piStats.forEach((itemInstances, piLabel) => {
                    itemInstances.forEach(item => {
                      const wheelKey = item.wheelKey
                      const itemType = item.itemType
                      
                      if (!piStatsByWheelAndType.has(wheelKey)) {
                        piStatsByWheelAndType.set(wheelKey, new Map())
                      }
                      const wheelMap = piStatsByWheelAndType.get(wheelKey)!
                      
                      if (!wheelMap.has(itemType)) {
                        wheelMap.set(itemType, new Map())
                      }
                      const typePiMap = wheelMap.get(itemType)!
                      
                      if (!typePiMap.has(piLabel)) {
                        typePiMap.set(piLabel, [])
                      }
                      typePiMap.get(piLabel)!.push(item)
                    })
                  })
                }

                itemTypeOrder.forEach(itemType => {
                  const statsConfig = getDomainStatsForType(itemType)
                  if (!statsConfig) return

                  // Add Pie Chart cards for this item type
                  allCards.push(
                    <div key={`${itemType}-pie`} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wheelOrder.filter(wheelKey => targetWheelKey ? wheelKey === targetWheelKey : true).map((wheelKey) => {
                        const domainStatsMap = statsConfig.domainStatsMap.get(wheelKey) || new Map()
                        const allDomainsForWheel = lifeDomainsByWheel.get(wheelKey) || []
                        return renderPieChartCard(
                          `${wheelNames[wheelKey]}: Quarterly ${statsConfig.label} Pie Chart`,
                          domainStatsMap,
                          allDomainsForWheel,
                          statsConfig.isLoading,
                          `${itemType.toLowerCase()}-pie-${wheelKey}`
                        )
                      })}
                    </div>
                  )

                  // Add List cards for this item type (if available)
                  const listCardsForType: JSX.Element[] = []
                  
                  wheelOrder.filter(wheelKey => targetWheelKey ? wheelKey === targetWheelKey : true).forEach(wheelKey => {
                    const typeMap = piStatsByWheelAndType.get(wheelKey)
                    if (!typeMap) return
                    
                    const typePiMap = typeMap.get(itemType)
                    if (!typePiMap || typePiMap.size === 0) return

                    const wheelName = wheelNamesFromPI.get(wheelKey) || wheelNames[wheelKey] || 'Unknown'

                    listCardsForType.push(
                      <Card key={`${wheelKey}-${itemType}`}>
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold">
                            {wheelName}: Quarterly {getItemTypeLabel(itemType)} <span className="italic">List</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {Array.from(typePiMap.entries())
                              .sort(([a], [b]) => {
                                // Sort by year, then quarter
                                const [quarterA, yearA] = a.replace('Q', '').split(' ').map(Number)
                                const [quarterB, yearB] = b.replace('Q', '').split(' ').map(Number)
                                if (yearA !== yearB) return yearB - yearA
                                return quarterB - quarterA
                              })
                              .map(([piLabel, itemInstances]) => (
                                <div key={piLabel} className="border rounded-lg p-3">
                                  <div className="font-semibold mb-3">{piLabel}</div>
                                  {itemInstances.length === 0 ? (
                                    <div className="text-sm text-muted-foreground">Geen items</div>
                                  ) : (
                                    <div className="space-y-2">
                                      {[...itemInstances].sort((a, b) => {
                                        // First sort by life domain name
                                        const domainCompare = (a.lifeDomainName || '').localeCompare(b.lifeDomainName || '')
                                        if (domainCompare !== 0) return domainCompare
                                        
                                        // If same domain, sort by itemNumber if available
                                        if (a.itemNumber && b.itemNumber) {
                                          const numA = parseInt(a.itemNumber.replace(/\D/g, '')) || 0
                                          const numB = parseInt(b.itemNumber.replace(/\D/g, '')) || 0
                                          return numA - numB
                                        }
                                        
                                        // Fallback to title sorting
                                        return (a.itemTitle || '').localeCompare(b.itemTitle || '')
                                      }).map((itemInstance) => (
                                        <div 
                                          key={itemInstance.kanbanItemId} 
                                          className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                                        >
                                          <div className="flex-1 min-w-0">
                                            {itemInstance.itemNumber && (
                                              <span className="text-muted-foreground mr-2">
                                                {itemInstance.itemNumber}
                                              </span>
                                            )}
                                            <span className="font-medium">{itemInstance.itemTitle}</span>
                                            <span className="text-xs text-muted-foreground ml-2">
                                              ({itemInstance.lifeDomainName})
                                            </span>
                                          </div>
                                          <span className="text-xs text-muted-foreground ml-2">
                                            {itemInstance.columnName === 'TODO' && 'Todo'}
                                            {itemInstance.columnName === 'IN_PROGRESS' && 'In Progress'}
                                            {itemInstance.columnName === 'IN_REVIEW' && 'In Review'}
                                            {itemInstance.columnName === 'DONE' && 'Done'}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })

                  // Add list cards for this item type as a grid
                  if (listCardsForType.length > 0) {
                    allCards.push(
                      <div key={`${itemType}-list`} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {listCardsForType}
                      </div>
                    )
                  }
                })

                return <>{allCards}</>
              })()}

              {/* Grid 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pie Charts by Wheel Type - Each wheel in its own card */}
                {isLoadingGoalStats ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Verdeling Goals Per Wheel Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center py-8">
                        <Loading className="h-6 w-6" />
                      </div>
                    </CardContent>
                  </Card>
                ) : goalStatsByWheel.size === 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Verdeling Goals Per Wheel Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">Geen goals gevonden</div>
                    </CardContent>
                  </Card>
                ) : (
                  Array.from(goalStatsByWheel.entries())
                    .filter(([wheelKey]) => targetWheelKey ? wheelKey === targetWheelKey : true)
                    .sort(([a], [b]) => {
                      // Sort: WHEEL_OF_LIFE first, then WHEEL_OF_BUSINESS
                      if (a === 'WHEEL_OF_LIFE') return -1
                      if (b === 'WHEEL_OF_LIFE') return 1
                      return a.localeCompare(b)
                    })
                    .map(([wheelKey, wheelStats]) => {
                      const total = wheelStats.todo + wheelStats.inProgress + wheelStats.inReview + wheelStats.done
                      const pieData = [
                        {
                          name: "todo",
                          value: wheelStats.todo,
                          fill: "oklch(0.646 0.222 41.116)",
                        },
                        {
                          name: "inProgress",
                          value: wheelStats.inProgress,
                          fill: "oklch(0.6 0.118 184.704)",
                        },
                        {
                          name: "inReview",
                          value: wheelStats.inReview,
                          fill: "oklch(0.398 0.07 227.392)",
                        },
                        {
                          name: "done",
                          value: wheelStats.done,
                          fill: "oklch(0.828 0.189 84.429)",
                        },
                      ].filter(item => item.value > 0)

                      return (
                        <Card key={wheelKey}>
                          <CardHeader>
                            <CardTitle className="text-lg font-semibold">{wheelStats.wheelName}: Verdeling Goals Per Status</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Total: {total} goals</p>
                              </div>
                              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                                {/* Donut Chart */}
                                <div className="flex-shrink-0">
                                  {pieData.length > 0 ? (
                                    <ChartContainer
                                      config={{
                                        todo: {
                                          label: "Goals om te starten",
                                          color: "oklch(0.646 0.222 41.116)",
                                        },
                                        inProgress: {
                                          label: "Actief bezig",
                                          color: "oklch(0.6 0.118 184.704)",
                                        },
                                        inReview: {
                                          label: "Wachten op review",
                                          color: "oklch(0.398 0.07 227.392)",
                                        },
                                        done: {
                                          label: "Afgerond",
                                          color: "oklch(0.828 0.189 84.429)",
                                        },
                                      }}
                                      className="mx-auto aspect-square w-[200px] h-[200px]"
                                    >
                                      <PieChart>
                                        <ChartTooltip
                                          cursor={false}
                                          content={<ChartTooltipContent hideLabel />}
                                        />
                                        <Pie
                                          data={pieData}
                                          dataKey="value"
                                          nameKey="name"
                                          innerRadius={60}
                                          outerRadius={90}
                                          strokeWidth={5}
                                        >
                                          {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                          ))}
                                        </Pie>
                                      </PieChart>
                                    </ChartContainer>
                                  ) : (
                                    <div className="flex items-center justify-center w-[200px] h-[200px] text-sm text-muted-foreground">
                                      Geen data
                                    </div>
                                  )}
                                </div>
                                {/* Legend */}
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'oklch(0.646 0.222 41.116)' }} />
                                    <span className="text-muted-foreground">Todo: {wheelStats.todo}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'oklch(0.6 0.118 184.704)' }} />
                                    <span className="text-muted-foreground">In Progress: {wheelStats.inProgress}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'oklch(0.398 0.07 227.392)' }} />
                                    <span className="text-muted-foreground">In Review: {wheelStats.inReview}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'oklch(0.828 0.189 84.429)' }} />
                                    <span className="text-muted-foreground">Done: {wheelStats.done}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                )}
              </div>

            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
