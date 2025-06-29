'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Zap, Shield, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '../../lib/store'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [configError, setConfigError] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const { signIn, signUp, loading, user } = useAuthStore()
  const router = useRouter()

  // Check Supabase configuration on component mount
  useEffect(() => {
    const checkConfig = () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
        setConfigError('Supabase URL is not configured. Please set NEXT_PUBLIC_SUPABASE_URL in your .env.local file.')
        return
      }
      
      if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'placeholder-key') {
        setConfigError('Supabase Anon Key is not configured. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.')
        return
      }
      
      setConfigError(null)
    }
    
    checkConfig()
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      setIsTransitioning(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (configError) {
      console.error('Cannot submit form due to configuration error:', configError)
      return
    }
    
    console.log('Form submitted:', { isLogin, email, username, password: '***' })
    
    try {
      let success = false
      
      if (isLogin) {
        console.log('Attempting sign in...')
        success = await signIn(email, password)
      } else {
        console.log('Attempting sign up...', { email, username })
        
        // Validate required fields for signup
        if (!email || !password) {
          console.error('Email and password are required')
          return
        }
        
        if (!username || username.trim() === '') {
          console.error('Username is required for signup')
          return
        }
        
        success = await signUp(email, password, username, username)
      }
      
      console.log('Auth result:', success)
      
      if (success) {
        setIsTransitioning(true)
        // For new users, go to assessment; for existing users, go to dashboard
        setTimeout(() => {
          if (isLogin) {
            router.push('/dashboard')
          } else {
            router.push('/onboarding/assessment')
          }
        }, 2000)
      }
    } catch (error) {
      console.error('Auth error:', error)
    }
  }

  const handleToggle = () => {
    console.log('Toggling form mode from', isLogin ? 'login' : 'signup', 'to', !isLogin ? 'login' : 'signup')
    setIsLogin(!isLogin)
    // Clear form when switching
    setEmail('')
    setPassword('')
    setUsername('')
  }

  const handleBackToHome = () => {
    router.push('/')
  }

  // Show transition screen
  if (isTransitioning) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity }
            }}
          >
            <Sparkles className="w-16 h-16 text-white" />
          </motion.div>
          
          <motion.h1
            className="text-4xl font-bold text-cyan-400 mb-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {user ? 'Welcome Back, Hunter!' : 'Hunter Registration Complete!'}
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {user ? 'Accessing your command center...' : 'Initializing awakening assessment...'}
          </motion.p>
          
          <motion.div
            className="w-64 h-2 bg-gray-800 rounded-full mx-auto overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // Show configuration error
  if (configError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md bg-black/60 backdrop-blur-lg border border-red-500/30 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Configuration Error</h2>
          <p className="text-gray-300 mb-6">{configError}</p>
          <div className="text-left bg-gray-800/50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-400 mb-2">Create a <code className="text-cyan-400">.env.local</code> file in your project root with:</p>
            <code className="text-xs text-green-400 block">
              NEXT_PUBLIC_SUPABASE_URL=your_supabase_url<br />
              NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
            </code>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Reload Page
            </button>
            <button
              onClick={handleBackToHome}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black/50 to-cyan-900/20" />
      
      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <motion.button
        onClick={handleBackToHome}
        className="absolute top-6 left-6 z-30 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-lg border border-cyan-500/30 rounded-full text-cyan-400 hover:bg-black/60 transition-all duration-300"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Back to Gate</span>
      </motion.button>

      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Animated Logo */}
            <motion.div
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center relative overflow-hidden"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              {/* Inner rotating element */}
              <motion.div
                className="absolute inset-2 border-2 border-white/30 rounded-xl"
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Center icon */}
              <Sparkles className="w-10 h-10 text-white z-10" />
              
              {/* Glowing effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-purple-400/30 rounded-2xl"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Scan lines effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent"
                animate={{ y: [-96, 96] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {isLogin ? 'HUNTER ACCESS' : 'HUNTER REGISTRATION'}
            </motion.h1>
            
            <motion.p
              className="text-gray-400 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {isLogin ? 'Welcome back to the system' : 'Begin your awakening journey'}
            </motion.p>
          </motion.div>

          {/* Form */}
          <motion.div
            className="bg-black/40 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-8 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Username field (only for signup) */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hunter ID
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                        placeholder="Choose your hunter name"
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {isLogin ? 'Email / Hunter ID' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                    placeholder={isLogin ? "Enter your email or hunter ID" : "your@email.com"}
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Access Code
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                    placeholder="Enter your access code"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full relative group py-4 text-lg font-semibold flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg overflow-hidden shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Initializing...</span>
                  </>
                ) : (
                  <>
                    {isLogin ? <Shield size={20} /> : <Zap size={20} />}
                    <span>{isLogin ? 'Access System' : 'Register as Hunter'}</span>
                  </>
                )}
                
                {/* Hover Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Pulsing Glow */}
                <motion.div
                  className="absolute inset-0 bg-white/10 rounded-lg"
                  animate={{ 
                    opacity: [0, 0.2, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>
            </form>

            {/* Toggle between login/signup */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <p className="text-gray-400 mb-3">
                {isLogin ? "New to the Hunter Association?" : "Already have an account?"}
              </p>
              <button
                onClick={handleToggle}
                className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium text-lg hover:underline"
              >
                {isLogin ? 'Register as Hunter' : 'Access Existing Account'}
              </button>
            </motion.div>

            {/* System status indicator */}
            <motion.div
              className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <motion.div
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>Hunter Association System Online</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 