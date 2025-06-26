'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  const [typedText, setTypedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

  const fullText = "System Initializing... Welcome, Hunter."

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
      }
    }, 100)

    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => {
      clearInterval(timer)
      clearInterval(cursorTimer)
    }
  }, [])

  const features = [
    {
      icon: '📘',
      title: 'Quests',
      description: 'Daily missions for XP',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: '🧠',
      title: 'Stats',
      description: 'Level up Intelligence, Strength, etc.',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: '🏅',
      title: 'Rewards',
      description: 'Unlock real-world perks',
      color: 'from-yellow-400 to-orange-400'
    },
    {
      icon: '🎒',
      title: 'Inventory',
      description: 'Collect badges and achievements',
      color: 'from-green-400 to-emerald-400'
    },
    {
      icon: '🎮',
      title: 'RPG UI',
      description: 'Solo Leveling Inspired interface',
      color: 'from-red-400 to-rose-400'
    }
  ]

  const steps = [
    { step: '01', title: 'Signup', description: 'Create your Hunter profile and get initial XP' },
    { step: '02', title: 'Complete Quests', description: 'Take on daily missions and challenges to level up' },
    { step: '03', title: 'Unlock Rewards', description: 'Earn real-world perks and keep climbing the ranks' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{ y }}
        >
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
              AscendOS
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-8">
              Your Real-Life RPG System
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mb-12"
          >
            <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <div className="font-mono text-cyan-400 text-lg">
                {typedText}
                <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            <Link href="/login">
              <motion.button
                className="relative px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-xl font-bold shadow-2xl overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Join AscendOS</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  layoutId="button-bg"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur-xl group-hover:blur-2xl transition-all" />
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-cyan-400 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-4">
              Power Up Your Life
            </h2>
            <p className="text-xl text-gray-400">Transform everyday tasks into epic quests</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="relative group"
              >
                <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 h-full hover:border-cyan-500/50 transition-all duration-300">
                  <div className={`text-6xl mb-4 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                  
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300 blur-xl`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Previews */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
              Experience the Interface
            </h2>
            <p className="text-xl text-gray-400">Immersive RPG-style dashboard and quest system</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {[
              { title: 'Dashboard', desc: 'Track your progress and stats', route: '/dashboard' },
              { title: 'Quest System', desc: 'Complete missions for XP', route: '/quests' },
              { title: 'Inventory', desc: 'Manage your achievements', route: '/inventory' },
              { title: 'Rewards', desc: 'Unlock real-world benefits', route: '/rewards' }
            ].map((preview, index) => (
              <motion.div
                key={preview.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 hover:border-purple-500/50 transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-lg mb-6 flex items-center justify-center border border-gray-600/30">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎮</div>
                      <div className="text-gray-400 text-sm">Preview Coming Soon</div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">{preview.title}</h3>
                  <p className="text-gray-400 mb-4">{preview.desc}</p>
                  <Link href={preview.route}>
                    <motion.button
                      className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full text-sm font-medium hover:from-purple-600 hover:to-pink-700 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Explore {preview.title}
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">Your journey to becoming a real-life legend</p>
          </motion.div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex items-center gap-8"
              >
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-white">{step.title}</h3>
                  <p className="text-gray-400 text-lg">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-8">
              Don't just live. Level up.
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Join thousands of hunters who've transformed their lives into an epic adventure
            </p>
            <Link href="/login">
              <motion.button
                className="relative px-16 py-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-2xl font-bold shadow-2xl overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Ascend Now</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 blur-xl group-hover:blur-2xl transition-all" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black/40 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-4">
                AscendOS
              </h3>
              <p className="text-gray-400">
                Transform your life into an epic RPG adventure
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/dashboard" className="block text-gray-400 hover:text-cyan-400 transition-colors">Dashboard</Link>
                <Link href="/quests" className="block text-gray-400 hover:text-cyan-400 transition-colors">Quests</Link>
                <Link href="/rewards" className="block text-gray-400 hover:text-cyan-400 transition-colors">Rewards</Link>
                <Link href="/inventory" className="block text-gray-400 hover:text-cyan-400 transition-colors">Inventory</Link>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <span className="text-2xl">🐦</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <span className="text-2xl">💼</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <span className="text-2xl">🐙</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 mb-2">
              Built by <span className="text-cyan-400 font-semibold">Prithviraj Verma</span>
            </p>
            <p className="text-gray-500 text-sm">
              Inspired by Solo Leveling • © 2024 AscendOS
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 