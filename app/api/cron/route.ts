import { NextRequest, NextResponse } from 'next/server'
import { getVideoQueue, markAsPublished } from '@/lib/db'
import { publishToInstagram } from '@/lib/instagram'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get unpublished videos
    const videos = await getVideoQueue()
    const unpublished = videos.filter((v: any) => !v.published)

    if (unpublished.length === 0) {
      return NextResponse.json({ message: 'No videos to publish' })
    }

    // Get oldest video
    const video = unpublished.sort((a: any, b: any) =>
      new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
    )[0]

    // Publish to Instagram
    await publishToInstagram(video.url, video.caption)

    // Mark as published
    await markAsPublished(video.id)

    return NextResponse.json({
      success: true,
      message: `Published video: ${video.caption}`,
      videoId: video.id
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Cron job failed'
    }, { status: 500 })
  }
}
