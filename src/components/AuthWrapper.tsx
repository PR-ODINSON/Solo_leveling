'use client'

import { useEffect } from 'react'
import { useAuthStore, useStatsStore } from '../lib/store'
import AuthForm from './AuthForm'
import LoadingSpinner from './LoadingSpinner'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading, initialize } = useAuthStore()
  const { initializeStats } = useStatsStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (user) {
      initializeStats()
    }
  }, [user, initializeStats])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <AuthForm />
  }

  return <>{children}</>
} 