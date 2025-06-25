'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Zap, Shield, Sparkles } from 'lucide-react'
import { useAuthStore } from '../lib/store'

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  
  const { signIn, signUp, loading } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLogin) {
      await signIn(email, password)
    } else {
      await signUp(email, password)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-0">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Animated Logo */}
          <motion.div
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyberpunk-primary via-cyberpunk-secondary to-cyberpunk-accent rounded-2xl flex items-center justify-center relative overflow-hidden"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {/* Inner rotating element */}
            <motion.div
              className="absolute inset-2 border-2 border-cyberpunk-dark/30 rounded-xl"
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Center icon */}
            <Sparkles className="w-8 h-8 text-cyberpunk-dark z-10" />
            
            {/* Glowing effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyberpunk-primary/20 to-cyberpunk-secondary/20 rounded-2xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Scan lines effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent"
              animate={{ y: [-80, 80] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'System Access' : 'Hunter Registration'}
          </h2>
          <p className="text-gray-400">
            {isLogin ? 'Enter your credentials to continue' : 'Create your hunter profile'}
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="cyberpunk-border rounded-2xl p-8 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyberpunk-primary/5 to-cyberpunk-secondary/5" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-secondary" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Username field (only for signup) */}
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
                    className="w-full pl-10 pr-4 py-3 bg-cyberpunk-gray/50 border border-cyberpunk-primary/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyberpunk-primary focus:ring-1 focus:ring-cyberpunk-primary transition-all"
                    placeholder="Choose your hunter name"
                    required={!isLogin}
                  />
                </div>
              </motion.div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {isLogin ? 'Hunter ID' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-cyberpunk-gray/50 border border-cyberpunk-primary/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyberpunk-primary focus:ring-1 focus:ring-cyberpunk-primary transition-all"
                  placeholder={isLogin ? "Enter your hunter ID" : "your@email.com"}
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
                  className="w-full pl-10 pr-12 py-3 bg-cyberpunk-gray/50 border border-cyberpunk-primary/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyberpunk-primary focus:ring-1 focus:ring-cyberpunk-primary transition-all"
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
              className="w-full cyberpunk-button py-4 text-lg font-semibold flex items-center justify-center gap-3 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-cyberpunk-dark/30 border-t-cyberpunk-dark rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Initializing...
                </>
              ) : (
                <>
                  {isLogin ? <Shield size={20} /> : <Zap size={20} />}
                  {isLogin ? 'Begin Your Ascension' : 'Register as Hunter'}
                </>
              )}
            </motion.button>
          </form>

          {/* Toggle between login/signup */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-gray-400">
              {isLogin ? "New to the system?" : "Already have an account?"}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="mt-2 text-cyberpunk-primary hover:text-cyberpunk-secondary transition-colors font-medium"
            >
              {isLogin ? 'Register as Hunter' : 'Access Existing Account'}
            </button>
          </motion.div>

          {/* System status indicator */}
          <motion.div
            className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            System Status: Online
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
} 