'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Target, 
  Trophy, 
  LogOut, 
  Menu, 
  X, 
  User, 
  Zap, 
  Settings,
  Shield,
  Crown,
  ChevronLeft,
  ChevronRight,
  Power
} from 'lucide-react'

const navigationItems = [
  { href: '/dashboard', icon: Brain, label: 'Dashboard', color: 'from-blue-500 to-cyan-400', glow: 'shadow-blue-500/50' },
  { href: '/quests', icon: Target, label: 'Quests', color: 'from-purple-500 to-pink-400', glow: 'shadow-purple-500/50' },
  { href: '/rewards', icon: Trophy, label: 'Rewards', color: 'from-yellow-500 to-orange-400', glow: 'shadow-yellow-500/50' },
  { href: '/settings', icon: Settings, label: 'Settings', color: 'from-gray-500 to-gray-400', glow: 'shadow-gray-500/50' },
]

// Mock stats for demo
const mockStats = [
  { stat_name: 'Intelligence', xp: 450, level: 4 },
  { stat_name: 'Strength', xp: 320, level: 3 },
  { stat_name: 'Dexterity', xp: 280, level: 2 },
  { stat_name: 'Wisdom', xp: 510, level: 5 },
  { stat_name: 'Charisma', xp: 190, level: 1 },
  { stat_name: 'Discipline', xp: 380, level: 3 }
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  // Calculate average level from mock stats
  const avgLevel = Math.floor(mockStats.reduce((sum, stat) => sum + stat.level, 0) / mockStats.length)
  const totalXP = mockStats.reduce((sum, stat) => sum + stat.xp, 0)

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const handleSignOut = () => {
    console.log('Sign out clicked - Demo mode')
    // In real app: await supabase.auth.signOut()
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-black/40 backdrop-blur-xl border border-blue-400/30 rounded-xl text-blue-400 hover:text-blue-300 transition-colors shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isMobileOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Hunter Control Panel Sidebar */}
      <AnimatePresence>
        <motion.div
          className={`fixed left-0 top-0 h-full z-40 flex flex-col ${
            isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } ${isCollapsed ? 'md:w-20' : 'w-64'} transition-transform duration-300`}
          initial={false}
          animate={{ width: isCollapsed ? 80 : 256 }}
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(15,23,42,0.8) 100%)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '4px 0 20px rgba(59, 130, 246, 0.1)'
          }}
        >
          {/* Glowing Right Border */}
          <motion.div
            className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-cyan-500/50"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Header - System Logo */}
          <motion.div
            className="p-6 border-b border-blue-400/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                }}
              >
                <Zap className="text-white" size={16} />
              </motion.div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      ASCEND OS
                    </h1>
                    <p className="text-xs text-blue-300/70">Hunter Control Panel</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Hunter Profile */}
          <motion.div
            className="p-4 border-b border-blue-400/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-400/30">
                  <User size={20} className="text-blue-400" />
                </div>
                {/* Status Indicator */}
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black/50"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    className="flex-1 min-w-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">Hunter: Prithvi</p>
                      <Crown size={12} className="text-yellow-400" />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Shield size={12} className="text-blue-400" />
                      <p className="text-xs text-blue-300">Avg Level: {avgLevel}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Zap size={10} className="text-yellow-400" />
                      <p className="text-xs text-gray-400">{totalXP.toLocaleString()} XP</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4">
            <motion.ul
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {navigationItems.map((item, index) => {
                const isActive = pathname === item.href
                const IconComponent = item.icon
                
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index + 0.4 }}
                  >
                    <Link href={item.href} onClick={() => setIsMobileOpen(false)}>
                      <motion.div
                        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-300'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                        whileHover={{ 
                          scale: 1.02,
                          x: 5,
                        }}
                        whileTap={{ scale: 0.98 }}
                        animate={isActive ? {
                          boxShadow: ['0 0 20px rgba(59, 130, 246, 0.3)', '0 0 30px rgba(59, 130, 246, 0.5)', '0 0 20px rgba(59, 130, 246, 0.3)']
                        } : {}}
                        transition={isActive ? { boxShadow: { duration: 2, repeat: Infinity } } : {}}
                      >
                        {/* Icon with Glow */}
                        <motion.div
                          className={`relative ${isActive ? `bg-gradient-to-r ${item.color}` : ''} ${
                            isActive ? 'text-white' : ''
                          } p-2 rounded-lg`}
                          whileHover={!isActive ? {
                            background: `linear-gradient(45deg, ${item.color.split(' ')[1]}, ${item.color.split(' ')[3]})`,
                            color: '#ffffff'
                          } : {}}
                          style={isActive ? {
                            boxShadow: `0 0 15px ${item.glow.split('/')[0].replace('shadow-', 'rgba(').replace('-500', ', 0.5)')}`
                          } : {}}
                        >
                          <IconComponent size={18} />
                        </motion.div>

                        <AnimatePresence>
                          {!isCollapsed && (
                            <motion.span
                              className="font-medium"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {/* Active Indicator */}
                        {isActive && (
                          <motion.div
                            className="ml-auto"
                            layoutId="activeIndicator"
                          >
                            <motion.div
                              className="w-2 h-2 bg-blue-400 rounded-full"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.7, 1, 0.7],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </motion.div>
                        )}

                        {/* Hover Glow Effect */}
                        <motion.div
                          className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 bg-gradient-to-r ${item.color} transition-opacity duration-300`}
                        />
                      </motion.div>
                    </Link>
                  </motion.li>
                )
              })}
            </motion.ul>
          </nav>

          {/* Collapse Toggle (Desktop) */}
          <motion.div
            className="hidden md:block p-4 border-t border-blue-400/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex items-center justify-center p-3 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-300 border border-transparent hover:border-blue-400/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </motion.div>
            </motion.button>
          </motion.div>

          {/* System Status / Logout */}
          <motion.div
            className="p-4 border-t border-blue-400/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <motion.button
              onClick={handleSignOut}
              className={`w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300 border border-transparent hover:border-red-400/30 ${
                isCollapsed ? 'justify-center' : ''
              }`}
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Power size={18} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    className="text-sm font-medium"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    System Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
} 