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
  Power,
  Sword,
  Scroll,
  Package,
  Home
} from 'lucide-react'
import { calculatePowerLevel, getHunterRank } from '../lib/utils'

// Solo Leveling themed navigation items
const navigationItems = [
  { href: '/dashboard', icon: Home, label: 'Command Center', color: 'from-blue-500 to-cyan-400', glow: 'shadow-blue-500/50', emoji: '🏛️' },
  { href: '/quests', icon: Sword, label: 'Quest Board', color: 'from-purple-500 to-pink-400', glow: 'shadow-purple-500/50', emoji: '⚔️' },
  { href: '/rewards', icon: Trophy, label: 'Treasure Vault', color: 'from-yellow-500 to-orange-400', glow: 'shadow-yellow-500/50', emoji: '🏆' },
  { href: '/inventory', icon: Package, label: 'Inventory', color: 'from-green-500 to-emerald-400', glow: 'shadow-green-500/50', emoji: '🎒' },
  { href: '/settings', icon: Settings, label: 'System Config', color: 'from-gray-500 to-gray-400', glow: 'shadow-gray-500/50', emoji: '⚙️' },
]

// Mock stats for demo
const mockStats = [
  { stat_name: 'Intelligence', xp: 450, level: 4 },
  { stat_name: 'Strength', xp: 520, level: 5 },
  { stat_name: 'Dexterity', xp: 380, level: 3 },
  { stat_name: 'Wisdom', xp: 610, level: 6 },
  { stat_name: 'Charisma', xp: 290, level: 2 },
  { stat_name: 'Discipline', xp: 480, level: 4 }
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  // Calculate hunter stats
  const powerLevel = calculatePowerLevel(mockStats)
  const hunterRank = getHunterRank(powerLevel)
  const avgLevel = Math.floor(mockStats.reduce((sum, stat) => sum + stat.level, 0) / mockStats.length)
  const totalXP = mockStats.reduce((sum, stat) => sum + stat.xp, 0)

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    try {
      const { supabase } = await import('../lib/supabase')
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
      } else {
        // Redirect to home page or login
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Error during sign out:', error)
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 solo-panel text-blue-400 hover:text-blue-300 transition-colors"
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
            background: 'linear-gradient(180deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 46, 0.9) 50%, rgba(22, 33, 62, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRight: '2px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '8px 0 32px rgba(0, 0, 0, 0.4), inset 1px 0 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Animated Right Border */}
          <motion.div
            className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-teal-500/50"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 4, repeat: Infinity }}
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
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                animate={{ 
                  rotate: [0, 360],
                  boxShadow: [
                    '0 0 20px rgba(59, 130, 246, 0.5)',
                    '0 0 30px rgba(147, 51, 234, 0.7)',
                    '0 0 20px rgba(59, 130, 246, 0.5)'
                  ]
                }}
                transition={{ 
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  boxShadow: { duration: 3, repeat: Infinity }
                }}
              >
                <Zap className="text-white" size={20} />
              </motion.div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h1 className="text-xl font-bold fantasy-font bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      HUNTER OS
                    </h1>
                    <p className="text-xs text-blue-300/70 ui-font">System Interface</p>
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
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-blue-400/50">
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
                      <p className="text-sm font-bold text-blue-100 ui-font">Hunter: Prithvi</p>
                      <span className="text-xs">{hunterRank.icon}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Shield size={12} className="text-blue-400" />
                      <p className={`text-xs ${hunterRank.color} ui-font font-semibold`}>{hunterRank.rank}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Power size={10} className="text-red-400" />
                      <p className="text-xs text-gray-400 ui-font">{powerLevel.toLocaleString()} Power</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item, index) => {
              const isActive = pathname === item.href
              const IconComponent = item.icon

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index + 0.3 }}
                >
                  <Link href={item.href}>
                    <motion.div
                      className={`
                        relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/50 text-blue-100' 
                          : 'text-blue-300/70 hover:text-blue-100 hover:bg-blue-500/10'
                        }
                      `}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full"
                          layoutId="activeIndicator"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}

                      {/* Icon */}
                      <motion.div
                        className={`
                          w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300
                          ${isActive 
                            ? `bg-gradient-to-r ${item.color} shadow-lg ${item.glow}` 
                            : 'bg-slate-800/50 group-hover:bg-slate-700/50'
                          }
                        `}
                        animate={isActive ? {
                          boxShadow: [
                            '0 0 10px rgba(59, 130, 246, 0.3)',
                            '0 0 20px rgba(59, 130, 246, 0.5)',
                            '0 0 10px rgba(59, 130, 246, 0.3)'
                          ]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="text-lg">{item.emoji}</span>
                      </motion.div>

                      {/* Label */}
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.div
                            className="flex-1"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span className={`font-medium ui-font ${isActive ? 'text-blue-100' : ''}`}>
                              {item.label}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Hover Glow Effect */}
                      <motion.div
                        className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                        style={{
                          background: `linear-gradient(135deg, ${item.color.split(' ')[1]}, ${item.color.split(' ')[3]})`,
                          filter: 'blur(15px)',
                          zIndex: -1,
                        }}
                      />
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Collapse Toggle */}
          <motion.div
            className="hidden md:block p-4 border-t border-blue-400/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex items-center justify-center p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-blue-400 hover:text-blue-300 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronLeft size={18} />
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Sign Out */}
          <motion.div
            className="p-4 border-t border-blue-400/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.button
              onClick={handleSignOut}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl 
                bg-red-500/10 border border-red-400/30 text-red-400 
                hover:bg-red-500/20 hover:text-red-300 transition-all duration-300
                ${isCollapsed ? 'justify-center' : ''}
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut size={18} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    className="font-medium ui-font"
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
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
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