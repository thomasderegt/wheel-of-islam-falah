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
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground">
                  You Want Success?<br />
                  <span className="text-primary">Beautiful</span> —<br />
                  Your success is our success.
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                  This web app is built to help you achieve real success - Falah - the complete and sustainable way of succeeding.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-lg font-medium text-foreground">It includes:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>the success you're seeking in this world</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>the success you need for your next life</span>
                  </li>
                </ul>
                <p className="text-muted-foreground pt-2">
                  By focussing on inner growth - Tazkiyyah - needed to achieve both
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

            {/* Right: Aspirational Image */}
            <div className="relative hidden md:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/LandingPagePictures/Lifestyle1.png"
                  alt="Wheel of Islam"
                  className="w-full h-auto object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </div>
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
              © {new Date().getFullYear()} Wheel of Islam
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

