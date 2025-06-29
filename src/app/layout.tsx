import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthWrapper from '../components/AuthWrapper'
import SmoothScrollProvider from '../components/SmoothScrollProvider'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AscendOS - Level Up Your Life',
  description: 'A Solo Leveling inspired self-improvement system. Transform daily tasks into epic quests and level up your life.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SmoothScrollProvider>
          <AuthWrapper>
            {children}
          </AuthWrapper>
        </SmoothScrollProvider>
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