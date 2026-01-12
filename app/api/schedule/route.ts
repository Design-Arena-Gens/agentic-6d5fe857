import { NextRequest, NextResponse } from 'next/server'
import { saveScheduleTime } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { time } = await request.json()

    if (!time) {
      return NextResponse.json({ error: 'No time provided' }, { status: 400 })
    }

    await saveScheduleTime(time)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Schedule save error:', error)
    return NextResponse.json({ error: 'Failed to save schedule' }, { status: 500 })
  }
}
