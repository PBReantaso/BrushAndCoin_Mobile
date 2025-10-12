'use client'

import MobileLayout from '@/components/layout/MobileLayout'

export default function EventsPage() {
  return (
    <MobileLayout currentPage="events">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Events</h1>
            <p className="text-gray-600">Events page coming soon...</p>
          </div>
        </div>
      </div>
    </MobileLayout>
  )
}

