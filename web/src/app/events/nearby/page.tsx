'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Navigation } from 'lucide-react'
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
  distance?: number // Distance in km
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function NearbyEventsPage() {
  const router = useRouter()
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRequestingLocation, setIsRequestingLocation] = useState(true)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    requestUserLocation()
    loadEvents()
  }, [])

  const requestUserLocation = () => {
    setIsRequestingLocation(true)
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      setIsRequestingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setUserLocation(location)
        setMapCenter(location)
        setIsRequestingLocation(false)
        toast.success('Location found!')
      },
      (error) => {
        console.error('Geolocation error:', error)
        toast.error('Unable to get your location. Please enable location permissions.')
        setIsRequestingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

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
      toast.error('Failed to load events')
    } finally {
      setIsLoading(false)
    }
  }

  // Filter events within 5km radius and calculate distances
  const nearbyEvents = events
    .filter(event => {
      if (!userLocation || !event.location_lat || !event.location_lng) return false
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        event.location_lat,
        event.location_lng
      )
      return distance <= 5 // 5km radius
    })
    .map(event => {
      if (!userLocation || !event.location_lat || !event.location_lng) return event
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        event.location_lat,
        event.location_lng
      )
      return { ...event, distance: Math.round(distance * 10) / 10 } // Round to 1 decimal
    })
    .sort((a, b) => (a.distance || 0) - (b.distance || 0)) // Sort by distance

  const getOsmMapUrl = () => {
    if (!mapCenter) return null
    const delta = 0.045 // Approximately 5km radius
    const bbox = `${mapCenter.lng - delta},${mapCenter.lat - delta},${mapCenter.lng + delta},${mapCenter.lat + delta}`
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lng}`
  }

  const getOsmViewUrl = (lat: number, lng: number) => {
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=13/${lat}/${lng}`
  }

  if (isRequestingLocation) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Requesting your location...</p>
          <p className="text-sm text-gray-500 mt-2">Please allow location access</p>
        </div>
      </div>
    )
  }

  if (!userLocation) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="px-4 pt-2 pb-6 lg:px-8 lg:pt-4 lg:pb-8 lg:ml-64 lg:mr-64 max-w-6xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Events</span>
          </button>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <Navigation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Location Access Required</h2>
            <p className="text-gray-600 mb-6">
              We need your location to show nearby events. Please enable location permissions and try again.
            </p>
            <button
              onClick={requestUserLocation}
              className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
            >
              Request Location Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="px-4 pt-2 pb-6 lg:px-8 lg:pt-4 lg:pb-8 lg:ml-64 lg:mr-64 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Events</span>
          </button>
          <button
            onClick={requestUserLocation}
            className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors"
          >
            <Navigation className="w-5 h-5" />
            <span className="text-sm font-medium">Update Location</span>
          </button>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Events Within 5km</h2>
            <p className="text-sm text-gray-600 mt-1">
              {nearbyEvents.length} {nearbyEvents.length === 1 ? 'event' : 'events'} found near you
            </p>
          </div>
          {mapCenter && (
            <div className="relative">
              <iframe
                title="Nearby events map"
                src={getOsmMapUrl() || ''}
                className="w-full h-96 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* User location marker overlay */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-red-500 rounded-full animate-ping opacity-20"></div>
              </div>
            </div>
          )}
        </div>

        {/* Events List */}
        <div>
          <h2 className="text-xl font-bold text-black mb-4">Nearby Events</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          ) : nearbyEvents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No events found within 5km of your location</p>
              <p className="text-sm text-gray-500">Try expanding your search or check back later</p>
            </div>
          ) : (
            <div className="space-y-3">
              {nearbyEvents.map((event) => {
                const eventDate = new Date(event.event_date)
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                const imageUrl = event.image_urls && event.image_urls.length > 0 ? event.image_urls[0] : null

                return (
                  <div
                    key={event.id}
                    onClick={() => router.push(`/events/${event.id}`)}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Date Section */}
                      <div className="w-15 flex-shrink-0">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-black">
                            {eventDate.getDate()}
                          </div>
                          <div className="text-xs text-gray-600">
                            {monthNames[eventDate.getMonth()]}
                          </div>
                          <div className="text-xs text-gray-600">
                            {eventDate.getFullYear()}
                          </div>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-base font-semibold text-black">
                            {event.title}
                          </h3>
                          {event.distance !== undefined && (
                            <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full ml-2">
                              {event.distance} km away
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{event.location_address || 'Location TBA'}</span>
                        </div>
                        
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
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

