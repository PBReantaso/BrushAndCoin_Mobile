'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, MessageCircle, X, Search, User as UserIcon } from 'lucide-react'

// Mock commission requests data
const mockCommissionRequests = [
  {
    id: '1',
    title: 'Portrait Commission',
    description: 'I would like a portrait of my dog',
    category: 'portrait',
    budget: 150.0,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isUrgent: false,
    clientId: 'client_1',
    clientName: 'Sarah Connor',
    clientAvatar: null,
    artistId: 'current_user',
    artistName: 'You',
    artistAvatar: null,
    status: 'pending',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    commissionType: 'received',
  },
  {
    id: '2',
    title: 'Logo Design',
    description: 'Need a professional logo for my startup',
    category: 'logoDesign',
    budget: 300.0,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    isUrgent: false,
    clientId: 'current_user',
    clientName: 'You',
    clientAvatar: null,
    artistId: 'artist_2',
    artistName: 'Alex Rivera',
    artistAvatar: null,
    status: 'accepted',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    commissionType: 'sent',
  },
  {
    id: '3',
    title: 'Custom Illustration',
    description: 'Book cover illustration needed',
    category: 'illustration',
    budget: 200.0,
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    isUrgent: false,
    clientId: 'client_3',
    clientName: 'Lisa Wang',
    clientAvatar: null,
    artistId: 'current_user',
    artistName: 'You',
    artistAvatar: null,
    status: 'accepted',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    commissionType: 'received',
  },
]

