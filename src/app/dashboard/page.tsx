'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  Target, 
  Trophy, 
  Flame, 
  Brain, 
  Dumbbell, 
  Zap as Lightning,
  Eye,
  Heart,
  Shield,
  Plus,
  CheckCircle,
  XCircle,
  Gift,
  Sparkles,
  TrendingUp,
  Gamepad2,
  Volume2,
  VolumeX
} from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { useStatsStore, useQuestsStore, useUIStore } from '../../lib/store'

// Mock data for demo since auth is disabled
const mockStats = [
  { id: '1', stat_name: 'Intelligence', xp: 450, level: 4, icon: Brain, color: 'from-blue-500 to-cyan-400' },
  { id: '2', stat_name: 'Strength', xp: 320, level: 3, icon: Dumbbell, color: 'from-red-500 to-orange-400' },
  { id: '3', stat_name: 'Dexterity', xp: 280, level: 2, icon: Lightning, color: 'from-yellow-500 to-amber-400' },
  { id: '4', stat_name: 'Wisdom', xp: 510, level: 5, icon: Eye, color: 'from-purple-500 to-indigo-400' },
  { id: '5', stat_name: 'Charisma', xp: 190, level: 1, icon: Heart, color: 'from-pink-500 to-rose-400' },
  { id: '6', stat_name: 'Discipline', xp: 380, level: 3, icon: Shield, color: 'from-green-500 to-emerald-400' }
]

const mockQuests = [
  { id: '1', title: 'Complete Morning Workout', stat_target: 'Strength', xp_reward: 50, due_date: new Date().toISOString(), completed: false },
  { id: '2', title: 'Read 30 Pages', stat_target: 'Intelligence', xp_reward: 40, due_date: new Date().toISOString(), completed: false },
  { id: '3', title: 'Meditate for 15 Minutes', stat_target: 'Wisdom', xp_reward: 35, due_date: new Date().toISOString(), completed: false }
]

// Floating Particles Component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
            className={`w-1 h-1 rounded-full ${
              Math.random() > 0.5 ? 'bg-blue-400/40' : 'bg-purple-400/40'
            }`}
            style={{
              boxShadow: `0 0 ${Math.random() * 10 + 5}px currentColor`,
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

// Floating XP Badge Component
const FloatingXPBadge = ({ xp, position, onComplete }: { xp: number, position: { x: number, y: number }, onComplete: () => void }) => {
  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{ left: position.x, top: position.y }}
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={{ 
        opacity: [0, 1, 1, 0], 
        scale: [0, 1.2, 1, 0.8], 
        y: -100 
      }}
      transition={{ 
        duration: 2,
        ease: "easeOut"
      }}
      onAnimationComplete={onComplete}
    >
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-4 py-2 rounded-full shadow-lg">
        +{xp} XP
      </div>
    </motion.div>
  )
}

