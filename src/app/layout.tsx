import { Analytics } from '@vercel/analytics/react'
import Providers from './Providers'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  authors: [{ name: 'Bronson Avila', url: 'https://www.bronsonavila.com' }],
  description: 'Moiré wave pattern generator',
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
  openGraph: {
    description: 'Moiré wave pattern generator',
    title: 'moire.haus',
    type: 'website',
    url: 'https://moire.haus',
  },
  title: 'moire.haus',
  twitter: { card: 'summary', description: 'Moiré wave pattern generator', title: 'moire.haus' },
}
export const viewport: Viewport = {
  initialScale: 1,
  themeColor: '#000000',
  viewportFit: 'cover',
  width: 'device-width',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>

        <Analytics />
      </body>
    </html>
  )
}
