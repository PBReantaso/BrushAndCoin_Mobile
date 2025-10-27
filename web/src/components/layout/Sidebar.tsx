'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Home, 
  MapPin, 
  MessageCircle, 
  User, 
  Settings,
  Plus,
  Search,
  Menu,
  X,
  LogOut
} from 'lucide-react'
import ApiService from '@/services/api'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to log out?')
    if (confirmed) {
      try {
        // Use API service logout method
        await ApiService.logout()
        
        // Force refresh to ensure clean state
        window.location.href = '/auth/login'
      } catch (error) {
        console.error('Logout error:', error)
        // Even if API call fails, clear local data and redirect
        window.location.href = '/auth/login'
      }
    }
  }

  const navigationItems = [
    {
      name: 'Home',
      href: '/home',
      icon: Home,
      active: pathname === '/home'
    },
    {
      name: 'Events',
      href: '/events',
      icon: MapPin,
      active: pathname === '/events'
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: MessageCircle,
      active: pathname === '/messages'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      active: pathname === '/profile'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      active: pathname === '/settings'
    }
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        w-64
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Brush&Coin</span>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onToggle}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search artworks..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-3 py-3 rounded-xl transition-colors group
                      ${item.active 
                        ? 'bg-red-50 text-red-600 border border-red-200' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${item.active ? 'text-red-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                    <span className="font-medium">{item.name}</span>
                    {item.active && (
                      <div className="ml-auto w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Create Post Button */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create Post</span>
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer mb-2">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">@johndoe</p>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-red-600 hover:text-red-700"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}
