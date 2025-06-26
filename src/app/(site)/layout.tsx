'use client'

import { motion } from 'framer-motion'
import Sidebar from '../../components/Sidebar'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      
      {/* Floating Particles Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
              y: [-20, -100],
              x: [0, Math.random() * 40 - 20],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut"
            }}
          >
            <div 
              className={`w-0.5 h-0.5 rounded-full ${
                Math.random() > 0.7 ? 'bg-blue-400/40' : 
                Math.random() > 0.4 ? 'bg-purple-400/40' : 'bg-teal-400/40'
              }`}
              style={{
                boxShadow: `0 0 ${Math.random() * 10 + 3}px currentColor`,
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Main Layout Container */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <motion.main 
          className="flex-1 ml-0 md:ml-64 relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Content Wrapper with Padding */}
          <div className="h-full overflow-y-auto">
            <div className="p-6 md:p-8">
              {/* Page Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {children}
              </motion.div>
            </div>
          </div>
          
          {/* Decorative Corner Glow */}
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-blue-500/10 via-purple-500/5 to-transparent pointer-events-none"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </motion.main>
      </div>
    </div>
  )
} 