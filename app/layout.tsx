import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Instagram Video Upload Agent',
  description: 'Automated daily Instagram video upload scheduler',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
