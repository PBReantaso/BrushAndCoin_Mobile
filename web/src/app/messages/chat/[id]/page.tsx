'use client'

import { useRealtimeMessages, useSendMessage } from '@/hooks/useMessaging'
import { ArrowLeft, MoreVertical, Paperclip, Send, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useRef, useState } from 'react'

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { data: session } = useSession()
  const { id: conversationId } = use(params)

  const { messages, isLoading, error } = useRealtimeMessages(conversationId)
  const sendMutation = useSendMessage()
  const [messageInput, setMessageInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [otherUserStatus, setOtherUserStatus] = useState<'online' | 'offline' | null>(null)
  const [lastSeenTime, setLastSeenTime] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setSelectedFile(file)

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() && !selectedFile) return

    setIsSending(true)
    try {
      if (selectedFile) {
        // Upload file and get URL
        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('type', selectedFile.type.startsWith('image/') ? 'image' : 'file')

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) {
          throw new Error('File upload failed')
        }

        const { fileUrl } = await uploadRes.json()

        await sendMutation.mutateAsync({
          conversationId,
          content: messageInput || `[${selectedFile.type.startsWith('image/') ? 'Image' : 'File'}]`,
          type: selectedFile.type.startsWith('image/') ? 'image' : 'file',
          attachmentUrl: fileUrl,
        })

        setSelectedFile(null)
        setPreviewUrl(null)
      } else {
        await sendMutation.mutateAsync({
          conversationId,
          content: messageInput,
          type: 'text',
        })
      }
      setMessageInput('')
    } catch (err) {
      console.error('Send message failed:', err)
      alert(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getStatusText = (lastActive: string) => {
    if (!lastActive) return 'Offline'
    
    const lastActiveDate = new Date(lastActive)
    const now = new Date()
    const diffMs = now.getTime() - lastActiveDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Online'
    if (diffMins < 60) return `Active ${diffMins}m ago`
    if (diffHours < 24) return `Active ${diffHours}h ago`
    if (diffDays < 7) return `Active ${diffDays}d ago`
    
    return `Last seen ${lastActiveDate.toLocaleDateString()}`
  }

  // Get the other participant's info
  const otherParticipant = messages.length > 0
    ? messages[0].senderId === session?.user?.id
      ? messages[0].receiver
      : messages[0].sender
    : null

  const otherParticipantName = otherParticipant?.first_name || 'User'

  // Fetch other user's status
  useEffect(() => {
    if (!otherParticipant?.id) return

    const fetchUserStatus = async () => {
      try {
        const res = await fetch(`/api/users/${otherParticipant.id}`)
        if (res.ok) {
          const userData = await res.json()
          const statusText = getStatusText(userData.lastActive || userData.last_seen)
          setLastSeenTime(statusText)
          setOtherUserStatus(statusText === 'Online' ? 'online' : 'offline')
        }
      } catch (err) {
        console.error('Failed to fetch user status:', err)
        setOtherUserStatus('offline')
      }
    }

    fetchUserStatus()
    // Poll every 30 seconds
    const interval = setInterval(fetchUserStatus, 30000)
    return () => clearInterval(interval)
  }, [otherParticipant?.id])

  // Group messages by date
  const groupedMessages = messages.reduce((acc: any, msg: any) => {
    const date = formatDate(msg.timestamp)
    if (!acc[date]) acc[date] = []
    acc[date].push(msg)
    return acc
  }, {})

  const statusDisplay = lastSeenTime || 'Loading...'

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{otherParticipantName}</h1>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${otherUserStatus === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <p className="text-xs text-gray-500">{statusDisplay}</p>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mb-2"></div>
              <p className="text-gray-600 text-sm">Loading messages...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 text-sm">Failed to load messages</div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {Object.entries(groupedMessages).map(([date, dateMessages]: [string, any]) => (
              <div key={date}>
                {/* Date Separator */}
                <div className="flex items-center justify-center mb-4">
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{date}</span>
                </div>

                {/* Messages for this date */}
                <div className="space-y-3">
                  {(dateMessages as any[]).map((message: any) => {
                    const isCurrentUser = message.senderId === session?.user?.id
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isCurrentUser
                              ? 'bg-red-500 text-white rounded-br-none'
                              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                          }`}
                        >
                          {/* Display image if it's an image message */}
                          {message.messageType === 'image' && message.attachmentUrl && (
                            <img
                              src={message.attachmentUrl}
                              alt="Message image"
                              className="max-w-full rounded-lg mb-2 max-h-64 object-cover"
                            />
                          )}

                          {/* Display file link if it's a file message */}
                          {message.messageType === 'file' && message.attachmentUrl && (
                            <a
                              href={message.attachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`block mb-2 underline text-sm ${
                                isCurrentUser ? 'text-blue-200' : 'text-blue-500'
                              }`}
                            >
                              📎 Download file
                            </a>
                          )}

                          <p className="text-sm break-words">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isCurrentUser ? 'text-red-100' : 'text-gray-500'
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        {/* File Preview */}
        {previewUrl && (
          <div className="mb-3 relative inline-block">
            <img src={previewUrl} alt="Preview" className="max-w-xs max-h-32 rounded-lg" />
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {selectedFile && !previewUrl && (
          <div className="mb-3 flex items-center justify-between bg-gray-100 p-2 rounded-lg">
            <span className="text-sm text-gray-700">{selectedFile.name}</span>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isSending}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={(!messageInput.trim() && !selectedFile) || isSending}
            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}

