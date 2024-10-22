import './globals.css'
import 'leaflet/dist/leaflet.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI-driven Map App',
  description: 'An interactive map application with AI features',
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