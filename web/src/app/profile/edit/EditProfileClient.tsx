'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft, Upload, X, User, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

interface UserProfile {
  id: string
  email: string
  username?: string
  first_name: string
  last_name: string
  bio?: string
  profile_image_url?: string
  location_address?: string
  location_lat?: number
  location_lng?: number
}

interface EditProfileClientProps {
  initialUser: {
    id: string
    email: string
    first_name: string
    last_name: string
    username?: string
    bio?: string
    profile_image_url?: string
    location_address?: string
  }
}

export default function EditProfileClient({ initialUser }: EditProfileClientProps) {
  const router = useRouter()
  const { update: updateSession } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  
  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [removedImage, setRemovedImage] = useState(false)
  const [locationAddress, setLocationAddress] = useState('')
  
  // Commission details
  const [commissionDescription, setCommissionDescription] = useState('')
  const [commissionPrice, setCommissionPrice] = useState('')
  const [commissionAvailable, setCommissionAvailable] = useState(false)
  
  // GCash details
  const [gcashNumber, setGcashNumber] = useState('')
  const [gcashName, setGcashName] = useState('')
  
  // Social links
  const [facebookLink, setFacebookLink] = useState('')
  const [twitterLink, setTwitterLink] = useState('')
  const [instagramLink, setInstagramLink] = useState('')
  const [pinterestLink, setPinterestLink] = useState('')
  const [websiteLink, setWebsiteLink] = useState('')
  
  // Location search
  const [searchAddressQuery, setSearchAddressQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/users/profile')
      if (!response.ok) {
        throw new Error('Failed to load profile')
      }
      const data = await response.json()
      setUser(data.user)
      setFirstName(data.user.first_name || '')
      setLastName(data.user.last_name || '')
      setUsername(data.user.username || '')
      setBio(data.user.bio || '')
      setProfileImage(data.user.profile_image_url || null)
      setLocationAddress(data.user.location_address || '')
      
      // Load commission details
      const commissionDetails = data.user.commission_details || {}
      setCommissionDescription(commissionDetails.description || '')
      setCommissionPrice(commissionDetails.price || '')
      setCommissionAvailable(commissionDetails.available || false)
      
      // Load GCash details
      const gcashDetails = data.user.gcash_details || {}
      setGcashNumber(gcashDetails.number || '')
      setGcashName(gcashDetails.name || '')
      
      // Load social links
      const socialLinks = data.user.social_links || {}
      setFacebookLink(socialLinks.facebook || '')
      setTwitterLink(socialLinks.twitter || '')
      setInstagramLink(socialLinks.instagram || '')
      setPinterestLink(socialLinks.pinterest || '')
      setWebsiteLink(socialLinks.website || '')
      
      setRemovedImage(false)
      setProfileImageFile(null)
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Failed to load profile')
      // Fallback to initial user data
      setUser(initialUser as UserProfile)
      setFirstName(initialUser.first_name || '')
      setLastName(initialUser.last_name || '')
      setUsername(initialUser.username || '')
      setBio(initialUser.bio || '')
      setProfileImage(initialUser.profile_image_url || null)
      setLocationAddress(initialUser.location_address || '')
      setRemovedImage(false)
      setProfileImageFile(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      setProfileImageFile(file)
      setRemovedImage(false) // Reset removed flag when new image is selected
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setProfileImage(null)
    setProfileImageFile(null)
    setRemovedImage(true)
  }

  const handleSearchAddress = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([])
      return
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`
      )
      const data = await response.json()
      setSearchResults(data)
      setShowSearchResults(true)
    } catch (error) {
      console.error('Error searching address:', error)
    }
  }

  const handleSelectAddress = (result: any) => {
    setLocationAddress(result.display_name)
    setSearchAddressQuery('')
    setShowSearchResults(false)
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!profileImageFile) return null

    const formData = new FormData()
    formData.append('file', profileImageFile)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      let imageUrl = profileImage
      
      // Upload new image if one was selected
      if (profileImageFile) {
        imageUrl = await uploadImage()
        if (!imageUrl) {
          throw new Error('Failed to upload profile image')
        }
      }

      // Prepare update data
      const updateData: any = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      }

      if (username.trim()) {
        updateData.username = username.trim()
      }

      if (bio.trim()) {
        updateData.bio = bio.trim()
      } else {
        updateData.bio = null
      }

      // Handle profile image: upload new, remove, or keep existing
      if (removedImage) {
        // User removed the image, set to null
        updateData.profile_image_url = null
      } else if (profileImageFile && imageUrl) {
        // User uploaded a new image
        updateData.profile_image_url = imageUrl
      }
      // If neither removedImage nor profileImageFile, don't include profile_image_url (keeps existing)

      if (locationAddress.trim()) {
        updateData.location_address = locationAddress.trim()
      }

      // Add commission details
      updateData.commission_details = {
        description: commissionDescription.trim(),
        price: commissionPrice.trim(),
        available: commissionAvailable
      }

      // Add GCash details
      updateData.gcash_details = {
        number: gcashNumber.trim(),
        name: gcashName.trim()
      }

      // Add social links
      updateData.social_links = {
        facebook: facebookLink.trim(),
        twitter: twitterLink.trim(),
        instagram: instagramLink.trim(),
        pinterest: pinterestLink.trim(),
        website: websiteLink.trim()
      }

      // Update profile
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      toast.success('Profile updated successfully!')
      
      // Update NextAuth session with new data
      try {
        await updateSession()
      } catch (error) {
        console.error('Error updating session:', error)
      }
      
      // Refresh the router to reload server components
      router.refresh()
      
      // Redirect to profile page after a short delay
      setTimeout(() => {
        router.push('/profile?updated=true')
      }, 500)
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="px-4 pt-2 pb-6 lg:px-8 lg:pt-4 lg:pb-8 lg:ml-64 lg:mr-64 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h2>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                {profileImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="profile-image-input"
                  />
                  <span className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {profileImage ? 'Change Picture' : 'Upload Picture'}
                    </span>
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Last Name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="username"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your unique username (optional)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder="Tell us about yourself..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {bio.length}/500 characters
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchAddressQuery || locationAddress}
                onChange={(e) => {
                  const value = e.target.value
                  setSearchAddressQuery(value)
                  setLocationAddress(value)
                  handleSearchAddress(value)
                }}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setShowSearchResults(true)
                  }
                }}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Search address (Optional)"
              />
              {searchAddressQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchAddressQuery('')
                    setShowSearchResults(false)
                  }}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            {showSearchResults && searchResults.length > 0 && (
              <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto">
                {searchResults.map((result) => (
                  <li
                    key={result.osm_id}
                    onClick={() => handleSelectAddress(result)}
                    className="p-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-900"
                  >
                    {result.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Commission Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Commission Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commission Description
                </label>
                <textarea
                  value={commissionDescription}
                  onChange={(e) => setCommissionDescription(e.target.value)}
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder="Describe your commission services, pricing, and what you offer..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {commissionDescription.length}/500 characters
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Starting Price (₱)
                  </label>
                  <input
                    type="text"
                    value={commissionPrice}
                    onChange={(e) => setCommissionPrice(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., 500"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={commissionAvailable}
                      onChange={(e) => setCommissionAvailable(e.target.checked)}
                      className="w-5 h-5 text-red-500 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Accepting Commissions
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* GCash Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">GCash Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GCash Number
                </label>
                <input
                  type="text"
                  value={gcashNumber}
                  onChange={(e) => setGcashNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 09123456789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GCash Account Name
                </label>
                <input
                  type="text"
                  value={gcashName}
                  onChange={(e) => setGcashName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Name on GCash account"
                />
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  value={facebookLink}
                  onChange={(e) => setFacebookLink(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="https://facebook.com/yourprofile"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter/X
                </label>
                <input
                  type="url"
                  value={twitterLink}
                  onChange={(e) => setTwitterLink(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="https://twitter.com/yourprofile"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  value={instagramLink}
                  onChange={(e) => setInstagramLink(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pinterest
                </label>
                <input
                  type="url"
                  value={pinterestLink}
                  onChange={(e) => setPinterestLink(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="https://pinterest.com/yourprofile"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={websiteLink}
                  onChange={(e) => setWebsiteLink(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 disabled:bg-red-300 transition-colors flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

