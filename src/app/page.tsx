'use client'

import { motion } from 'framer-motion'
import { Sword, Shield, Zap, Crown, Star, Sparkles } from 'lucide-react'
import AuthForm from '@/components/AuthForm'
import { useAuthStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.replace('/dashboard')
    }
  }, [user, router])

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-cyberpunk-dark relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-cyberpunk-grid bg-[size:50px_50px] opacity-20" />
      
      {/* Floating Orbs */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-cyberpunk-primary/20 rounded-full blur-2xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-32 w-24 h-24 bg-cyberpunk-secondary/20 rounded-full blur-xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/3 w-20 h-20 bg-cyberpunk-accent/20 rounded-full blur-xl"
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Welcome Content */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo and Title */}
            <div className="mb-8">
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-cyberpunk-primary via-cyberpunk-secondary to-cyberpunk-accent rounded-2xl mb-6 flex items-center justify-center relative"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Crown className="w-10 h-10 text-cyberpunk-dark" />
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-cyberpunk-accent rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              
              <h1 className="text-5xl xl:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyberpunk-primary via-cyberpunk-secondary to-cyberpunk-accent bg-clip-text text-transparent">
                  AscendOS
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-2">Level Up Your Life</p>
              <p className="text-gray-400">A Solo Leveling inspired self-improvement system</p>
            </div>

            {/* Features */}
            <div className="space-y-6 mb-8">
              <motion.div
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-12 h-12 bg-cyberpunk-primary/20 rounded-lg flex items-center justify-center">
                  <Sword className="w-6 h-6 text-cyberpunk-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Quest System</h3>
                  <p className="text-gray-400">Complete daily challenges and level up</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-12 h-12 bg-cyberpunk-secondary/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-cyberpunk-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Stat Tracking</h3>
                  <p className="text-gray-400">Monitor your growth across multiple skills</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="w-12 h-12 bg-cyberpunk-accent/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-cyberpunk-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Rewards System</h3>
                  <p className="text-gray-400">Earn points and unlock achievements</p>
                </div>
              </motion.div>
            </div>

            {/* Stats Preview */}
            <motion.div
              className="grid grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="cyberpunk-border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cyberpunk-primary mb-1">1000+</div>
                <div className="text-xs text-gray-400">Hunters</div>
              </div>
              <div className="cyberpunk-border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cyberpunk-secondary mb-1">50K+</div>
                <div className="text-xs text-gray-400">Quests</div>
              </div>
              <div className="cyberpunk-border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cyberpunk-accent mb-1">∞</div>
                <div className="text-xs text-gray-400">Potential</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <AuthForm />
          </motion.div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyberpunk-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </div>
  )
} 