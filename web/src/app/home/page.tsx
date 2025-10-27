'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Post } from '@/types/post'
import { Palette, AlertCircle, RotateCcw, Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react'

// Mock data - this will be replaced with API calls
const mockPosts: Post[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Maria Santos',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    title: 'Digital Portrait Commission',
    description: 'Just finished this beautiful digital portrait for a client. The attention to detail in the eyes really brings the piece to life!',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    likes: 24,
    comments: 8,
    isLiked: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date().toISOString(),
    tags: ['digital', 'portrait', 'commission'],
    category: 'Digital Art'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'John Cruz',
    userAvatar: 'https://i.pravatar.cc/150?img=2',
    title: 'Watercolor Landscape',
    description: 'Sunset over Manila Bay. There\'s something magical about capturing the golden hour in watercolors.',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    likes: 42,
    comments: 15,
    isLiked: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    updatedAt: new Date().toISOString(),
    tags: ['watercolor', 'landscape', 'manila'],
    category: 'Traditional Art'
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Ana Dela Cruz',
    userAvatar: 'https://i.pravatar.cc/150?img=3',
    title: 'Character Design for Game',
    description: 'Working on character designs for an indie game project. This warrior character has been so fun to develop!',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    likes: 67,
    comments: 23,
    isLiked: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    updatedAt: new Date().toISOString(),
    tags: ['character', 'game', 'concept'],
    category: 'Concept Art'
  }
]

export default function HomePage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock user data - replace with actual user from auth
  const currentUser = {
    id: 'current-user',
    name: 'Current User',
    avatar: 'https://i.pravatar.cc/150?img=10'
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // In real implementation, this would be:
      // const response = await ApiService.getArtworks()
      // setPosts(response.data)
      
      setPosts(mockPosts)
      setFilteredPosts(mockPosts)
    } catch (err) {
      setError('Failed to load posts. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }


  const handleCreatePost = () => {
    router.push('/posts/create')
  }


  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    )
  }

  const handleComment = (postId: string) => {
    router.push(`/posts/${postId}`)
  }

  const handleShare = (postId: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this artwork!',
        url: window.location.origin + `/posts/${postId}`
      })
    } else {
      navigator.clipboard.writeText(window.location.origin + `/posts/${postId}`)
    }
  }

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`)
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={loadPosts}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2 inline" />
            Retry
          </button>
        </div>
      )
    }

    if (filteredPosts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Palette className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No artworks found</h3>
          <p className="text-gray-500 text-center">
            {searchQuery 
              ? 'Try adjusting your search terms'
              : 'Be the first to share your artwork!'
            }
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-6 lg:space-y-8">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 lg:shadow-md">
            {/* Post Header */}
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {post.userAvatar ? (
                      <img
                        src={post.userAvatar}
                        alt={post.userName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-medium text-lg lg:text-xl">
                        {post.userName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-base lg:text-lg">
                      {post.userName}
                    </p>
                    <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreHorizontal className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Post Image */}
            <div className="relative w-full h-80 lg:h-96 bg-gray-100">
              {post.imageUrl ? (
                <img
                  src={post.imageUrl}
                  alt={post.title}
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

            {/* Post Actions */}
            <div className="p-4 lg:p-6">
              <div className="flex items-center space-x-8 mb-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-2 transition-colors ${
                    post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-6 h-6 lg:w-7 lg:h-7 ${post.isLiked ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={() => handleComment(post.id)}
                  className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <MessageCircle className="w-6 h-6 lg:w-7 lg:h-7" />
                </button>
                
                <button
                  onClick={() => handleShare(post.id)}
                  className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
                >
                  <Share className="w-6 h-6 lg:w-7 lg:h-7" />
                </button>
              </div>

              {/* Post Title */}
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3">{post.title}</h3>
              
              {/* Post Description */}
              {post.description && (
                <p className="text-gray-700 mb-4 text-sm lg:text-base leading-relaxed">{post.description}</p>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-xs lg:text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Likes and Comments Count */}
              <p className="text-sm lg:text-base text-gray-500">
                {post.likes} Likes • {post.comments} Comments
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      {/* Main Content */}
      <div className="px-4 pt-2 pb-6 lg:px-8 lg:pt-4 lg:pb-8 lg:ml-64 max-w-4xl mx-auto">
        {/* Create Post Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 lg:mb-6">
          <div className="p-4 lg:p-6">
            <div className="flex items-center space-x-4">
              {/* User Avatar */}
              <div className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-medium text-lg lg:text-xl">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Post Input Field */}
              <div className="flex-1">
                <button
                  onClick={handleCreatePost}
                  className="w-full px-4 py-3 lg:py-4 text-left rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-500 text-sm lg:text-base">Share your artwork...</span>
                </button>
              </div>

              {/* Post Button */}
              <button
                onClick={handleCreatePost}
                className="px-6 py-2 lg:py-3 bg-red-500 text-white rounded-full font-semibold text-sm lg:text-base hover:bg-red-600 transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        {renderContent()}
      </div>
    </div>
  )
}
