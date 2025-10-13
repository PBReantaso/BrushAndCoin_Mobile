import { getUsers } from '@/lib/server/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const users = await getUsers(100)
    return NextResponse.json({ success: true, data: users })
  } catch (err: any) {
    console.error('API /api/users error', err)
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 })
  }
}
