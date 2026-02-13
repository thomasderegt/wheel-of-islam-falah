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
  BookOpen,
  Trophy,
  Scale
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

      {/* SECTION 1 — Gen Z Hero */}
      <section className="relative py-20 px-4 border-b border-dashed border-border">
        <div className="absolute top-4 left-4 text-2xl font-bold text-muted-foreground">1</div>
        <Container className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-12">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground">
                Hey Gen Z!<br />
                Looking for success in this life and the next?<br />
                <span className="text-primary">Check!</span><br />
                Looking for a life with meaning and direction?<br />
                <span className="text-primary">Check!</span>
              </h1>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 2 — Welcome to Qalbsalim */}
      <section className="relative py-20 px-4 border-b border-dashed border-border">
        <div className="absolute top-4 left-4 text-2xl font-bold text-muted-foreground">2</div>
        <Container className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-12">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Welcome to Qalbsalim (Soundheart),
              </h1>
              <div className="text-xl md:text-2xl text-muted-foreground leading-relaxed space-y-4">
                <p>
                  A platform designed to help you flourish and achieve success. Without compromising the dunya over the akhirah or vice versa.
                </p>
                <p>
                  Hence Allah (swt) says:
                </p>
                <blockquote className="text-lg md:text-xl italic border-l-4 border-primary pl-6">
                  &quot;Our Lord, give us in this world good and in the Hereafter good, (...).&quot;<br />
                  <span className="text-base not-italic mt-2 block">Qur&apos;an 2:201</span>
                </blockquote>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 3 — Hayya 'alal-falah */}
      <section className="relative py-20 px-4 border-b border-dashed border-border">
        <div className="absolute top-4 left-4 text-2xl font-bold text-muted-foreground">3</div>
        <Container className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-12">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Hayya &apos;alal-falah
              </h2>
              <div className="text-xl md:text-2xl text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Experience Falah through:
                </p>
                <ul className="space-y-3 mt-6">
                  <li>Through <span className="font-bold">Tazkiyyah</span>, the purification and development of your heart.</li>
                  <li>And <span className="font-bold">Fiqh</span>, understanding and applying the divine dos and don&apos;ts concerning your actions.</li>
                  <li>And, <span className="font-bold">High-performance</span>, being able to use proven techniques in Goal-Management & Execution, to keep you focused on success.</li>
                </ul>
              </div>

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
          </div>
        </Container>
      </section>

      {/* SECTION 4 — Success as taught in the Quran, Sunnah */}
      <section className="relative py-20 px-4 bg-background border-b border-dashed border-border">
        <div className="absolute top-4 left-4 text-2xl font-bold text-muted-foreground">4</div>
        <Container className="max-w-6xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Straight from the source:
            </h2>
            <div className="space-y-6">
              <blockquote className="text-lg md:text-xl text-muted-foreground italic border-l-4 border-primary pl-6">
                "The Day when neither wealth nor children will benefit anyone, except one who comes to Allah (swt) with a sound heart."<br />
                <span className="text-base not-italic mt-2 block">Qur'an 26:88–89</span>
              </blockquote>
                
              <blockquote className="text-lg md:text-xl text-muted-foreground italic border-l-4 border-primary pl-6">
                "Allah (swt) does not look at your appearance or your wealth, but He looks at your hearts and your deeds."<br />
                <span className="text-base not-italic mt-2 block">Prophet Muhammad saws, Ṣaḥīḥ Muslim 2564</span>
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
                "Unquestionably, in the remembrance of Allah (swt) do hearts find rest."<br />
                <span className="text-base not-italic mt-2 block">Qur'an 13:28</span>
              </blockquote>
              
              <blockquote className="text-lg md:text-xl text-muted-foreground italic border-l-4 border-primary pl-6">
                "Our Lord, give us in this world good and in the Hereafter good, (...)."<br />
                <span className="text-base not-italic mt-2 block">Qur'an 2:201</span>
              </blockquote>
              
              <blockquote className="text-lg md:text-xl text-muted-foreground italic border-l-4 border-primary pl-6">
                "And that the ultimate goal is (going back) to your Lord"<br />
                <span className="text-base not-italic mt-2 block">Quran 53:42</span>
              </blockquote>
              
              <blockquote className="text-lg md:text-xl text-muted-foreground italic border-l-4 border-primary pl-6">
                "The Messengers of Allah (swt) are the physicians of the heart"<br />
                <span className="text-base not-italic mt-2 block">Quote imam Ibn al-Qayyim (ra)</span>
              </blockquote>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 5 — Wheel of Islam Model */}
      <section className="relative py-20 px-4 bg-background border-b border-dashed border-border">
        <div className="absolute top-4 left-4 text-2xl font-bold text-muted-foreground">5</div>
        <Container className="max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="flex justify-center">
              <img 
                src="/WheelOfIslamModel.png" 
                alt="Wheel of Islam Model" 
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 6 — Goal Management & Execution */}
      <section className="relative py-20 px-4 bg-background border-b border-dashed border-border">
        <div className="absolute top-4 left-4 text-2xl font-bold text-muted-foreground">4</div>
        <Container className="max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Succes, Goal- Management & Execution
              </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                To be successful, you need to know how to manage goals and execute them effectively. Qalbsalim is here to help. Just log in and let us grow together.<br />
                You will learn things like:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground">
                  Radical Focus
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Less distractions, more results. Focus on what moves the needle, drop the rest.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground">
                  Measure Your Success
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  You dont have to guess. Know exactly what's working and what's not with clear metrics and feedbackloops.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground">
                  Achieving goals
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Dream big and set big goals. Learn how to break them down. Execute and track your progress.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground">
                  Consistency & High Performance
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  What happens when motivation gets low? Qalbsalim helps you to stay consistent and focus on (ultimate) success
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 7 — Wheel of Work */}
      <section className="relative py-20 px-4 bg-background border-b border-dashed border-border">
        <div className="absolute top-4 left-4 text-2xl font-bold text-muted-foreground">5</div>
        <Container className="max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="flex justify-center">
              <img 
                src="/WheelOfWork.jpeg" 
                alt="Wheel of Work" 
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 8 — Imam Ibn al-Qayyim on Tazkiyah */}
      <section className="relative py-20 px-4 bg-background border-b border-dashed border-border">
        <div className="absolute top-4 left-4 text-2xl font-bold text-muted-foreground">6</div>
        <Container className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-12">
            {/* Text Content */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                The Messengers of Allah (swt) are the physicians of the heart
              </h2>
              <p className="text-xl text-muted-foreground">
                Quote imam Ibn al-Qayyim (ra)
              </p>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <blockquote className="text-lg italic leading-relaxed border-l-4 border-primary pl-6">
                  "…tazkiyat al-nafs is more difficult and severe than treating the body.
                  <br /><br />
                  Whoever purifies his ego-self through spiritual training (Ryada), disciplining (Mujahada) and retreat (Khalwa), (but mix it) with what was not brought by the Messenger of Allah (swt) (himself), then he (someone) is like the sick person who attempts to treat himself with his own opinion, but how does his opinion compare to that of the knowledge of a physician?
                  <br /><br />
                  The Messengers of Allah (swt) are the physicians of the heart, and as such there is no way of purifying them nor augmenting them except through their method; putting yourself in their hands and with absolute compliance and submission to them…"
                </blockquote>
                <p className="text-sm opacity-75">
                  Ibn al-Qayyim (ra), lam al-Muwaqqicin, 2:177.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 9 — Wheel of Life */}
      <section className="relative py-20 px-4 bg-background border-b border-dashed border-border">
        <div className="absolute top-4 left-4 text-2xl font-bold text-muted-foreground">7</div>
        <Container className="max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="flex justify-center">
              <img 
                src="/WheelOfLife.png" 
                alt="Wheel of Life" 
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 10 — Core Concepts of Success */}
      <section className="relative py-20 px-4 bg-background border-b border-dashed border-border">
        <div className="absolute top-4 left-4 text-2xl font-bold text-muted-foreground">8</div>
        <Container className="max-w-6xl mx-auto">
          <div className="space-y-8 mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Core concepts of succes
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Step 0 - Falah */}
            <div className="flex flex-col items-start space-y-4 p-8 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
              <div className="p-4 rounded-full bg-primary/10">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  Falah
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ultimate Success
                </p>
              </div>
            </div>

            {/* Step 1 - Tazkiyyah */}
            <div className="flex flex-col items-start space-y-4 p-8 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
              <div className="p-4 rounded-full bg-primary/10">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  Tazkiyyah
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  The interior path to success
                </p>
              </div>
            </div>

            {/* Step 2 - Fiqh */}
            <div className="flex flex-col items-start space-y-4 p-8 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
              <div className="p-4 rounded-full bg-primary/10">
                <Scale className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  Fiqh
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  The exterior path to success
                </p>
              </div>
            </div>

            {/* Step 3 - Dunya */}
            <div className="flex flex-col items-start space-y-4 p-8 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
              <div className="p-4 rounded-full bg-primary/10">
                <Home className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  Dunya
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Gift & Test
                </p>
              </div>
            </div>

            {/* Step 4 - Ākhirah */}
            <div className="flex flex-col items-start space-y-4 p-8 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
              <div className="p-4 rounded-full bg-primary/10">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  Ākhirah
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Final Return
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 11 — Image Carousel */}
      <section className="relative py-20 px-4 bg-background border-b border-dashed border-border">
        <div className="absolute top-4 left-4 text-2xl font-bold text-muted-foreground">9</div>
        <Container className="max-w-7xl mx-auto">
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
        </Container>
      </section>

      {/* SECTION 12 — Why Success Needs Inner Strength */}
      <section className="relative py-20 px-4 bg-muted/30 border-b border-dashed border-border">
        <div className="absolute top-4 left-4 text-2xl font-bold text-muted-foreground">10</div>
        <Container className="max-w-6xl mx-auto">
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Why success needs inner strength
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Wanting success is easy. Building it and keeping it, is something else.
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

