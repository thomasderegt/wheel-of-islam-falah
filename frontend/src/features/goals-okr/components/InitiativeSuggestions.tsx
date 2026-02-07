'use client'

/**
 * InitiativeSuggestions Component
 * 
 * Displays suggested initiatives for a key result
 * Users can click to create an initiative from a suggestion or start a learning flow
 */

import { useState } from 'react'
import { useInitiativeSuggestions } from '../hooks/useInitiativeSuggestions'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Loading } from '@/shared/components/ui/Loading'
import { Lightbulb, BookOpen, Plus } from 'lucide-react'
import type { InitiativeDTO } from '../api/goalsOkrApi'

interface InitiativeSuggestionsProps {
  readonly keyResultId: number
  readonly language?: 'nl' | 'en'
  readonly onSelectSuggestion?: (suggestion: InitiativeDTO) => void
  readonly onStartLearningFlow?: (suggestion: InitiativeDTO) => void
}

export function InitiativeSuggestions({ 
  keyResultId, 
  language = 'en',
  onSelectSuggestion,
  onStartLearningFlow
}: InitiativeSuggestionsProps) {
  const { data: suggestions, isLoading } = useInitiativeSuggestions(keyResultId)

  const getTitle = (suggestion: InitiativeDTO): string => {
    return language === 'nl' 
      ? (suggestion.titleNl || suggestion.titleEn)
      : (suggestion.titleEn || suggestion.titleNl)
  }

  const getDescription = (suggestion: InitiativeDTO): string => {
    return language === 'nl'
      ? (suggestion.descriptionNl || suggestion.descriptionEn || '')
      : (suggestion.descriptionEn || suggestion.descriptionNl || '')
  }

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <Loading />
      </div>
    )
  }

  if (!suggestions || suggestions.length === 0) {
    return null
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold">
          {language === 'nl' ? 'Voorgestelde Initiatives' : 'Suggested Initiatives'}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">
                  {getTitle(suggestion)}
                </CardTitle>
                {suggestion.learningFlowTemplateId && (
                  <Badge variant="outline" className="gap-1">
                    <BookOpen className="h-3 w-3" />
                    {language === 'nl' ? 'Learning Flow' : 'Learning Flow'}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {getDescription(suggestion) && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {getDescription(suggestion)}
                </p>
              )}
              <div className="flex items-center gap-2">
                {suggestion.learningFlowTemplateId && onStartLearningFlow ? (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onStartLearningFlow(suggestion)}
                    className="gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    {language === 'nl' ? 'Start Learning Flow' : 'Start Learning Flow'}
                  </Button>
                ) : null}
                {onSelectSuggestion && (
                  <Button
                    variant={suggestion.learningFlowTemplateId ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => onSelectSuggestion(suggestion)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {language === 'nl' ? 'Maak Initiative' : 'Create Initiative'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