export default function MessagesPage() {
  const router = useRouter()
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [commissionFilter, setCommissionFilter] = useState('All')
  const [conversations, setConversations] = useState<any[]>([])
  const [isLoadingConvos, setIsLoadingConvos] = useState(false)
  const [convoError, setConvoError] = useState<string | null>(null)
  const [commissionRequests, setCommissionRequests] = useState(mockCommissionRequests)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const loadConversations = useCallback(async () => {
    setIsLoadingConvos(true)
    setConvoError(null)
    try {
      const res = await fetch('/api/messages/conversations')
      if (!res.ok) {
        let msg = 'Failed to load conversations'
        try {
          const err = await res.json()
          if (err?.error) msg = err.error
        } catch (_) { /* ignore */ }
        throw new Error(msg)
      }
      const data = await res.json()
      setConversations(data.conversations || [])
    } catch (e: any) {
      console.error('Load conversations error', e)
      setConvoError(e?.message || 'Failed to load conversations')
      setConversations([])
    } finally {
      setIsLoadingConvos(false)
    }
  }, [])

  // Load recent conversations from localStorage (mock client-side persistence)
  useEffect(() => {
    loadConversations()

    const handleFocus = () => loadConversations()
    window.addEventListener('focus', handleFocus)
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const commissionFilters = ['All', 'Pending', 'Accepted', 'Completed', 'Declined']

  const formatRelativeTime = (ts?: number | string) => {
    if (!ts) return ''
    const t = typeof ts === 'string' ? Number(ts) : ts
    if (!t || Number.isNaN(t)) return ''
    const diff = Date.now() - t
    const sec = Math.floor(diff / 1000)
    if (sec < 60) return 'just now'
    const min = Math.floor(sec / 60)
    if (min < 60) return `${min}m ago`
    const hr = Math.floor(min / 60)
    if (hr < 24) return `${hr}h ago`
    const d = Math.floor(hr / 24)
    return `${d}d ago`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'accepted': return 'text-green-600 bg-green-100'
      case 'completed': return 'text-blue-600 bg-blue-100'
      case 'declined': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCommissionTypeBadge = (type: string) => {
    if (type === 'received') {
      return (
        <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
          RECEIVED
        </span>
      )
    } else {
      return (
        <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full">
          SENT
        </span>
      )
    }
  }

  const handleNewMessage = () => {
    setIsSearchOpen(true)
  }

  const handleSelectUser = async (user: any) => {
    setIsSearchOpen(false)
    setSearchQuery('')
    setSearchResults([])
    const targetId = user.id
    if (!targetId) return
    try {
      const res = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: targetId }),
      })
      if (!res.ok) throw new Error('Failed to create conversation')
      const data = await res.json()
      const convoId = data.conversation_id
      if (convoId) {
        router.push(`/messages/chat/${encodeURIComponent(convoId)}`)
      }
    } catch (err) {
      console.error('Create conversation error', err)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    const doSearch = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([])
        setSearchError(null)
        return
      }
      setIsSearching(true)
      setSearchError(null)
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery.trim())}&limit=8`, {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error('Search failed')
        const data = await res.json()
        setSearchResults(data.users || [])
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setSearchError('Failed to search users')
          setSearchResults([])
        }
      } finally {
        setIsSearching(false)
      }
    }
    const debounce = setTimeout(doSearch, 300)
    return () => {
      clearTimeout(debounce)
      controller.abort()
    }
  }, [searchQuery])

  const handleCommissionClick = (commission: any) => {
    if (commission.commissionType === 'received') {
      // Navigate to commission details (artist view)
      router.push(`/commissions/${commission.id}`)
    } else {
      // Navigate to client commission progress (client view)
      router.push(`/commissions/client/${commission.id}`)
    }
  }

  const handleMessageClick = (convo: any) => {
    if (convo?.id) {
      router.push(`/messages/chat/${encodeURIComponent(convo.id)}`)
    }
  }


  const filteredCommissionRequests = commissionRequests.filter(commission => {
    if (commissionFilter === 'All') return true
    return commission.status.toLowerCase() === commissionFilter.toLowerCase()
  })

  return (
    <div className="bg-gray-50">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setSelectedTabIndex(0)}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              selectedTabIndex === 0
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setSelectedTabIndex(1)}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              selectedTabIndex === 1
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Commissions
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pt-2 pb-6 lg:px-8 lg:pt-4 lg:pb-8 lg:ml-64 lg:mr-64 max-w-6xl mx-auto">
        {selectedTabIndex === 0 ? (
          /* Messages Tab */
          <div className="space-y-3">
            {isLoadingConvos ? (
              <div className="py-6 text-center text-gray-500 text-sm">Loading conversations...</div>
            ) : convoError ? (
              <div className="py-6 text-center text-red-500 text-sm space-y-2">
                <div>{convoError}</div>
                <button
                  onClick={loadConversations}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : conversations.length === 0 ? (
              <div className="py-6 text-center text-gray-500 text-sm">No conversations yet. Start a new one with +</div>
            ) : (
              conversations.map(convo => (
                <div
                  key={convo.id}
                  onClick={() => handleMessageClick(convo)}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    {/* User Avatar */}
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                      {convo.other_user?.profile_image_url ? (
                        <img
                          src={convo.other_user.profile_image_url}
                          alt={convo.other_user.username || 'user'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 font-medium">
                          {(convo.other_user?.first_name?.[0] || convo.other_user?.username?.[0] || '?').toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          {convo.other_user?.first_name
                            ? `${convo.other_user.first_name} ${convo.other_user.last_name || ''}`.trim()
                            : convo.other_user?.username || 'User'}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatRelativeTime(convo.last_message?.created_at || convo.updated_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {convo.last_message?.text || 'No messages yet'}
                      </p>
                    </div>

                    {/* Unread Indicator */}
                    {convo.unread_count > 0 && (
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Commissions Tab */
          <div>
            {/* Commission Filter */}
            <div className="flex space-x-2 mb-4 overflow-x-auto">
              {commissionFilters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setCommissionFilter(filter)}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    commissionFilter === filter
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Commission Requests */}
            <div className="space-y-3">
              {filteredCommissionRequests.map(commission => (
                <div
                  key={commission.id}
                  onClick={() => handleCommissionClick(commission)}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{commission.title}</h3>
                        {getCommissionTypeBadge(commission.commissionType)}
                      </div>
                      <p className="text-sm text-gray-600">{commission.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(commission.status)}`}>
                      {commission.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Budget: ${commission.budget}</span>
                    <span>{commission.clientName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button for New Message */}
      <button
        onClick={handleNewMessage}
        className="fixed bottom-20 right-4 w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-10"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* New Message Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 relative">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <h2 className="text-lg font-semibold text-gray-900 mb-4">Start a new message</h2>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by username"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="mt-4 max-h-80 overflow-y-auto">
              {isSearching ? (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
                </div>
              ) : searchError ? (
                <p className="text-sm text-red-500 text-center py-4">{searchError}</p>
              ) : searchResults.length === 0 && searchQuery.trim().length >= 2 ? (
                <p className="text-sm text-gray-500 text-center py-4">No users found.</p>
              ) : (
                <div className="space-y-2">
                  {searchResults.map((u) => (
                    <button
                      key={u.id || u.username || u.email}
                      onClick={() => handleSelectUser(u)}
                      className="w-full flex items-center space-x-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {u.profile_image_url ? (
                          <img src={u.profile_image_url} alt={u.username || u.email} className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {u.first_name && u.last_name ? `${u.first_name} ${u.last_name}` : u.username || 'Unknown User'}
                        </p>
                        {u.username && (
                          <p className="text-xs text-gray-500 truncate">@{u.username}</p>
                        )}
                      </div>
                      <MessageCircle className="w-5 h-5 text-red-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}