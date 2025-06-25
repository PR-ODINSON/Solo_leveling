'use client'

import { motion } from 'framer-motion'
import { Zap, Target, Trophy, ArrowRight, Sparkles } from 'lucide-react'
import AuthForm from '../components/AuthForm'
import { useAuthStore } from '../lib/store'

export default function HomePage() {
  const { user } = useAuthStore()

  if (user) {
    // Redirect to dashboard if already logged in
    window.location.href = '/dashboard'
    return null
  }

  return (
    <div className="min-h-screen bg-cyberpunk-dark overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyberpunk-primary/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left Column - Welcome Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo/Brand */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-cyberpunk-primary to-cyberpunk-secondary rounded-xl flex items-center justify-center">
                <Sparkles className="text-cyberpunk-dark" size={24} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-secondary bg-clip-text text-transparent">
                AscendOS
              </h1>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Level Up
                <br />
                <span className="bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-secondary bg-clip-text text-transparent">
                  Your Life
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-lg">
                Transform daily tasks into epic quests. Track your progress, 
                earn XP, and unlock achievements in the ultimate life RPG system.
              </p>
            </motion.div>

            {/* Features Preview */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="cyberpunk-border rounded-lg p-4 text-center">
                <Target className="text-cyberpunk-primary mx-auto mb-2" size={24} />
                <h3 className="text-white font-semibold">Quest System</h3>
                <p className="text-gray-400 text-sm">Turn tasks into adventures</p>
              </div>
              
              <div className="cyberpunk-border rounded-lg p-4 text-center">
                <Zap className="text-cyberpunk-secondary mx-auto mb-2" size={24} />
                <h3 className="text-white font-semibold">Stat Tracking</h3>
                <p className="text-gray-400 text-sm">Monitor your growth</p>
              </div>
              
              <div className="cyberpunk-border rounded-lg p-4 text-center">
                <Trophy className="text-yellow-500 mx-auto mb-2" size={24} />
                <h3 className="text-white font-semibold">Rewards</h3>
                <p className="text-gray-400 text-sm">Unlock achievements</p>
              </div>
            </motion.div>

            {/* Stats Preview */}
            <motion.div
              className="flex gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div>
                <div className="text-2xl font-bold text-cyberpunk-primary">1,247</div>
                <div className="text-gray-400 text-sm">Total XP</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyberpunk-secondary">23</div>
                <div className="text-gray-400 text-sm">Quests Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-500">7</div>
                <div className="text-gray-400 text-sm">Achievements</div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <div className="flex items-center gap-2 text-cyberpunk-primary">
                <ArrowRight size={20} />
                <span className="text-lg font-semibold">Ready to begin your ascension?</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Auth Form */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="w-full max-w-md">
              <AuthForm />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyberpunk-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  )
} 