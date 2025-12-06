import { Analytics } from '@vercel/analytics/react'
import Providers from './Providers'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  alternates: { canonical: 'https://moire.haus' },
  authors: [{ name: 'Bronson Avila', url: 'https://www.bronsonavila.com' }],
  category: 'Art & Design',
  description: 'Moiré wave pattern generator',
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
  keywords: [
    'generative art',
    'interactive art',
    'moiré pattern',
    'pattern generator',
    'visual patterns',
    'wave generator',
    'wave interference',
    'WebGL',
  ],
  other: {
    'github:repo': 'https://github.com/bronsonavila/moire-haus',
  },
  openGraph: {
    description: 'Moiré wave pattern generator',
    images: [
      {
        alt: 'Moiré Wave Pattern Generator',
        height: 630,
        url: 'https://moire.haus/screenshot.png',
        width: 1200,
      },
    ],
    siteName: 'moire.haus',
    title: 'moire.haus',
    type: 'website',
    url: 'https://moire.haus',
  },
  robots: { index: true, follow: true },
  title: 'moire.haus',
  twitter: {
    card: 'summary_large_image',
    description: 'Moiré wave pattern generator',
    images: ['https://moire.haus/screenshot.png'],
    title: 'moire.haus',
  },
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
