'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Calendar, Share, MapPin, Clock, Users, DollarSign, X, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useUser } from '@/hooks/useUser'

interface ScheduleItem {
  time: string
  activity: string
}

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
  schedule?: ScheduleItem[]
  is_active: boolean
  created_at: string
  updated_at: string
  attendee_count: number
  participants?: {
    id: string
    username: string
    first_name: string
    last_name: string
    profile_image_url: string | null
  }[]
  organizer: {
    id: string
    username: string
    first_name: string
    last_name: string
    profile_image_url: string | null
  }
}

export default function EventDetailPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params?.id as string
  const { user } = useUser()
  
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'details' | 'location' | 'participants'>('details')
  const [isJoining, setIsJoining] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Check if current user is the organizer
  const isOrganizer = user?.id && event?.organizer?.id === user.id

  const getInitials = (first?: string, last?: string, username?: string) => {
    const a = first?.charAt(0) || ''
    const b = last?.charAt(0) || ''
    const u = username?.charAt(0) || ''
    return (a + b || u || '?').toUpperCase()
  }

  const getOsmEmbedUrl = (lat: number, lng: number) => {
    const delta = 0.01 // roughly ~1km box
    const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`
  }

  useEffect(() => {
    if (eventId) {
      loadEvent()
    }
  }, [eventId])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isImageModalOpen) {
        setIsImageModalOpen(false)
      }
    }
    if (isImageModalOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isImageModalOpen])

  const loadEvent = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/events/${eventId}`)
      
      if (!response.ok) {
        throw new Error('Failed to load event')
      }

      const data = await response.json()
      setEvent(data.event)
    } catch (error) {
      console.error('Error loading event:', error)
      toast.error('Failed to load event')
      router.push('/events')
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinEvent = async () => {
    setIsJoining(true)
    try {
      const response = await fetch(`/api/events/${eventId}/join`, {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to join event')
      }

      toast.success('Joined event successfully!')
      // Reload event to update attendee count
      await loadEvent()
    } catch (error: any) {
      console.error('Error joining event:', error)
      toast.error(error.message || 'Failed to join event')
    } finally {
      setIsJoining(false)
    }
  }

  const handleShareEvent = () => {
    if (navigator.share && event) {
      navigator.share({
        title: event.title,
        text: event.description || '',
        url: window.location.href,
      }).catch(() => {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href)
        toast.success('Event link copied to clipboard!')
      })
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
      toast.success('Event link copied to clipboard!')
    }
  }

  const handleDeleteEvent = async () => {
    if (!event) return

    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.title}"? This action cannot be undone.`
    )

    if (!confirmed) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete event')
      }

      toast.success('Event deleted successfully!')
      router.push('/events')
    } catch (error: any) {
      console.error('Error deleting event:', error)
      toast.error(error.message || 'Failed to delete event')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Event not found</p>
          <button
            onClick={() => router.push('/events')}
            className="text-red-500 hover:text-red-600"
          >
            Go back to events
          </button>
        </div>
      </div>
    )
  }

  const eventDate = new Date(event.event_date)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = eventDate.getDate()
  const month = monthNames[eventDate.getMonth()]
  const year = eventDate.getFullYear()
  const time = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Main Content */}
      <div className="px-4 pt-2 pb-6 lg:px-8 lg:pt-4 lg:pb-8 lg:ml-64 lg:mr-64 max-w-6xl mx-auto">
        {/* Back Button and Title */}
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Events</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                // TODO: Add to calendar
                toast.info('Add to calendar feature coming soon!')
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Calendar className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleShareEvent}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Share className="w-5 h-5 text-gray-600" />
            </button>
            {isOrganizer && (
              <button
                onClick={handleDeleteEvent}
                disabled={isDeleting}
                className="p-2 hover:bg-red-50 rounded-full transition-colors text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete event"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Event Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 p-5 lg:p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{event.title}</h1>
                <div className="px-3 py-1 bg-red-500 rounded-lg">
                  <span className="text-xs font-semibold text-white">EVENT</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{day} {month} {year}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{time}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{event.location_address || 'Location TBA'}</span>
              </div>
            </div>
            {event.image_urls && event.image_urls.length > 0 && (
              <div 
                className="w-32 h-24 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setIsImageModalOpen(true)}
              >
                <img
                  src={event.image_urls[0]}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
          <div className="grid grid-cols-3">
            <button
              onClick={() => setSelectedTab('details')}
              className={`py-3 rounded-xl transition-colors ${
                selectedTab === 'details'
                  ? 'bg-red-500 text-white font-semibold'
                  : 'text-black hover:bg-gray-50'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setSelectedTab('location')}
              className={`py-3 rounded-xl transition-colors ${
                selectedTab === 'location'
                  ? 'bg-red-500 text-white font-semibold'
                  : 'text-black hover:bg-gray-50'
              }`}
            >
              Location
            </button>
            <button
              onClick={() => setSelectedTab('participants')}
              className={`py-3 rounded-xl transition-colors ${
                selectedTab === 'participants'
                  ? 'bg-red-500 text-white font-semibold'
                  : 'text-black hover:bg-gray-50'
              }`}
            >
              Participants
            </button>
          </div>
        </div>

        {/* Content */}
        {selectedTab === 'details' && (
          <div className="space-y-4">
            {/* Event Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-lg font-bold text-black mb-4">Event Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {event.description || 'No description provided.'}
              </p>
            </div>

            {/* Event Schedule */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-lg font-bold text-black mb-4">Event Schedule</h3>
              <div className="space-y-3">
                {event.schedule && event.schedule.length > 0 ? (
                  event.schedule.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-20 text-xs font-semibold text-red-500">{item.time}</div>
                      <div className="flex-1 text-sm text-black">{item.activity}</div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-20 text-xs font-semibold text-red-500">{time}</div>
                      <div className="flex-1 text-sm text-black">Event Start</div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-20 text-xs font-semibold text-red-500">TBA</div>
                      <div className="flex-1 text-sm text-black">Event Activities</div>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        )}

        {selectedTab === 'location' && (
          <div className="space-y-4">
            {/* Map Container - OpenStreetMap embed */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {event.location_lat && event.location_lng ? (
                <div className="relative">
                  <iframe
                    title="Event location map"
                    src={getOsmEmbedUrl(event.location_lat, event.location_lng)}
                    className="w-full h-72 border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <button
                    onClick={() => {
                      const url = `https://www.openstreetmap.org/?mlat=${event.location_lat}&mlon=${event.location_lng}#map=15/${event.location_lat}/${event.location_lng}`
                      window.open(url, '_blank')
                    }}
                    className="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-600 transition-colors flex items-center gap-2 shadow"
                  >
                    <MapPin className="w-4 h-4" />
                    View on OSM
                  </button>
                </div>
              ) : (
                <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                  Location not available
                </div>
              )}
            </div>

            {/* Venue Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-lg font-bold text-black mb-4">Venue Information</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Address</p>
                    <p className="text-sm text-black">{event.location_address || 'Address TBA'}</p>
                  </div>
                </div>
                {event.max_attendees && (
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-600">Capacity</p>
                      <p className="text-sm text-black">{event.max_attendees} attendees</p>
                    </div>
                  </div>
                )}
                {event.registration_fee > 0 && (
                  <div className="flex items-start space-x-3">
                    <DollarSign className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-600">Registration Fee</p>
                      <p className="text-sm text-black">₱{event.registration_fee.toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'participants' && (
          <div className="space-y-4">
            {/* Participants List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-lg font-bold text-black mb-4">
                Participants ({event.participants?.length ?? event.attendee_count ?? 0})
              </h3>
              <div className="space-y-3">
                {event.participants && event.participants.length > 0 ? (
                  event.participants.map((p) => (
                    <div key={p.id} className="p-3 bg-gray-50 rounded-lg flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {p.profile_image_url ? (
                          <img src={p.profile_image_url} alt={p.username || 'User'} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-600 text-sm font-semibold">
                            {getInitials(p.first_name, p.last_name, p.username)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-black truncate">
                          {(p.first_name || '') + ' ' + (p.last_name || '') || p.username || 'Participant'}
                        </p>
                        {p.username && (
                          <p className="text-xs text-gray-500 truncate">@{p.username}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No participants yet. Be the first to join!</p>
                )}
              </div>
            </div>

            {/* Join Event Button - Only show if not organizer */}
            {!isOrganizer && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <button
                  onClick={handleJoinEvent}
                  disabled={isJoining}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  {isJoining ? 'Joining...' : 'Join This Event'}
                </button>
              </div>
            )}
            
            {/* Delete Event Button - Only show if organizer */}
            {isOrganizer && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <button
                  onClick={handleDeleteEvent}
                  disabled={isDeleting}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  {isDeleting ? 'Deleting...' : 'Delete This Event'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Modal/Lightbox */}
      {isImageModalOpen && event.image_urls && event.image_urls.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Close image"
          >
            <X className="w-8 h-8" />
          </button>
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={event.image_urls[0]}
              alt={event.title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}

