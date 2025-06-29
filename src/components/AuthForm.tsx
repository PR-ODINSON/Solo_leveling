'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function AuthForm() {
  const router = useRouter()

  const handleRedirectToAuth = () => {
    router.push('/auth')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <motion.div
        className="text-center max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Logo */}
        <motion.div
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center relative overflow-hidden"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Sparkles className="w-8 h-8 text-white z-10" />
          
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-purple-400/30 rounded-2xl"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
          Authentication Required
        </h2>
        
        <p className="text-gray-400 mb-8">
          Please access the Hunter Association system to continue
        </p>

        <motion.button
          onClick={handleRedirectToAuth}
          className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg text-lg font-semibold text-white hover:from-cyan-500 hover:to-purple-500 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Access Hunter System
        </motion.button>
      </motion.div>
    </div>
  )
} 