'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit3, Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react'

// Mock user data
const mockUser = {
  name: 'Artist Name',
  username: '@artistname',
  followers: 1247,
  following: 89,
  bio: 'Digital artist and illustrator',
  socials: {
    facebook: 'https://facebook.com/artistname',
    twitter: 'https://twitter.com/artistname',
    pinterest: 'https://pinterest.com/artistname',
  },
  userId: 'current_user',
  userAvatar: null,
}

// Mock posts data
const mockPosts = [
  {
    id: '1',
    userId: 'current_user',
    userName: 'Artist Name',
    userAvatar: null,
    title: 'Digital Portrait Commission',
    description: 'Just finished this beautiful digital portrait for a client.',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    likes: 24,
    comments: 8,
    isLiked: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['digital', 'portrait', 'commission'],
    category: 'Digital Art'
  },
  {
    id: '2',
    userId: 'current_user',
    userName: 'Artist Name',
    userAvatar: null,
    title: 'Watercolor Landscape',
    description: 'Sunset over Manila Bay. There\'s something magical about capturing the golden hour.',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    likes: 42,
    comments: 15,
    isLiked: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['watercolor', 'landscape', 'manila'],
    category: 'Traditional Art'
  },
]

// Mock merchandise data
const mockMerchandise = [
  {
    id: 1,
    title: 'Art Print - The Starry Night',
    image: '/placeholder-merch.jpg',
    price: '$25.00',
  },
  {
    id: 2,
    title: 'T-Shirt - Surreal Dreams',
    image: '/placeholder-merch.jpg',
    price: '$35.00',
  },
]

export default function ProfilePage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState(0) // Gallery tab is selected
  const [user, setUser] = useState(mockUser)
  const [posts, setPosts] = useState(mockPosts)
  const [merchandise, setMerchandise] = useState(mockMerchandise)
  const [isOtherUser, setIsOtherUser] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
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


  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
    console.log('Edit profile clicked')
  }

  const renderGalleryTab = () => (
    <div className="grid grid-cols-2 gap-3">
      {posts.map(post => (
        <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Post Image */}
          <div className="relative w-full h-48 bg-gray-100">
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

          {/* Post Info */}
          <div className="p-3">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">{post.title}</h3>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{post.likes} likes</span>
              <span>{post.comments} comments</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderMerchandiseTab = () => (
    <div className="grid grid-cols-2 gap-3">
      {merchandise.map(item => (
        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Merchandise Image */}
          <div className="relative w-full h-48 bg-gray-100">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 text-2xl">🛍️</span>
                </div>
                <p className="text-gray-400 text-sm">No image</p>
              </div>
            </div>
          </div>

          {/* Merchandise Info */}
          <div className="p-3">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
            <p className="text-red-500 font-semibold text-sm">{item.price}</p>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="bg-gray-50">
      {/* Main Content */}
      <div className="px-4 pt-2 pb-6 lg:px-8 lg:pt-4 lg:pb-8 lg:ml-64 max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex items-start space-x-4">
            {/* Profile Picture */}
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
              {user.userAvatar ? (
                <img
                  src={user.userAvatar}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-gray-600 font-medium text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-xl font-bold text-black">{user.name}</h1>
                  <p className="text-gray-600">{user.username}</p>
                </div>
                {!isOtherUser && (
                  <button
                    onClick={handleEditProfile}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Edit3 className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>

              {/* Follow/Following Stats */}
              <div className="flex space-x-4 mb-3">
                <div className="text-center">
                  <div className="font-semibold text-black">{user.followers}</div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-black">{user.following}</div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-700 text-sm mb-3">{user.bio}</p>

              {/* Follow Button (if viewing another user) */}
              {isOtherUser && (
                <button className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors">
                  Follow
                </button>
              )}
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

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-2xl lg:hidden">
        <div className="h-16 px-4 flex items-center justify-around">
          {[
            { icon: Home, label: 'Home', route: '/home' },
            { icon: MapPin, label: 'Events', route: '/events' },
            { icon: MessageIcon, label: 'Messages', route: '/messages' },
            { icon: User, label: 'Profile', route: '/profile' },
          ].map((item, index) => {
            const IconComponent = item.icon
            return (
              <button
                key={item.label}
                onClick={() => {
                  setSelectedIndex(index)
                  router.push(item.route)
                }}
                className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  selectedIndex === index 
                    ? 'text-red-500' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <IconComponent className={`w-6 h-6 ${selectedIndex === index ? 'fill-current' : ''}`} />
                <span className={`text-xs font-medium ${
                  selectedIndex === index ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}