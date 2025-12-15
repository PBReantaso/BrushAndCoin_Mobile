import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import UserProfileClient from './UserProfileClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  try {
    // Fetch user info (include JSONB fields for gcash and social links)
    const userResult = await query(
      `SELECT 
        id, username, first_name, last_name, email, profile_image_url, 
        bio, user_type, is_verified, location_address, gcash_details, commission_details, social_links, created_at
       FROM users 
       WHERE id = $1 AND is_active = true`,
      [id]
    );

    if (userResult.rows.length === 0) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h1>
            <p className="text-gray-600">The user you're looking for doesn't exist or has been deactivated.</p>
          </div>
        </div>
      );
    }

    const user = userResult.rows[0];
    const isOwnProfile = session.user.id === id;

    // Get user stats
    const [artworksCount, followersCount, followingCount] = await Promise.all([
      query('SELECT COUNT(*) as count FROM artworks WHERE user_id = $1', [id]),
      query('SELECT COUNT(*) as count FROM follows WHERE following_id = $1', [id]),
      query('SELECT COUNT(*) as count FROM follows WHERE follower_id = $1', [id]),
    ]);

    const stats = {
      artworks: parseInt(artworksCount.rows[0].count),
      followers: parseInt(followersCount.rows[0].count),
      following: parseInt(followingCount.rows[0].count),
    };

    return (
      <UserProfileClient 
        user={user} 
        stats={stats}
        isOwnProfile={isOwnProfile}
        currentUserId={session.user.id}
      />
    );
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">Failed to load user profile. Please try again later.</p>
        </div>
      </div>
    );
  }
}

