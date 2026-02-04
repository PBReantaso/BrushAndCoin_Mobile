'use client'

import ArtworkDetailModal from '@/components/artwork/ArtworkDetailModal'
import { useUser } from '@/hooks/useUser'
import { Edit3, Heart, Image as ImageIcon, MessageCircle, MoreHorizontal, Share, UserCheck, UserPlus, Users } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

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
  like_count?: number;
  comment_count?: number;
  created_at: string;
  updated_at: string;
}

interface UserStats {
  artwork_count: number;
  total_commissions: number;
  completed_commissions: number;
  average_rating: number;
  total_reviews: number;
}

interface FollowStats {
  followers_count: number;
  following_count: number;
  is_following: boolean;
  is_own_profile: boolean;
}

interface ProfileClientProps {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    username?: string;
    user_type: string;
    is_verified: boolean;
    profile_image_url?: string;
    bio?: string;
    location_address?: string;
    commission_details?: any;
    gcash_details?: any;
    social_links?: any;
  }
}

export default function ProfileClient({ user: initialUser }: ProfileClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user: authUser, isLoading } = useUser()
  const [selectedTab, setSelectedTab] = useState(0)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [followStats, setFollowStats] = useState<FollowStats | null>(null)
  const [isLoadingArtworks, setIsLoadingArtworks] = useState(false)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [isLoadingFollow, setIsLoadingFollow] = useState(false)
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false)
  const [user, setUser] = useState(initialUser || authUser)
  const [isLoadingUser, setIsLoadingUser] = useState(false)
  
  // Commission Modal state
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false)
  const [commissionForm, setCommissionForm] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: ''
  })
  const [isSubmittingCommission, setIsSubmittingCommission] = useState(false)
  
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
    try {
      const response = await fetch(`/api/artworks/${artworkId}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        // Refetch artworks to get updated like counts
        fetchUserArtworks();
      }
    } catch (error) {
      console.error('Error liking artwork:', error);
    }
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
      // TODO: Show toast notification
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  // Check if this is the current user's own profile
  const isOwnProfile = authUser?.id === user?.id

  // Fetch fresh user data from API
  const fetchUserData = async () => {
    if (!isOwnProfile) return // Only fetch for own profile
    
    setIsLoadingUser(true)
    try {
      const response = await fetch('/api/users/profile')
      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setIsLoadingUser(false)
    }
  }

  // Load user data on mount and when returning from edit
  useEffect(() => {
    // Initialize user from props or auth
    if (!user && (initialUser || authUser)) {
      setUser(initialUser || authUser)
    }
    
    // Fetch fresh data if this is own profile
    if (isOwnProfile && user?.id) {
      fetchUserData()
    }
  }, [initialUser?.id, authUser?.id])

  // Refresh data when returning from edit page
  useEffect(() => {
    const updated = searchParams.get('updated')
    if (updated === 'true' && isOwnProfile && user?.id) {
      // Remove the query parameter
      router.replace('/profile', { scroll: false })
      // Fetch fresh data
      fetchUserData()
      fetchUserArtworks()
      fetchUserStats()
    }
  }, [searchParams, isOwnProfile, user?.id])

  // Reload data when page becomes visible (e.g., returning from edit)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isOwnProfile && user?.id) {
        fetchUserData()
        fetchUserArtworks()
        fetchUserStats()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isOwnProfile, user?.id])

  useEffect(() => {
    if (user?.id) {
      fetchUserArtworks();
      fetchUserStats();
      // Fetch follow stats for both own profile and others (to show counts)
      fetchFollowStats();
    }
  }, [user?.id, isOwnProfile])

  const fetchUserArtworks = async () => {
    try {
      setIsLoadingArtworks(true);
      const response = await fetch(`/api/users/${user?.id}/artworks`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch artworks:', errorData.error || 'Unknown error');
        // Set empty array instead of throwing
        setArtworks([]);
        return;
      }

      const data = await response.json();
      setArtworks(data.artworks || []);
    } catch (err) {
      console.error('Error fetching artworks:', err);
      // Set empty array on error so page still loads
      setArtworks([]);
    } finally {
      setIsLoadingArtworks(false);
    }
  }

  const fetchUserStats = async () => {
    try {
      setIsLoadingStats(true);
      const response = await fetch(`/api/users/${user?.id}/stats`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch stats:', errorData.error || 'Unknown error');
        // Set default stats instead of throwing
        setStats({
          artwork_count: 0,
          total_commissions: 0,
          completed_commissions: 0,
          average_rating: 0,
          total_reviews: 0
        });
        return;
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Set default stats on error so page still loads
      setStats({
        artwork_count: 0,
        total_commissions: 0,
        completed_commissions: 0,
        average_rating: 0,
        total_reviews: 0
      });
    } finally {
      setIsLoadingStats(false);
    }
  }

  const fetchFollowStats = async () => {
    try {
      setIsLoadingFollow(true);
      const response = await fetch(`/api/users/${user?.id}/follow-status`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch follow stats:', errorData.error || 'Unknown error');
        // Set default follow stats instead of throwing
        setFollowStats({
          followers_count: 0,
          following_count: 0,
          is_following: false,
          is_own_profile: false
        });
        return;
      }

      const data = await response.json();
      setFollowStats(data);
    } catch (err) {
      console.error('Error fetching follow stats:', err);
      // Set default follow stats on error so page still loads
      setFollowStats({
        followers_count: 0,
        following_count: 0,
        is_following: false,
        is_own_profile: false
      });
    } finally {
      setIsLoadingFollow(false);
    }
  }

  const handleFollow = async () => {
    if (!user?.id || !followStats) return;

    try {
      setIsUpdatingFollow(true);
      
      if (followStats.is_following) {
        // Unfollow
        const response = await fetch(`/api/users/${user.id}/follow`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setFollowStats(prev => prev ? {
            ...prev,
            is_following: false,
            followers_count: prev.followers_count - 1
          } : null);
        }
      } else {
        // Follow
        const response = await fetch(`/api/users/${user.id}/follow`, {
          method: 'POST'
        });

        if (response.ok) {
          setFollowStats(prev => prev ? {
            ...prev,
            is_following: true,
            followers_count: prev.followers_count + 1
          } : null);
        }
      }
    } catch (err) {
      console.error('Error updating follow status:', err);
    } finally {
      setIsUpdatingFollow(false);
    }
  }

  const handleSubmitCommission = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !commissionForm.title || !commissionForm.description || !commissionForm.budget) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setIsSubmittingCommission(true)
      const response = await fetch('/api/commissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artist_id: user.id,
          title: commissionForm.title,
          description: commissionForm.description,
          budget: parseFloat(commissionForm.budget),
          deadline: commissionForm.deadline || null,
        }),
      })

      if (response.ok) {
        // Reset form and close modal
        setCommissionForm({ title: '', description: '', budget: '', deadline: '' })
        setIsCommissionModalOpen(false)
        alert('Commission request sent successfully!')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to submit commission request'}`)
      }
    } catch (err) {
      console.error('Error submitting commission:', err)
      alert('Failed to submit commission request')
    } finally {
      setIsSubmittingCommission(false)
    }
  }

  // Show loading state
  if (isLoading || !user) {
    return (
      <div className="bg-gray-50">
        <div className="px-4 pt-2 pb-6 lg:px-8 lg:pt-4 lg:pb-8 lg:ml-64 lg:mr-64 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-300 rounded animate-pulse w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Use actual user data
  const userData = {
    name: `${user.first_name} ${user.last_name}`,
    username: user.username ? `@${user.username}` : '@username',
    bio: user.bio || 'No bio yet',
    profile_image_url: user.profile_image_url,
    location: user.location_address,
    user_type: user.user_type,
  }

  const formatPrice = (price: number | null) => {
    if (!price) return 'Not for sale';
    return `₱${price.toLocaleString()}`;
  }

  const handleEditProfile = () => {
    router.push('/profile/edit')
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
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No artworks yet</h3>
        <p className="text-gray-500 mb-4">Start by uploading your first artwork!</p>
        <button 
          onClick={() => router.push('/home')}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Create Artwork
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {artworks.map(artwork => (
        <div key={artwork.id} className="bg-white rounded-xl shadow-sm border border-gray-100 lg:shadow-md cursor-pointer" onClick={() => openArtworkModal(artwork)}>
          {/* Artwork Header */}
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  {userData.profile_image_url ? (
                    <img
                      src={userData.profile_image_url}
                      alt={userData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 font-medium text-lg lg:text-xl">
                      {user.first_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-base lg:text-lg">
                    {userData.name}
                  </p>
                  <p className="text-sm text-gray-500">{formatDate(artwork.created_at)}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MoreHorizontal className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Artwork Image */}
          <div className="relative w-full h-80 lg:h-96 bg-gray-100">
            {artwork.image_urls && artwork.image_urls.length > 0 ? (
              <img
                src={artwork.image_urls[0]}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-2xl">🖼️</span>
                  </div>
                  <p className="text-gray-400 text-sm">No image</p>
                </div>
              </div>
            )}
          </div>

          {/* Artwork Actions */}
          <div className="p-4 lg:p-6">
            <div className="flex items-center space-x-8 mb-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(artwork.id);
                }}
                className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
              >
                <Heart className="w-6 h-6 lg:w-7 lg:h-7" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // The comment functionality is handled in the modal
                }}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
              >
                <MessageCircle className="w-6 h-6 lg:w-7 lg:h-7" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(artwork.id);
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
              {artwork.like_count || 0} Likes • {artwork.comment_count || 0} Comments
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

  const renderMerchandiseTab = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <span className="text-gray-400 text-2xl">🛍️</span>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Merchandise Coming Soon</h3>
      <p className="text-gray-500">We're working on bringing merchandise features to your profile.</p>
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
                  <h1 className="text-xl font-bold text-black">{userData.name}</h1>
                  <p className="text-gray-600">{userData.username}</p>
                </div>
                {isOwnProfile ? (
                  <button
                    onClick={handleEditProfile}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Edit3 className="w-5 h-5 text-gray-600" />
                  </button>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => setIsCommissionModalOpen(true)}
                      className="px-4 py-2 rounded-lg font-semibold transition-colors bg-red-500 text-white hover:bg-red-600"
                    >
                      Commission
                    </button>
                    <button
                      onClick={handleFollow}
                      disabled={isUpdatingFollow || !followStats}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                        followStats?.is_following
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
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
                  </div>
                )}
              </div>

              {/* Follow/Following Stats */}
              <div className="flex space-x-4 mb-3">
                <div className="text-center">
                  <div className="font-semibold text-black flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {isLoadingFollow && !isOwnProfile ? '...' : followStats?.followers_count || 0}
                  </div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-black flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {isLoadingFollow && !isOwnProfile ? '...' : followStats?.following_count || 0}
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

        {/* Commission Modal */}
        {isCommissionModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full shadow-lg max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                <h2 className="text-xl font-bold text-gray-900">Request Commission</h2>
                <button
                  onClick={() => setIsCommissionModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Commission Details Info Section */}
              <div className="px-6 pt-6 pb-4 border-b border-gray-200 bg-blue-50">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Commission Details</h3>
                <p className="text-xs text-gray-500 mb-3">Provided by {user?.first_name} {user?.last_name}</p>
                
                {user?.commission_details?.available && (
                  <div className="mb-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                      Accepting Commissions
                    </span>
                  </div>
                )}
                
                {user?.commission_details?.description ? (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-600 mb-1">Description</p>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">
                      {user.commission_details.description}
                    </p>
                  </div>
                ) : (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-600 mb-1">Description</p>
                    <p className="text-gray-500 text-sm">No description provided.</p>
                  </div>
                )}
                
                {user?.commission_details?.price ? (
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-sm font-medium text-gray-600">Starting Price:</span>
                    <span className="text-lg font-semibold text-blue-500">
                      ₱{parseFloat(user.commission_details.price).toLocaleString()}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-sm font-medium text-gray-600">Starting Price:</span>
                    <span className="text-sm text-blue-500 font-medium">Contact for pricing</span>
                  </div>
                )}
                
                {user?.commission_details && !user.commission_details.available && (
                  <p className="text-sm text-gray-500">Currently not accepting commissions.</p>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitCommission} className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Custom Character Design"
                    value={commissionForm.title}
                    onChange={(e) => setCommissionForm({ ...commissionForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    placeholder="Describe your commission request in detail..."
                    value={commissionForm.description}
                    onChange={(e) => setCommissionForm({ ...commissionForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    rows={4}
                    required
                  />
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget (₱) *
                  </label>
                  <input
                    type="number"
                    placeholder="Enter your budget"
                    value={commissionForm.budget}
                    onChange={(e) => setCommissionForm({ ...commissionForm, budget: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={commissionForm.deadline}
                    onChange={(e) => setCommissionForm({ ...commissionForm, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCommissionModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingCommission}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmittingCommission ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Send Request</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Artwork Detail Modal */}
        <ArtworkDetailModal
          artwork={selectedArtwork ? {
            ...selectedArtwork,
            tags: selectedArtwork.tags ?? [],
            user: {
              id: user.id,
              username: user.username || '',
              first_name: user.first_name,
              last_name: user.last_name,
              profile_image_url: user.profile_image_url ?? null
            }
          } : null}
          isOpen={isModalOpen}
          onClose={closeArtworkModal}
          currentUserId={authUser?.id}
          onLike={handleLike}
          onShare={handleShare}
        />
      </div>
    </div>
  )
}