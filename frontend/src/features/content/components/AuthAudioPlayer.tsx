/**
 * AuthAudioPlayer - Plays audio from authenticated API endpoint
 * Lazy loads: fetches audio only when user clicks play.
 * The HTML5 audio element does not send Authorization headers, so we fetch
 * the audio with credentials and use an object URL for playback.
 */

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import apiClient from '@/shared/api/client'
import { Button } from '@/shared/components/ui/button'

interface AuthAudioPlayerProps {
  audioUrl: string
  className?: string
}

export function AuthAudioPlayer({ audioUrl, className }: AuthAudioPlayerProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const objectUrlRef = useRef<string | null>(null)

  const loadAndPlay = useCallback(() => {
    if (!audioUrl || objectUrl || loading) return

    setLoading(true)
    setError(null)

    apiClient
      .get(audioUrl, { responseType: 'blob' })
      .then((res) => {
        const blob = res.data as Blob
        const url = URL.createObjectURL(blob)
        objectUrlRef.current = url
        setObjectUrl(url)
      })
      .catch((err) => {
        setError(err?.response?.status === 403 ? 'Geen toegang' : 'Kon audio niet laden')
      })
      .finally(() => setLoading(false))
  }, [audioUrl, objectUrl, loading])

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
    }
  }, [])

  if (error) {
    return <span className="text-sm text-muted-foreground">{error}</span>
  }

  if (!objectUrl) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={loadAndPlay}
        disabled={loading}
        className="gap-2 h-8"
      >
        <Play className="h-4 w-4" />
        {loading ? 'Laden...' : 'Afspelen'}
      </Button>
    )
  }

  return (
    <audio controls src={objectUrl} className={className}>
      Your browser does not support audio playback.
    </audio>
  )
}
