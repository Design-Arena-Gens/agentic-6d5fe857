import { NextRequest, NextResponse } from 'next/server'
import { publishToInstagram } from '@/lib/instagram'
import { getVideoQueue, markAsPublished } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { videoId } = await request.json()

    if (!videoId) {
      return NextResponse.json({ error: 'No video ID provided' }, { status: 400 })
    }

    const videos = await getVideoQueue()
    const video = videos.find((v: any) => v.id === videoId)

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    if (video.published) {
      return NextResponse.json({ error: 'Video already published' }, { status: 400 })
    }

    // Publish to Instagram
    await publishToInstagram(video.url, video.caption)

    // Mark as published
    await markAsPublished(videoId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Publish error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to publish'
    }, { status: 500 })
  }
}
