'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '../lib/store'
import LoadingSpinner from './LoadingSpinner'

interface AuthWrapperProps {
  children: ReactNode
  requireAuth?: boolean
  requireOnboarding?: boolean
}

export default function AuthWrapper({ 
  children, 
  requireAuth = false, 
  requireOnboarding = false 
}: AuthWrapperProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, profile, loading, initialized, initialize, hasCompletedOnboarding } = useAuthStore()

  useEffect(() => {
    // Initialize auth on mount
    if (!initialized) {
      initialize()
    }
  }, [initialized, initialize])

  useEffect(() => {
    // Don't do anything while still loading or not initialized
    if (loading || !initialized) return

    const isOnboardingPage = pathname.startsWith('/onboarding')
    const isAuthPage = pathname === '/' && !user
    const isDashboardOrProtected = pathname.startsWith('/dashboard') || 
                                   pathname.startsWith('/quests') || 
                                   pathname.startsWith('/rewards') || 
                                   pathname.startsWith('/inventory') || 
                                   pathname.startsWith('/settings')

    // Handle authentication routing
    if (requireAuth && !user) {
      // User needs to be authenticated but isn't
      router.push('/')
      return
    }

    if (user) {
      const completedOnboarding = hasCompletedOnboarding()
      
      // If user is authenticated but on the landing page, redirect appropriately
      if (pathname === '/') {
        if (completedOnboarding) {
          router.push('/dashboard')
        } else {
          router.push('/onboarding/assessment')
        }
        return
      }

      // If user hasn't completed onboarding
      if (!completedOnboarding) {
        // Allow access to onboarding pages
        if (isOnboardingPage) {
          return
        }
        
        // Redirect to onboarding if trying to access protected pages
        if (isDashboardOrProtected) {
          router.push('/onboarding/assessment')
          return
        }
      } else {
        // User has completed onboarding
        
        // If they're trying to access onboarding pages, redirect to dashboard
        if (isOnboardingPage) {
          router.push('/dashboard')
          return
        }
      }

      // Handle specific onboarding requirements
      if (requireOnboarding && !completedOnboarding) {
        router.push('/onboarding/assessment')
        return
      }
    }
  }, [user, profile, loading, initialized, pathname, router, requireAuth, requireOnboarding, hasCompletedOnboarding])

  // Show loading while initializing or during auth state changes
  if (loading || !initialized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-400 mt-4">Initializing AscendOS...</p>
        </div>
      </div>
    )
  }

  // Show loading if we need auth but don't have user yet
  if (requireAuth && !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-400 mt-4">Authenticating...</p>
        </div>
      </div>
    )
  }

  // Show loading if we need completed onboarding but user hasn't completed it
  if (requireOnboarding && user && !hasCompletedOnboarding()) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-400 mt-4">Redirecting to onboarding...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 