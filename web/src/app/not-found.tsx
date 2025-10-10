import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-6xl font-extrabold text-gray-900">
            404
          </h2>
          <p className="mt-2 text-xl text-gray-600">
            Page not found
          </p>
          <p className="mt-2 text-sm text-gray-500">
            The page you're looking for doesn't exist.
          </p>
        </div>
        <div className="mt-8">
          <Link
            href="/"
            className="btn btn-primary btn-md"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
