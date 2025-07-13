import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RetroFuture Fashion - 90s Inspired Modern Style',
  description: 'Experience the future of fashion with our AI-powered try-on technology and 90s-inspired modern designs',
  keywords: 'fashion, 90s, retro, AI try-on, virtual fitting, cyberpunk fashion',
  authors: [{ name: 'RetroFuture Fashion' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-retro-dark text-white overflow-x-hidden`}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #ff00ff',
              boxShadow: '0 0 10px rgba(255, 0, 255, 0.3)',
            },
          }}
        />
      </body>
    </html>
  )
}