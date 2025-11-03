'use client'

import LayoutWithSidebar from '@/components/layout/LayoutWithSidebar'
import { Providers } from '@/components/providers'
import { SessionProvider } from 'next-auth/react'
import { Inter, Poppins } from 'next/font/google'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMounted, setIsMounted] = useState(false)
  
  // Remove usePathname from here to avoid hydration issues
  const pathname = usePathname?.() // Safe access
  const isAuthPage = pathname?.startsWith('/auth') || false

  useEffect(() => {
    setIsMounted(true)
    
    // Remove extension-added attributes that cause hydration mismatches
    if (typeof document !== 'undefined') {
      document.body.removeAttribute('data-new-gr-c-s-check-loaded')
      document.body.removeAttribute('data-gr-ext-installed')
    }
  }, [])

  // Show minimal loading state during initial render to avoid hydration issues
  if (!isMounted) {
    return (
      <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
        <body 
          className="font-sans antialiased" 
          suppressHydrationWarning
        >
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body 
        className="font-sans antialiased" 
        suppressHydrationWarning
      >
        <SessionProvider>
          <Providers>
            {isAuthPage ? (
              // Simple layout for auth pages
              <div className="min-h-screen bg-gray-50">
                <main>{children}</main>
              </div>
            ) : (
              // Layout with sidebar for authenticated pages
              <LayoutWithSidebar>
                {children}
              </LayoutWithSidebar>
            )}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </Providers>
        </SessionProvider>
      </body>
    </html>
  )
}