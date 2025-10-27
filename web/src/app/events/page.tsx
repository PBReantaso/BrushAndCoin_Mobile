'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react'

// Mock events data
const mockEvents = [
  {
    id: 1,
    title: 'Bicol Cosplay Arena',
    date: new Date(2025, 8, 19), // September 19, 2025
    image: '/placeholder-event.jpg',
    description: 'Anime cosplay event featuring Hatsune Miku and other characters',
    location: 'Bicol Cosplay Arena',
  },
  {
    id: 2,
    title: 'Art Gallery Opening',
    date: new Date(2025, 8, 25), // September 25, 2025
    image: '/placeholder-event.jpg',
    description: 'Local artist showcase and gallery opening',
    location: 'Downtown Art Center',
  },
  {
    id: 3,
    title: 'Digital Art Workshop',
    date: new Date(2025, 9, 5), // October 5, 2025
    image: '/placeholder-event.jpg',
    description: 'Learn digital art techniques from professionals',
    location: 'Creative Hub Manila',
  },
]

export default function EventsPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [focusedDate, setFocusedDate] = useState(new Date())
  const [events, setEvents] = useState(mockEvents)

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  useEffect(() => {
    removePastEvents()
  }, [])

  const removePastEvents = () => {
    const now = new Date()
    setEvents(prevEvents => 
      prevEvents.filter(event => {
        const eventDate = new Date(event.date)
        // Remove events that are more than 1 day past their date
        return eventDate >= new Date(now.getTime() - 24 * 60 * 60 * 1000)
      })
    )
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
      const isSelected = date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      const hasEvent = events.some(event => {
        const eventDate = new Date(event.date)
        return eventDate.getDate() === day &&
          eventDate.getMonth() === focusedDate.getMonth() &&
          eventDate.getFullYear() === focusedDate.getFullYear()
      })

      calendarDays.push(
        <button
          key={day}
          onClick={() => setSelectedDate(date)}
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

  const buildEventCard = (event: any) => {
    const eventDate = new Date(event.date)
    
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
              {event.location}
            </p>
            
            {/* Event Image Placeholder */}
            <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-gray-400 text-2xl">📅</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleCreateEvent = async () => {
    // Navigate to create event page
    router.push('/events/create')
  }


  return (
    <div className="bg-gray-50">
      {/* Main Content */}
      <div className="px-4 pt-2 pb-6 lg:px-8 lg:pt-4 lg:pb-8 lg:ml-64 lg:mr-64 max-w-6xl mx-auto">
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

        {/* Locate Artists Button */}
        <button
          onClick={() => {
            // TODO: Implement locate artists functionality
          }}
          className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold text-base hover:bg-red-600 transition-colors mb-4"
        >
          Locate Artists Near Me
        </button>

        {/* Events Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-black">Events</h2>
            <button
              onClick={handleCreateEvent}
              className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="space-y-3">
            {events.map(event => buildEventCard(event))}
          </div>
        </div>
      </div>
    </div>
  )
}