import { redirect } from 'next/navigation'

export default function HomePage() {
  // For development, redirect directly to home page
  redirect('/home')
}
