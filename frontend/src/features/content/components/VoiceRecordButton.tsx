/**
 * VoiceRecordButton - Record voice as a comment
 */

'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Mic, Square } from 'lucide-react'
import { addVoiceReviewComment } from '../api/contentApi'

interface VoiceRecordButtonProps {
  reviewId: number
  reviewedVersionId: number
  fieldName: string
  onSuccess: () => void
  disabled?: boolean
}

export function VoiceRecordButton({
  reviewId,
  reviewedVersionId,
  fieldName,
  onSuccess,
  disabled = false,
}: VoiceRecordButtonProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        if (chunksRef.current.length === 0) return

        setIsUploading(true)
        try {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
          await addVoiceReviewComment(reviewId, reviewedVersionId, fieldName, blob)
          onSuccess()
        } catch (err) {
          console.error(err)
          alert('Kon opname niet uploaden.')
        } finally {
          setIsUploading(false)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error(err)
      alert('Microfoon toegang is nodig voor voice recording.')
    }
  }, [reviewId, reviewedVersionId, fieldName, onSuccess])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
      setIsRecording(false)
    }
  }, [isRecording])

  const buttonLabel = isRecording
    ? 'Stop'
    : isUploading
      ? 'Uploaden...'
      : 'Voice'

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={isRecording ? stopRecording : startRecording}
      disabled={disabled || isUploading}
      className="gap-2"
    >
      {isRecording && <Square className="h-4 w-4 fill-current" />}
      {!isRecording && !isUploading && <Mic className="h-4 w-4" />}
      {buttonLabel}
    </Button>
  )
}
