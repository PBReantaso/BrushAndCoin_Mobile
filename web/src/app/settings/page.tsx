'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Lock, Heart, MessageCircle, UserPlus, Key, Monitor, HelpCircle, Shield, FileText, LogOut, Trash2, Globe, Bell, Mail, Eye } from 'lucide-react'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const router = useRouter()
  const [privateAccount, setPrivateAccount] = useState(false)
  const [pushLikes, setPushLikes] = useState(true)
  const [pushComments, setPushComments] = useState(true)
  const [pushFollows, setPushFollows] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  // General settings
  const [language, setLanguage] = useState('en')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [showEmailInProfile, setShowEmailInProfile] = useState(false)
  const [autoPlayVideos, setAutoPlayVideos] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('settings_language')
    const savedEmailNotifications = localStorage.getItem('settings_emailNotifications')
    const savedShowEmail = localStorage.getItem('settings_showEmail')
    const savedAutoPlay = localStorage.getItem('settings_autoPlay')
    const savedPrivateAccount = localStorage.getItem('settings_privateAccount')
    const savedPushLikes = localStorage.getItem('settings_pushLikes')
    const savedPushComments = localStorage.getItem('settings_pushComments')
    const savedPushFollows = localStorage.getItem('settings_pushFollows')

    if (savedLanguage) setLanguage(savedLanguage)
    if (savedEmailNotifications !== null) setEmailNotifications(savedEmailNotifications === 'true')
    if (savedShowEmail !== null) setShowEmailInProfile(savedShowEmail === 'true')
    if (savedAutoPlay !== null) setAutoPlayVideos(savedAutoPlay === 'true')
    if (savedPrivateAccount !== null) setPrivateAccount(savedPrivateAccount === 'true')
    if (savedPushLikes !== null) setPushLikes(savedPushLikes === 'true')
    if (savedPushComments !== null) setPushComments(savedPushComments === 'true')
    if (savedPushFollows !== null) setPushFollows(savedPushFollows === 'true')
  }, [])

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('settings_language', language)
  }, [language])

  useEffect(() => {
    localStorage.setItem('settings_emailNotifications', String(emailNotifications))
  }, [emailNotifications])

  useEffect(() => {
    localStorage.setItem('settings_showEmail', String(showEmailInProfile))
  }, [showEmailInProfile])

  useEffect(() => {
    localStorage.setItem('settings_autoPlay', String(autoPlayVideos))
  }, [autoPlayVideos])

  useEffect(() => {
    localStorage.setItem('settings_privateAccount', String(privateAccount))
  }, [privateAccount])

  useEffect(() => {
    localStorage.setItem('settings_pushLikes', String(pushLikes))
  }, [pushLikes])

  useEffect(() => {
    localStorage.setItem('settings_pushComments', String(pushComments))
  }, [pushComments])

  useEffect(() => {
    localStorage.setItem('settings_pushFollows', String(pushFollows))
  }, [pushFollows])


  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to log out?')
    if (confirmed) {
      setIsLoggingOut(true)
      try {
        // Use NextAuth signout
        await signOut({ 
          callbackUrl: '/auth/login?logout=true',
          redirect: true 
        })
      } catch (error) {
        console.error('Logout error:', error)
        // Even if signOut fails, clear storage and redirect
        localStorage.clear()
        sessionStorage.clear()
        window.location.href = '/auth/login?logout=true'
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
    description,
    value, 
    onChange 
  }: { 
    icon: any
    title: string
    description?: string
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
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
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

  const SelectTile = ({ 
    icon: Icon, 
    title, 
    value, 
    options,
    onChange 
  }: { 
    icon: any
    title: string
    value: string
    options: { value: string; label: string }[]
    onChange: (value: string) => void
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
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )

  return (
    <div className="bg-gray-50">
      {/* Main Content */}
      <div className="px-4 pt-2 pb-6 lg:px-8 lg:pt-4 lg:pb-8 lg:ml-64 lg:mr-64 max-w-6xl mx-auto">
        {/* General Section */}
        <SectionHeader title="General" />
        <SelectTile
          icon={Globe}
          title="Language"
          value={language}
          options={[
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' },
            { value: 'ja', label: 'Japanese' },
            { value: 'zh', label: 'Chinese' },
            { value: 'ko', label: 'Korean' },
            { value: 'pt', label: 'Portuguese' },
            { value: 'it', label: 'Italian' },
            { value: 'ru', label: 'Russian' }
          ]}
          onChange={(value) => {
            setLanguage(value)
            toast.success('Language preference saved')
          }}
        />
        <SwitchTile
          icon={Mail}
          title="Email Notifications"
          description="Receive email updates about your account activity"
          value={emailNotifications}
          onChange={(value) => {
            setEmailNotifications(value)
            toast.success(value ? 'Email notifications enabled' : 'Email notifications disabled')
          }}
        />
        <SwitchTile
          icon={Eye}
          title="Show Email in Profile"
          description="Make your email address visible to other users"
          value={showEmailInProfile}
          onChange={(value) => {
            setShowEmailInProfile(value)
            toast.success(value ? 'Email will be visible in your profile' : 'Email hidden from profile')
          }}
        />
        <SwitchTile
          icon={Monitor}
          title="Auto-play Videos"
          description="Automatically play videos in your feed"
          value={autoPlayVideos}
          onChange={(value) => {
            setAutoPlayVideos(value)
            toast.success(value ? 'Videos will auto-play' : 'Videos will not auto-play')
          }}
        />

        {/* Account Section */}
        <SectionHeader title="Account" />
        <SettingsTile
          icon={User}
          title="Edit Profile"
          onClick={() => router.push('/profile/edit')}
        />
        <SwitchTile
          icon={Lock}
          title="Private Account"
          description="Make your profile and posts visible only to approved followers"
          value={privateAccount}
          onChange={setPrivateAccount}
        />

        {/* Notifications Section */}
        <SectionHeader title="Notifications" />
        <SwitchTile
          icon={Heart}
          title="Likes"
          description="Notify me when someone likes my artwork or post"
          value={pushLikes}
          onChange={setPushLikes}
        />
        <SwitchTile
          icon={MessageCircle}
          title="Comments"
          description="Notify me when someone comments on my artwork or post"
          value={pushComments}
          onChange={setPushComments}
        />
        <SwitchTile
          icon={UserPlus}
          title="New Followers"
          description="Notify me when someone starts following my profile"
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
