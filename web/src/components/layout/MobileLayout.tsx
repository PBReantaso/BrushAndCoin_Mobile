'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, Map, MessageCircle, User } from 'lucide-react'

interface MobileLayoutProps {
  children: React.ReactNode
  currentPage?: string
}

export default function MobileLayout({ children, currentPage = 'home' }: MobileLayoutProps) {
  const router = useRouter()
  const [selectedIndex, setSelectedIndex] = useState(0)

  const navItems = [
    { icon: Home, label: 'Home', route: '/home', key: 'home' },
    { icon: Map, label: 'Events', route: '/events', key: 'events' },
    { icon: MessageCircle, label: 'Messages', route: '/messages', key: 'messages' },
    { icon: User, label: 'Profile', route: '/profile', key: 'profile' },
  ]

  const handleNavClick = (index: number, route: string) => {
    setSelectedIndex(index)
    router.push(route)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden">
        <div className="bg-white border-t border-gray-200">
          <div className="h-16 px-4 flex items-center justify-around">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const isSelected = currentPage === item.key || selectedIndex === index
              
              return (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(index, item.route)}
                  className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                    isSelected 
                      ? 'text-red-500' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isSelected ? 'fill-current' : ''}`} />
                  <span className={`text-xs font-medium ${
                    isSelected ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
