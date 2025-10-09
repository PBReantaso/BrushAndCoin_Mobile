'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Something went wrong!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We encountered an unexpected error. Please try again.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={reset}
            className="btn btn-primary btn-md w-full"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="btn btn-outline btn-md w-full"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  )
}
