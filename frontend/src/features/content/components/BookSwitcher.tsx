'use client'

/**
 * BookSwitcher Component
 * 
 * Vervangt BookCarousel met een simpele swipe/switch implementatie
 * - Geen carousel library
 * - Touch/swipe support
 * - Keyboard navigation
 * - Responsive
 */

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { NavBookCircle } from './NavBookCircle'
import { Container } from '@/shared/components/ui/container'
import { Button } from '@/shared/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { BookDTO } from '@/shared/api/types'

interface BookSwitcherProps {
  categoryId: number | null
  books: BookDTO[]
  categoryName: string
  targetBookId?: number | null
  language?: 'nl' | 'en'
}

export function BookSwitcher({ 
  categoryId, 
  books, 
  categoryName, 
  targetBookId,
  language = 'en'
}: BookSwitcherProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50

  const translateBookTitle = (title: string): string => {
    const titleMap: Record<string, { nl: string; en: string }> = {
      'What Harms the Heart': { nl: 'Wat het hart schaadt', en: 'What Harms the Heart' },
      'What Purifies the Heart': { nl: 'Wat het hart zuivert', en: 'What Purifies the Heart' },
      'Insights': { nl: 'Inzichten', en: 'Insights' },
      'The Beginning': { nl: 'Het Begin', en: 'The Beginning' }
    }
    
    if (titleMap[title]) {
      return titleMap[title][language] || title
    }
    
    return title
  }

  // Navigate to target book
  useEffect(() => {
    if (targetBookId && books.length > 0) {
      const targetIndex = books.findIndex(book => book.id === targetBookId)
      if (targetIndex !== -1) {
        setCurrentIndex(targetIndex)
      }
    }
  }, [targetBookId, books])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, books.length])

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : books.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex(prev => (prev < books.length - 1 ? prev + 1 : 0))
  }

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNext()
    }
    if (isRightSwipe) {
      handlePrevious()
    }
  }

  if (books.length === 0) return null

  if (books.length === 1) {
    const book = books[0]
    return (
      <div className="flex flex-col items-center space-y-1 -mt-4 border-2 border-red-500">
        <h3 className="text-lg font-semibold">Book {book.id}</h3>
        <NavBookCircle bookId={book.id} language={language} />
      </div>
    )
  }

  const currentBook = books[currentIndex]

  return (
    <div className="w-full -mt-4 border-2 border-red-500">
      <Container className="w-full border-2 border-red-600">
        {/* Book title and navigation */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 px-4 border-2 border-red-400">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
            aria-label="Previous book"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-center flex-1 min-w-0 px-2">
            Book {currentBook.id}
          </h3>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
            aria-label="Next book"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        {/* Book indicator dots */}
        {books.length > 1 && (
          <div className="flex justify-center gap-2 mb-4">
            {books.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-muted hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to book ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* NavBookCircle - swipeable container */}
        <div
          ref={containerRef}
          className="w-full touch-none select-none border-2 border-red-300"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex flex-col items-center border-2 border-red-200">
            <NavBookCircle bookId={currentBook.id} language={language} />
          </div>
        </div>
      </Container>
    </div>
  )
}

