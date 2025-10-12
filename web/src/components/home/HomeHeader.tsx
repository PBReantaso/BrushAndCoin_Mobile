'use client'

import { useState } from 'react'
import { Search, Settings } from 'lucide-react'

interface HomeHeaderProps {
  onSearch: (query: string) => void
  onSettings: () => void
}

export default function HomeHeader({ onSearch, onSettings }: HomeHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-2xl font-bold text-black">B</span>
          <span className="text-2xl font-normal text-red-500">&C</span>
        </div>

        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search artworks..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Settings Icon */}
        <button
          onClick={onSettings}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Settings className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </div>
  )
}
