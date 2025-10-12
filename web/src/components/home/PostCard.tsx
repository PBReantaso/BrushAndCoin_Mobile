'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Post } from '@/types/post'
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react'

interface PostCardProps {
  post: Post
  onLike: (postId: string) => void
  onComment: (postId: string) => void
  onShare: (postId: string) => void
  onUserClick: (userId: string) => void
}

export default function PostCard({
  post,
  onLike,
  onComment,
  onShare,
  onUserClick
}: PostCardProps) {
  const [imageError, setImageError] = useState(false)

  const handleLike = () => {
    onLike(post.id)
  }

  const handleComment = () => {
    onComment(post.id)
  }

  const handleShare = () => {
    onShare(post.id)
  }

  const handleUserClick = () => {
    onUserClick(post.userId)
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
      {/* Post Header */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleUserClick}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden"
            >
              {post.userAvatar && !imageError ? (
                <Image
                  src={post.userAvatar}
                  alt={post.userName}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span className="text-gray-600 font-medium">
                  {post.userName.charAt(0).toUpperCase()}
                </span>
              )}
            </button>
            <div>
              <button
                onClick={handleUserClick}
                className="font-semibold text-gray-900 hover:text-red-500 transition-colors text-base"
              >
                {post.userName}
              </button>
              <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-3 pb-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
        <p className="text-gray-700 mb-3 text-sm">{post.description}</p>

        {/* Post Image */}
        {post.imageUrl && !imageError && (
          <div className="relative w-full h-64 mb-3 rounded-lg overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors ${
                post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{post.likes}</span>
            </button>
            
            <button
              onClick={handleComment}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.comments}</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
            >
              <Share className="w-5 h-5" />
            </button>
          </div>
          
          <div className="text-xs text-gray-500">
            {post.category}
          </div>
        </div>
      </div>
    </div>
  )
}
