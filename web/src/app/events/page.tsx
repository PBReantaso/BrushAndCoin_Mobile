'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import toast from 'react-hot-toast'

interface Event {
  id: string
  title: string
  description: string | null
  event_date: string
  location_address: string | null
  location_lat: number | null
  location_lng: number | null
  max_attendees: number | null
  registration_fee: number
  image_urls?: string[]
  is_active: boolean
  created_at: string
  updated_at: string
  organizer: {
    id: string
    username: string
    first_name: string
    last_name: string
    profile_image_url: string | null
  }
}

export default function EventsPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [focusedDate, setFocusedDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  useEffect(() => {
    loadEvents()
  }, [])

  // Reload events when page becomes visible (e.g., returning from create event)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadEvents()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const loadEvents = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/events')
      
      if (!response.ok) {
        throw new Error('Failed to load events')
      }

      const data = await response.json()
      setEvents(data.events || [])
    } catch (error) {
      console.error('Error loading events:', error)
      toast.error('Failed to load events. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getMonthName = (month: number) => monthNames[month]

  const buildCalendarGrid = () => {
    const firstDayOfMonth = new Date(focusedDate.getFullYear(), focusedDate.getMonth(), 1)
    const lastDayOfMonth = new Date(focusedDate.getFullYear(), focusedDate.getMonth() + 1, 0)
    const firstWeekday = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()

    const calendarDays = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstWeekday; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-10" />)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(focusedDate.getFullYear(), focusedDate.getMonth(), day)
      const isSelected = selectedDate !== null &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      const hasEvent = events.some(event => {
        const eventDate = new Date(event.event_date)
        return eventDate.getDate() === day &&
          eventDate.getMonth() === focusedDate.getMonth() &&
          eventDate.getFullYear() === focusedDate.getFullYear()
      })

      calendarDays.push(
        <button
          key={day}
          onClick={() => {
            // Toggle: if clicking the same date, clear selection; otherwise, select it
            if (isSelected) {
              setSelectedDate(null)
            } else {
              setSelectedDate(date)
            }
          }}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
            isSelected
              ? 'bg-red-500 text-white'
              : hasEvent
                ? 'text-red-500 hover:bg-red-50'
                : 'text-black hover:bg-gray-100'
          }`}
        >
          {day}
        </button>
      )
    }

    return calendarDays
  }

  const buildEventCard = (event: Event) => {
    const eventDate = new Date(event.event_date)
    const imageUrl = event.image_urls && event.image_urls.length > 0 ? event.image_urls[0] : null
    
    return (
      <div
        key={event.id}
        onClick={() => {
          router.push(`/events/${event.id}`)
        }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 mb-3 p-4 cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="flex items-start space-x-4">
          {/* Date Section */}
          <div className="w-15 flex-shrink-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-black">
                {eventDate.getDate()}
              </div>
              <div className="text-xs text-gray-600">
                {getMonthName(eventDate.getMonth())}
              </div>
              <div className="text-xs text-gray-600">
                {eventDate.getFullYear()}
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="flex-1">
            <h3 className="text-base font-semibold text-black mb-1">
              {event.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {event.location_address || 'Location TBA'}
            </p>
            
            {/* Event Image */}
            <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-2xl">📅</div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleCreateEvent = () => {
    router.push('/events/create')
  }

  const filteredEvents = events.filter(event => {
    // Filter by selected date (if a date is selected)
    if (selectedDate) {
      const eventDate = new Date(event.event_date)
      const isSameDate = eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear()
      
      if (!isSameDate) return false
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = event.title.toLowerCase().includes(query) ||
        event.location_address?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query)
      
      return matchesSearch
    }
    
    // If no date selected and no search query, show all events
    return true
  })

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Main Content */}
      <div className="px-4 pt-2 pb-6 lg:px-8 lg:pt-4 lg:pb-8 lg:ml-64 lg:mr-64 max-w-6xl mx-auto">
        {/* Search Bar Section */}
        <div className="mb-4 lg:mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
        {/* Calendar Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 p-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                setFocusedDate(new Date(focusedDate.getFullYear(), focusedDate.getMonth() - 1))
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-black" />
            </button>
            
            <h2 className="text-lg font-semibold text-black">
              {getMonthName(focusedDate.getMonth())} {focusedDate.getFullYear()}
            </h2>
            
            <button
              onClick={() => {
                setFocusedDate(new Date(focusedDate.getFullYear(), focusedDate.getMonth() + 1))
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-black" />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {buildCalendarGrid()}
          </div>
        </div>

        {/* Locate Events Button */}
        <button
          onClick={() => {
            router.push('/events/nearby')
          }}
          className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold text-base hover:bg-red-600 transition-colors mb-4"
        >
          Locate Events Near Me
        </button>

        {/* Events Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-black">Events</h2>
              {selectedDate && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {getMonthName(selectedDate.getMonth())} {selectedDate.getDate()}, {selectedDate.getFullYear()}
                  </span>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="text-xs text-red-500 hover:text-red-600 underline"
                  >
                    Clear filter
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={handleCreateEvent}
              className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-500">
                {selectedDate 
                  ? `No events found on ${getMonthName(selectedDate.getMonth())} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}.`
                  : searchQuery
                    ? 'No events match your search. Try a different query.'
                    : 'No events found. Create one to get started!'
                }
              </p>
              {(selectedDate || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedDate(null)
                    setSearchQuery('')
                  }}
                  className="mt-4 text-sm text-red-500 hover:text-red-600 underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvents.map(event => buildEventCard(event))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
