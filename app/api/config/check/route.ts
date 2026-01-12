import { NextResponse } from 'next/server'

export async function GET() {
  const configured = !!(process.env.INSTAGRAM_USERNAME && process.env.INSTAGRAM_PASSWORD)
  return NextResponse.json({ configured })
}
