'use client'

import LayoutWithSidebar from '@/components/layout/LayoutWithSidebar'
import { Providers } from '@/components/providers'
import { Inter, Poppins } from 'next/font/google'
import { usePathname } from 'next/navigation'
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
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
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
      </body>
    </html>
  )
}