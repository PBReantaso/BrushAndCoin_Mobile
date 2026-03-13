'use client';

import ArtworkDetailModal from '@/components/artwork/ArtworkDetailModal';
import { ArrowLeft, DollarSign, Edit3, Grid3X3, List, MessageCircle, UserCheck, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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

interface Artist {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  profile_image_url?: string;
  bio?: string;
  user_type: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface FollowStats {
  followers_count: number;
  following_count: number;
  is_following: boolean;
}

interface Props {
  artist: Artist;
  initialArtworks: Artwork[];
  initialPagination: Pagination;
  isOwnProfile: boolean;
  followStats: FollowStats | null;
  currentUserId: string;
}

export default function ArtistGalleryClient({ 
  artist, 
  initialArtworks, 
  initialPagination,
  isOwnProfile,
  followStats,
  currentUserId
}: Props) {
  const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
  const [currentFollowStats, setCurrentFollowStats] = useState<FollowStats | null>(followStats);
  
  // Modal state
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const router = useRouter();

  // Modal functions
  const openArtworkModal = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  };

  const closeArtworkModal = () => {
    setIsModalOpen(false);
    setSelectedArtwork(null);
  };

  const handleLike = async (artworkId: string) => {
    // TODO: Implement like functionality
    console.log('Like artwork:', artworkId);
  };

  const handleShare = async (artworkId: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this artwork!',
          url: window.location.origin + `/artworks/${artworkId}`
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.origin + `/artworks/${artworkId}`);
      // TODO: Show toast notification
    }
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${artist.id}/artworks?page=${newPage}&limit=${pagination.limit}`);
      const data = await response.json();
      
      setArtworks(data.artworks);
      setPagination(data.pagination);
      
      // Update URL without refreshing the page
      const url = new URL(window.location.href);
      url.searchParams.set('page', newPage.toString());
      window.history.pushState({}, '', url.toString());
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!artist.id || !currentFollowStats) return;

    setIsUpdatingFollow(true);
    try {
      if (currentFollowStats.is_following) {
        // Unfollow
        const response = await fetch(`/api/users/${artist.id}/follow`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setCurrentFollowStats(prev => prev ? {
            ...prev,
            is_following: false,
            followers_count: prev.followers_count - 1
          } : null);
        }
      } else {
        // Follow
        const response = await fetch(`/api/users/${artist.id}/follow`, {
          method: 'POST'
        });

        if (response.ok) {
          setCurrentFollowStats(prev => prev ? {
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
  };

  const handleRequestCommission = () => {
    // Navigate to commission request page
    router.push(`/commissions/request?artistId=${artist.id}`);
  };

  const handleSendMessage = () => {
    // Navigate to messaging with this user
    router.push(`/messages?userId=${artist.id}`);
  };

  const handleTipArtist = () => {
    // Navigate to tip page
    router.push(`/tip?artistId=${artist.id}`);
  };

  const formatPrice = (price: number | null) => {
    if (!price) return 'Not for sale';
    return `₱${price.toLocaleString()}`;
  };

  const artistName = `${artist.first_name} ${artist.last_name}`;
  const artistUsername = artist.username ? `@${artist.username}` : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {/* Profile Picture */}
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {artist.profile_image_url ? (
                    <img
                      src={artist.profile_image_url}
                      alt={artistName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-gray-600 font-medium text-2xl">
                      {artist.first_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Artist Info */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{artistName}</h1>
                  {artistUsername && (
                    <p className="text-gray-600 text-lg">{artistUsername}</p>
                  )}
                  {artist.bio && (
                    <p className="text-gray-700 mt-2 max-w-2xl">{artist.bio}</p>
                  )}
                  
                  {/* Follow Stats */}
                  {!isOwnProfile && currentFollowStats && (
                    <div className="flex space-x-6 mt-3">
                      <div className="text-center">
                        <div className="font-semibold text-black">
                          {currentFollowStats.followers_count}
                        </div>
                        <div className="text-sm text-gray-600">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-black">
                          {currentFollowStats.following_count}
                        </div>
                        <div className="text-sm text-gray-600">Following</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                {isOwnProfile ? (
                  // Own Profile Actions
                  <>
                    <Link 
                      href="/profile/edit"
                      className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Link>
                    <button
                      onClick={() => router.push('/commissions')}
                      className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      My Commissions
                    </button>
                  </>
                ) : (
                  // Other User Profile Actions
                  <>
                    <button
                      onClick={handleFollow}
                      disabled={isUpdatingFollow || !currentFollowStats}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                        currentFollowStats?.is_following
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    >
                      {isUpdatingFollow ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : !currentFollowStats ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : currentFollowStats.is_following ? (
                        <>
                          <UserCheck className="w-4 h-4 mr-2" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={handleRequestCommission}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        Commission
                      </button>
                      <button
                        onClick={handleSendMessage}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </button>
                    </div>
                    
                    <button
                      onClick={handleTipArtist}
                      className="flex items-center justify-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                    >
                      💝 Tip Artist
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Toggle and Artwork Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Artworks ({pagination.total})
            </h2>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${
                viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${
                viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Artworks Display */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Artworks Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {artworks.map((artwork) => (
                  <div 
                    key={artwork.id} 
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => openArtworkModal(artwork)}
                  >
                    {artwork.image_urls && artwork.image_urls[0] && (
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={artwork.image_urls[0]}
                          alt={artwork.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{artwork.title}</h3>
                      {artwork.description && (
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {artwork.description}
                        </p>
                      )}
                      {artwork.price && (
                        <p className="text-red-600 font-semibold mb-2">
                          {formatPrice(artwork.price)}
                        </p>
                      )}
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>
    {artwork.comment_count || 0} Comments • {new Date(artwork.created_at).toLocaleDateString()}
  </span>
                        {artwork.is_commission && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Commission
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View
              <div className="space-y-4 mb-8">
                {artworks.map((artwork) => (
                  <div 
                    key={artwork.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => openArtworkModal(artwork)}
                  >
                    <div className="flex">
                      {artwork.image_urls && artwork.image_urls[0] && (
                        <div className="w-32 h-32 flex-shrink-0">
                          <img
                            src={artwork.image_urls[0]}
                            alt={artwork.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4 flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{artwork.title}</h3>
                        {artwork.description && (
                          <p className="text-gray-600 text-sm mb-2">
                            {artwork.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          {artwork.price && (
                            <p className="text-red-600 font-semibold">
                              {formatPrice(artwork.price)}
                            </p>
                          )}
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>
                              {new Date(artwork.created_at).toLocaleDateString()}
                            </span>
                            {artwork.is_commission && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Commission
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Artworks Message */}
            {artworks.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Grid3X3 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No artworks yet</h3>
                <p className="text-gray-500 mb-4">
                  {isOwnProfile 
                    ? "You haven't uploaded any artworks yet." 
                    : "This artist hasn't uploaded any artworks yet."
                  }
                </p>
                {isOwnProfile && (
                  <Link 
                    href="/home"
                    className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Create Your First Artwork
                  </Link>
                )}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || isLoading}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isLoading}
                    className={`w-10 h-10 rounded-md ${
                      pagination.page === pageNum
                        ? 'bg-red-500 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages || isLoading}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Artwork Detail Modal */}
        <ArtworkDetailModal
          artwork={selectedArtwork ? {
            ...selectedArtwork,
            tags: selectedArtwork.tags ?? [],
            user: {
              id: artist.id,
              username: artist.username,
              first_name: artist.first_name,
              last_name: artist.last_name,
              profile_image_url: artist.profile_image_url ?? null
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
  );
}