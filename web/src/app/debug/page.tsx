'use client'

import { useSession } from 'next-auth/react';

export default function DebugPage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Session Debug</h1>
        
        <div className="space-y-4">
          <div>
            <strong>Status:</strong> {status}
          </div>
          
          <div>
            <strong>Session Data:</strong>
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>

          <div>
            <strong>Environment Variables:</strong>
            <div className="bg-gray-100 p-4 rounded mt-2">
              <p>NEXTAUTH_URL: {process.env.NEXTAUTH_URL}</p>
              <p>NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set'}</p>
              <p>DATABASE_URL: {process.env.DATABASE_URL ? 'Set' : 'Not set'}</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Reload
            </button>
            <button
              onClick={() => {
                // Clear all auth-related storage
                document.cookie.split(";").forEach(function(c) {
                  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
              }}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Clear All Storage
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}