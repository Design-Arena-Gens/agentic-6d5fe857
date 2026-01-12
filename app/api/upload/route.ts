import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { getVideoQueue, addToQueue } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const video = formData.get('video') as File
    const caption = formData.get('caption') as string

    if (!video) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(video.name, video, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    // Add to queue
    const videoData = {
      id: Date.now().toString(),
      url: blob.url,
      caption: caption || '',
      uploadedAt: new Date().toISOString(),
      published: false,
    }

    await addToQueue(videoData)

    return NextResponse.json({ success: true, video: videoData })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
