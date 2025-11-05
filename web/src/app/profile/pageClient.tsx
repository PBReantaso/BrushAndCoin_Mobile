'use client'

import { useUser } from '@/hooks/useUser'
import { Edit3, Image as ImageIcon, UserCheck, UserPlus, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
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
  }
}

export default function ProfileClient({ user: initialUser }: ProfileClientProps) {
  const router = useRouter()
  const { user: authUser, isLoading } = useUser()
  const [selectedTab, setSelectedTab] = useState(0)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [followStats, setFollowStats] = useState<FollowStats | null>(null)
  const [isLoadingArtworks, setIsLoadingArtworks] = useState(false)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [isLoadingFollow, setIsLoadingFollow] = useState(false)
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false)

  // Use the user from props, fallback to auth hook
  const user = initialUser || authUser

  // Check if this is the current user's own profile
  const isOwnProfile = authUser?.id === user?.id

  useEffect(() => {
    if (user?.id) {
      fetchUserArtworks();
      fetchUserStats();
      // Only fetch follow stats if it's not the user's own profile
      if (!isOwnProfile) {
        fetchFollowStats();
      }
    }
  }, [user?.id, isOwnProfile])

  const fetchUserArtworks = async () => {
    try {
      setIsLoadingArtworks(true);
      const response = await fetch(`/api/users/${user?.id}/artworks`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch artworks');
      }

      const data = await response.json();
      setArtworks(data.artworks);
    } catch (err) {
      console.error('Error fetching artworks:', err);
    } finally {
      setIsLoadingArtworks(false);
    }
  }

  const fetchUserStats = async () => {
    try {
      setIsLoadingStats(true);
      const response = await fetch(`/api/users/${user?.id}/stats`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setIsLoadingStats(false);
    }
  }

  const fetchFollowStats = async () => {
    try {
      setIsLoadingFollow(true);
      const response = await fetch(`/api/users/${user?.id}/follow-status`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch follow stats');
      }

      const data = await response.json();
      setFollowStats(data);
    } catch (err) {
      console.error('Error fetching follow stats:', err);
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
          <p className="text-gray-500">Start by uploading your first artwork!</p>
          <button 
            onClick={() => router.push('/artworks/create')}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Upload Artwork
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-3">
        {artworks.map(artwork => (
          <div key={artwork.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
               onClick={() => router.push(`/artworks/${artwork.id}`)}>
            {/* Artwork Image */}
            <div className="relative w-full h-48 bg-gray-100">
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

            {/* Artwork Info */}
            <div className="p-3">
              <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{artwork.title}</h3>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatPrice(artwork.price)}</span>
                <span>{artwork.category}</span>
              </div>
              {artwork.is_commission && (
                <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Commission
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

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
                <div className="text-center">
                  <div className="font-semibold text-black flex items-center">
                    <ImageIcon className="w-4 h-4 mr-1" />
                    {isLoadingStats ? '...' : stats?.artwork_count || 0}
                  </div>
                  <div className="text-sm text-gray-600">Artworks</div>
                </div>
                {/*{stats?.average_rating && stats.average_rating > 0 && (
                  <div className="text-center">
                    <div className="font-semibold text-black flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                      {stats.average_rating.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                )}*/}
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
      </div>
    </div>
  )
}