 'use client'

import { Conversation, Message } from '@/types/messaging'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'

const API_BASE = '/api/messages'

export const messagingKeys = {
  all: ['messaging'],
  conversations: () => [...messagingKeys.all, 'conversations'],
  messages: () => [...messagingKeys.all, 'messages'],
  messageList: (conversationId: string) => [...messagingKeys.messages(), conversationId],
}

// GET conversations list
export const useConversations = () => {
  return useQuery({
    queryKey: messagingKeys.conversations(),
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/conversations`)
      if (!res.ok) throw new Error('Failed to fetch conversations')
      const data = await res.json()
      return (data.conversations || data) as Conversation[]
    },
  })
}

// GET messages in conversation
export const useMessages = (conversationId: string, enabled = true) => {
  const queryClient = useQueryClient()
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!conversationId) return

    // connect SSE to receive new messages for this conversation
    const url = `${API_BASE}/events?conversationId=${encodeURIComponent(conversationId)}`
    const es = new EventSource(url)
    esRef.current = es

    es.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data)
        // payload may be { event: 'new-message', message }
        const msg = payload?.message || payload
        if (!msg) return
        queryClient.setQueryData(messagingKeys.messageList(conversationId), (old: Message[] = []) => [
          ...old,
          msg,
        ])
      } catch (err) {
        console.error('SSE parse error:', err)
      }
    }

    es.onerror = (err) => {
      // on error, close and cleanup
      try { es.close() } catch (e) {}
      esRef.current = null
    }

    return () => {
      try { es.close() } catch (e) {}
      esRef.current = null
    }
  }, [conversationId, queryClient])

  return useQuery({
    queryKey: messagingKeys.messageList(conversationId),
    queryFn: async () => {
      const res = await fetch(`${API_BASE}?conversationId=${encodeURIComponent(conversationId)}`)
      if (!res.ok) throw new Error('Failed to fetch messages')
      const data = await res.json()
      return (data.messages || data) as Message[]
    },
    enabled: !!conversationId && enabled,
  })
}

// CREATE conversation with user
export const useCreateConversation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`${API_BASE}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create conversation')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagingKeys.conversations() })
    },
  })
}

// SEND message (with Socket.io support)
export const useSendMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      conversationId?: string
      receiverId?: string
      content: string
      type?: 'text' | 'image' | 'file'
      attachmentUrl?: string
      attachments?: File[]
    }) => {
      const res = await fetch(`${API_BASE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: data.conversationId,
          receiverId: data.receiverId,
          message: data.content,
          messageType: data.type || 'text',
          attachmentUrl: data.attachmentUrl,
        }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to send message')
      }
      return res.json()
    },
    onSuccess: (_, data) => {
      if (data.conversationId) {
        queryClient.invalidateQueries({ queryKey: messagingKeys.messageList(data.conversationId) })
        queryClient.invalidateQueries({ queryKey: messagingKeys.conversations() })
      }
    },
  })
}

// Hook for real-time message updates with Socket.io
export const useRealtimeMessages = (conversationId: string) => {
  const queryClient = useQueryClient()
  const messagesQuery = useMessages(conversationId)
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  useEffect(() => {
    if (!conversationId) return

    const url = `${API_BASE}/events?conversationId=${encodeURIComponent(conversationId)}`
    const es = new EventSource(url)

    es.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data)
        if (!payload) return

        if (payload.event === 'new-message' && payload.message) {
          queryClient.setQueryData(messagingKeys.messageList(conversationId), (old: Message[] = []) => [
            ...old,
            payload.message,
          ])
        }

        if (payload.event === 'user_typing' && payload.username) {
          const username = payload.username as string
          setTypingUsers((prev) => (prev.includes(username) ? prev : [...prev, username]))
          setTimeout(() => setTypingUsers((prev) => prev.filter((u) => u !== username)), 3000)
        }
      } catch (err) {
        console.error('SSE parse error:', err)
      }
    }

    es.onerror = () => {
      try { es.close() } catch (e) {}
    }

    return () => {
      try { es.close() } catch (e) {}
    }
  }, [conversationId, queryClient])

  return {
    messages: messagesQuery.data || [],
    isLoading: messagesQuery.isLoading,
    error: messagesQuery.error,
    typingUsers,
  }
}
