'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import HomeHeader from '@/components/home/HomeHeader'
import CreatePostSection from '@/components/home/CreatePostSection'
import PostCard from '@/components/home/PostCard'
import { Post } from '@/types/post'
import { ArtTrackOutlined, ErrorOutline, Refresh } from 'lucide-react'

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
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(mockPosts)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Mock user data - replace with actual user from auth
  const currentUser = {
    id: 'current-user',
    name: 'Current User',
    avatar: 'https://i.pravatar.cc/150?img=10'
  }

  useEffect(() => {
    loadPosts()
  }, [])

  useEffect(() => {
    filterPosts(searchQuery)
  }, [searchQuery, posts])

  const loadPosts = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In real implementation, this would be:
      // const response = await ApiService.getArtworks()
      // setPosts(response.data)
      
      setPosts(mockPosts)
    } catch (err) {
      setError('Failed to load posts. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const filterPosts = (query: string) => {
    if (!query.trim()) {
      setFilteredPosts(posts)
      return
    }

    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.description.toLowerCase().includes(query.toLowerCase()) ||
      post.userName.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
      post.category.toLowerCase().includes(query.toLowerCase())
    )
    
    setFilteredPosts(filtered)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCreatePost = () => {
    // Navigate to create post page
    router.push('/posts/create')
  }

  const handleSettings = () => {
    router.push('/settings')
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
    // Navigate to post detail page
    router.push(`/posts/${postId}`)
  }

  const handleShare = (postId: string) => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: 'Check out this artwork!',
        url: window.location.origin + `/posts/${postId}`
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin + `/posts/${postId}`)
    }
  }

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`)
  }

  const renderContent = () => {
    if (isLoading && posts.length === 0) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )
    }

    if (error && posts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <ErrorOutline className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={loadPosts}
            className="btn-primary"
          >
            <Refresh className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      )
    }

    if (filteredPosts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <ArtTrackOutlined className="w-16 h-16 text-gray-400 mb-4" />
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
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onUserClick={handleUserClick}
          />
        ))}
      </div>
    )
  }

  return (
    <MobileLayout currentPage="home">
      {/* Header */}
      <HomeHeader onSearch={handleSearch} onSettings={handleSettings} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4">
          {/* Create Post Section */}
          <CreatePostSection
            onCreatePost={handleCreatePost}
            userAvatar={currentUser.avatar}
            userName={currentUser.name}
          />

          {/* Posts Feed */}
          {renderContent()}
        </div>
      </div>
    </MobileLayout>
  )
}
