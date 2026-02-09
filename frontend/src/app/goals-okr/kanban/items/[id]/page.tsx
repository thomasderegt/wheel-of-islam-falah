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
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getKanbanItem } from '@/features/goals-okr/api/goalsOkrApi'
import { useUpdateKanbanItemNotes, useKanbanItems } from '@/features/goals-okr/hooks/useKanbanItems'
import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/features/auth'
import { getGoal, getObjective, getKeyResult, getInitiative, getUserGoalInstance, getUserObjectiveInstance, getUserKeyResultInstance, getUserInitiativeInstance, getInitiativesByKeyResult, getObjectivesByGoal, getKeyResultsByObjective, type ObjectiveDTO, type KeyResultDTO, type InitiativeDTO } from '@/features/goals-okr/api/goalsOkrApi'

export default function KanbanItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const itemId = Number(params.id)
  const language = 'en' as 'nl' | 'en'
  
  const [notes, setNotes] = useState('')
  const [itemTitle, setItemTitle] = useState<string>('')
  const [isLoadingTitle, setIsLoadingTitle] = useState(true)
  const [children, setChildren] = useState<Array<ObjectiveDTO | KeyResultDTO | InitiativeDTO>>([])
  const [isLoadingChildren, setIsLoadingChildren] = useState(false)
  const [childrenType, setChildrenType] = useState<'OBJECTIVE' | 'KEY_RESULT' | 'INITIATIVE' | null>(null)
  
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

  // Load children based on item type
  useEffect(() => {
    if (!kanbanItem) return

    const loadChildren = async () => {
      setIsLoadingChildren(true)
      try {
        switch (kanbanItem.itemType) {
          case 'GOAL': {
            // Get UserGoalInstance → Goal → Objectives
            const userGoalInstance = await getUserGoalInstance(kanbanItem.itemId)
            const goal = await getGoal(userGoalInstance.goalId)
            const objectives = await getObjectivesByGoal(goal.id)
            setChildren(objectives)
            setChildrenType('OBJECTIVE')
            break
          }
          case 'OBJECTIVE': {
            // Get UserObjectiveInstance → Objective → KeyResults
            const userObjectiveInstance = await getUserObjectiveInstance(kanbanItem.itemId)
            const objective = await getObjective(userObjectiveInstance.objectiveId)
            const keyResults = await getKeyResultsByObjective(objective.id)
            setChildren(keyResults)
            setChildrenType('KEY_RESULT')
            break
          }
          case 'KEY_RESULT': {
            // Get UserKeyResultInstance → KeyResult → Initiatives
            const userKeyResultInstance = await getUserKeyResultInstance(kanbanItem.itemId)
            const keyResult = await getKeyResult(userKeyResultInstance.keyResultId)
            const initiatives = await getInitiativesByKeyResult(keyResult.id)
            setChildren(initiatives)
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
  // We'll try to find the kanban item by checking all kanban items and their instances
  const handleChildClick = async (childType: 'OBJECTIVE' | 'KEY_RESULT' | 'INITIATIVE', childTemplateId: number) => {
    if (!allKanbanItems || !kanbanItem) return
    
    try {
      // Get parent instance to match against
      let parentInstanceId: number | null = null
      if (kanbanItem.itemType === 'GOAL') {
        const userGoalInstance = await getUserGoalInstance(kanbanItem.itemId)
        parentInstanceId = userGoalInstance.id
      } else if (kanbanItem.itemType === 'OBJECTIVE') {
        const userObjectiveInstance = await getUserObjectiveInstance(kanbanItem.itemId)
        parentInstanceId = userObjectiveInstance.id
      } else if (kanbanItem.itemType === 'KEY_RESULT') {
        const userKeyResultInstance = await getUserKeyResultInstance(kanbanItem.itemId)
        parentInstanceId = userKeyResultInstance.id
      }
      
      if (!parentInstanceId) return
      
      // Find matching kanban item by checking instances
      let foundKanbanItemId: number | null = null
      
      if (childType === 'OBJECTIVE') {
        // Check all OBJECTIVE kanban items
        for (const item of allKanbanItems.filter(i => i.itemType === 'OBJECTIVE')) {
          try {
            const instance = await getUserObjectiveInstance(item.itemId)
            if (instance.objectiveId === childTemplateId && instance.userGoalInstanceId === parentInstanceId) {
              foundKanbanItemId = item.id
              break
            }
          } catch {
            // Continue to next item
          }
        }
      } else if (childType === 'KEY_RESULT') {
        // Check all KEY_RESULT kanban items
        for (const item of allKanbanItems.filter(i => i.itemType === 'KEY_RESULT')) {
          try {
            const instance = await getUserKeyResultInstance(item.itemId)
            if (instance.keyResultId === childTemplateId && instance.userObjectiveInstanceId === parentInstanceId) {
              foundKanbanItemId = item.id
              break
            }
          } catch {
            // Continue to next item
          }
        }
      } else if (childType === 'INITIATIVE') {
        // Check all INITIATIVE kanban items
        for (const item of allKanbanItems.filter(i => i.itemType === 'INITIATIVE')) {
          try {
            const instance = await getUserInitiativeInstance(item.itemId)
            if (instance.initiativeId === childTemplateId && instance.userKeyResultInstanceId === parentInstanceId) {
              foundKanbanItemId = item.id
              break
            }
          } catch {
            // Continue to next item
          }
        }
      }
      
      if (foundKanbanItemId) {
        router.push(`/goals-okr/kanban/items/${foundKanbanItemId}`)
      } else {
        // If no kanban item exists, show a message
        alert(language === 'nl' 
          ? 'Dit item staat nog niet op je Progress Board. Voeg het toe om de details te bekijken.'
          : 'This item is not yet on your Progress Board. Add it to view details.')
      }
    } catch (error) {
      console.error('Error navigating to child:', error)
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
                  onClick={() => router.push('/goals-okr/kanban')}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {language === 'nl' ? 'Terug naar Progress Board' : 'Back to Progress Board'}
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
                  onClick={() => router.push('/goals-okr/kanban')}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {language === 'nl' ? 'Terug naar Progress Board' : 'Back to Progress Board'}
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
                  onClick={() => router.push('/goals-okr/kanban')}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {language === 'nl' ? 'Terug naar Progress Board' : 'Back to Progress Board'}
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
                        {children.map((child) => {
                          const title = language === 'nl' 
                            ? ('titleNl' in child ? child.titleNl || child.titleEn : child.title)
                            : ('titleEn' in child ? child.titleEn || child.titleNl : child.title)
                          const description = language === 'nl'
                            ? ('descriptionNl' in child ? child.descriptionNl : child.description)
                            : ('descriptionEn' in child ? child.descriptionEn : child.description)
                          
                          return (
                            <div
                              key={child.id}
                              className="p-4 border rounded-lg transition-colors hover:bg-accent cursor-pointer"
                              onClick={() => handleChildClick(childrenType!, child.id)}
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
                                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
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
