'use client'

/**
 * My WOI Space Page Component
 * 
 * Dit is de My WOI Space pagina die de gebruiker ziet na het inloggen.
 * De gebruiker kan hier:
 * - Navigeren naar de Wheel of Islam (home)
 * - Bekijken van persoonlijke voortgang (Mijn Tuin)
 * - Bekijken van voltooide chapters (Mijn Bloemen)
 */

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible'
import { CheckCircle2, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { getEnrollmentsForUser, getProgressForEnrollment, getStepsForTemplate } from '@/features/learning/api/learningApi'
import { getSection, getSectionPublishedVersion, getChapterCurrentVersion } from '@/features/content/api/contentApi'
import type { LearningFlowEnrollmentDTO, EnrollmentStepProgressDTO } from '@/shared/api/types'

interface EnrollmentWithDetails extends LearningFlowEnrollmentDTO {
  sectionTitle?: string
  chapterTitle?: string
  progress?: EnrollmentStepProgressDTO[]
  totalSteps?: number
  completedSteps?: number
}

export default function MyWOISpacePage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([])
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [myGardenExpanded, setMyGardenExpanded] = useState(false)
  const [myProfileExpanded, setMyProfileExpanded] = useState(false)
  
  /**
   * Load enrollments for the current user
   */
  const loadEnrollments = useCallback(async () => {
    if (!user?.id) return
    
    try {
      setEnrollmentsLoading(true)
      setError(null)
      
      // Load enrollments
      const enrollmentsData = await getEnrollmentsForUser(user.id)
      
      // Enrich with section/chapter info and progress
      const enrichedEnrollments = await Promise.all(
        enrollmentsData.map(async (enrollment) => {
          try {
            // Load section info
            const section = await getSection(enrollment.sectionId)
            const sectionVersion = await getSectionPublishedVersion(section.id).catch(() => null)
            
            // Load progress
            const progress = await getProgressForEnrollment(enrollment.id)
            
            // Load template to get total steps
            const steps = await getStepsForTemplate(enrollment.templateId)
            
            // Get section title
            const sectionTitle = sectionVersion
              ? (sectionVersion.titleNl || sectionVersion.titleEn || `Section ${section.orderIndex}`)
              : `Section ${section.orderIndex}`
            
            // Load chapter if available
            let chapterTitle: string | undefined
            if (section.chapterId) {
              try {
                const chapterVersion = await getChapterCurrentVersion(section.chapterId).catch(() => null)
                if (chapterVersion) {
                  chapterTitle = chapterVersion.titleNl || chapterVersion.titleEn
                }
              } catch (err) {
                console.error('Failed to load chapter:', err)
              }
            }
            
            const completedSteps = progress.filter(p => p.status === 'COMPLETED').length
            
            return {
              ...enrollment,
              sectionTitle,
              chapterTitle,
              progress,
              totalSteps: steps.length,
              completedSteps,
            }
          } catch (err) {
            console.error(`Failed to enrich enrollment ${enrollment.id}:`, err)
            return {
              ...enrollment,
              sectionTitle: 'Onbekende sectie',
              progress: [],
              totalSteps: 0,
              completedSteps: 0,
            }
          }
        })
      )
      
      setEnrollments(enrichedEnrollments)
    } catch (err) {
      console.error('Failed to load enrollments:', err)
      setError(err instanceof Error ? err.message : 'Failed to load enrollments')
    } finally {
      setEnrollmentsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (user?.id) {
      loadEnrollments()
    } else {
      setEnrollmentsLoading(false)
    }
  }, [user?.id, loadEnrollments])
  
  const handleContinueEnrollment = (enrollmentId: number) => {
    router.push(`/enrollments/${enrollmentId}/flow`)
  }

  const isCompleted = (enrollment: EnrollmentWithDetails) => {
    return enrollment.completedAt !== null && enrollment.completedAt !== undefined
  }

  const getProgressPercentage = (enrollment: EnrollmentWithDetails) => {
    if (!enrollment.totalSteps || enrollment.totalSteps === 0) return 0
    return Math.round((enrollment.completedSteps || 0) / enrollment.totalSteps * 100)
  }

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: 'url(/BackgroundPictures/BackgroundImageMySacredSpace.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Navbar */}
      <Navbar variant="landing" />
      
      {/* Main Content Area */}
      <div className="flex-1 flex justify-start p-8 pt-16">
        <div className="container w-full max-w-md space-y-8">
          {/* My WOI Space Cards */}
          <div className="flex flex-col gap-4 pt-8">
            <Collapsible open={myGardenExpanded} onOpenChange={setMyGardenExpanded}>
              <Card className="hover:shadow-lg transition-shadow">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer">
                    <div className="flex items-center justify-between">
                      <CardTitle>Mijn Tuin</CardTitle>
                      {myGardenExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    {/* Loading state */}
                    {enrollmentsLoading && (
                      <p className="text-xs text-muted-foreground">Laden...</p>
                    )}

                    {/* Error state */}
                    {error && (
                      <p className="text-xs text-red-600">{error}</p>
                    )}

                    {/* Enrollments summary */}
                    {!enrollmentsLoading && !error && (
                      <>
                        {enrollments.length === 0 ? (
                          <p className="text-xs text-muted-foreground">
                            Nog geen learning flows gestart
                          </p>
                        ) : (
                          <div className="space-y-2 mt-2">
                            {enrollments.slice(0, 3).map((enrollment) => (
                          <button
                            key={enrollment.id}
                            type="button"
                            className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer w-full text-left"
                            onClick={() => handleContinueEnrollment(enrollment.id)}
                          >
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium truncate">
                                    {enrollment.sectionTitle}
                                  </p>
                                  {enrollment.totalSteps && enrollment.totalSteps > 0 && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                                        <div
                                          className="bg-primary h-1.5 rounded-full transition-all"
                                          style={{ width: `${getProgressPercentage(enrollment)}%` }}
                                        />
                                      </div>
                                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {getProgressPercentage(enrollment)}%
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {isCompleted(enrollment) ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 ml-2 flex-shrink-0" />
                                ) : (
                                  <Clock className="w-3.5 h-3.5 text-blue-600 ml-2 flex-shrink-0" />
                                )}
                              </button>
                            ))}
                            {enrollments.length > 3 && (
                              <p className="text-xs text-muted-foreground text-center pt-1">
                                +{enrollments.length - 3} meer
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <Collapsible open={myProfileExpanded} onOpenChange={setMyProfileExpanded}>
              <Card className="hover:shadow-lg transition-shadow">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer">
                    <div className="flex items-center justify-between">
                      <CardTitle>Mijn Profiel</CardTitle>
                      {myProfileExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-2">
                      {user?.email && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Email</p>
                          <p className="text-xs">{user.email}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
            
          </div>
        </div>
      </div>
    </div>
  )
}
