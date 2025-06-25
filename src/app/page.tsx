'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect directly to dashboard since auth is disabled
    router.replace('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-cyberpunk-dark flex items-center justify-center">
      <div className="text-center">
        <div className="text-cyberpunk-primary text-xl mb-4">Redirecting to Dashboard...</div>
        <div className="w-8 h-8 border-2 border-cyberpunk-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
} 