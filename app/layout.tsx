import './globals.css'
import 'leaflet/dist/leaflet.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Whale Occurence Map',
  description: 'Whale Occurence Map',
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