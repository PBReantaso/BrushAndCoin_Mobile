import { query } from '@/lib/db';
import { Heart, MessageCircle, MoreHorizontal, Share } from 'lucide-react';
import { notFound } from 'next/navigation';

async function getArtwork(id: string) {
  try {
    const result = await query(
      `SELECT 
        a.*,
        u.id as user_id,
        u.username,
        u.first_name,
        u.last_name,
        u.profile_image_url
       FROM artworks a
       JOIN users u ON a.user_id = u.id
       WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const artwork = result.rows[0];

    return {
      id: artwork.id,
      title: artwork.title,
      description: artwork.description,
      image_urls: artwork.image_urls || [],
      category: artwork.category,
      tags: artwork.tags || [],
      price: artwork.price,
      is_commission: artwork.is_commission,
      is_available: artwork.is_available,
      created_at: artwork.created_at,
      updated_at: artwork.updated_at,
      user: {
        id: artwork.user_id,
        username: artwork.username,
        first_name: artwork.first_name,
        last_name: artwork.last_name,
        profile_image_url: artwork.profile_image_url,
      }
    };
  } catch (error) {
    console.error('Error fetching artwork:', error);
    return null;
  }
}

export default async function ArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artwork = await getArtwork(id);

  if (!artwork) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Header */}
          <div className="p-4 lg:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  {artwork.user.profile_image_url ? (
                    <img
                      src={artwork.user.profile_image_url}
                      alt={artwork.user.first_name}
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
                  {artwork.user.username && (
                    <p className="text-sm text-gray-500">@{artwork.user.username}</p>
                  )}
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MoreHorizontal className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative w-full h-96 lg:h-[500px] bg-gray-100">
            {artwork.image_urls && artwork.image_urls[0] ? (
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

          {/* Actions */}
          <div className="p-4 lg:p-6">
            <div className="flex items-center space-x-8 mb-4">
              <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
                <Heart className="w-6 h-6 lg:w-7 lg:h-7" />
              </button>
              
              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                <MessageCircle className="w-6 h-6 lg:w-7 lg:h-7" />
              </button>
              
              <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                <Share className="w-6 h-6 lg:w-7 lg:h-7" />
              </button>
            </div>

            {/* Title and Description */}
            <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-3">{artwork.title}</h1>
            
            {artwork.description && (
              <p className="text-gray-700 mb-4 text-base lg:text-lg leading-relaxed">{artwork.description}</p>
            )}

            {/* Price */}
            {artwork.price && (
              <div className="mb-4">
                <span className="text-2xl font-semibold text-red-500">₱{artwork.price.toLocaleString()}</span>
                {artwork.is_commission && (
                  <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    Commission Available
                  </span>
                )}
              </div>
            )}

            {/* Tags */}
            {artwork.tags && artwork.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {artwork.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Category */}
            {artwork.category && (
              <div className="text-sm text-gray-500 mb-4">
                <strong>Category:</strong> {artwork.category}
              </div>
            )}

            {/* Engagement Stats */}
            <p className="text-sm lg:text-base text-gray-500 mb-4">
              0 Likes • 0 Comments
            </p>

            {/* Date */}
            <p className="text-sm text-gray-500">
              Posted on {new Date(artwork.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-100 p-4 lg:p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Comments (0)</h3>
            
            {/* Add Comment */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <button className="text-red-500 font-semibold hover:text-red-600 transition-colors">
                Post
              </button>
            </div>

            {/* No Comments Message */}
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No comments yet</p>
              <p className="text-gray-400 text-sm">Be the first to comment on this artwork</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}