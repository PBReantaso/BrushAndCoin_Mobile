'use client'

import ArtworkDetailModal from '@/components/artwork/ArtworkDetailModal'
import { DollarSign, Edit3, Facebook, Globe, Heart, Image as ImageIcon, Link2, MessageCircle, Palette, Share, Twitter, UserCheck, UserPlus, Users, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CommissionRequestForm from '../../../components/commissions/CommissionRequestForm'

interface Artwork {
  id: string;
  title: string;
  description: string | null;
  image_urls: string[];
  category: string | null;
  tags: string[] | null;
  price: number | null;
  is_commission: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

interface FollowStats {
  followers_count: number;
  following_count: number;
  is_following: boolean;
}

interface UserProfileClientProps {
  user: {
    id: string
    username: string | null
    first_name: string
    last_name: string
    email: string
    profile_image_url: string | null
    bio: string | null
    user_type: string
    is_verified: boolean
    location_address: string | null
    gcash_details?: any
    social_links?: any
    commission_details?: any
    created_at: string
  }
  stats: {
    artworks: number
    followers: number
    following: number
  }
  isOwnProfile: boolean
  currentUserId: string
}

export default function UserProfileClient({ user, stats: initialStats, isOwnProfile, currentUserId }: UserProfileClientProps) {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState(0)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [followStats, setFollowStats] = useState<FollowStats | null>(null)
  const [isLoadingArtworks, setIsLoadingArtworks] = useState(false)
  const [isLoadingFollow, setIsLoadingFollow] = useState(false)
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false)
  const [stats, setStats] = useState(initialStats)
  const [showCommissionModal, setShowCommissionModal] = useState(false)
  const [showCommissionForm, setShowCommissionForm] = useState(false)
  // Safe fallback for commission details when DB doesn't include the field
  const commissionDetails: any = (user as any)?.commission_details ?? null
  // Safe fallbacks for gcash and social links
  const gcashDetails: any = (user as any)?.gcash_details ?? {}
  const socialLinks: any = (user as any)?.social_links ?? {}
  
  // Modal state
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Modal functions
  const openArtworkModal = (artwork: Artwork) => {
    setSelectedArtwork(artwork)
    setIsModalOpen(true)
  }

  const closeArtworkModal = () => {
    setIsModalOpen(false)
    setSelectedArtwork(null)
  }

  const handleLike = async (artworkId: string) => {
    // TODO: Implement like functionality
    console.log('Like artwork:', artworkId)
  }

  const handleShare = async (artworkId: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this artwork!',
          url: window.location.origin + `/artworks/${artworkId}`
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(window.location.origin + `/artworks/${artworkId}`)
    }
  }

  // Fetch artworks
  useEffect(() => {
    if (user?.id) {
      fetchUserArtworks()
      if (!isOwnProfile) {
        fetchFollowStats()
      }
    }
  }, [user?.id, isOwnProfile])

  const fetchUserArtworks = async () => {
    try {
      setIsLoadingArtworks(true)
      const response = await fetch(`/api/users/${user.id}/artworks`)
      
      if (!response.ok) {
        console.error('Failed to fetch artworks')
        setArtworks([])
        return
      }

      const data = await response.json()
      setArtworks(data.artworks || [])
    } catch (err) {
      console.error('Error fetching artworks:', err)
      setArtworks([])
    } finally {
      setIsLoadingArtworks(false)
    }
  }

  const fetchFollowStats = async () => {
    try {
      setIsLoadingFollow(true)
      const response = await fetch(`/api/users/${user.id}/follow-status`)
      
      if (!response.ok) {
        console.error('Failed to fetch follow stats')
        setFollowStats({
          followers_count: stats.followers,
          following_count: stats.following,
          is_following: false
        })
        return
      }

      const data = await response.json()
      setFollowStats(data)
      // Update stats with follow counts
      setStats(prev => ({
        ...prev,
        followers: data.followers_count || prev.followers,
        following: data.following_count || prev.following
      }))
    } catch (err) {
      console.error('Error fetching follow stats:', err)
      setFollowStats({
        followers_count: stats.followers,
        following_count: stats.following,
        is_following: false
      })
    } finally {
      setIsLoadingFollow(false)
    }
  }

  const handleFollow = async () => {
    if (!user?.id || !followStats) return

    try {
      setIsUpdatingFollow(true)
      
      if (followStats.is_following) {
        // Unfollow
        const response = await fetch(`/api/users/${user.id}/follow`, {
          method: 'DELETE'
        })

        if (response.ok) {
          setFollowStats(prev => prev ? {
            ...prev,
            is_following: false,
            followers_count: prev.followers_count - 1
          } : null)
          setStats(prev => ({
            ...prev,
            followers: prev.followers - 1
          }))
        }
      } else {
        // Follow
        const response = await fetch(`/api/users/${user.id}/follow`, {
          method: 'POST'
        })

        if (response.ok) {
          setFollowStats(prev => prev ? {
            ...prev,
            is_following: true,
            followers_count: prev.followers_count + 1
          } : null)
          setStats(prev => ({
            ...prev,
            followers: prev.followers + 1
          }))
        }
      }
    } catch (err) {
      console.error('Error updating follow status:', err)
    } finally {
      setIsUpdatingFollow(false)
    }
  }

  const handleCommission = () => {
    // Open modal to show commission details and CTA
    setShowCommissionModal(true)
  }

  const handleSendCommissionRequest = () => {
    // Open the commission request form modal
    setShowCommissionModal(false)
    setShowCommissionForm(true)
  }

  const handleTip = () => {
    // Show GCash details if available
    if (gcashDetails && (gcashDetails.number || gcashDetails.name)) {
      const gcashInfo = gcashDetails
      const message = `GCash Details:\nNumber: ${gcashInfo.number || 'Not provided'}\nName: ${gcashInfo.name || 'Not provided'}`
      alert(message)
      // TODO: Implement actual tip payment functionality
    } else {
      toast.error('This user has not set up their GCash details yet.')
    }
  }

  const handleOtherSocials = () => {
    // Show social media links if available
    if (socialLinks && Object.keys(socialLinks).some(key => socialLinks[key])) {
      const socials = socialLinks
      const links = []
      if (socials.facebook) links.push(`Facebook: ${socials.facebook}`)
      if (socials.twitter) links.push(`Twitter/X: ${socials.twitter}`)
      if (socials.instagram) links.push(`Instagram: ${socials.instagram}`)
      if (socials.pinterest) links.push(`Pinterest: ${socials.pinterest}`)
      if (socials.website) links.push(`Website: ${socials.website}`)
      
      if (links.length > 0) {
        // Open links in a modal or new window
        const linksText = links.join('\n')
        const openLinks = window.confirm(`${linksText}\n\nOpen links in new tabs?`)
        if (openLinks) {
          if (socials.facebook) window.open(socials.facebook, '_blank')
          if (socials.twitter) window.open(socials.twitter, '_blank')
          if (socials.instagram) window.open(socials.instagram, '_blank')
          if (socials.pinterest) window.open(socials.pinterest, '_blank')
          if (socials.website) window.open(socials.website, '_blank')
        }
      } else {
        toast('This user has not added any social media links yet.')
      }
    } else {
      toast('This user has not added any social media links yet.')
    }
  }

  const userData = {
    name: `${user.first_name} ${user.last_name}`,
    username: user.username ? `@${user.username}` : '@username',
    bio: user.bio || 'No bio yet',
    profile_image_url: user.profile_image_url,
    location: user.location_address,
    user_type: user.user_type,
  }

  const formatPrice = (price: number | null) => {
    if (!price) return 'Not for sale'
    return `₱${price.toLocaleString()}`
  }

  const renderGalleryTab = () => {
    if (isLoadingArtworks) {
      return (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (artworks.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No artworks yet</h3>
          <p className="text-gray-500">This artist hasn't uploaded any artworks yet.</p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {artworks.map(artwork => (
          <div key={artwork.id} className="bg-white rounded-xl shadow-sm border border-gray-100 lg:shadow-md cursor-pointer" onClick={() => openArtworkModal(artwork)}>
            {/* Artwork Image */}
            {artwork.image_urls && artwork.image_urls.length > 0 && (
              <div className="w-full h-64 lg:h-80 bg-gray-100 overflow-hidden rounded-t-xl">
                <img
                  src={artwork.image_urls[0]}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Artwork Actions */}
            <div className="p-4 lg:p-6">
              <div className="flex items-center space-x-8 mb-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLike(artwork.id)
                  }}
                  className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Heart className="w-6 h-6 lg:w-7 lg:h-7" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <MessageCircle className="w-6 h-6 lg:w-7 lg:h-7" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleShare(artwork.id)
                  }}
                  className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
                >
                  <Share className="w-6 h-6 lg:w-7 lg:h-7" />
                </button>
              </div>

              {/* Artwork Title */}
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3">{artwork.title}</h3>
              
              {/* Artwork Description */}
              {artwork.description && (
                <p className="text-gray-700 mb-4 text-sm lg:text-base leading-relaxed">{artwork.description}</p>
              )}

              {/* Price */}
              {artwork.price && (
                <div className="mb-3">
                  <span className="text-lg font-semibold text-red-500">₱{artwork.price.toLocaleString()}</span>
                  {artwork.is_commission && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Commission Available
                    </span>
                  )}
                </div>
              )}

              {/* Tags */}
              {artwork.tags && artwork.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {artwork.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-xs lg:text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Category */}
              {artwork.category && (
                <div className="text-sm text-gray-500 mb-2">
                  Category: {artwork.category}
                </div>
              )}

              {/* Engagement Stats */}
              <p className="text-sm lg:text-base text-gray-500">
                0 Likes • 0 Comments
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderMerchandiseTab = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <span className="text-gray-400 text-2xl">🛍️</span>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Merchandise Coming Soon</h3>
      <p className="text-gray-500">We're working on bringing merchandise features to this profile.</p>
    </div>
  )

  return (
    <div className="bg-gray-50">
      {/* Main Content */}
      <div className="px-4 pt-2 pb-6 lg:px-8 lg:pt-4 lg:pb-8 lg:ml-64 lg:mr-64 max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex items-start space-x-4">
            {/* Profile Picture */}
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              {userData.profile_image_url ? (
                <img
                  src={userData.profile_image_url}
                  alt={userData.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-gray-600 font-medium text-2xl">
                  {user.first_name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {/* Line 1: Name + Follow button (left), Commission button (right) */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-black">
                    {userData.name}
                    {user.is_verified && (
                      <span className="ml-2 text-red-500" title="Verified">✓</span>
                    )}
                  </h1>
                  {/* For visiting profiles: Follow button */}
                  {!isOwnProfile && (
                    <button
                      onClick={handleFollow}
                      disabled={isUpdatingFollow || !followStats}
                      className={`px-3 py-1 rounded-lg font-semibold text-sm transition-colors flex items-center space-x-1 whitespace-nowrap ${
                        followStats?.is_following
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    >
                      {isUpdatingFollow ? (
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : !followStats ? (
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : followStats.is_following ? (
                        <>
                          <UserCheck className="w-3 h-3" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3 h-3" />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div>
                  {/* For own profile: Edit button */}
                  {isOwnProfile && (
                    <button
                      onClick={() => router.push('/profile/edit')}
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <Edit3 className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                  {/* For visiting profiles: Commission button (far right) */}
                  {!isOwnProfile && (
                    <button
                      onClick={handleCommission}
                      className="px-3 py-1 rounded-lg font-semibold text-sm transition-colors flex items-center space-x-1 whitespace-nowrap bg-blue-500 text-white hover:bg-blue-600"
                    >
                      <Palette className="w-4 h-4" />
                      <span>Commission</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Line 2: Username (left), Tip button (right) */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600">{userData.username}</p>
                {/* Tip button for visiting profiles */}
                {!isOwnProfile && (
                  <button
                    onClick={handleTip}
                    className="px-3 py-1 rounded-lg font-semibold text-sm transition-colors flex items-center space-x-1 whitespace-nowrap bg-green-500 text-white hover:bg-green-600"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Tip</span>
                  </button>
                )}
              </div>

              {/* Line 3: Followers + Following */}
              <div className="flex items-center gap-4 mb-2">
                <div className="text-center">
                  <div className="font-semibold text-black flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {isLoadingFollow && !isOwnProfile ? '...' : stats.followers}
                  </div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-black flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {isLoadingFollow && !isOwnProfile ? '...' : stats.following}
                  </div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
              </div>

              {/* Line 4: Social Links Icons (only show if socialLinks has values) */}
              {!isOwnProfile && socialLinks && Object.keys(socialLinks).some(key => socialLinks[key]) && (
                <div className="flex gap-2 mb-2 justify-end">
                  {socialLinks.facebook && (
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      title="Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition-colors"
                      title="X/Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors"
                      title="Instagram"
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                  {socialLinks.website && (
                    <a
                      href={socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Website"
                    >
                      <Link2 className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}

              {/* Bio */}
              <p className="text-gray-700 text-sm mb-3">{userData.bio}</p>

              {/* Location and User Type */}
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                {userData.location && (
                  <span>{userData.location}</span>
                )}
                <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize">
                  {user.user_type}
                </div>
              </div>

              {/* Action Buttons: Commission, Tip, Other Socials */}
              {/* Removed: now integrated into visitor profile vertical button stack above */}
            </div>
          </div>
        </div>

        {/* Commission details are displayed in the modal for visitors; static section removed */}



        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
          <div className="flex">
            <button
              onClick={() => setSelectedTab(0)}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                selectedTab === 0
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => setSelectedTab(1)}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                selectedTab === 1
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Merchandise
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {selectedTab === 0 ? renderGalleryTab() : renderMerchandiseTab()}
        </div>

        {/* Artwork Detail Modal */}
        <ArtworkDetailModal
          artwork={selectedArtwork ? {
            ...selectedArtwork,
            tags: selectedArtwork.tags || [],
            user: {
              id: user.id,
              username: user.username || '',
              first_name: user.first_name,
              last_name: user.last_name,
              profile_image_url: user.profile_image_url || ''
            }
          } : null}
          isOpen={isModalOpen}
          onClose={closeArtworkModal}
          currentUserId={currentUserId}
          onLike={handleLike}
          onShare={handleShare}
        />

        {/* Commission Details Modal */}
        {showCommissionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
              <button
                onClick={() => setShowCommissionModal(false)}
                className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <div className="flex items-center space-x-3 mb-4">
                <Palette className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Commission Details</h3>
                  <p className="text-sm text-gray-500">Provided by {user.first_name} {user.last_name}</p>
                </div>
                {user.commission_details?.available && (
                  <span className="ml-auto px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                    Accepting
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {user.commission_details?.description || 'No description provided.'}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Starting Price:</span>
                  <span className="text-base font-semibold text-blue-500">
                    {user.commission_details?.price
                      ? `₱${parseFloat(user.commission_details.price).toLocaleString()}`
                      : 'Contact for pricing'}
                  </span>
                </div>

                {!user.commission_details?.available && (
                  <p className="text-sm text-gray-500">Currently not accepting commissions.</p>
                )}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-3 sm:space-y-0">
                <button
                  onClick={() => setShowCommissionModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleSendCommissionRequest}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
                >
                  Send Commission Request
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Commission Request Form Modal (opens after clicking Send Commission Request) */}
        {showCommissionForm && (
          <CommissionRequestForm
            artistId={user.id}
            artistName={`${user.first_name} ${user.last_name}`}
            artistAvatar={user.profile_image_url || undefined}
            onClose={() => setShowCommissionForm(false)}
            onSuccess={() => {
              setShowCommissionForm(false)
              toast.success('Commission request sent')
            }}
          />
        )}
      </div>
    </div>
  )
}
