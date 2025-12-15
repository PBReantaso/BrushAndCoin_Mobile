'use client'

import { useAcceptCommission, useCancelCommission, useCommission, useCompleteCommission, useDeclineCommission } from '@/hooks/useCommission'
import { AlertCircle, ArrowLeft, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CommissionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const commissionId = params.id

  const { data: commission, isLoading, error } = useCommission(commissionId)
  const acceptMutation = useAcceptCommission()
  const declineMutation = useDeclineCommission()
  const completeMutation = useCompleteCommission()
  const cancelMutation = useCancelCommission()

  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false)
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false)
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (error || !commission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg">Failed to load commission</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => `₱${amount.toFixed(2)}`
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-purple-100 text-purple-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAccept = async () => {
    try {
      await acceptMutation.mutateAsync(commissionId)
      setShowAcceptConfirm(false)
    } catch (err) {
      console.error('Accept failed:', err)
    }
  }

  const handleDecline = async () => {
    try {
      await declineMutation.mutateAsync(commissionId)
      setShowDeclineConfirm(false)
    } catch (err) {
      console.error('Decline failed:', err)
    }
  }

  const handleComplete = async () => {
    try {
      await completeMutation.mutateAsync(commissionId)
      setShowCompleteConfirm(false)
    } catch (err) {
      console.error('Complete failed:', err)
    }
  }

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync(commissionId)
      setShowCancelConfirm(false)
      router.push('/commissions')
    } catch (err) {
      console.error('Cancel failed:', err)
    }
  }

  const isArtist = commission.artistId === 'current_user' // This should be compared with actual session user
  const isClient = commission.clientId === 'current_user'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{commission.title}</h1>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(commission.status)}`}>
              {commission.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Commission Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{commission.description}</p>
            </div>

            {/* Requirements */}
            {commission.requirements && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{commission.requirements}</p>
              </div>
            )}

            {/* Party Info */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Commission Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Client</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {commission.clientAvatar ? (
                        <img src={commission.clientAvatar} alt={commission.clientName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-medium text-gray-600">{commission.clientName[0]}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{commission.clientName}</p>
                      <p className="text-xs text-gray-500">Client</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">Artist</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {commission.artistAvatar ? (
                        <img src={commission.artistAvatar} alt={commission.artistName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-medium text-gray-600">{commission.artistName[0]}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{commission.artistName}</p>
                      <p className="text-xs text-gray-500">Artist</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget</span>
                  <span className="font-medium text-gray-900">{formatCurrency(commission.budget)}</span>
                </div>
                {commission.isUrgent && (
                  <div className="flex justify-between text-yellow-600">
                    <span>Urgent Fee (20%)</span>
                    <span className="font-medium">{formatCurrency(commission.budget * 0.2)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-red-600">{formatCurrency(commission.budget + (commission.isUrgent ? commission.budget * 0.2 : 0))}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Created</p>
                  <p className="font-medium text-gray-900">{formatDate(commission.createdAt)}</p>
                </div>
                {commission.deadline && (
                  <div>
                    <p className="text-gray-600">Deadline</p>
                    <p className="font-medium text-gray-900">{formatDate(commission.deadline)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg p-6 space-y-3">
              {commission.status === 'pending' && isArtist && (
                <>
                  <button
                    onClick={() => setShowAcceptConfirm(true)}
                    disabled={acceptMutation.isPending}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors font-medium"
                  >
                    {acceptMutation.isPending ? 'Accepting...' : 'Accept Commission'}
                  </button>
                  <button
                    onClick={() => setShowDeclineConfirm(true)}
                    disabled={declineMutation.isPending}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors font-medium"
                  >
                    {declineMutation.isPending ? 'Declining...' : 'Decline Commission'}
                  </button>
                </>
              )}

              {commission.status === 'accepted' && isArtist && (
                <button
                  onClick={() => setShowCompleteConfirm(true)}
                  disabled={completeMutation.isPending}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors font-medium"
                >
                  {completeMutation.isPending ? 'Marking Complete...' : 'Mark as Complete'}
                </button>
              )}

              {commission.status === 'pending' && isClient && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={cancelMutation.isPending}
                  className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-colors font-medium"
                >
                  {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Commission'}
                </button>
              )}

              <button
                onClick={() => router.push(`/messages?user=${isClient ? commission.artistId : commission.clientId}`)}
                className="w-full px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      {showAcceptConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Accept Commission?</h3>
            <p className="text-gray-600 mb-6">By accepting this commission, you agree to complete the work as specified and the payment will be held in escrow.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAcceptConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeclineConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Decline Commission?</h3>
            <p className="text-gray-600 mb-6">The client will be notified and can request from another artist.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeclineConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mark Commission as Complete?</h3>
            <p className="text-gray-600 mb-6">The client will be notified. Payment will be released once approved.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCompleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Commission?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone. The artist will be notified.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Keep Commission
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Cancel Commission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
