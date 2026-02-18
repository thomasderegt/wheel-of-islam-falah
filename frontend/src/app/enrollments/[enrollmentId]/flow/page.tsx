/**
 * Enrollment Flow Page
 * Main page for users to go through a learning flow enrollment
 * Route: /enrollments/[enrollmentId]/flow
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Textarea } from '@/shared/components/ui/textarea'
import { Label } from '@/shared/components/ui/label'
import { 
  getEnrollment, 
  getStepsForTemplate, 
  getProgressForEnrollment,
  getProgressForStep,
  getAnswers,
  addAnswer,
  updateProgress,
  completeEnrollment
} from '@/features/learning/api/learningApi'
import { getParagraphPublishedVersion } from '@/features/content/api/contentApi'
import { getAllCategories, getBooksByCategory, getChaptersByBook, getSectionsByChapter } from '@/features/content/api/contentApi'
import type { 
  ParagraphVersionDTO,
  LearningFlowEnrollmentDTO, 
  LearningFlowStepDTO, 
  EnrollmentStepProgressDTO,
  EnrollmentAnswerDTO 
} from '@/shared/api/types'

export default function EnrollmentFlowPage() {
  const router = useRouter()
  const params = useParams()
  const enrollmentId = Number.parseInt(params.enrollmentId as string)

  const [enrollment, setEnrollment] = useState<LearningFlowEnrollmentDTO | null>(null)
  const [template, setTemplate] = useState<{ name: string; description?: string } | null>(null)
  const [steps, setSteps] = useState<LearningFlowStepDTO[]>([])
  const [progress, setProgress] = useState<Map<number, EnrollmentStepProgressDTO>>(new Map())
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [chapterId, setChapterId] = useState<number | null>(null)
  const [allAnswers, setAllAnswers] = useState<Map<number, EnrollmentAnswerDTO[]>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Current step state
  const [paragraphContent, setParagraphContent] = useState<ParagraphVersionDTO | null>(null)
  const [impressionText, setImpressionText] = useState('')
  const [reflectionText, setReflectionText] = useState('')
  const [savingImpression, setSavingImpression] = useState(false)
  const [savingReflection, setSavingReflection] = useState(false)
  const [currentSubstep, setCurrentSubstep] = useState(1)

  useEffect(() => {
    if (enrollmentId) {
      loadEnrollmentData()
    }
  }, [enrollmentId])

  useEffect(() => {
    if (steps.length > 0 && currentStepIndex < steps.length) {
      loadCurrentStepData()
    }
  }, [steps, currentStepIndex])

  const loadEnrollmentData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load enrollment
      const enrollmentData = await getEnrollment(enrollmentId)
      setEnrollment(enrollmentData)

      // Load steps
      const stepsData = await getStepsForTemplate(enrollmentData.templateId)
      const sortedSteps = stepsData.sort((a, b) => a.orderIndex - b.orderIndex)
      setSteps(sortedSteps)

      // Load progress
      const progressData = await getProgressForEnrollment(enrollmentId)
      const progressMap = new Map<number, EnrollmentStepProgressDTO>()
      progressData.forEach((p) => {
        const step = sortedSteps.find((s) => s.id === p.stepId)
        if (step) {
          progressMap.set(step.orderIndex, p)
        }
      })
      setProgress(progressMap)

      // Find first incomplete step or start at first step
      const firstIncompleteIndex = sortedSteps.findIndex((step) => {
        const stepProgress = progressMap.get(step.orderIndex)
        return !stepProgress || stepProgress.status !== 'COMPLETED'
      })
      setCurrentStepIndex(firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0)

      // Load answers for all steps
      const answersMap = new Map<number, EnrollmentAnswerDTO[]>()
      for (const step of sortedSteps) {
        try {
          const stepAnswers = await getAnswers(enrollmentId, step.id)
          answersMap.set(step.id, stepAnswers)
        } catch (err) {
          console.error(`Failed to load answers for step ${step.id}:`, err)
        }
      }
      setAllAnswers(answersMap)

      // Load section to get chapterId for navigation
      try {
        const categories = await getAllCategories()
        let foundChapterId: number | null = null
        for (const category of categories) {
          const books = await getBooksByCategory(category.id)
          for (const book of books) {
            const chapters = await getChaptersByBook(book.id)
            for (const chapter of chapters) {
              const sections = await getSectionsByChapter(chapter.id)
              if (sections.some(s => s.id === enrollmentData.sectionId)) {
                foundChapterId = chapter.id
                break
              }
            }
            if (foundChapterId) break
          }
          if (foundChapterId) break
        }
        if (foundChapterId) {
          setChapterId(foundChapterId)
        }
      } catch (err) {
        console.error('Failed to find chapterId:', err)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load enrollment')
    } finally {
      setLoading(false)
    }
  }

  const loadCurrentStepData = async () => {
    if (currentStepIndex >= steps.length) return
    
    const currentStep = steps[currentStepIndex]
    
    try {
      // Load paragraph content
      const content = await getParagraphPublishedVersion(currentStep.paragraphId)
      setParagraphContent(content)

      if (!content) return

      // Load answers for current step
      const stepAnswers = allAnswers.get(currentStep.id) || []
      const impressions = stepAnswers.filter(a => a.type === 'PICTURE_QUESTION')
      const reflections = stepAnswers.filter(a => a.type === 'REFLECTION')

      setImpressionText(impressions.length > 0 ? impressions[0].answerText : '')
      setReflectionText(reflections.length > 0 ? reflections[0].answerText : '')

      // Set initial substep
      const title = (content.titleEn || content.titleNl || '').toLowerCase()
      const isIntroOrConclusion = title.includes('introduction') || title.includes('conclusion')
      setCurrentSubstep(isIntroOrConclusion ? 2 : 1)
    } catch (err) {
      console.error('Failed to load step data:', err)
    }
  }

  const handleSaveImpression = async () => {
    if (!impressionText.trim() || !steps[currentStepIndex]) return

    try {
      setSavingImpression(true)
      await addAnswer(enrollmentId, steps[currentStepIndex].id, {
        type: 'PICTURE_QUESTION',
        answerText: impressionText.trim(),
      })
      
      // Reload answers
      const stepAnswers = await getAnswers(enrollmentId, steps[currentStepIndex].id)
      const newAnswers = new Map(allAnswers)
      newAnswers.set(steps[currentStepIndex].id, stepAnswers)
      setAllAnswers(newAnswers)
      
      // Update progress
      const stepProgress = await getProgressForStep(enrollmentId, steps[currentStepIndex].id)
      if (stepProgress) {
        const newProgress = new Map(progress)
        newProgress.set(steps[currentStepIndex].orderIndex, stepProgress)
        setProgress(newProgress)
      }
    } catch (err) {
      console.error('Failed to save impression:', err)
      alert('Failed to save impression')
    } finally {
      setSavingImpression(false)
    }
  }

  const handleSaveReflection = async () => {
    if (!reflectionText.trim() || !steps[currentStepIndex]) return

    try {
      setSavingReflection(true)
      await addAnswer(enrollmentId, steps[currentStepIndex].id, {
        type: 'REFLECTION',
        answerText: reflectionText.trim(),
      })
      
      // Reload answers
      const stepAnswers = await getAnswers(enrollmentId, steps[currentStepIndex].id)
      const newAnswers = new Map(allAnswers)
      newAnswers.set(steps[currentStepIndex].id, stepAnswers)
      setAllAnswers(newAnswers)
    } catch (err) {
      console.error('Failed to save reflection:', err)
      alert('Failed to save reflection')
    } finally {
      setSavingReflection(false)
    }
  }

  const handleCompleteStep = async () => {
    if (!steps[currentStepIndex]) return

    try {
      await updateProgress(enrollmentId, steps[currentStepIndex].id, {
        status: 'COMPLETED'
      })
      
      // Reload progress
      const stepProgress = await getProgressForStep(enrollmentId, steps[currentStepIndex].id)
      if (stepProgress) {
        const newProgress = new Map(progress)
        newProgress.set(steps[currentStepIndex].orderIndex, stepProgress)
        setProgress(newProgress)
      }
    } catch (err) {
      console.error('Failed to complete step:', err)
      alert('Failed to complete step')
    }
  }

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const handleCompleteFlow = async () => {
    try {
      await completeEnrollment(enrollmentId)
      if (chapterId) {
        router.push(`/chapter/${chapterId}/overview`)
      } else {
        router.push('/home')
      }
    } catch (err) {
      console.error('Failed to complete enrollment:', err)
      alert(err instanceof Error ? err.message : 'Failed to complete enrollment')
    }
  }

  const allStepsCompleted = steps.length > 0 && steps.every((step) => {
    const stepProgress = progress.get(step.orderIndex)
    return stepProgress?.status === 'COMPLETED'
  })

  const getCompletedSubstepsCount = () => {
    let completed = 0
    const totalSubsteps = steps.length * 3
    
    for (const step of steps) {
      const stepProgress = progress.get(step.orderIndex)
      const stepAnswers = allAnswers.get(step.id) || []
      
      const hasImpression = stepAnswers.some(a => a.type === 'PICTURE_QUESTION')
      const hasReflection = stepAnswers.some(a => a.type === 'REFLECTION')
      const isInProgress = stepProgress?.status === 'IN_PROGRESS' || stepProgress?.status === 'COMPLETED'
      
      if (hasImpression) completed++
      if (isInProgress) completed++
      if (hasReflection) completed++
    }
    
    return { completed, total: totalSubsteps }
  }

  const { completed: completedSubstepsCount, total: totalSubstepsCount } = getCompletedSubstepsCount()

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto p-6">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Loading enrollment...</p>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !enrollment || steps.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto p-6">
          <Card className="p-4 bg-destructive/10 border-destructive">
            <p className="text-destructive">
              {error || 'Enrollment not found or has no steps'}
            </p>
            <Link href="/home">
              <Button className="mt-4">Go to Home</Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  const currentStep = steps[currentStepIndex]
  const currentProgress = progress.get(currentStep.orderIndex)
  const stepAnswers = allAnswers.get(currentStep.id) || []
  const hasImpression = stepAnswers.some(a => a.type === 'PICTURE_QUESTION')
  const hasReflection = stepAnswers.some(a => a.type === 'REFLECTION')

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          {chapterId ? (
            <Link href={`/chapter/${chapterId}/overview`}>
              <Button variant="ghost" size="sm" className="gap-2">
                Back to Overview
              </Button>
            </Link>
          ) : (
            <Link href="/home">
              <Button variant="ghost" size="sm" className="gap-2">
                Back to Main Menu
              </Button>
            </Link>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{completedSubstepsCount} / {totalSubstepsCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all duration-300"
              style={{ width: `${totalSubstepsCount > 0 ? (completedSubstepsCount / totalSubstepsCount) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {steps.map((step, index) => {
            const stepProgress = progress.get(step.orderIndex)
            const status = stepProgress?.status || 'NOT_STARTED'
            const isCurrent = index === currentStepIndex
            
            const getStatusColor = () => {
              switch (status) {
                case 'COMPLETED': return 'bg-green-500'
                case 'IN_PROGRESS': return 'bg-yellow-500'
                default: return 'bg-gray-300'
              }
            }
            
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(index)}
                className={`
                  relative w-10 h-10 rounded-full border-2 transition-all
                  ${isCurrent ? 'border-primary scale-110' : 'border-gray-300'}
                  ${getStatusColor()}
                  hover:scale-105
                `}
                title={`Step ${step.orderIndex}: ${status}`}
              >
                <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold">
                  {step.orderIndex}
                </span>
              </button>
            )
          })}
        </div>

        {/* Current Step View */}
        {paragraphContent && (
          <Card>
            <CardHeader>
              <CardTitle>Step {currentStep.orderIndex}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Substep Navigation */}
              <div className="flex gap-2">
                <Button
                  variant={currentSubstep === 1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentSubstep(1)}
                >
                  1. First Impression
                </Button>
                <Button
                  variant={currentSubstep === 2 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentSubstep(2)}
                >
                  2. Content
                </Button>
                <Button
                  variant={currentSubstep === 3 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentSubstep(3)}
                >
                  3. Reflection
                </Button>
              </div>

              {/* Substep 1: First Impression */}
              {currentSubstep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label>Your First Impression</Label>
                    <Textarea
                      value={impressionText}
                      onChange={(e) => setImpressionText(e.target.value)}
                      placeholder="Describe your first impression..."
                      rows={6}
                    />
                  </div>
                  <Button
                    onClick={handleSaveImpression}
                    disabled={savingImpression || !impressionText.trim()}
                  >
                    {savingImpression ? 'Saving...' : 'Save Impression'}
                  </Button>
                </div>
              )}

              {/* Substep 2: Content */}
              {currentSubstep === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">
                      {paragraphContent.titleEn || paragraphContent.titleNl || 'Content'}
                    </h3>
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-line">
                        {paragraphContent.contentEn || paragraphContent.contentNl || 'No content available'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Substep 3: Reflection */}
              {currentSubstep === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label>Reflection</Label>
                    <Textarea
                      value={reflectionText}
                      onChange={(e) => setReflectionText(e.target.value)}
                      placeholder={currentStep.questionText || 'Write your reflection...'}
                      rows={6}
                    />
                  </div>
                  <Button
                    onClick={handleSaveReflection}
                    disabled={savingReflection || !reflectionText.trim()}
                  >
                    {savingReflection ? 'Saving...' : 'Save Reflection'}
                  </Button>
                </div>
              )}

              {/* Step Actions */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={currentStepIndex === 0}
                >
                  Previous
                </Button>
                {currentProgress?.status !== 'COMPLETED' && (
                  <Button
                    onClick={handleCompleteStep}
                    disabled={!hasImpression || !hasReflection}
                  >
                    Complete Step
                  </Button>
                )}
                <Button
                  onClick={handleNextStep}
                  disabled={currentStepIndex === steps.length - 1}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Complete Flow Button */}
        {allStepsCompleted && (
          <Card className="p-4 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">All steps completed!</h3>
                <p className="text-sm text-muted-foreground">
                  You have completed all steps. You can now complete the learning flow.
                </p>
              </div>
              <Button onClick={handleCompleteFlow} className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Complete Flow
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
