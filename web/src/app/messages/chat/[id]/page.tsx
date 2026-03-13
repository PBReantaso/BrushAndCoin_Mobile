'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Send, Phone, Video, MoreHorizontal, AlertCircle } from 'lucide-react'

interface ChatMessage {
  id: string
  senderId: string
  text: string
  timestamp: number
}

export default function ChatPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const rawId = params?.id || 'unknown'
  const conversationId = decodeURIComponent(rawId)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const storageKey = useMemo(
    () => `conversation-${conversationId}`,
    [conversationId]
  )

  const loadMessages = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/messages/${encodeURIComponent(conversationId)}`)
      if (res.status === 401) {
        router.push('/auth/login')
        return
      }
      if (!res.ok) throw new Error('Failed to load messages')
      const data = await res.json()
      const mapped = (data.messages || []).map((m: any) => ({
        id: m.id,
        senderId: m.sender_id,
        text: m.text,
        timestamp: new Date(m.created_at).getTime(),
      }))
      setMessages(mapped.length > 0 ? mapped : [{
        id: `sys-${Date.now()}`,
        senderId: 'system',
        text: 'Start the conversation',
        timestamp: Date.now(),
      }])
    } catch (e: any) {
      console.error('Load messages error', e)
      setError(e?.message || 'Failed to load messages')
      setMessages([{
        id: `sys-${Date.now()}`,
        senderId: 'system',
        text: 'Start the conversation',
        timestamp: Date.now(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // Load conversation from API
  useEffect(() => {
    loadMessages()
  }, [conversationId])

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return
    const pending: ChatMessage = {
      id: `tmp-${Date.now()}`,
      senderId: 'me',
      text: input.trim(),
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, pending])
    const textToSend = input.trim()
    setInput('')
    try {
      const res = await fetch(`/api/messages/${encodeURIComponent(conversationId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSend }),
      })
      if (res.ok) {
        const data = await res.json()
        const saved = data.message
        setMessages(prev => [...prev.filter(m => m.id !== pending.id), {
          id: saved.id,
          senderId: saved.sender_id,
          text: saved.text,
          timestamp: new Date(saved.created_at).getTime(),
        }])
      } else {
        // revert pending message if failed
        setMessages(prev => prev.filter(m => m.id !== pending.id))
      }
    } catch (e) {
      setMessages(prev => prev.filter(m => m.id !== pending.id))
    }
  }

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col lg:pl-64">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center space-x-3">
        <button
          onClick={() => router.push('/messages')}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1">
          <p className="text-sm text-gray-500">Chatting with</p>
          <p className="text-base font-semibold text-gray-900 truncate">
            {conversationId}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      >
        {error && (
          <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
            <button
              onClick={loadMessages}
              className="ml-auto text-red-600 hover:text-red-700 font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.senderId === 'me'
            const isSystem = msg.senderId === 'system'
            return (
              <div
                key={msg.id}
                className={`flex ${
                  isSystem ? 'justify-center' : isMe ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    isSystem
                      ? 'bg-gray-100 text-gray-700'
                      : isMe
                        ? 'bg-red-500 text-white rounded-br-none'
                        : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {!isSystem && (
                    <p
                      className={`text-[11px] mt-1 ${
                        isMe ? 'text-red-100' : 'text-gray-500'
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Composer */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
            aria-label="Send"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

