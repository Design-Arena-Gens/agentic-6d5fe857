import { NextResponse } from 'next/server'
import { getVideoQueue } from '@/lib/db'

export async function GET() {
  try {
    const videos = await getVideoQueue()
    return NextResponse.json({ videos })
  } catch (error) {
    console.error('Failed to fetch videos:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}
