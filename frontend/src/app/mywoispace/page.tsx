'use client'

/**
 * My Space Page Component
 * 
 * Dit is de My Space pagina met een audio/video speler voor Omar Hisham
 */

import Navbar from '@/shared/components/navigation/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

export default function MySpacePage() {
  // Omar Hisham YouTube channel - Full Quran playlist
  // You can change this to a specific video ID or playlist ID
  const omarHishamVideoId = 'playlist?list=PL8q8hSx1LzoKvBpLfCH3F8yE9zJ8K7x9Q' // Example playlist
  // Or use a specific video: const omarHishamVideoId = 'VIDEO_ID_HERE'
  
  // Alternative: Use a popular Omar Hisham full Quran playlist
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${omarHishamVideoId}`

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
      <div className="flex-1 flex items-center justify-center p-8 pt-16">
        <div className="container w-full max-w-4xl">
          <Card className="bg-card/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Omar Hisham</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full aspect-video rounded-lg overflow-hidden">
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
