'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Calendar, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreateEventPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [venue, setVenue] = useState('')
  const [locationAddress, setLocationAddress] = useState('')
  const [locationLat, setLocationLat] = useState<number | null>(null)
  const [locationLng, setLocationLng] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState('10:00')
  const [category, setCategory] = useState('Art')
  const [maxAttendees, setMaxAttendees] = useState('')
  const [registrationFee, setRegistrationFee] = useState('0')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const categories = [
    'Art',
    'Music',
    'Comedy',
    'Sports',
    'Technology',
    'Business',
    'Education',
    'Other'
  ]

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        })
      })

      setLocationLat(position.coords.latitude)
      setLocationLng(position.coords.longitude)

      // Attempt to get address from coordinates
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        )
        const data = await response.json()
        if (data.display_name) {
          setLocationAddress(data.display_name)
        }
      } catch (error) {
        console.error('Error getting address:', error)
      }

      toast.success('Location updated successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Error getting location')
    }
  }

  const searchAddress = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter an address to search')
      return
    }

    setIsSearching(true)
    setSearchResults([])
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery.trim()
        )}&limit=5`
      )
      const data = await response.json()
      setSearchResults(data || [])
      if (!data || data.length === 0) {
        toast.error('No results found for that address')
      }
    } catch (error) {
      console.error('Address search error:', error)
      toast.error('Failed to search address. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const selectSearchResult = (result: any) => {
    setLocationAddress(result.display_name || '')
    if (result.lat && result.lon) {
      setLocationLat(parseFloat(result.lat))
      setLocationLng(parseFloat(result.lon))
    }
    setSearchResults([])
    toast.success('Location set from search')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error('Please enter event title')
      return
    }

    if (!venue.trim()) {
      toast.error('Please enter venue')
      return
    }

    if (!description.trim()) {
      toast.error('Please enter description')
      return
    }

    if (!locationAddress.trim() && (!locationLat || !locationLng)) {
      toast.error('Please select a location')
      return
    }

    setIsSubmitting(true)

    try {
      // Upload image if present
      let imageUrl: string | null = null
      if (uploadedImage) {
        const formData = new FormData()
        formData.append('file', uploadedImage)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) {
          const err = await uploadRes.json()
          throw new Error(err.error || 'Failed to upload image')
        }

        const uploadData = await uploadRes.json()
        imageUrl = uploadData.url || null
      }

      // Combine date and time
      const [hours, minutes] = selectedTime.split(':')
      const eventDateTime = new Date(selectedDate)
      eventDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

      const eventData = {
        title: title.trim(),
        description: description.trim(),
        venue: venue.trim(),
        location_address: locationAddress.trim() || null,
        location_lat: locationLat,
        location_lng: locationLng,
        event_date: eventDateTime.toISOString(),
        category: category,
        max_attendees: maxAttendees ? parseInt(maxAttendees) : null,
        registration_fee: registrationFee ? parseFloat(registrationFee) : 0,
        image_urls: imageUrl ? [imageUrl] : []
      }

      console.log('Creating event with data:', eventData)

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create event')
      }

      const data = await response.json()
      console.log('Event created successfully:', data)
      
      toast.success('Event created successfully!')
      router.push('/events')
      
    } catch (error: any) {
      console.error('Error creating event:', error)
      toast.error(error.message || 'Failed to create event. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-red-500 rounded-b-2xl px-4 py-4 mb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-red-600 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          
          <h1 className="text-white text-xl font-bold">Create Event</h1>
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="text-white text-base font-semibold hover:text-red-100 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 pb-6 lg:px-8 lg:pb-8 lg:ml-64 lg:mr-64 max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Image Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Add Event Image</h3>
            <div className="relative w-full max-w-md mx-auto">
              <label
                className="block w-full border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-red-300 transition-colors"
              >
                <div className="flex flex-col items-center space-y-2 text-gray-600">
                  <Calendar className="w-8 h-8 text-red-500" />
                  <p className="text-sm">Click to upload</p>
                  <p className="text-xs text-gray-400">PNG/JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      if (!file.type.startsWith('image/')) {
                        toast.error('Please select an image file')
                        return
                      }
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error('Image must be smaller than 5MB')
                        return
                      }
                      setUploadedImage(file)
                      const reader = new FileReader()
                      reader.onload = (evt) => setImagePreview(evt.target?.result as string)
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </label>
              {imagePreview && (
                <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedImage(null)
                      setImagePreview(null)
                    }}
                    className="absolute top-2 right-2 bg-white/80 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow hover:bg-white"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Event Title */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 pb-2">
              <label className="text-sm font-semibold text-red-500">Event Title</label>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              className="w-full px-4 pb-4 text-gray-900 placeholder-gray-400 focus:outline-none"
              required
            />
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 pb-2">
              <label className="text-sm font-semibold text-red-500">Category</label>
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 pb-4 text-gray-900 focus:outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <label className="text-sm font-semibold text-red-500 mb-4 block">Date & Time</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Date</label>
                <input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Time</label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Venue */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 pb-2">
              <label className="text-sm font-semibold text-red-500">Venue</label>
            </div>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Enter venue name"
              className="w-full px-4 pb-4 text-gray-900 placeholder-gray-400 focus:outline-none"
              required
            />
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <label className="text-sm font-semibold text-red-500 mb-4 block">Location</label>
            
            <div className="mb-3">
              <input
                type="text"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                placeholder="Location Address"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Address Search */}
            <div className="mb-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search address"
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={searchAddress}
                  disabled={isSearching}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 disabled:bg-red-300 transition-colors"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-sm max-h-48 overflow-auto">
                  {searchResults.map((res: any) => (
                    <button
                      key={`${res.place_id}`}
                      type="button"
                      onClick={() => selectSearchResult(res)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-gray-800"
                    >
                      {res.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={getCurrentLocation}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              {locationLat && locationLng ? 'Update Location' : 'Get Current Location'}
            </button>

            {locationLat && locationLng && (
              <p className="mt-2 text-xs text-gray-600 text-center">
                Location: {locationLat.toFixed(6)}, {locationLng.toFixed(6)}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 pb-2">
              <label className="text-sm font-semibold text-red-500">Description</label>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your event..."
              rows={4}
              className="w-full px-4 pb-4 text-gray-900 placeholder-gray-400 focus:outline-none resize-none"
              required
            />
          </div>

          {/* Optional Fields */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <label className="text-sm font-semibold text-red-500 mb-4 block">Additional Info (Optional)</label>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Max Attendees</label>
                <input
                  type="number"
                  value={maxAttendees}
                  onChange={(e) => setMaxAttendees(e.target.value)}
                  placeholder="No limit"
                  min="1"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Registration Fee (PHP)</label>
                <input
                  type="number"
                  value={registrationFee}
                  onChange={(e) => setRegistrationFee(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Create Event Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating event...
              </div>
            ) : (
              'Create Event'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

