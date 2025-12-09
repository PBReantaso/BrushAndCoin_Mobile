// src/components/artwork/ArtworkDetailModal.tsx
'use client';

import { Heart, MessageCircle, Send, Share, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  profile_image_url: string | null;
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
  user: User;
  comment_count?: number;
  like_count?: number;
}

interface ArtworkDetailModalProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
  onLike?: (artworkId: string) => void;
  onShare?: (artworkId: string) => void;
  onCommentAdded?: (artworkId: string) => void; // Add this callback
}

export default function ArtworkDetailModal({
  artwork,
  isOpen,
  onClose,
  currentUserId,
  onLike,
  onShare,
  onCommentAdded // Add this prop
}: ArtworkDetailModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    if (isOpen && artwork) {
      loadComments(artwork.id);
      // Initialize comment count from artwork prop
      setCommentCount(artwork.comment_count || 0);
    }
  }, [isOpen, artwork]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const loadComments = async (artworkId: string) => {
    setIsLoadingComments(true);
    try {
      const response = await fetch(`/api/artworks/${artworkId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
        // Update comment count from API response
        if (data.comment_count !== undefined) {
          setCommentCount(data.comment_count);
        }
      } else {
        console.error('Failed to load comments');
        setComments([]);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !artwork || !currentUserId) return;

    setIsSubmittingComment(true);
    try {
      const response = await fetch(`/api/artworks/${artwork.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: newComment.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => [data.comment, ...prev]);
        setNewComment('');
        
        // Update comment count
        setCommentCount(prev => prev + 1);
        
        // Notify parent component about new comment
        if (onCommentAdded) {
          onCommentAdded(artwork.id);
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to add comment:', errorData.error);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleModalLike = () => {
    if (artwork && onLike) {
      onLike(artwork.id);
    }
  };

  const handleModalShare = () => {
    if (artwork && onShare) {
      onShare(artwork.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const formatPrice = (price: number | null) => {
    if (!price) return 'Not for sale';
    return `₱${price.toLocaleString()}`;
  };

  if (!isOpen || !artwork) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/2 bg-black flex items-center justify-center">
          {artwork.image_urls && artwork.image_urls[0] ? (
            <img
              src={artwork.image_urls[0]}
              alt={artwork.title}
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
                {artwork.user.profile_image_url ? (
                  <img
                    src={artwork.user.profile_image_url}
                    alt={artwork.user.first_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-gray-600" />
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {artwork.user.first_name} {artwork.user.last_name}
                </p>
                {artwork.user.username && (
                  <p className="text-gray-500 text-xs">@{artwork.user.username}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
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
                  {artwork.user.profile_image_url ? (
                    <img
                      src={artwork.user.profile_image_url}
                      alt={artwork.user.first_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {artwork.user.first_name} {artwork.user.last_name}
                  </p>
                </div>
              </div>
              
              <h1 className="text-xl font-semibold text-gray-900 mb-2">{artwork.title}</h1>
              
              {artwork.description && (
                <p className="text-gray-700 mb-3">{artwork.description}</p>
              )}

              {/* Price */}
              {artwork.price && (
                <div className="mb-3">
                  <span className="text-lg font-semibold text-red-500">
                    {formatPrice(artwork.price)}
                  </span>
                  {artwork.is_commission && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Commission Available
                    </span>
                  )}
                </div>
              )}

              {/* Tags */}
              {artwork.tags && artwork.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {artwork.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Engagement Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                <span>{artwork.like_count || 0} Likes</span>
                <span>{commentCount} Comments</span>
              </div>

              <p className="text-gray-500 text-xs">
                {formatDate(artwork.created_at)}
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
                onClick={handleModalLike}
                className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
              >
                <Heart className="w-6 h-6" />
                <span className="text-sm">{artwork.like_count || 0}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                <MessageCircle className="w-6 h-6" />
                <span className="text-sm">{commentCount}</span>
              </button>
              <button
                onClick={handleModalShare}
                className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
              >
                <Share className="w-6 h-6" />
              </button>
            </div>

            {/* Add Comment */}
            {currentUserId && (
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isSubmittingComment && handleAddComment()}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  disabled={isSubmittingComment}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}