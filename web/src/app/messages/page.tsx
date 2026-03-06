"use client"

import { useConversations, useCreateConversation } from '@/hooks/useMessaging'
import { MessageCircle, Plus, Search, User as UserIcon, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MessagesPage() {
  const router = useRouter()
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

  const handleNewMessage = () => setIsSearchOpen(true)

  const handleSelectUser = async (user: any) => {
    setIsSearchOpen(false)
    setSearchQuery('')
    setSearchResults([])
    try {
      const conversation = await createConversationMutation.mutateAsync(user.id)
      if (conversation?.id) router.push(`/messages/chat/${conversation.id}`)
    } catch (err) {
      console.error('Failed to create conversation:', err)
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

  const handleConversationClick = (conversationId: string) => {
    router.push(`/messages/chat/${conversationId}`)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => router.push('/messages')}
              className="text-3xl font-bold text-gray-900 hover:text-red-600 transition-colors"
            >
              Messages
            </button>
            <span className="text-3xl font-bold text-gray-400">|</span>
            <button
              onClick={() => router.push('/commissions')}
              className="text-3xl font-bold text-gray-400 hover:text-red-600 transition-colors"
            >
              Commissions
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            <p className="mt-4 text-gray-600">Loading conversations...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-red-600">Failed to load conversations</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No conversations yet</p>
            <p className="text-gray-500 text-sm mt-2">Start a new conversation by clicking the + button</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((convo: any) => (
              <div
                key={convo.id}
                onClick={() => handleConversationClick(convo.id)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
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

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {convo.other_user?.first_name
                          ? `${convo.other_user.first_name} ${convo.other_user.last_name || ''}`.trim()
                          : convo.other_user?.username || 'User'}
                      </h3>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatTime(convo.last_message?.created_at || convo.updated_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 truncate">
                      {convo.last_message?.text || 'No messages yet'}
                    </p>
                  </div>

                  {convo.unread_count > 0 && (
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleNewMessage}
        className="fixed bottom-20 right-4 w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-10"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

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
                autoFocus
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
                    <div
                      key={u.id || u.username || u.email}
                      className="flex items-center space-x-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                        {u.profile_image_url ? (
                          <img src={u.profile_image_url} alt={u.username || u.email} className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => router.push(`/profile/${u.id}`)}
                          className="text-sm font-semibold text-gray-900 truncate hover:text-red-600 transition-colors text-left"
                        >
                          {u.first_name && u.last_name ? `${u.first_name} ${u.last_name}` : u.username || 'Unknown User'}
                        </button>
                        <p className="text-xs text-gray-500 truncate">@{u.username || u.email}</p>
                      </div>
                      <button
                        onClick={() => handleSelectUser(u)}
                        className="px-3 py-1 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors flex-shrink-0"
                      >
                        Message
                      </button>
                    </div>
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
