import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthWrapper from '../components/AuthWrapper'
import SmoothScrollProvider from '../components/SmoothScrollProvider'
import { SoundProvider } from '../components/SoundSystem'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AscendOS - Level Up Your Life',
  description: 'A Solo Leveling inspired self-improvement system. Transform daily tasks into epic quests and level up your life.',
  keywords: 'self-improvement, gamification, productivity, goals, habits, RPG, solo leveling',
  authors: [{ name: 'Prithviraj Verma' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0f172a',
  openGraph: {
    title: 'AscendOS - Level Up Your Life',
    description: 'Transform your reality into an epic RPG adventure. Complete quests, level up stats, and become the hero of your own story.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AscendOS - Level Up Your Life',
    description: 'Transform your reality into an epic RPG adventure.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
-        <SoundProvider>
          <SmoothScrollProvider>
            <AuthWrapper>
              {children}
            </AuthWrapper>
          </SmoothScrollProvider>
        </SoundProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#00ffff',
              border: '1px solid #00ffff30',
            },
            success: {
              iconTheme: {
                primary: '#00ffff',
                secondary: '#1a1a1a',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff0000',
                secondary: '#1a1a1a',
              },
            },
          }}
        />
      </body>
    </html>
  )
}