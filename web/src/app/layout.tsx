import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
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

export const metadata: Metadata = {
  title: 'Brush&Coin - Creative Marketplace',
  description: 'Connect with talented artists and commission custom artwork. Secure payments, milestone tracking, and verified reviews.',
  keywords: 'art, commission, artist, creative, marketplace, artwork, custom art',
  authors: [{ name: 'Brush&Coin Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0ea5e9',
  openGraph: {
    title: 'Brush&Coin - Creative Marketplace',
    description: 'Connect with talented artists and commission custom artwork.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brush&Coin - Creative Marketplace',
    description: 'Connect with talented artists and commission custom artwork.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          {children}
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
