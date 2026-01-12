import { NextRequest, NextResponse } from 'next/server'
import { deleteVideo } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteVideo(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 })
  }
}
