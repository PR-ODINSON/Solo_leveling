'use client'

import { motion } from 'framer-motion'

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-cyberpunk-dark flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 border-4 border-cyberpunk-primary/30 border-t-cyberpunk-primary rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          <h2 className="text-xl font-bold text-cyberpunk-primary mb-2">
            Initializing System...
          </h2>
          <p className="text-gray-400">
            Loading your adventure
          </p>
        </motion.div>
      </div>
    </div>
  )
} 