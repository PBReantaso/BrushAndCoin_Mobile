'use client'

import {
  AlertCircle,
  ArrowLeft,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Palette,
  RotateCcw,
  Send,
  Share,
  Upload,
  User,
  X
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Artwork {
  id: string;
  title: string;
  description: string | null;
  image_urls: string[];
  category: string | null;
  tags: string[];
  price: number | null;
  is_commission: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    profile_image_url: string | null;
  };
  comment_count?: number;
  like_count?: number;
}

interface Comment {
  id: string;
  user_id: string;
  artwork_id: string;
  comment: string;
  created_at: string;
  user: {
    first_name: string;
    last_name: string;
    profile_image_url: string | null;
    username: string;
  };
}

interface HomeClientProps {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    username?: string;
    user_type: string;
    is_verified: boolean;
    profile_image_url?: string;
  } | null
}

export default function HomeClient({ user }: HomeClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Create post modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [isCommission, setIsCommission] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  // Post detail modal state
  const [selectedPost, setSelectedPost] = useState<Artwork | null>(null)
  const [showPostModal, setShowPostModal] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  // Redirect if user is null (safety net)
  useEffect(() => {
    if (!user) {
      console.log('🚨 HomeClient: User is null, redirecting to login')
      router.push('/auth/login')
      return
    }
  }, [user, router])

  useEffect(() => {
    loadArtworks()
  }, [])

  // Handle post parameter from URL
  useEffect(() => {
    const postId = searchParams.get('post')
    if (postId) {
      const fetchAndShowPost = async () => {
        try {
          const response = await fetch(`/api/artworks/${postId}`)
          if (response.ok) {
            const postData = await response.json()
            setSelectedPost(postData)
            setShowPostModal(true)
            loadComments(postId)
          }
        } catch (error) {
          console.error('Error fetching post:', error)
        }
      }
      fetchAndShowPost()
    }
  }, [searchParams])

  const loadArtworks = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/home/recent-artworks')
      
      if (!response.ok) {
        throw new Error('Failed to load artworks')
      }

      const data = await response.json()
      setArtworks(data.artworks || [])
    } catch (err) {
      setError('Failed to load artworks. Please try again.')
      console.error('Error loading artworks:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadComments = async (artworkId: string) => {
    setIsLoadingComments(true)
    try {
      const response = await fetch(`/api/artworks/${artworkId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      } else {
        console.error('Failed to load comments')
        setComments([])
      }
    } catch (error) {
      console.error('Error loading comments:', error)
      setComments([])
    } finally {
      setIsLoadingComments(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPost || !user) return

    setIsSubmittingComment(true)
    try {
      const response = await fetch(`/api/artworks/${selectedPost.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: newComment.trim() }),
      })

      if (response.ok) {
        const data = await response.json()
        setComments(prev => [data.comment, ...prev])
        setNewComment('')
        
        // Update comment count in artworks list
        setArtworks(prev => prev.map(artwork => 
          artwork.id === selectedPost.id 
            ? { 
                ...artwork, 
                comment_count: (artwork.comment_count || 0) + 1 
              }
            : artwork
        ))
      } else {
        const errorData = await response.json()
        console.error('Failed to add comment:', errorData.error)
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const openPostModal = (artwork: Artwork) => {
    setSelectedPost(artwork)
    setShowPostModal(true)
    loadComments(artwork.id)
    
    // Update URL without page reload
    const url = new URL(window.location.href)
    url.searchParams.set('post', artwork.id)
    window.history.pushState({}, '', url.toString())
  }

  const closePostModal = () => {
    setShowPostModal(false)
    setSelectedPost(null)
    setComments([])
    setNewComment('')
    
    // Remove query parameter from URL without page reload
    const url = new URL(window.location.href)
    url.searchParams.delete('post')
    window.history.replaceState({}, '', url.toString())
  }

  const openCreateModal = () => {
    setIsCreateModalOpen(true)
    resetCreateForm()
  }

  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
    resetCreateForm()
  }

  const resetCreateForm = () => {
    setTitle('')
    setDescription('')
    setTags('')
    setCategory('')
    setPrice('')
    setIsCommission(false)
    setImagePreview(null)
    setUploadedImage(null)
    setCreateError(null)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setCreateError('Please select an image file')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setCreateError('Image must be smaller than 5MB')
        return
      }

      setUploadedImage(file)
      setCreateError(null)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setUploadedImage(null)
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!uploadedImage) return null

    try {
      const formData = new FormData()
      formData.append('file', uploadedImage)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const data = await response.json()
      return data.url
    } catch (error: any) {
      console.error('Image upload error:', error)
      throw new Error(`Image upload failed: ${error.message}`)
    }
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError(null)
    setIsSubmitting(true)

    try {
      let imageUrl = null
      if (uploadedImage) {
        imageUrl = await uploadImage()
      }
      
      const artworkData = {
        title: title.trim(),
        description: description.trim(),
        category,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        image_urls: imageUrl ? [imageUrl] : [],
        price: price ? parseFloat(price) : null,
        is_commission: isCommission
      }

      console.log('Creating artwork with data:', artworkData)

      const response = await fetch('/api/artworks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artworkData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create artwork')
      }

      const data = await response.json()
      console.log('Artwork created successfully:', data)
      
      const newArtwork = {
        ...data.artwork,
        user: {
          id: user!.id,
          username: user!.username,
          first_name: user!.first_name,
          last_name: user!.last_name,
          profile_image_url: user!.profile_image_url
        },
        comment_count: 0,
        like_count: 0
      }
      
      setArtworks(prev => [newArtwork, ...prev])
      closeCreateModal()
      
    } catch (error: any) {
      console.error('Error creating post:', error)
      setCreateError(error.message || 'Failed to create artwork. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLike = async (artworkId: string) => {
    console.log('Like artwork:', artworkId)
  }

  const handleComment = (artworkId: string) => {
    const artwork = artworks.find(a => a.id === artworkId)
    if (artwork) {
      openPostModal(artwork)
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
    }
  }

  const handleUserClick = (userId: string) => {
    router.push(`/profile/artworks/${userId}`)
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

  const isFormValid = title.trim() && 
                     description.trim() && 
                     category && 
                     imagePreview

  // Post Detail Modal Component
  const PostDetailModal = () => {
    if (!selectedPost) return null

    const handleLike = async () => {
      console.log('Like post:', selectedPost.id)
    }

    const handleShare = async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: selectedPost.title,
            text: selectedPost.description || '',
            url: window.location.origin + `/home?post=${selectedPost.id}`,
          })
        } catch (error) {
          console.log('Share cancelled')
        }
      } else {
        navigator.clipboard.writeText(window.location.origin + `/home?post=${selectedPost.id}`)
      }
    }

    const formatPrice = (price: number | null) => {
      if (!price) return 'Not for sale'
      return `₱${price.toLocaleString()}`
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2 bg-black flex items-center justify-center">
            {selectedPost.image_urls && selectedPost.image_urls[0] ? (
              <img
                src={selectedPost.image_urls[0]}
                alt={selectedPost.title}
                className="w-full h-full object-contain max-h-[70vh]"
              />
            ) : (
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 text-2xl">🖼️</span>
                </div>
                <p className="text-gray-400">No image available</p>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="md:w-1/2 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {selectedPost.user.profile_image_url ? (
                    <img
                      src={selectedPost.user.profile_image_url}
                      alt={selectedPost.user.first_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {selectedPost.user.first_name} {selectedPost.user.last_name}
                  </p>
                  {selectedPost.user.username && (
                    <p className="text-gray-500 text-xs">@{selectedPost.user.username}</p>
                  )}
                </div>
              </div>
              <button
                onClick={closePostModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments Section */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Post Content */}
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    {selectedPost.user.profile_image_url ? (
                      <img
                        src={selectedPost.user.profile_image_url}
                        alt={selectedPost.user.first_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {selectedPost.user.first_name} {selectedPost.user.last_name}
                    </p>
                  </div>
                </div>
                
                <h1 className="text-xl font-semibold text-gray-900 mb-2">{selectedPost.title}</h1>
                
                {selectedPost.description && (
                  <p className="text-gray-700 mb-3">{selectedPost.description}</p>
                )}

                {/* Price */}
                {selectedPost.price && (
                  <div className="mb-3">
                    <span className="text-lg font-semibold text-red-500">
                      {formatPrice(selectedPost.price)}
                    </span>
                    {selectedPost.is_commission && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Commission Available
                      </span>
                    )}
                  </div>
                )}

                {/* Tags */}
                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {selectedPost.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-gray-500 text-xs">
                  {formatDate(selectedPost.created_at)}
                </p>
              </div>

              {/* Comments List */}
              {isLoadingComments ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mx-auto"></div>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No comments yet</p>
                  <p className="text-gray-400 text-sm">Be the first to comment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map(comment => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                        {comment.user.profile_image_url ? (
                          <img
                            src={comment.user.profile_image_url}
                            alt={comment.user.first_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="font-semibold text-sm">
                            {comment.user.first_name} {comment.user.last_name}
                            {comment.user.username && (
                              <span className="text-gray-500 text-xs ml-2">
                                @{comment.user.username}
                              </span>
                            )}
                          </p>
                          <p className="text-gray-700 text-sm mt-1">{comment.comment}</p>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">
                          {formatDate(comment.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions and Add Comment */}
            <div className="border-t p-4 space-y-3">
              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Heart className="w-6 h-6" />
                </button>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                  <MessageCircle className="w-6 h-6" />
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
                >
                  <Share className="w-6 h-6" />
                </button>
              </div>

              {/* Add Comment */}
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isSubmittingComment && handleAddComment()}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  disabled={isSubmittingComment}
                  autoFocus
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isSubmittingComment}
                  className="text-red-500 hover:text-red-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmittingComment ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
            onClick={loadArtworks}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2 inline" />
            Retry
          </button>
        </div>
      )
    }

    if (artworks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Palette className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No artworks found</h3>
          <p className="text-gray-500 text-center">
            Be the first to share your artwork!
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Create First Artwork
          </button>
        </div>
      )
    }

    return (
      <div className="space-y-6 lg:space-y-8">
        {artworks.map(artwork => (
          <div key={artwork.id} className="bg-white rounded-xl shadow-sm border border-gray-100 lg:shadow-md">
            {/* Post Header */}
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center space-x-4 cursor-pointer"
                  onClick={() => handleUserClick(artwork.user.id)}
                >
                  <div className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {artwork.user.profile_image_url ? (
                      <img
                        src={artwork.user.profile_image_url}
                        alt={artwork.user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-medium text-lg lg:text-xl">
                        {artwork.user.first_name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-base lg:text-lg">
                      {artwork.user.first_name} {artwork.user.last_name}
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

            {/* Post Actions */}
            <div className="p-4 lg:p-6">
              <div className="flex items-center space-x-8 mb-4">
                <button
                  onClick={() => handleLike(artwork.id)}
                  className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Heart className="w-6 h-6 lg:w-7 lg:h-7" />
                </button>
                
                <button
                  onClick={() => handleComment(artwork.id)}
                  className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <MessageCircle className="w-6 h-6 lg:w-7 lg:h-7" />
                </button>
                
                <button
                  onClick={() => handleShare(artwork.id)}
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
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    )
  }

  const currentUser = {
    id: user.id,
    name: `${user.first_name} ${user.last_name}`,
    avatar: user.profile_image_url || `https://i.pravatar.cc/150?u=${user.email}`,
    username: user.username,
    email: user.email
  }

  return (
    <div className="bg-gray-50">
      {/* Main Content */}
      <div className="px-4 pt-2 pb-6 lg:px-8 lg:pt-4 lg:pb-8 lg:ml-64 lg:mr-64 max-w-6xl mx-auto">
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
                  onClick={openCreateModal}
                  className="w-full px-4 py-3 lg:py-4 text-left rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-500 text-sm lg:text-base">Share your artwork...</span>
                </button>
              </div>

              {/* Post Button */}
              <button
                onClick={openCreateModal}
                className="px-6 py-2 lg:py-3 bg-red-500 text-white rounded-full font-semibold text-sm lg:text-base hover:bg-red-600 transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        </div>

        {/* Artworks Feed */}
        {renderContent()}

        {/* Post Detail Modal */}
        {showPostModal && <PostDetailModal />}
      </div>

      {/* Create Post Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={closeCreateModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                  </button>
                  <h1 className="text-lg font-semibold text-gray-900">Create Post</h1>
                </div>
                <button
                  onClick={closeCreateModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={isSubmitting}
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {createError && (
              <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{createError}</p>
              </div>
            )}

            {/* Modal Content */}
            <div className="p-6">
              <form onSubmit={handleCreateSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Upload Artwork</h3>
                  </div>
                  <div>
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          disabled={isSubmitting}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isSubmitting}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Title</h3>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give your artwork a title..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Description</h3>
                  </div>
                  <div>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell us about your artwork..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Category</h3>
                  </div>
                  <div>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select a category</option>
                      <option value="Digital Art">Digital Art</option>
                      <option value="Traditional Art">Traditional Art</option>
                      <option value="Concept Art">Concept Art</option>
                      <option value="Illustration">Illustration</option>
                      <option value="Photography">Photography</option>
                      <option value="Sculpture">Sculpture</option>
                      <option value="Mixed Media">Mixed Media</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Price and Commission */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Price (Optional)</h3>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Commission */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Commission</h3>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isCommission"
                        checked={isCommission}
                        onChange={(e) => setIsCommission(e.target.checked)}
                        className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                        disabled={isSubmitting}
                      />
                      <label htmlFor="isCommission" className="ml-2 text-sm text-gray-700">
                        This artwork is available for commissions
                      </label>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Tags</h3>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Enter tags separated by commas (e.g., portrait, digital, commission)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Tags help others discover your artwork
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={closeCreateModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Artwork'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}