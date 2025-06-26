'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  User, 
  Mail, 
  AlertTriangle, 
  RefreshCw, 
  LogOut,
  Save,
  X,
  Shield,
  Zap,
  Palette,
  Bell,
  Lock
} from 'lucide-react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText: string
  isDestructive?: boolean
}

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText, 
  isDestructive = false 
}: ConfirmationModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="solo-panel p-8 max-w-md w-full relative"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", bounce: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Warning Icon */}
            <motion.div
              className={`w-16 h-16 ${isDestructive ? 'bg-red-500/20' : 'bg-blue-500/20'} rounded-full flex items-center justify-center mx-auto mb-6`}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertTriangle size={32} className={isDestructive ? 'text-red-400' : 'text-blue-400'} />
            </motion.div>

            <h2 className="text-2xl font-bold text-center text-blue-100 mb-4 fantasy-font">{title}</h2>
            <p className="text-blue-200 text-center mb-8 ui-font">{message}</p>

            <div className="flex gap-4">
              <motion.button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-blue-200 rounded-xl transition-colors ui-font font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={onConfirm}
                className={`flex-1 px-6 py-3 ${
                  isDestructive 
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-400/30' 
                    : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-400/30'
                } rounded-xl transition-colors ui-font font-semibold`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface ToggleSwitchProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label: string
  description: string
  icon: React.ReactNode
  color?: string
}

