import type { Metadata, Viewport } from 'next'
import './globals.css'
import RootLayoutClient from './layout-client'

export const metadata: Metadata = {
  title: 'Brush&Coin - Creative Marketplace',
  description: 'Connect with talented artists and commission custom artwork. Secure payments, milestone tracking, and verified reviews.',
  keywords: 'art, commission, artist, creative, marketplace, artwork, custom art',
  authors: [{ name: 'Brush&Coin Team' }],
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#EF4444',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RootLayoutClient>{children}</RootLayoutClient>
}
