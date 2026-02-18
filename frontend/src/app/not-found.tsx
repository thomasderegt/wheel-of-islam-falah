import Link from 'next/link'
import { Button } from '@/shared/components/ui/button'
import { Container } from '@/shared/components/ui/container'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Container className="text-center space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Pagina niet gevonden</h1>
        <p className="text-muted-foreground">
          De opgevraagde pagina bestaat niet. Ga terug naar de startpagina.
        </p>
        <Button asChild>
          <Link href="/">Naar startpagina</Link>
        </Button>
      </Container>
    </div>
  )
}
