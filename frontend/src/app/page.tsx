'use client'

/**
 * Landing Page Component
 * 
 * New landing page with 4 sections:
 * 1. Hero Section - Headline, subheadline, buttons, aspirational image
 * 2. Lifestyle Vision - Dunya success with image carousel
 * 3. Why Success Needs Inner Strength - Icon grid explaining inner qualities
 * 4. How It Works - 3-step process
 */

import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { Button } from '@/shared/components/ui/button'
import { Container } from '@/shared/components/ui/container'
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/components/ui/carousel'
import Navbar from '@/shared/components/navigation/Navbar'
import { 
  Target, 
  Brain, 
  Heart, 
  Eye, 
  Shield, 
  Repeat,
  Home,
  Sparkles,
  BookOpen
} from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()

  // Create autoplay plugin instance
  const autoplayPlugin = useMemo(
    () =>
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    []
  )

  const handleGetStarted = () => {
    router.push('/onboarding')
  }

  const lifestyleImages = [
    '/CarouselLandingPagePictures/Heart.png',
    '/CarouselLandingPagePictures/Lifestyle1.png',
    '/CarouselLandingPagePictures/Lifestyle2.png',
    '/CarouselLandingPagePictures/Lifestyle3.png',
    '/CarouselLandingPagePictures/Lifestyle4.png',
    '/CarouselLandingPagePictures/Lifestyle5.png',
  ]

  const innerStrengthQualities = [
    { icon: Target, label: 'Focus' },
    { icon: Shield, label: 'Discipline' },
    { icon: Heart, label: 'Emotional balance' },
    { icon: Eye, label: 'Clarity' },
    { icon: Brain, label: 'Confidence' },
    { icon: Repeat, label: 'Consistency' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar variant="landing" />

      {/* SECTION 1 — Hero Section */}
      <section className="relative px-4 py-20 md:py-32 min-h-[80vh] flex items-center">
        <Container className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto">
            {/* Text Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground">
                  Hey Gen Z!<br />
                  Looking for success in this life and the next?<br />
                  <span className="text-primary">Check!</span><br />
                  Looking for a life with meaning and direction?<br />
                  <span className="text-primary">Check!</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                  Welcome to <span className="font-bold">Qalbsalim</span> (Soundheart).<br />
                  A platform designed to help you flourish and achieve true success (Falah) in this life and the next.<br />
                  <br />
                  Experience sustainable growth through Tazkiyyah — the purification and development of the heart — as taught in the Qur'an and Sunnah.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="h-12 px-8 text-base"
                >
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base"
                  onClick={() => router.push('/orientation')}
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Why Tazkiyyah Section */}
            <div className="space-y-6 mt-12 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Authenticity check:
              </h2>
              
              <blockquote className="text-lg md:text-xl text-muted-foreground italic border-l-4 border-primary pl-6">
                "The Day when neither wealth nor children will benefit anyone — except one who comes to Allah with a sound heart."<br />
                <span className="text-base not-italic mt-2 block">Qur'an 26:88–89</span>
              </blockquote>
                
              <blockquote className="text-lg md:text-xl text-muted-foreground italic border-l-4 border-primary pl-6">
                "Allah does not look at your appearance or your wealth, but He looks at your hearts and your deeds."<br />
                <span className="text-base not-italic mt-2 block">Ṣaḥīḥ Muslim 2564</span>
              </blockquote>
                
              <blockquote className="text-lg md:text-xl text-muted-foreground italic border-l-4 border-primary pl-6">
                "Successful is the one who purifies himself, remembers the name of his Lord, and prays."<br />
                <span className="text-base not-italic mt-2 block">Qur'an 87:14–15</span>
              </blockquote>
                
              <blockquote className="text-lg md:text-xl text-muted-foreground italic border-l-4 border-primary pl-6">
                "Successful is the one who purifies it, and ruined is the one who corrupts it."<br />
                <span className="text-base not-italic mt-2 block">Qur'an 91:9–10</span>
              </blockquote>
                
              <blockquote className="text-lg md:text-xl text-muted-foreground italic border-l-4 border-primary pl-6">
                "Unquestionably, in the remembrance of Allah do hearts find rest."<br />
                <span className="text-base not-italic mt-2 block">Qur'an 13:28</span>
              </blockquote>
              
              <blockquote className="text-lg md:text-xl text-muted-foreground italic border-l-4 border-primary pl-6">
                "And that the ultimate goal is to your Lord"<br />
                <span className="text-base not-italic mt-2 block">Quran 53:42</span>
              </blockquote>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 2 — Lifestyle Vision (Dunya Success) */}
      <section className="py-20 px-4 bg-background">
        <Container className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                The Good Life
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Imagine waking up in your own place — clean, modern, peaceful.
                </p>
                <p>
                  A space that feels vibrant, where you begin the day with purpose and gratitude.
                </p>
                <p>
                  Your outfit fits, the sunlight hits just right, and you can sense barakah in the way your life is moving forward.
                </p>
                <p>
                  You have the freedom to take weekend trips, to sit in your favourite café, and to buy the things you need without too much stress or hesitation.
                </p>
                <p>
                  Your routine supports you: morning workouts that strengthen you, food that fuels you, and habits that bring energy into your day.
                </p>
                <p>
                  When you step into school or the workplace, you feel focused, capable, and prepared.
                </p>
                <p className="font-medium text-foreground">
                  You want progress. You want success. So let's build it together.
                </p>
              </div>
            </div>

            {/* Right: Image Carousel */}
            <div className="relative">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                plugins={[autoplayPlugin]}
                className="w-full"
              >
                <CarouselContent>
                  {lifestyleImages.map((image, index) => (
                    <CarouselItem key={image}>
                      <div className="relative rounded-xl overflow-hidden shadow-lg w-full h-[320px] sm:h-[360px] md:h-[420px] lg:h-[480px] max-h-[60vh]">
                        <img
                          src={image}
                          alt={`Lifestyle scene ${index + 1}`}
                          className={`w-full h-full object-cover ${
                            image.includes('/Lifestyle1.png') || image.includes('/Lifestyle2.png')
                              ? 'object-top'
                              : 'object-center'
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 3 — Why Success Needs Inner Strength */}
      <section className="py-20 px-4 bg-muted/30">
        <Container className="max-w-6xl mx-auto">
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Why Success Needs Inner Strength
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Wanting success is easy. Building it — and keeping it — is something else entirely.
              </p>
              <p className="text-lg text-muted-foreground">
                Anyone can picture the good life. But living it requires qualities that don't come from luck or motivation alone.
              </p>
            </div>

            {/* Icon Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {innerStrengthQualities.map((quality, index) => {
                const IconComponent = quality.icon
                return (
                  <div
                    key={quality.label}
                    className="flex flex-col items-center gap-4 p-6 rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-colors"
                  >
                    <div className="p-4 rounded-full bg-primary/10">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <span className="text-lg font-medium text-foreground">
                      {quality.label}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Closing Statement */}
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xl font-medium text-foreground">
                Real success — the kind that lasts — needs a strong inner foundation.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 4 — How It Works (Steps Section) */}
      <section className="py-20 px-4 bg-background">
        <Container className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-start space-y-4 p-8 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
              <div className="p-4 rounded-full bg-primary/10">
                <Home className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  1. Build Your Dunya
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Set goals, habits, routines, and projects that move your life forward.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-start space-y-4 p-8 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
              <div className="p-4 rounded-full bg-primary/10">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  2. Strengthen Your Inner World
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Develop focus, clarity, patience, emotional discipline, and spiritual depth.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-start space-y-4 p-8 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
              <div className="p-4 rounded-full bg-primary/10">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  3. Prepare for the Akhirah
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Align your intentions and actions with a heart ready for the next life.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-background border-t border-border/60">
        <Container className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Qalbsalim
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                variant="ghost"
                onClick={() => router.push('/orientation')}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                About Us
              </Button>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  )
}

