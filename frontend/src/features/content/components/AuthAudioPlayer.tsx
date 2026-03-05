/**
 * AuthAudioPlayer - Plays audio from authenticated API endpoint
 * The HTML5 audio element does not send Authorization headers, so we fetch
 * the audio with credentials and use an object URL for playback.
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import apiClient from '@/shared/api/client'

interface AuthAudioPlayerProps {
  audioUrl: string
  className?: string
}

export function AuthAudioPlayer({ audioUrl, className }: AuthAudioPlayerProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const objectUrlRef = useRef<string | null>(null)

  useEffect(() => {
    if (!audioUrl) return

    let cancelled = false

    apiClient
      .get(audioUrl, { responseType: 'blob' })
      .then((res) => {
        if (cancelled) return
        const blob = res.data as Blob
        const url = URL.createObjectURL(blob)
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = url
        setObjectUrl(url)
        setError(null)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.response?.status === 403 ? 'Geen toegang' : 'Kon audio niet laden')
        }
      })

    return () => {
      cancelled = true
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
      setObjectUrl(null)
    }
  }, [audioUrl])

  if (error) {
    return <span className="text-sm text-muted-foreground">{error}</span>
  }

  if (!objectUrl) {
    return <span className="text-sm text-muted-foreground">Laden...</span>
  }

  return (
    <audio controls src={objectUrl} className={className}>
      Your browser does not support audio playback.
    </audio>
  )
}
