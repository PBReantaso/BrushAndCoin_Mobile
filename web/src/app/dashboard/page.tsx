import DashboardLayout from '@/components/layout/DashboardLayout';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

async function getDashboardStats(userId: string) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/dashboard/stats`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      activeCommissions: 0,
      totalEarnings: 0,
      artworkPortfolio: 0
    };
  }
}

async function getRecentActivity(userId: string) {
  try {
    // This would be a real API call to get recent activity
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}

export default async function DashboardPage() {
  const user = await auth()
  
  if (!user) {
    redirect('/auth/login')
  }

  const stats = await getDashboardStats(user.id);
  const recentActivity = await getRecentActivity(user.id);

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.first_name} {user.last_name}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your creative projects.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Active Commissions */}
          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Commissions</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.activeCommissions}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="p-2 bg-success-100 rounded-lg">
                  <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-semibold text-gray-900">₱{stats.totalEarnings.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Artwork Portfolio */}
          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="p-2 bg-warning-100 rounded-lg">
                  <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Artwork Portfolio</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.artworkPortfolio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity - Will be populated when we have real data */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="card-content">
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {/* Real activity will be mapped here */}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}