'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Target, Trophy, LogOut, Menu, X, User, Zap, Settings } from 'lucide-react'
import { useAuthStore } from '../lib/store'

const navigationItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/quests', icon: Target, label: 'Quests' },
  { href: '/rewards', icon: Trophy, label: 'Rewards' },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuthStore()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 cyberpunk-button"
      >
        {isCollapsed ? <Menu size={20} /> : <X size={20} />}
      </button>

      {/* Sidebar */}
      <motion.div
        className={`fixed left-0 top-0 h-full cyberpunk-border border-r z-40 flex flex-col ${
          isCollapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'w-64'
        } transition-all duration-300`}
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-cyberpunk-primary/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyberpunk-primary to-cyberpunk-secondary rounded-lg flex items-center justify-center">
              <Zap className="text-cyberpunk-dark" size={16} />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-cyberpunk-primary">AscendOS</h1>
                <p className="text-xs text-gray-400">Level Up System</p>
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-cyberpunk-primary/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyberpunk-primary/20 rounded-full flex items-center justify-center">
                <User size={16} className="text-cyberpunk-primary" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-400">Hunter</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-cyberpunk-primary/20 text-cyberpunk-primary border border-cyberpunk-primary/50'
                        : 'text-gray-400 hover:text-white hover:bg-cyberpunk-gray/50'
                    }`}
                  >
                    <item.icon size={20} />
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                    {isActive && (
                      <motion.div
                        className="ml-auto w-2 h-2 bg-cyberpunk-primary rounded-full"
                        layoutId="activeIndicator"
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Collapse Toggle (Desktop) */}
        <div className="hidden md:block p-4 border-t border-cyberpunk-primary/30">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-white hover:bg-cyberpunk-gray/50 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Sign Out */}
        <div className="p-4 border-t border-cyberpunk-primary/30">
          <button
            onClick={handleSignOut}
            className={`flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </motion.div>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  )
} 