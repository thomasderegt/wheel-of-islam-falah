'use client'

/**
 * My Space Page Component
 * 
 * Dit is de My Space pagina met een audio/video speler voor Omar Hisham
 */

import { useState } from 'react'
import Navbar from '@/shared/components/navigation/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Minimize2, Maximize2 } from 'lucide-react'

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
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 pt-16">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Ibn al-Qayyim Card */}
          <div className="transition-all duration-300">
            <Card className={`bg-card/70 backdrop-blur-md border-border/50 transition-all duration-300 h-full ${
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
                    "So the Qur'aan is a complete cure from all of the diseases pertaining to the heart and body, as well as the disorders of the world and the Hereafter, and it is not that every individual is worthy for or is granted ability to be cured by way of it, and so if the one who is sick does well in the (course of) treatment with it, and places it upon his ailment with truthfulness and Eemaan and complete acceptance and definitive belief, together with the fulfillment of its conditions, the ailment can never resist it.
                    <br /><br />
                    How can the ailments resist the Speech of the Lord of the earth and the heavens which is such that – had it been revealed upon the mountains – it would have cleft them asunder, or (revealed) upon the earth – it would have sundered it. So there is no sickness from the sicknesses of the hearts and the bodies except that in the Qur'aan is a means to the guiding direction of its remedy and its cause, as well as the protection from it – for whosoever Allaah has bestowed an understanding into His Book."
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

          {/* Player Card */}
          <div className="transition-all duration-300">
            <Card className="bg-card backdrop-blur-sm opacity-100 h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
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
    </div>
  )
}
