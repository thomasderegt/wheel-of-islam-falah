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
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 pt-16 pb-24">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Ibn al-Qayyim Card */}
          <div className={`transition-all duration-300 ${isQuoteMinimized ? 'self-start' : 'self-stretch'}`}>
            <Card className={`bg-card/70 backdrop-blur-md border-border/50 transition-all duration-300 ${
              isQuoteMinimized ? 'shadow-sm' : 'shadow-md h-full'
            }`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <CardTitle className={`font-medium transition-all ${
                      isQuoteMinimized ? 'text-xs text-muted-foreground' : 'text-sm'
                    }`}>
                      {isQuoteMinimized ? 'Imam Ibn al-Qayyim (ra) quote' : 'Imam Ibn al-Qayyim (ra) quote'}
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
                    "So the Quran is a complete cure for all the diseases of the heart and the body, and the maladies of the worldly life and the Hereafter.
                    <br /><br />
                    Not every person qualifies for it (i.e. worthy and deserving) and is given the success and ability in being cured by it. If the sick person wishes to take advantage and benefit by treating himself with it, and he applies and implements it upon his malady with Sidq (truthfulness) and Eman (Faith), alongside having complete acceptance, firm belief (I'tiqaad) and by fulfilling its conditions, then no disease will ever be able to resist and withstand it.
                    <br /><br />
                    How can any disease resist and withstand the Speech of the Lord of the Heavens and the Earth? If it was revealed upon a mountain then it would have split it asunder, or upon the Earth then indeed it would have split it into pieces.
                    <br /><br />
                    So there is not a disease from the diseases of the hearts and bodies except that in the Quran there is a means of guidance to its cure, its cause, and protection from it; for whoever Allah has blessed him with understanding of His Book."
                  </blockquote>
                  <p className="text-xs text-muted-foreground mt-2 text-right">
                    — Ibn al-Qayyim (ra)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 text-right opacity-75">
                    Zaad al-Ma'aad fee Hadiyy Khayr al-'Ibaad (4/322-323)
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
                    <CardTitle className="text-2xl">Quran recitation</CardTitle>
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
                    title="Quran Recitation"
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
