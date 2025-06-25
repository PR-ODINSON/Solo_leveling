'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Zap } from 'lucide-react'
import { useAuthStore } from '@/lib/store'

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const { signIn, signUp, loading } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) return

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password)
      } else {
        await signIn(formData.email, formData.password)
      }
    } catch (error) {
      // Error handling is done in the store
    }
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setFormData({ email: '', password: '' })
    setShowPassword(false)
  }

  return (
    <motion.div
      className="relative cyberpunk-border rounded-2xl p-8 w-full max-w-md backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyberpunk-primary/10 via-transparent to-cyberpunk-secondary/10 rounded-2xl blur-xl -z-10" />
      
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          className="w-16 h-16 bg-gradient-to-br from-cyberpunk-primary via-cyberpunk-secondary to-cyberpunk-accent rounded-xl mx-auto mb-4 flex items-center justify-center relative overflow-hidden"
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ type: "spring", stiffness: 200, duration: 0.8 }}
        >
          <span className="text-cyberpunk-dark font-bold text-2xl relative z-10">A</span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: [-100, 100] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
        
        <motion.h2 
          className="text-2xl font-bold text-white mb-2"
          animate={{ textShadow: ["0 0 10px #00ffff", "0 0 20px #00ffff", "0 0 10px #00ffff"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isSignUp ? 'Begin Your Ascension' : 'Welcome Back, Hunter'}
        </motion.h2>
        <p className="text-gray-400 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-cyberpunk-accent" />
          {isSignUp ? 'Create your hunter profile' : 'Continue your journey'}
          <Sparkles className="w-4 h-4 text-cyberpunk-accent" />
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Hunter ID (Email)
          </label>
          <div className="relative group">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your hunter ID"
              className="w-full px-4 py-3 bg-cyberpunk-gray/50 border border-cyberpunk-primary/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyberpunk-primary focus:ring-2 focus:ring-cyberpunk-primary/20 transition-all duration-300 group-hover:border-cyberpunk-primary/50"
              required
            />
            <div className="absolute inset-0 bg-gradient-to-r from-cyberpunk-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Access Code (Password)
          </label>
          <div className="relative group">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your access code"
              className="w-full px-4 py-3 bg-cyberpunk-gray/50 border border-cyberpunk-primary/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyberpunk-primary focus:ring-2 focus:ring-cyberpunk-primary/20 transition-all duration-300 group-hover:border-cyberpunk-primary/50"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-cyberpunk-primary transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <div className="absolute inset-0 bg-gradient-to-r from-cyberpunk-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading || !formData.email || !formData.password}
          className="w-full bg-gradient-to-r from-cyberpunk-primary/20 to-cyberpunk-secondary/20 border border-cyberpunk-primary/50 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:from-cyberpunk-primary/30 hover:to-cyberpunk-secondary/30 hover:border-cyberpunk-primary hover:shadow-lg hover:shadow-cyberpunk-primary/30 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <motion.div 
                className="w-5 h-5 border-2 border-cyberpunk-primary border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              {isSignUp ? 'Initializing Hunter Profile...' : 'Accessing System...'}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 relative z-10">
              {isSignUp ? <User size={20} /> : <Zap size={20} />}
              {isSignUp ? 'Create Hunter Profile' : 'Enter AscendOS'}
            </div>
          )}
          
          {/* Button Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyberpunk-primary/20 to-transparent"
            animate={{ x: [-100, 100] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </motion.button>
      </form>

      {/* Toggle Mode */}
      <motion.div 
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-gray-400 mb-2">
          {isSignUp ? 'Already registered as a hunter?' : "New to the hunter system?"}
        </p>
        <motion.button
          onClick={toggleMode}
          className="text-cyberpunk-primary hover:text-cyberpunk-secondary transition-colors font-medium relative group"
          whileHover={{ scale: 1.05 }}
        >
          {isSignUp ? 'Access Existing Profile' : 'Register as Hunter'}
          <motion.div
            className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-secondary origin-left"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </motion.div>

      {/* System Info */}
      <motion.div 
        className="mt-8 p-4 bg-cyberpunk-primary/5 border border-cyberpunk-primary/20 rounded-lg relative overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="absolute top-2 right-2">
          <motion.div
            className="w-2 h-2 bg-cyberpunk-primary rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <p className="text-xs text-gray-400 text-center leading-relaxed">
          <span className="text-cyberpunk-primary font-medium">System Status:</span> Online
          <br />
          Demo environment - Use any credentials to access
          <br />
          <span className="text-cyberpunk-secondary">⚠️ Configure Supabase for production</span>
        </p>
      </motion.div>
    </motion.div>
  )
} 