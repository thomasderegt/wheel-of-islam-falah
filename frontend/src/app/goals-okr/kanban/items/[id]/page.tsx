'use client'

/**
 * Kanban Item Detail Page
 * 
 * Shows details of a kanban item and allows editing notes
 */

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Textarea } from '@/shared/components/ui/textarea'
import { Loading } from '@/shared/components/ui/Loading'
import { ArrowLeft, Save, ChevronRight } from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getKanbanItem } from '@/features/goals-okr/api/goalsOkrApi'
import { useUpdateKanbanItemNotes, useKanbanItems } from '@/features/goals-okr/hooks/useKanbanItems'
import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/features/auth'
import { getGoal, getObjective, getKeyResult, getInitiative, getUserGoalInstance, getUserObjectiveInstance, getUserKeyResultInstance, getUserInitiativeInstance, getInitiativesByKeyResult, getObjectivesByGoal, getKeyResultsByObjective, getUserObjectiveInstancesByUserGoalInstance, getUserKeyResultInstancesByUserObjectiveInstance, getUserInitiativeInstancesByUserKeyResultInstance, updateGoal, type ObjectiveDTO, type KeyResultDTO, type InitiativeDTO, type GoalDTO } from '@/features/goals-okr/api/goalsOkrApi'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/components/ui/select'
import { Label } from '@/shared/components/ui/label'

