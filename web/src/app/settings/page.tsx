'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Lock, Heart, MessageCircle, UserPlus, Key, Monitor, HelpCircle, Shield, FileText, LogOut, Trash2 } from 'lucide-react'
import ApiService from '@/services/api'

export default function SettingsPage() {
  const router = useRouter()
  const [privateAccount, setPrivateAccount] = useState(false)
  const [pushLikes, setPushLikes] = useState(true)
  const [pushComments, setPushComments] = useState(true)
  const [pushFollows, setPushFollows] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)


  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to log out?')
    if (confirmed) {
      setIsLoggingOut(true)
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

  const handleDeleteAccount = () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.')
    if (confirmed) {
      // Handle account deletion
      console.log('Account deletion requested')
    }
  }

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="mb-2 mt-6 first:mt-0">
      <h3 className="text-xs font-semibold text-red-500 uppercase tracking-wider">
        {title}
      </h3>
    </div>
  )

  const SettingsTile = ({ 
    icon: Icon, 
    title, 
    onClick, 
    showChevron = true 
  }: { 
    icon: any
    title: string
    onClick: () => void
    showChevron?: boolean
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-3 lg:shadow-md">
      <button
        onClick={onClick}
        className="w-full p-4 lg:p-6 flex items-center space-x-4 hover:bg-gray-50 transition-colors"
      >
        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-red-500" />
        </div>
        <div className="flex-1 text-left">
          <span className="text-base lg:text-lg font-medium text-gray-900">
            {title}
          </span>
        </div>
        {showChevron && (
          <div className="text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </button>
    </div>
  )

  const SwitchTile = ({ 
    icon: Icon, 
    title, 
    value, 
    onChange 
  }: { 
    icon: any
    title: string
    value: boolean
    onChange: (value: boolean) => void
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-3 lg:shadow-md">
      <div className="p-4 lg:p-6 flex items-center space-x-4">
        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-red-500" />
        </div>
        <div className="flex-1">
          <span className="text-base lg:text-lg font-medium text-gray-900">
            {title}
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
        </label>
      </div>
    </div>
  )

  const DangerTile = ({ 
    icon: Icon, 
    title, 
    onClick,
    disabled = false
  }: { 
    icon: any
    title: string
    onClick: () => void
    disabled?: boolean
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-3 lg:shadow-md">
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`w-full p-4 lg:p-6 flex items-center space-x-4 transition-colors ${
          disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-red-50'
        }`}
      >
        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-red-500" />
        </div>
        <div className="flex-1 text-left">
          <span className="text-base lg:text-lg font-medium text-red-500">
            {title}
          </span>
        </div>
      </button>
    </div>
  )

  return (
    <div className="bg-gray-50">
      {/* Main Content */}
      <div className="px-4 pt-2 pb-6 lg:px-8 lg:pt-4 lg:pb-8 lg:ml-64 lg:mr-64 max-w-6xl mx-auto">
        {/* Account Section */}
        <SectionHeader title="Account" />
        <SettingsTile
          icon={User}
          title="Edit Profile"
          onClick={() => router.push('/profile')}
        />
        <SwitchTile
          icon={Lock}
          title="Private Account"
          value={privateAccount}
          onChange={setPrivateAccount}
        />

        {/* Notifications Section */}
        <SectionHeader title="Notifications" />
        <SwitchTile
          icon={Heart}
          title="Likes"
          value={pushLikes}
          onChange={setPushLikes}
        />
        <SwitchTile
          icon={MessageCircle}
          title="Comments"
          value={pushComments}
          onChange={setPushComments}
        />
        <SwitchTile
          icon={UserPlus}
          title="Follows"
          value={pushFollows}
          onChange={setPushFollows}
        />

        {/* Security Section */}
        <SectionHeader title="Security" />
        <SettingsTile
          icon={Key}
          title="Change Password"
          onClick={() => {
            // TODO: Implement change password
            console.log('Change password clicked')
          }}
        />
        <SettingsTile
          icon={Monitor}
          title="Login Activity"
          onClick={() => {
            // TODO: Implement login activity
            console.log('Login activity clicked')
          }}
        />

        {/* Support Section */}
        <SectionHeader title="Support" />
        <SettingsTile
          icon={HelpCircle}
          title="Help Center"
          onClick={() => {
            // TODO: Implement help center
            console.log('Help center clicked')
          }}
        />
        <SettingsTile
          icon={Shield}
          title="Privacy Policy"
          onClick={() => {
            // TODO: Implement privacy policy
            console.log('Privacy policy clicked')
          }}
        />
        <SettingsTile
          icon={FileText}
          title="Terms of Service"
          onClick={() => {
            // TODO: Implement terms of service
            console.log('Terms of service clicked')
          }}
        />

        {/* Danger Zone */}
        <div className="mt-8">
          <DangerTile
            icon={LogOut}
            title={isLoggingOut ? "Logging out..." : "Log Out"}
            onClick={handleLogout}
            disabled={isLoggingOut}
          />
          <DangerTile
            icon={Trash2}
            title="Delete Account"
            onClick={handleDeleteAccount}
          />
        </div>
      </div>
    </div>
  )
}
