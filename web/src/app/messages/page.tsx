'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, MessageCircle } from 'lucide-react'

// Mock messages data
const mockMessages = [
  {
    id: 1,
    userName: 'Sarah Connor',
    lastMessage: 'I would like a portrait of my dog',
    timestamp: '1h ago',
    isRead: false,
  },
  {
    id: 2,
    userName: 'Alex Rivera',
    lastMessage: 'Working on your logo design...',
    timestamp: '2h ago',
    isRead: true,
  },
  {
    id: 3,
    userName: 'Lisa Wang',
    lastMessage: 'The illustration is ready for review',
    timestamp: '1d ago',
    isRead: false,
  },
]

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
  const [messages, setMessages] = useState(mockMessages)
  const [commissionRequests, setCommissionRequests] = useState(mockCommissionRequests)

  const commissionFilters = ['All', 'Pending', 'Accepted', 'Completed', 'Declined']

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
    // Show new message dialog
    const username = prompt('Enter username to message:')
    if (username) {
      // Navigate to chat with new user
      router.push(`/messages/chat/${username}`)
    }
  }

  const handleCommissionClick = (commission: any) => {
    if (commission.commissionType === 'received') {
      // Navigate to commission details (artist view)
      router.push(`/commissions/${commission.id}`)
    } else {
      // Navigate to client commission progress (client view)
      router.push(`/commissions/client/${commission.id}`)
    }
  }

  const handleMessageClick = (message: any) => {
    router.push(`/messages/chat/${message.userName}`)
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
      <div className="flex-1 px-4 pt-2 pb-6 lg:px-8 lg:pt-4 lg:pb-8 lg:ml-64 max-w-4xl mx-auto">
        {selectedTabIndex === 0 ? (
          /* Messages Tab */
          <div className="space-y-3">
            {messages.map(message => (
              <div
                key={message.id}
                onClick={() => handleMessageClick(message)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  {/* User Avatar */}
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {message.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Message Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{message.userName}</h3>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{message.lastMessage}</p>
                  </div>

                  {/* Unread Indicator */}
                  {!message.isRead && (
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
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

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-2xl lg:hidden">
        <div className="h-16 px-4 flex items-center justify-around">
          {[
            { icon: Home, label: 'Home', route: '/home' },
            { icon: MapPin, label: 'Events', route: '/events' },
            { icon: MessageCircle, label: 'Messages', route: '/messages' },
            { icon: User, label: 'Profile', route: '/profile' },
          ].map((item, index) => {
            const IconComponent = item.icon
            return (
              <button
                key={item.label}
                onClick={() => {
                  setSelectedNavIndex(index)
                  router.push(item.route)
                }}
                className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  selectedNavIndex === index 
                    ? 'text-red-500' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <IconComponent className={`w-6 h-6 ${selectedNavIndex === index ? 'fill-current' : ''}`} />
                <span className={`text-xs font-medium ${
                  selectedNavIndex === index ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}