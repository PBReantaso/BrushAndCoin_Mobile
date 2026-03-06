'use client'

import { useCommissions } from '@/hooks/useCommission'
import { AlertCircle, Clock, DollarSign } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CommissionsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Fetch commissions
  const { data: commissions = [], isLoading, error } = useCommissions(activeTab, statusFilter === 'all' ? undefined : statusFilter)

  const formatCurrency = (amount: number) => {
    return `₱${amount.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-purple-100 text-purple-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'declined':
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCommissionClick = (commissionId: string) => {
    router.push(`/commissions/${commissionId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-1 mb-4">
            <button
              onClick={() => router.push('/messages')}
              className="text-3xl font-bold text-gray-400 hover:text-red-600 transition-colors"
            >
              Messages
            </button>
            <span className="text-3xl font-bold text-gray-400">|</span>
            <button
              onClick={() => router.push('/commissions')}
              className="text-3xl font-bold text-gray-900 hover:text-red-600 transition-colors"
            >
              Commissions
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('received')}
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                activeTab === 'received'
                  ? 'bg-white text-red-600 border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Received
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                activeTab === 'sent'
                  ? 'bg-white text-red-600 border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sent
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex space-x-2 overflow-x-auto">
            {['all', 'pending', 'accepted', 'in_progress', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            <p className="mt-4 text-gray-600">Loading commissions...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">Failed to load commissions</p>
          </div>
        ) : commissions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No commissions found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {commissions.map(commission => (
              <div
                key={commission.id}
                onClick={() => handleCommissionClick(commission.id)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{commission.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{commission.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(commission.status)}`}>
                    {commission.status.charAt(0).toUpperCase() + commission.status.slice(1).replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 font-medium">{formatCurrency(commission.budget)}</span>
                  </div>
                  {commission.deadline && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{formatDate(commission.deadline)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {activeTab === 'received' && commission.clientAvatar ? (
                        <img src={commission.clientAvatar} alt={commission.clientName} className="w-full h-full object-cover" />
                      ) : !activeTab || commission.artistAvatar ? (
                        <img src={commission.artistAvatar} alt={commission.artistName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-medium text-gray-600">
                          {(activeTab === 'received' ? commission.clientName : commission.artistName)[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">
                        {activeTab === 'received' ? commission.clientName : commission.artistName}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {activeTab === 'received' ? 'Client' : 'Artist'}
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs">{formatDate(commission.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
