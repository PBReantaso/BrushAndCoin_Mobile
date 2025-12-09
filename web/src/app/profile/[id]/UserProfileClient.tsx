'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Edit3, Heart, Image as ImageIcon, MessageCircle, MoreHorizontal, Share, UserCheck, UserPlus, Users, Palette } from 'lucide-react'
import Link from 'next/link'
import ArtworkDetailModal from '@/components/artwork/ArtworkDetailModal'

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
    // Navigate to messages page to start a commission conversation
    // In the future, this could navigate to a commission creation page
    router.push(`/messages?user=${user.id}&type=commission`)
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
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-xl font-bold text-black">
                    {userData.name}
                    {user.is_verified && (
                      <span className="ml-2 text-red-500" title="Verified">✓</span>
                    )}
                  </h1>
                  <p className="text-gray-600">{userData.username}</p>
                </div>
                {isOwnProfile ? (
                  <button
                    onClick={() => router.push('/profile/edit')}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Edit3 className="w-5 h-5 text-gray-600" />
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleFollow}
                      disabled={isUpdatingFollow || !followStats}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
                        followStats?.is_following
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    >
                      {isUpdatingFollow ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : !followStats ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : followStats.is_following ? (
                        <>
                          <UserCheck className="w-4 h-4" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                    {user.user_type === 'artist' && (
                      <button
                        onClick={handleCommission}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center space-x-2"
                      >
                        <Palette className="w-4 h-4" />
                        <span>Commission</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Follow/Following Stats */}
              <div className="flex space-x-4 mb-3">
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

              {/* Bio */}
              <p className="text-gray-700 text-sm mb-3">{userData.bio}</p>

              {/* Location and User Type */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {userData.location && (
                  <span>{userData.location}</span>
                )}
                <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize">
                  {user.user_type}
                </div>
              </div>
            </div>
          </div>
        </div>

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
      </div>
    </div>
  )
}
