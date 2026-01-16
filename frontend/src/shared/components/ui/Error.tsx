'use client'

interface ErrorProps {
  message: string
  onRetry?: () => void
}

/**
 * Error component
 * Simple error display for FASE 1
 */
export function Error({ message, onRetry }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <p className="text-red-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      )}
    </div>
  )
}

