'use client'

/**
 * My Space Page Component
 * 
 * Dit is de My Space pagina met een audio/video speler voor Omar Hisham
 */

import { useState, useEffect, useRef } from 'react'
import Navbar from '@/shared/components/navigation/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Minimize2, Maximize2, GripVertical } from 'lucide-react'

export default function MySpacePage() {
  // Omar Hisham YouTube channel - Full Quran playlist
  // You can change this to a specific video ID or playlist ID
  const omarHishamVideoId = 'sHDmxMrCfCw' // Video: https://www.youtube.com/watch?v=sHDmxMrCfCw
  // Or use a playlist: const omarHishamVideoId = 'playlist?list=PL8q8hSx1LzoKvBpLfCH3F8yE9zJ8K7x9Q'
  
  // Alternative: Use a popular Omar Hisham full Quran playlist
  // Add autoplay=1 and mute=1 (browsers require mute for autoplay to work)
  // User can unmute manually after video starts
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${omarHishamVideoId}?autoplay=1&mute=1`

  // Player size state - default to large player
  const [isMinimized, setIsMinimized] = useState(() => {
    const saved = localStorage.getItem('mywoispace-player-minimized')
    return saved === 'true'
  })

  // Quote banner state - default to minimized for subtlety
  const [isQuoteMinimized, setIsQuoteMinimized] = useState(() => {
    const saved = localStorage.getItem('mywoispace-quote-minimized')
    return saved === 'true'
  })

  // Draggable state
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  // Load position from localStorage on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem('mywoispace-card-position')
    if (savedPosition) {
      try {
        const { x, y } = JSON.parse(savedPosition)
        // Ensure position doesn't overlap with quote banner
        const quoteBannerWidth = isQuoteMinimized ? 48 : 320
        const minX = 32 + quoteBannerWidth + 24 // left padding + banner + gap
        setPosition({ x: Math.max(minX, x), y })
      } catch (e) {
        // Ignore parse errors, set default position
        const quoteBannerWidth = isQuoteMinimized ? 48 : 320
        setPosition({ x: 32 + quoteBannerWidth + 24, y: 0 })
      }
    } else {
      // Set default position to the right of quote banner
      const quoteBannerWidth = isQuoteMinimized ? 48 : 320
      setPosition({ x: 32 + quoteBannerWidth + 24, y: 0 })
    }
  }, [isQuoteMinimized])

  // Save position to localStorage
  useEffect(() => {
    if (position.x !== 0 || position.y !== 0) {
      localStorage.setItem('mywoispace-card-position', JSON.stringify(position))
    }
  }, [position])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (cardRef.current) {
      setIsDragging(true)
      const rect = cardRef.current.getBoundingClientRect()
      // Calculate offset from mouse position to card position
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && cardRef.current) {
        const cardWidth = cardRef.current.offsetWidth
        const cardHeight = cardRef.current.offsetHeight
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        
        // Calculate new position based on mouse position minus drag offset
        let newX = e.clientX - dragStart.x
        let newY = e.clientY - dragStart.y
        
        // Get container bounds (accounting for padding)
        const container = cardRef.current.parentElement
        if (container) {
          const containerRect = container.getBoundingClientRect()
          
          // Account for quote banner on the left (80px padding + quote banner width)
          const quoteBannerWidth = isQuoteMinimized ? 48 : 320 // w-12 = 48px, w-80 = 320px
          const leftPadding = 32 // p-8 = 32px
          const minX = containerRect.left + leftPadding + quoteBannerWidth + 24 // Add gap
          const maxX = containerRect.right - cardWidth - 32 // Right padding
          const minY = containerRect.top
          const maxY = containerRect.bottom - cardHeight
          
          // Clamp position to container bounds (which keeps it within viewport)
          newX = Math.max(minX, Math.min(newX, maxX))
          newY = Math.max(minY, Math.min(newY, maxY))
          
          // Convert to relative position within container
          setPosition({
            x: newX - containerRect.left,
            y: newY - containerRect.top,
          })
        } else {
          // Fallback: constrain to viewport directly
          const quoteBannerWidth = isQuoteMinimized ? 48 : 320
          const leftPadding = 32
          const minX = leftPadding + quoteBannerWidth + 24
          const maxX = viewportWidth - cardWidth - 32
          const minY = 0
          const maxY = viewportHeight - cardHeight
          
          newX = Math.max(minX, Math.min(newX, maxX))
          newY = Math.max(minY, Math.min(newY, maxY))
          
          setPosition({
            x: newX,
            y: newY,
          })
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart, isQuoteMinimized])

  return (
    <div 
      className="min-h-screen flex flex-col relative"
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
      <div className="flex-1 flex items-center justify-center p-8 pt-16 relative overflow-hidden">
        {/* Quote Banner - Left side, subtle and minimizeable */}
        <div className={`absolute left-8 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-300 ${
          isQuoteMinimized ? 'w-12' : 'w-80 max-w-80'
        }`}>
          <Card className={`bg-card/70 backdrop-blur-md border-border/50 transition-all duration-300 ${
            isQuoteMinimized ? 'shadow-sm' : 'shadow-md'
          }`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <CardTitle className={`font-medium transition-all ${
                    isQuoteMinimized ? 'text-xs text-muted-foreground' : 'text-sm'
                  }`}>
                    {isQuoteMinimized ? 'Ibn al-Qayyim' : 'Ibn al-Qayyim'}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 flex-shrink-0"
                  onClick={() => {
                    const newState = !isQuoteMinimized
                    setIsQuoteMinimized(newState)
                    localStorage.setItem('mywoispace-quote-minimized', String(newState))
                  }}
                  title={isQuoteMinimized ? 'Show quote' : 'Hide quote'}
                >
                  {isQuoteMinimized ? (
                    <Maximize2 className="h-3.5 w-3.5" />
                  ) : (
                    <Minimize2 className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </CardHeader>
            {!isQuoteMinimized && (
              <CardContent className="pt-0">
                <blockquote className="text-sm text-foreground/90 italic leading-relaxed border-l-2 border-primary/30 pl-4">
                  "So the Qur'aan is a complete cure from all of the diseases pertaining to the heart and body, as well as the disorders of the world and the Hereafter, and it is not that every individual is worthy for or is granted ability to be cured by way of it, and so if the one who is sick does well in the (course of) treatment with it, and places it upon his ailment with truthfulness and Eemaan and complete acceptance and definitive belief, together with the fulfillment of its conditions, the ailment can never resist it. How can the ailments resist the Speech of the Lord of the earth and the heavens which is such that – had it been revealed upon the mountains – it would have cleft them asunder, or (revealed) upon the earth – it would have sundered it. So there is no sickness from the sicknesses of the hearts and the bodies except that in the Qur'aan is a means to the guiding direction of its remedy and its cause, as well as the protection from it – for whosoever Allaah has bestowed an understanding into His Book."
                </blockquote>
                <p className="text-xs text-muted-foreground mt-2 text-right">
                  — Ibn al-Qayyim (rahimahullaah)
                </p>
                <p className="text-xs text-muted-foreground mt-1 text-right opacity-75">
                  Zaad al-Ma'aad vol 4 p.352
                </p>
              </CardContent>
            )}
          </Card>
        </div>
        <div 
          ref={cardRef}
          className={`absolute transition-all duration-300 ${isMinimized ? 'w-80 max-w-80' : 'w-full max-w-4xl'}`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: isDragging ? 'grabbing' : 'default',
          }}
        >
          <Card className="bg-card backdrop-blur-sm opacity-100">
            <CardHeader 
              className="pb-3 cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              title="Click and drag to move"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-2xl">Omar Hisham</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    const newState = !isMinimized
                    setIsMinimized(newState)
                    localStorage.setItem('mywoispace-player-minimized', String(newState))
                  }}
                  title={isMinimized ? 'Maximize player' : 'Minimize player'}
                >
                  {isMinimized ? (
                    <Maximize2 className="h-5 w-5" />
                  ) : (
                    <Minimize2 className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`w-full rounded-lg overflow-hidden transition-all duration-300 ${isMinimized ? 'aspect-video h-48' : 'aspect-video'}`}>
                <iframe
                  width="100%"
                  height="100%"
                  src={youtubeEmbedUrl}
                  title="Omar Hisham Quran Recitation"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="border-0"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
