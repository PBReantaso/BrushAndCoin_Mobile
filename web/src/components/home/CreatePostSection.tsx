'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

interface CreatePostSectionProps {
  onCreatePost: () => void
  userAvatar?: string
  userName?: string
}

export default function CreatePostSection({
  onCreatePost,
  userAvatar,
  userName = 'User'
}: CreatePostSectionProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
      <div className="p-4">
        <div className="flex items-center space-x-3">
          {/* User Avatar */}
          <div className="flex-shrink-0 w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-600 font-medium">
                {userName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Post Input Field */}
          <div className="flex-1">
            <button
              onClick={onCreatePost}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`w-full px-4 py-3 text-left rounded-full border transition-all duration-200 ${
                isHovered
                  ? 'border-gray-300 bg-gray-50'
                  : 'border-gray-200 bg-gray-100'
              }`}
            >
              <span className="text-gray-500 text-sm">Share your artwork...</span>
            </button>
          </div>

          {/* Post Button */}
          <button
            onClick={onCreatePost}
            className="px-4 py-2 bg-red-500 text-white rounded-full font-semibold text-sm hover:bg-red-600 transition-colors duration-200"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  )
}
