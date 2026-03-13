import { authOptions } from '@/lib/auth-options';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import ArtistGalleryClient from './ArtistGalleryClient';

interface PageProps {
  params: { id: string };
  searchParams: { page?: string };
}

export default async function ArtistGalleryPage({ params, searchParams }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  const page = parseInt(searchParams.page || '1');
  const limit = 12;
  const offset = (page - 1) * limit;
  
  try {
    // Fetch artist info
    const artistResult = await query(
      'SELECT id, username, first_name, last_name, profile_image_url, bio, user_type FROM users WHERE id = $1',
      [params.id]
    );

    if (artistResult.rows.length === 0) {
      return <div className="container mx-auto px-4 py-8">Artist not found</div>;
    }

    const artist = artistResult.rows[0];
    const isOwnProfile = session.user.id === params.id;

    // Fetch paginated artworks directly from database (server-side)
    const artworksResult = await query(
      `SELECT 
        id, title, description, image_urls, category, tags, price,
        is_commission, is_available, created_at, updated_at
       FROM artworks 
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [params.id, limit, offset]
    );

    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) FROM artworks WHERE user_id = $1',
      [params.id]
    );
    const total = parseInt(countResult.rows[0].count);

    const artworks = artworksResult.rows.map(artwork => ({
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
      updated_at: artwork.updated_at
    }));

    // Fetch follow stats if viewing another user's profile
    let followStats = null;
    if (!isOwnProfile) {
      const followResult = await query(
        `SELECT 
          (SELECT COUNT(*) FROM follows WHERE following_id = $1) as followers_count,
          (SELECT COUNT(*) FROM follows WHERE follower_id = $1) as following_count,
          EXISTS(SELECT 1 FROM follows WHERE follower_id = $2 AND following_id = $1) as is_following`,
        [params.id, session.user.id]
      );
      followStats = followResult.rows[0];
    }

    return (
      <ArtistGalleryClient
        artist={artist}
        initialArtworks={artworks}
        initialPagination={{
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }}
        isOwnProfile={isOwnProfile}
        followStats={followStats}
        currentUserId={session.user.id}
      />
    );
  } catch (error) {
    console.error('Error loading artist gallery:', error);
    return <div className="container mx-auto px-4 py-8">Error loading gallery</div>;
  }
}