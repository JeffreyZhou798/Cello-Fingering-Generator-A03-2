import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Violin Fingering Generator',
  description: 'AI-powered violin fingering generation using Dyna-Q reinforcement learning',
  icons: {
    icon: '/violin.svg',
  },
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
