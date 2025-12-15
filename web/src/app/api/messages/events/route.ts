import { createSSEStream } from '@/lib/sse'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const conversationId = url.searchParams.get('conversationId')
    if (!conversationId) return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 })

    const stream = createSSEStream(conversationId)
    const headers = new Headers({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })

    return new Response(stream as any, { headers })
  } catch (err) {
    console.error('SSE events error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