export default function KanbanItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const itemId = Number(params.id)
  const language = 'en' as 'nl' | 'en'
  
  // Get back URL from query parameter or referrer
  const getBackUrl = () => {
    // First, try to get from returnTo query parameter
    const returnTo = searchParams?.get('returnTo')
    if (returnTo) {
      try {
        return decodeURIComponent(returnTo)
      } catch {
        // If decoding fails, fall back to default
      }
    }
    
    // Fallback: check referrer
    if (typeof window !== 'undefined') {
      const referrer = document.referrer
      if (referrer.includes('/goals-okr/kanban')) {
        try {
          const referrerUrl = new URL(referrer)
          const queryString = referrerUrl.search
          return queryString ? `/goals-okr/kanban${queryString}` : '/goals-okr/kanban'
        } catch {
          return '/goals-okr/kanban'
        }
      }
    }
    
    // Default fallback
    return '/goals-okr/kanban'
  }
  
  const [notes, setNotes] = useState('')
  const [itemTitle, setItemTitle] = useState<string>('')
  const [isLoadingTitle, setIsLoadingTitle] = useState(true)
  const [children, setChildren] = useState<Array<ObjectiveDTO | KeyResultDTO | InitiativeDTO>>([])
  const [childrenInstances, setChildrenInstances] = useState<Array<{ id: number; instanceId: number }>>([])
  const [isLoadingChildren, setIsLoadingChildren] = useState(false)
  const [childrenType, setChildrenType] = useState<'OBJECTIVE' | 'KEY_RESULT' | 'INITIATIVE' | null>(null)
  
  // Program Increment state (for GOAL items)
  const [goalData, setGoalData] = useState<GoalDTO | null>(null)
  const [isLoadingGoalData, setIsLoadingGoalData] = useState(false)
  const [goalDataError, setGoalDataError] = useState<string | null>(null)
  const [selectedQuarter, setSelectedQuarter] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [isUpdatingPI, setIsUpdatingPI] = useState(false)
  
  // Get all kanban items to find children kanban items
  const { data: allKanbanItems } = useKanbanItems(user?.id || null)
  
  // Create a map of kanban items by itemType and itemId for quick lookup
  const kanbanItemMap = useMemo(() => {
    if (!allKanbanItems) return new Map<string, number>()
    const map = new Map<string, number>()
    allKanbanItems.forEach(item => {
      const key = `${item.itemType}-${item.itemId}`
      map.set(key, item.id)
    })
    return map
  }, [allKanbanItems])
  
  const { data: kanbanItem, isLoading, error } = useQuery({
    queryKey: ['goals-okr', 'kanban-item', itemId],
    queryFn: () => getKanbanItem(itemId),
    enabled: !!itemId,
    retry: 2,
  })

  const updateNotesMutation = useUpdateKanbanItemNotes()

  // Load item title
  useEffect(() => {
    if (!kanbanItem) return

    const loadTitle = async () => {
      setIsLoadingTitle(true)
      try {
        let title = ''
        
        switch (kanbanItem.itemType) {
          case 'GOAL': {
            const userGoalInstance = await getUserGoalInstance(kanbanItem.itemId)
            const goal = await getGoal(userGoalInstance.goalId)
            title = language === 'nl' ? (goal.titleNl || goal.titleEn) : (goal.titleEn || goal.titleNl)
            break
          }
          case 'OBJECTIVE': {
            const userObjectiveInstance = await getUserObjectiveInstance(kanbanItem.itemId)
            const objective = await getObjective(userObjectiveInstance.objectiveId)
            title = language === 'nl' ? (objective.titleNl || objective.titleEn) : (objective.titleEn || objective.titleNl)
            break
          }
          case 'KEY_RESULT': {
            const userKeyResultInstance = await getUserKeyResultInstance(kanbanItem.itemId)
            const keyResult = await getKeyResult(userKeyResultInstance.keyResultId)
            title = language === 'nl' ? (keyResult.titleNl || keyResult.titleEn) : (keyResult.titleEn || keyResult.titleNl)
            break
          }
          case 'INITIATIVE': {
            const userInitiativeInstance = await getUserInitiativeInstance(kanbanItem.itemId)
            try {
              const userInitiative = await getInitiative(userInitiativeInstance.initiativeId)
              title = userInitiative.title
            } catch (error: any) {
              if (error?.response?.status !== 404) {
                console.warn('Error loading user initiative:', error)
              }
              const userKeyResultInstance = await getUserKeyResultInstance(userInitiativeInstance.userKeyResultInstanceId)
              const keyResult = await getKeyResult(userKeyResultInstance.keyResultId)
              const templateInitiatives = await getInitiativesByKeyResult(keyResult.id)
              const templateInitiative = templateInitiatives.find(i => i.id === userInitiativeInstance.initiativeId)
              if (templateInitiative) {
                title = language === 'nl' 
                  ? (templateInitiative.titleNl || templateInitiative.titleEn)
                  : (templateInitiative.titleEn || templateInitiative.titleNl)
              }
            }
            break
          }
        }
        setItemTitle(title)
      } catch (error) {
        console.error('Failed to load item title:', error)
        setItemTitle(`${kanbanItem.itemType} ${kanbanItem.itemId}`)
      } finally {
        setIsLoadingTitle(false)
      }
    }

    loadTitle()
  }, [kanbanItem, language])

  // Initialize notes from kanban item
  useEffect(() => {
    if (kanbanItem) {
      setNotes(kanbanItem.notes || '')
    }
  }, [kanbanItem])

  // Load Goal data when item is GOAL, OBJECTIVE, KEY_RESULT, or INITIATIVE
  useEffect(() => {
    if (!kanbanItem) return
    
    const loadGoalData = async () => {
      setIsLoadingGoalData(true)
      setGoalDataError(null)
      try {
        let goal: GoalDTO | null = null
        
        switch (kanbanItem.itemType) {
          case 'GOAL': {
            const userGoalInstance = await getUserGoalInstance(kanbanItem.itemId)
            goal = await getGoal(userGoalInstance.goalId)
            break
          }
          case 'OBJECTIVE': {
            const userObjectiveInstance = await getUserObjectiveInstance(kanbanItem.itemId)
            const objective = await getObjective(userObjectiveInstance.objectiveId)
            goal = await getGoal(objective.goalId)
            break
          }
          case 'KEY_RESULT': {
            const userKeyResultInstance = await getUserKeyResultInstance(kanbanItem.itemId)
            const keyResult = await getKeyResult(userKeyResultInstance.keyResultId)
            const objective = await getObjective(keyResult.objectiveId)
            goal = await getGoal(objective.goalId)
            break
          }
          case 'INITIATIVE': {
            const userInitiativeInstance = await getUserInitiativeInstance(kanbanItem.itemId)
            const userKeyResultInstance = await getUserKeyResultInstance(userInitiativeInstance.userKeyResultInstanceId)
            const keyResult = await getKeyResult(userKeyResultInstance.keyResultId)
            const objective = await getObjective(keyResult.objectiveId)
            goal = await getGoal(objective.goalId)
            break
          }
        }
        
        if (goal) {
          setGoalData(goal)
          setSelectedQuarter(goal.quarter ?? null)
          setSelectedYear(goal.year ?? null)
        }
      } catch (error: any) {
        console.error('Failed to load goal data:', error)
        console.error('Error details:', {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status
        })
        const errorMessage = error?.response?.data?.error || error?.message || 'Failed to load goal data'
        setGoalDataError(errorMessage)
      } finally {
        setIsLoadingGoalData(false)
      }
    }
    
    loadGoalData()
  }, [kanbanItem])

  // Update PI handler
  const handleUpdatePI = async () => {
    if (!goalData || !kanbanItem) return
    
    setIsUpdatingPI(true)
    try {
      // Use goalData.id directly (we already have it from loading)
      const updatedGoal = await updateGoal(goalData.id, {
        quarter: selectedQuarter,
        year: selectedYear,
      })
      setGoalData(updatedGoal)
    } catch (error) {
      console.error('Failed to update PI:', error)
      alert('Failed to update Quarter. Please try again.')
    } finally {
      setIsUpdatingPI(false)
    }
  }

  // Load children based on item type
  useEffect(() => {
    if (!kanbanItem) return

    const loadChildren = async () => {
      setIsLoadingChildren(true)
      try {
        switch (kanbanItem.itemType) {
          case 'GOAL': {
            // Get only UserObjectiveInstances that the user has started for this UserGoalInstance
            const userObjectiveInstances = await getUserObjectiveInstancesByUserGoalInstance(kanbanItem.itemId)
            // Get Objective templates for these instances
            const objectives = await Promise.all(
              userObjectiveInstances.map(instance => getObjective(instance.objectiveId))
            )
            setChildren(objectives)
            setChildrenInstances(userObjectiveInstances.map(instance => ({ id: instance.objectiveId, instanceId: instance.id })))
            setChildrenType('OBJECTIVE')
            break
          }
          case 'OBJECTIVE': {
            // Get only UserKeyResultInstances that the user has started for this UserObjectiveInstance
            const userKeyResultInstances = await getUserKeyResultInstancesByUserObjectiveInstance(kanbanItem.itemId)
            // Get KeyResult templates for these instances
            const keyResults = await Promise.all(
              userKeyResultInstances.map(instance => getKeyResult(instance.keyResultId))
            )
            setChildren(keyResults)
            setChildrenInstances(userKeyResultInstances.map(instance => ({ id: instance.keyResultId, instanceId: instance.id })))
            setChildrenType('KEY_RESULT')
            break
          }
          case 'KEY_RESULT': {
            // Get only UserInitiativeInstances that the user has started for this UserKeyResultInstance
            const userInitiativeInstances = await getUserInitiativeInstancesByUserKeyResultInstance(kanbanItem.itemId)
            // Get Initiative templates for these instances
            const initiatives = await Promise.all(
              userInitiativeInstances.map(async (instance) => {
                try {
                  // Try to get user-created initiative first
                  const userInitiative = await getInitiative(instance.initiativeId)
                  return {
                    id: userInitiative.id,
                    title: userInitiative.title,
                    description: userInitiative.description,
                    keyResultId: userInitiative.userKeyResultInstanceId
                  } as InitiativeDTO
                } catch {
                  // If not found, try template initiative
                  const userKeyResultInstance = await getUserKeyResultInstance(instance.userKeyResultInstanceId)
                  const keyResult = await getKeyResult(userKeyResultInstance.keyResultId)
                  const templateInitiatives = await getInitiativesByKeyResult(keyResult.id)
                  const templateInitiative = templateInitiatives.find(i => i.id === instance.initiativeId)
                  if (templateInitiative) {
                    return templateInitiative
                  }
                  throw new Error(`Initiative ${instance.initiativeId} not found`)
                }
              })
            )
            setChildren(initiatives)
            setChildrenInstances(userInitiativeInstances.map(instance => ({ id: instance.initiativeId, instanceId: instance.id })))
            setChildrenType('INITIATIVE')
            break
          }
          case 'INITIATIVE': {
            // Initiatives don't have children
            setChildren([])
            setChildrenType(null)
            break
          }
        }
      } catch (error) {
        console.error('Failed to load children:', error)
        setChildren([])
        setChildrenType(null)
      } finally {
        setIsLoadingChildren(false)
      }
    }

    loadChildren()
  }, [kanbanItem])

  // Helper function to navigate to child detail page
  // We use the instance IDs we already have from loading children
  const handleChildClick = (childIndex: number) => {
    if (!childrenInstances[childIndex]) return
    
    const childInstance = childrenInstances[childIndex]
    
    // Find kanban item for this instance
    const kanbanItem = allKanbanItems?.find(
      item => item.itemType === childrenType && item.itemId === childInstance.instanceId
    )
    
    if (kanbanItem) {
      router.push(`/goals-okr/kanban/items/${kanbanItem.id}`)
    } else {
      // If no kanban item exists, show a message
      alert(language === 'nl' 
        ? 'Dit item staat nog niet op je Progress Board. Voeg het toe om de details te bekijken.'
        : 'This item is not yet on your Progress Board. Add it to view details.')
    }
  }

  const handleSaveNotes = async () => {
    if (!kanbanItem) return
    
    await updateNotesMutation.mutateAsync({
      itemId: kanbanItem.id,
      notes: notes.trim() || null,
    })
  }

  const getItemTypeLabel = (itemType: string) => {
    const labels: Record<string, { en: string; nl: string }> = {
      GOAL: { en: 'Goal', nl: 'Doel' },
      OBJECTIVE: { en: 'Objective', nl: 'Objectief' },
      KEY_RESULT: { en: 'Key Result', nl: 'Kernresultaat' },
      INITIATIVE: { en: 'Initiative', nl: 'Initiatief' },
    }
    return labels[itemType]?.[language] || itemType
  }

  const getColumnLabel = (columnName: string) => {
    const labels: Record<string, { en: string; nl: string }> = {
      TODO: { en: 'To Do', nl: 'Te Doen' },
      IN_PROGRESS: { en: 'In Progress', nl: 'Bezig' },
      IN_REVIEW: { en: 'In Review', nl: 'In Beoordeling' },
      DONE: { en: 'Done', nl: 'Klaar' },
    }
    return labels[columnName]?.[language] || columnName
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center min-h-[400px]">
                <Loading />
              </div>
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-4xl mx-auto">
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push(getBackUrl())}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {language === 'nl' ? 'Terug naar Execute Board' : 'Back to Execute Board'}
                </Button>
                <div className="text-center py-12 space-y-4">
                  <p className="text-lg font-medium text-destructive">
                    {language === 'nl' ? 'Fout bij het laden van kanban item' : 'Error loading kanban item'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'nl' 
                      ? 'Er is een fout opgetreden bij het ophalen van het kanban item. Controleer of de backend draait.'
                      : 'An error occurred while fetching the kanban item. Please check if the backend is running.'}
                  </p>
                  {error && 'response' in error && error.response && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Status: {error.response.status} - {error.response.statusText || 'Unknown error'}
                    </p>
                  )}
                </div>
              </div>
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (!kanbanItem && !isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-4xl mx-auto">
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push(getBackUrl())}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {language === 'nl' ? 'Terug naar Execute Board' : 'Back to Execute Board'}
                </Button>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {language === 'nl' ? 'Kanban item niet gevonden' : 'Kanban item not found'}
                  </p>
                </div>
              </div>
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar variant="landing" />
        <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push(getBackUrl())}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {language === 'nl' ? 'Terug naar Execute Board' : 'Back to Execute Board'}
                </Button>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground px-2 py-1 rounded bg-muted">
                      {getItemTypeLabel(kanbanItem.itemType)}
                    </span>
                    <span className="text-sm text-muted-foreground px-2 py-1 rounded bg-muted">
                      {getColumnLabel(kanbanItem.columnName)}
                    </span>
                  </div>
                  {isLoadingTitle ? (
                    <div className="h-8 w-64 bg-muted animate-pulse rounded" />
                  ) : (
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                      {itemTitle}
                    </h1>
                  )}
                </div>
              </div>

              {/* Program Increment Section (for all items - shows parent Goal's PI) */}
              {kanbanItem && (
                <Card>
                  <CardHeader>
                    <CardTitle>Set Quarter</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isLoadingGoalData ? (
                      <div className="flex items-center justify-center py-8">
                        <Loading className="h-6 w-6" />
                        <span className="ml-2 text-sm text-muted-foreground">Loading goal data...</span>
                      </div>
                    ) : goalDataError ? (
                      <div className="space-y-2">
                        <div className="text-sm text-destructive">
                          {language === 'nl' ? 'Fout bij het laden:' : 'Error loading:'} {goalDataError}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Retry loading
                            if (kanbanItem?.itemType === 'GOAL') {
                              const loadGoalData = async () => {
                                setIsLoadingGoalData(true)
                                setGoalDataError(null)
                                try {
                                  const userGoalInstance = await getUserGoalInstance(kanbanItem.itemId)
                                  const goal = await getGoal(userGoalInstance.goalId)
                                  setGoalData(goal)
                                  setSelectedQuarter(goal.quarter ?? null)
                                  setSelectedYear(goal.year ?? null)
                                } catch (error: any) {
                                  console.error('Failed to load goal data (retry):', error)
                                  const errorMessage = error?.response?.data?.error || error?.message || 'Failed to load goal data'
                                  setGoalDataError(errorMessage)
                                } finally {
                                  setIsLoadingGoalData(false)
                                }
                              }
                              loadGoalData()
                            }
                          }}
                        >
                          Retry
                        </Button>
                      </div>
                    ) : goalData ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="quarter">Quarter</Label>
                            <Select
                              value={selectedQuarter?.toString() || ''}
                              onValueChange={(v) => setSelectedQuarter(v ? parseInt(v) : null)}
                              disabled={isUpdatingPI}
                            >
                              <SelectTrigger id="quarter">
                                <SelectValue placeholder="Select quarter" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">None</SelectItem>
                                <SelectItem value="1">Q1</SelectItem>
                                <SelectItem value="2">Q2</SelectItem>
                                <SelectItem value="3">Q3</SelectItem>
                                <SelectItem value="4">Q4</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Select
                              value={selectedYear?.toString() || ''}
                              onValueChange={(v) => setSelectedYear(v ? parseInt(v) : null)}
                              disabled={isUpdatingPI}
                            >
                              <SelectTrigger id="year">
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">None</SelectItem>
                                {Array.from({ length: 5 }, (_, i) => {
                                  const year = new Date().getFullYear() + i
                                  return (
                                    <SelectItem key={year} value={year.toString()}>
                                      {year}
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button
                          onClick={handleUpdatePI}
                          disabled={isUpdatingPI || (selectedQuarter === goalData.quarter && selectedYear === goalData.year)}
                          className="w-full"
                        >
                          {isUpdatingPI ? 'Updating...' : 'Update Quarter'}
                        </Button>
                        {goalData.quarter && goalData.year && (
                          <p className="text-sm text-muted-foreground">
                            Current: Q{goalData.quarter} {goalData.year}
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {language === 'nl' ? 'Goal data niet beschikbaar' : 'Goal data not available'}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Children Section */}
              {children.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {childrenType === 'OBJECTIVE' && (language === 'nl' ? 'Objectieven' : 'Objectives')}
                      {childrenType === 'KEY_RESULT' && (language === 'nl' ? 'Kernresultaten' : 'Key Results')}
                      {childrenType === 'INITIATIVE' && (language === 'nl' ? 'Initiatieven' : 'Initiatives')}
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        ({children.length})
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingChildren ? (
                      <div className="flex items-center justify-center py-8">
                        <Loading className="h-6 w-6" />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {children.map((child, index) => {
                          const title = language === 'nl' 
                            ? ('titleNl' in child ? child.titleNl || child.titleEn : child.title)
                            : ('titleEn' in child ? child.titleEn || child.titleNl : child.title)
                          const description = language === 'nl'
                            ? ('descriptionNl' in child ? child.descriptionNl : child.description)
                            : ('descriptionEn' in child ? child.descriptionEn : child.description)
                          const hasKanbanItem = childrenInstances[index] && allKanbanItems?.some(
                            item => item.itemType === childrenType && item.itemId === childrenInstances[index].instanceId
                          )
                          
                          return (
                            <div
                              key={child.id}
                              className={`p-4 border rounded-lg transition-colors ${
                                hasKanbanItem ? 'hover:bg-accent cursor-pointer' : 'opacity-75'
                              }`}
                              onClick={() => hasKanbanItem && handleChildClick(index)}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm">{title}</h4>
                                  {description && (
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                      {description}
                                    </p>
                                  )}
                                  {childrenType === 'KEY_RESULT' && 'targetValue' in child && (
                                    <div className="mt-2 text-xs text-muted-foreground">
                                      {language === 'nl' ? 'Doel:' : 'Target:'} {child.targetValue} {child.unit}
                                    </div>
                                  )}
                                </div>
                                {hasKanbanItem && (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Notes Editor */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'nl' ? 'Opmerkingen' : 'Notes'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={language === 'nl' ? 'Voeg opmerkingen toe...' : 'Add notes...'}
                    className="min-h-[200px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveNotes}
                      disabled={updateNotesMutation.isPending}
                    >
                      {updateNotesMutation.isPending ? (
                        <>
                          <Loading className="mr-2 h-4 w-4" />
                          {language === 'nl' ? 'Opslaan...' : 'Saving...'}
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {language === 'nl' ? 'Opslaan' : 'Save'}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
