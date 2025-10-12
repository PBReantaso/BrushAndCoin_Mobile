'use client'

import MobileLayout from '@/components/layout/MobileLayout'

export default function MessagesPage() {
  return (
    <MobileLayout currentPage="messages">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
            <p className="text-gray-600">Messages page coming soon...</p>
          </div>
        </div>
      </div>
    </MobileLayout>
  )
}