// Enhanced Level Up Modal
const LevelUpModal = ({ isVisible, statName, newLevel, onClose }: { 
  isVisible: boolean, 
  statName: string, 
  newLevel: number, 
  onClose: () => void 
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Burst Animation Background */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 3, opacity: [0, 0.3, 0] }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <div className="w-full h-full bg-gradient-radial from-blue-500/20 to-transparent" />
          </motion.div>

          <motion.div
            className="relative bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-xl border-2 border-blue-400/50 rounded-3xl p-8 text-center max-w-md mx-4"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ type: "spring", duration: 1, bounce: 0.3 }}
            style={{
              boxShadow: '0 0 50px rgba(59, 130, 246, 0.5), inset 0 0 50px rgba(59, 130, 246, 0.1)'
            }}
          >
            {/* Glowing Border Animation */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-blue-400/30"
              animate={{
                borderColor: ['rgba(59, 130, 246, 0.3)', 'rgba(59, 130, 246, 0.8)', 'rgba(59, 130, 246, 0.3)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Floating Icons */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-blue-400/60"
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: `${15 + (i % 2) * 70}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.3, 0.8, 0.3],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                ⚡
              </motion.div>
            ))}

            {/* Main Content */}
            <motion.div
              className="relative z-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="text-8xl mb-6"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                🆙
              </motion.div>

              <motion.h2 
                className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                LEVEL UP!
              </motion.h2>

              <motion.p 
                className="text-white text-xl mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {statName} reached Level {newLevel}
              </motion.p>

              <motion.button
                onClick={onClose}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                Continue
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// System Tooltip Component
const SystemTooltip = ({ soundEnabled, toggleSound }: { soundEnabled: boolean, toggleSound: () => void }) => {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2 }}
    >
      <div className="bg-gradient-to-r from-slate-900/90 to-purple-900/90 backdrop-blur-xl border border-blue-400/30 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-blue-300 text-sm">
          <Gamepad2 size={16} />
          <span>Press Q to create a new Quest</span>
        </div>
        <div className="flex items-center gap-2 text-purple-300 text-sm">
          <Target size={16} />
          <span>Click quests to complete them</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-blue-400/20">
          <span className="text-gray-400 text-xs">System Audio</span>
          <button
            onClick={toggleSound}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState(mockStats)
  const [quests, setQuests] = useState(mockQuests)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpStat, setLevelUpStat] = useState('')
  const [levelUpLevel, setLevelUpLevel] = useState(0)
  const [streak, setStreak] = useState(7)
  const [todayXP, setTodayXP] = useState(50)
  const [floatingXP, setFloatingXP] = useState<Array<{ id: number, xp: number, position: { x: number, y: number } }>>([])
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Calculate total level and XP
  const totalXP = stats.reduce((sum, stat) => sum + stat.xp, 0)
  const avgLevel = Math.floor(stats.reduce((sum, stat) => sum + stat.level, 0) / stats.length)

  // Play sound effect (mock implementation)
  const playSound = (type: 'xp' | 'levelup') => {
    if (!soundEnabled) return
    // In a real implementation, you would play actual audio files
    console.log(`Playing ${type} sound effect`)
  }

  const completeQuest = (questId: string, event: React.MouseEvent) => {
    const quest = quests.find(q => q.id === questId)
    if (!quest) return

    // Get click position for floating XP
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top
    }

    // Add floating XP badge
    const xpId = Date.now()
    setFloatingXP(prev => [...prev, { id: xpId, xp: quest.xp_reward, position }])

    // Update quest as completed
    setQuests(prev => prev.map(q => 
      q.id === questId ? { ...q, completed: true } : q
    ))

    // Find related stat and update XP
    const statIndex = stats.findIndex(s => s.stat_name === quest.stat_target)
    if (statIndex !== -1) {
      const oldStat = stats[statIndex]
      const newXP = oldStat.xp + quest.xp_reward
      const newLevel = Math.floor(newXP / 100)
      
      setStats(prev => prev.map((stat, index) => 
        index === statIndex ? { ...stat, xp: newXP, level: newLevel } : stat
      ))

      // Check for level up
      if (newLevel > oldStat.level) {
        setLevelUpStat(quest.stat_target)
        setLevelUpLevel(newLevel)
        setShowLevelUp(true)
        playSound('levelup')
      } else {
        playSound('xp')
      }
    }

    setTodayXP(prev => prev + quest.xp_reward)
  }

  const removeFloatingXP = (id: number) => {
    setFloatingXP(prev => prev.filter(xp => xp.id !== id))
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'q') {
        console.log('Create new quest shortcut pressed')
        // In a real implementation, this would open the create quest modal
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <FloatingParticles />
        
        {/* Grid Pattern */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '50px 50px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-transparent to-purple-500/5" />
      </div>

      <Sidebar />

      {/* Floating XP Badges */}
      {floatingXP.map(xp => (
        <FloatingXPBadge
          key={xp.id}
          xp={xp.xp}
          position={xp.position}
          onComplete={() => removeFloatingXP(xp.id)}
        />
      ))}

      {/* Enhanced Level Up Modal */}
      <LevelUpModal
        isVisible={showLevelUp}
        statName={levelUpStat}
        newLevel={levelUpLevel}
        onClose={() => setShowLevelUp(false)}
      />

      {/* System Tooltip */}
      <SystemTooltip 
        soundEnabled={soundEnabled}
        toggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      <main className="md:ml-64 p-6 relative z-10">
        {/* Header Section with Enhanced Animations */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        >
          <div className="relative bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-6 overflow-hidden">
            {/* Glassmorphism Enhancement */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
            
            <div className="relative flex items-center justify-between">
              <div>
                <motion.h1 
                  className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Welcome back, Shadow Hunter
                </motion.h1>
                <motion.p 
                  className="text-blue-300 text-lg mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Level {avgLevel} • Total XP: {totalXP.toLocaleString()}
                </motion.p>
              </div>
              
              <div className="flex items-center gap-6">
                {/* Enhanced Streak Counter */}
                <motion.div
                  className="flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 rounded-xl px-4 py-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Flame className="text-orange-400" size={24} />
                  </motion.div>
                  <div>
                    <div className="text-orange-400 font-bold text-xl">{streak}</div>
                    <div className="text-orange-300 text-sm">Day Streak</div>
                  </div>
                </motion.div>

                {/* Enhanced Today's XP */}
                <motion.div
                  className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl px-4 py-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <TrendingUp className="text-green-400" size={24} />
                  </motion.div>
                  <div>
                    <div className="text-green-400 font-bold text-xl">+{todayXP}</div>
                    <div className="text-green-300 text-sm">Today's XP</div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Enhanced System Notification */}
            <motion.div
              className="mt-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-400/20 rounded-xl p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-2 h-2 bg-blue-400 rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-blue-300">📈 System Alert: You gained +{todayXP} XP in Wisdom today</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Enhanced Stats Section */}
          <div className="xl:col-span-2">
            <motion.h2
              className="text-2xl font-bold text-white mb-6 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="text-blue-400" />
              </motion.div>
              Hunter Statistics
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon
                const progress = (stat.xp % 100) / 100

                return (
                  <motion.div
                    key={stat.id}
                    className="group relative"
                    initial={{ opacity: 0, y: 50, rotateX: -15 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ 
                      delay: index * 0.1 + 0.5,
                      type: "spring",
                      bounce: 0.3
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 5,
                      rotateX: 5,
                      z: 50
                    }}
                    style={{ perspective: 1000 }}
                  >
                    {/* Enhanced Glow Effect */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-30 rounded-2xl blur-xl transition-opacity duration-500`}
                      whileHover={{ scale: 1.1 }}
                    />
                    
                    {/* Glassmorphism Card */}
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-blue-400/30 transition-all duration-500 shadow-2xl">
                      {/* Ambient Inner Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
                      
                      {/* Header */}
                      <div className="relative flex items-center justify-between mb-4">
                        <motion.div 
                          className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <IconComponent className="text-white" size={24} />
                        </motion.div>
                        <div className="text-right">
                          <motion.div 
                            className="text-2xl font-bold text-white"
                            key={stat.level}
                            initial={{ scale: 1.5, color: '#60A5FA' }}
                            animate={{ scale: 1, color: '#FFFFFF' }}
                            transition={{ duration: 0.3 }}
                          >
                            Lv.{stat.level}
                          </motion.div>
                          <div className="text-sm text-gray-400">{stat.xp} XP</div>
                        </div>
                      </div>

                      {/* Stat Name */}
                      <h3 className="relative text-lg font-semibold text-white mb-3">{stat.stat_name}</h3>

                      {/* Enhanced XP Progress Bar */}
                      <div className="relative space-y-2">
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>{stat.xp % 100} / 100 XP</span>
                          <span>Next: Lv.{stat.level + 1}</span>
                        </div>
                        
                        <div className="h-3 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${stat.color} rounded-full relative overflow-hidden shadow-lg`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress * 100}%` }}
                            transition={{ duration: 1.5, delay: index * 0.1 + 0.8, ease: "easeOut" }}
                          >
                            {/* Enhanced Shimmer Effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                              animate={{ x: [-100, 200] }}
                              transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                            />
                            {/* Pulse Effect */}
                            <motion.div
                              className="absolute inset-0 bg-white/20"
                              animate={{ opacity: [0, 0.5, 0] }}
                              transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                            />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Enhanced Right Column */}
          <div className="space-y-8">
            {/* Enhanced Active Quests */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, type: "spring", bounce: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Target className="text-purple-400" />
                </motion.div>
                Active Quests
              </h2>

              <div className="space-y-4">
                {quests.map((quest, index) => (
                  <motion.div
                    key={quest.id}
                    className="relative bg-white/5 backdrop-blur-xl border border-purple-400/20 rounded-xl p-4 hover:border-purple-400/40 transition-all duration-300 shadow-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.8, type: "spring", bounce: 0.2 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    {/* Glassmorphism Enhancement */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-xl" />
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">{quest.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span>{quest.stat_target}</span>
                          <span>•</span>
                          <motion.span 
                            className="text-yellow-400"
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            +{quest.xp_reward} XP
                          </motion.span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {!quest.completed ? (
                          <>
                            <motion.button
                              onClick={(e) => completeQuest(quest.id, e)}
                              className="w-10 h-10 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-lg flex items-center justify-center text-green-400 hover:bg-green-500/30 transition-colors shadow-lg"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <CheckCircle size={16} />
                            </motion.button>
                            <motion.button
                              className="w-10 h-10 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors shadow-lg"
                              whileHover={{ scale: 1.1, rotate: -5 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <XCircle size={16} />
                            </motion.button>
                          </>
                        ) : (
                          <motion.div 
                            className="w-10 h-10 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-lg flex items-center justify-center text-green-400"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                          >
                            <CheckCircle size={16} />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced Recent Rewards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, type: "spring", bounce: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Trophy className="text-yellow-400" />
                </motion.div>
                Recent Rewards
              </h2>

              <motion.div 
                className="relative bg-white/5 backdrop-blur-xl border border-yellow-400/20 rounded-xl p-6 shadow-lg"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                {/* Glassmorphism Enhancement */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-xl" />
                
                <div className="relative flex items-center gap-4">
                  <motion.div 
                    className="w-12 h-12 bg-yellow-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Gift className="text-yellow-400" size={24} />
                  </motion.div>
                  <div>
                    <h3 className="text-white font-medium">Gym Session Unlocked!</h3>
                    <p className="text-gray-400 text-sm">Earned with 500 Strength XP</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}