const ToggleSwitch = ({ enabled, onChange, label, description, icon, color = 'blue' }: ToggleSwitchProps) => {
  return (
    <motion.div
      className="flex items-center justify-between p-4 solo-panel-inner rounded-xl"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-4">
        <motion.div
          className={`w-12 h-12 bg-gradient-to-br from-${color}-500/30 to-${color}-600/30 rounded-xl flex items-center justify-center`}
          animate={{
            boxShadow: enabled 
              ? [`0 0 15px rgba(59, 130, 246, 0.3)`, `0 0 25px rgba(59, 130, 246, 0.5)`, `0 0 15px rgba(59, 130, 246, 0.3)`]
              : ['0 0 0px rgba(0, 0, 0, 0)']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {icon}
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold text-blue-100 ui-font">{label}</h3>
          <p className="text-sm text-blue-300/70 ui-font">{description}</p>
        </div>
      </div>
      
      <motion.button
        onClick={() => onChange(!enabled)}
        className={`
          relative w-14 h-8 rounded-full transition-colors duration-300
          ${enabled ? `bg-${color}-500/30 border-${color}-400/50` : 'bg-slate-700/50 border-slate-600/50'}
          border-2
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className={`
            absolute top-1 w-6 h-6 rounded-full transition-all duration-300
            ${enabled ? `bg-${color}-400 left-7` : 'bg-slate-400 left-1'}
          `}
          animate={{
            boxShadow: enabled 
              ? [`0 0 10px rgba(59, 130, 246, 0.5)`, `0 0 15px rgba(59, 130, 246, 0.8)`, `0 0 10px rgba(59, 130, 246, 0.5)`]
              : ['0 0 0px rgba(0, 0, 0, 0)']
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.button>
    </motion.div>
  )
}

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [displayName, setDisplayName] = useState('Prithvi')
  const [tempDisplayName, setTempDisplayName] = useState('Prithvi')
  const [email] = useState('hunter@ascendos.app') // Mock email from Supabase session
  const [showResetModal, setShowResetModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('ascendos-settings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setDarkMode(settings.darkMode ?? true)
      setSoundEffects(settings.soundEffects ?? true)
      setNotifications(settings.notifications ?? true)
      setDisplayName(settings.displayName ?? 'Prithvi')
      setTempDisplayName(settings.displayName ?? 'Prithvi')
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = () => {
    const settings = {
      darkMode,
      soundEffects,
      notifications,
      displayName: tempDisplayName
    }
    localStorage.setItem('ascendos-settings', JSON.stringify(settings))
    setDisplayName(tempDisplayName)
    
    // Show success toast (you could implement a toast system)
    console.log('Settings saved successfully!')
  }

  const handleResetProgress = async () => {
    setIsResetting(true)
    
    // Simulate reset process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Clear all progress data (in a real app, this would clear the database)
    localStorage.removeItem('ascendos-progress')
    localStorage.removeItem('ascendos-stats')
    localStorage.removeItem('ascendos-quests')
    
    setIsResetting(false)
    setShowResetModal(false)
    
    console.log('Progress reset successfully!')
  }

  const handleLogout = async () => {
    try {
      const { supabase } = await import('../../../lib/supabase')
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
      } else {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Error during sign out:', error)
    }
  }

  return (
    <>
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl font-bold mb-4 fantasy-font bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent text-shadow-glow">
          ⚙️ System Configuration
        </h1>
        <p className="text-xl text-blue-300/80 ui-font">
          Customize your Hunter OS experience and manage your account
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appearance Settings */}
        <motion.div
          className="solo-panel p-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-blue-100 mb-6 fantasy-font flex items-center gap-3">
            <Palette className="text-purple-400" size={24} />
            Appearance
          </h2>
          
          <div className="space-y-4">
            <ToggleSwitch
              enabled={darkMode}
              onChange={setDarkMode}
              label="Dark Mode"
              description="Toggle between dark and light themes"
              icon={darkMode ? <Moon className="text-blue-400" size={20} /> : <Sun className="text-yellow-400" size={20} />}
              color="blue"
            />
          </div>
        </motion.div>

        {/* Audio Settings */}
        <motion.div
          className="solo-panel p-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-blue-100 mb-6 fantasy-font flex items-center gap-3">
            <Volume2 className="text-green-400" size={24} />
            Audio & Notifications
          </h2>
          
          <div className="space-y-4">
            <ToggleSwitch
              enabled={soundEffects}
              onChange={setSoundEffects}
              label="Sound Effects"
              description="Play audio feedback for actions"
              icon={soundEffects ? <Volume2 className="text-green-400" size={20} /> : <VolumeX className="text-red-400" size={20} />}
              color="green"
            />
            
            <ToggleSwitch
              enabled={notifications}
              onChange={setNotifications}
              label="Push Notifications"
              description="Receive quest reminders and updates"
              icon={<Bell className="text-yellow-400" size={20} />}
              color="yellow"
            />
          </div>
        </motion.div>

        {/* Profile Settings */}
        <motion.div
          className="solo-panel p-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-blue-100 mb-6 fantasy-font flex items-center gap-3">
            <User className="text-blue-400" size={24} />
            Profile
          </h2>
          
          <div className="space-y-6">
            {/* Display Name */}
            <div>
              <label className="block text-sm font-semibold text-blue-300 mb-2 ui-font">
                Hunter Name
              </label>
              <input
                type="text"
                value={tempDisplayName}
                onChange={(e) => setTempDisplayName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-blue-400/30 rounded-xl text-blue-100 placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 ui-font"
                placeholder="Enter your hunter name"
              />
            </div>

            {/* Save Button */}
            <motion.button
              onClick={saveSettings}
              disabled={tempDisplayName === displayName}
              className={`
                w-full px-6 py-3 rounded-xl font-semibold ui-font transition-all duration-300
                ${tempDisplayName !== displayName
                  ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-400/30'
                  : 'bg-slate-700/50 text-slate-400 border border-slate-600/30 cursor-not-allowed'
                }
              `}
              whileHover={tempDisplayName !== displayName ? { scale: 1.02 } : {}}
              whileTap={tempDisplayName !== displayName ? { scale: 0.98 } : {}}
            >
              <Save className="inline mr-2" size={18} />
              Save Changes
            </motion.button>
          </div>
        </motion.div>

        {/* Account Info */}
        <motion.div
          className="solo-panel p-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-blue-100 mb-6 fantasy-font flex items-center gap-3">
            <Shield className="text-purple-400" size={24} />
            Account
          </h2>
          
          <div className="space-y-6">
            {/* Email Display */}
            <div>
              <label className="block text-sm font-semibold text-blue-300 mb-2 ui-font">
                Email Address
              </label>
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/30 border border-slate-600/30 rounded-xl">
                <Mail className="text-blue-400" size={18} />
                <span className="text-blue-200 ui-font">{email}</span>
              </div>
            </div>

            {/* Logout Button */}
            <motion.button
              onClick={() => setShowLogoutModal(true)}
              className="w-full px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-400/30 rounded-xl font-semibold ui-font transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="inline mr-2" size={18} />
              Sign Out
            </motion.button>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          className="lg:col-span-2 solo-panel p-6 border-red-400/30"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-red-400 mb-6 fantasy-font flex items-center gap-3">
            <AlertTriangle className="text-red-400" size={24} />
            Danger Zone
          </h2>
          
          <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-300 mb-2 ui-font">Reset All Progress</h3>
            <p className="text-red-200/80 mb-4 ui-font">
              This will permanently delete all your stats, quests, and achievements. This action cannot be undone.
            </p>
            <motion.button
              onClick={() => setShowResetModal(true)}
              disabled={isResetting}
              className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-400/30 rounded-xl font-semibold ui-font transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={!isResetting ? { scale: 1.02 } : {}}
              whileTap={!isResetting ? { scale: 0.98 } : {}}
            >
              {isResetting ? (
                <>
                  <RefreshCw className="inline mr-2 animate-spin" size={18} />
                  Resetting...
                </>
              ) : (
                <>
                  <RefreshCw className="inline mr-2" size={18} />
                  Reset Progress
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetProgress}
        title="Reset All Progress?"
        message="This will permanently delete all your stats, completed quests, and achievements. This action cannot be undone."
        confirmText="Reset Everything"
        isDestructive={true}
      />

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Sign Out?"
        message="Are you sure you want to sign out of your Hunter account?"
        confirmText="Sign Out"
        isDestructive={false}
      />
    </>
  )
} 