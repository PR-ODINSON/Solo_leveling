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
  VolumeX,
  Crown,
  Sword,
  Star,
  Power
} from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { useStatsStore, useQuestsStore, useUIStore } from '../../lib/store'
import { 
  STAT_ICONS, 
  STAT_DESCRIPTIONS, 
  calculateLevel, 
  getXpProgress, 
  calculatePowerLevel, 
  getHunterRank,
  getQuestDifficulty 
} from '../../lib/utils'

// Mock data with Solo Leveling theme
const mockStats = [
  { id: '1', stat_name: 'Intelligence', xp: 450, level: 4, icon: '🧠', color: 'from-blue-500 to-cyan-400' },
  { id: '2', stat_name: 'Strength', xp: 520, level: 5, icon: '⚔️', color: 'from-red-500 to-orange-400' },
  { id: '3', stat_name: 'Dexterity', xp: 380, level: 3, icon: '🏹', color: 'from-green-500 to-emerald-400' },
  { id: '4', stat_name: 'Wisdom', xp: 610, level: 6, icon: '🔮', color: 'from-purple-500 to-indigo-400' },
  { id: '5', stat_name: 'Charisma', xp: 290, level: 2, icon: '👑', color: 'from-yellow-500 to-amber-400' },
  { id: '6', stat_name: 'Discipline', xp: 480, level: 4, icon: '🛡️', color: 'from-gray-500 to-slate-400' }
]

const mockQuests = [
  { id: '1', title: 'Complete Morning Training Routine', stat_target: 'Strength', xp_reward: 50, rarity: 'Common', due_date: new Date().toISOString(), completed: false },
  { id: '2', title: 'Study Advanced Magic Theory', stat_target: 'Intelligence', xp_reward: 75, rarity: 'Rare', due_date: new Date().toISOString(), completed: false },
  { id: '3', title: 'Clear B-Rank Dungeon', stat_target: 'Dexterity', xp_reward: 120, rarity: 'Epic', due_date: new Date().toISOString(), completed: false },
  { id: '4', title: 'Defeat Shadow Monarch', stat_target: 'Wisdom', xp_reward: 250, rarity: 'Legendary', due_date: new Date().toISOString(), completed: false }
]

// Floating Particles Background
const ParticleField = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      
      {/* Floating Particles */}
      {[...Array(150)].map((_, i) => (
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
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
            y: [-30, -150],
            x: [0, Math.random() * 60 - 30],
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "easeOut"
          }}
        >
          <div 
            className={`w-1 h-1 rounded-full ${
              Math.random() > 0.7 ? 'bg-blue-400/60' : 
              Math.random() > 0.4 ? 'bg-purple-400/60' : 'bg-teal-400/60'
            }`}
            style={{
              boxShadow: `0 0 ${Math.random() * 15 + 5}px currentColor`,
            }}
          />
        </motion.div>
      ))}
      
      {/* Larger Glowing Orbs */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `radial-gradient(circle, ${
              Math.random() > 0.5 ? 'rgba(59, 130, 246, 0.6)' : 'rgba(147, 51, 234, 0.6)'
            }, transparent)`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
          }}
          transition={{
            duration: Math.random() * 8 + 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
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
        scale: [0, 1.3, 1, 0.8], 
        y: -120 
      }}
      transition={{ 
        duration: 2.5,
        ease: "easeOut"
      }}
      onAnimationComplete={onComplete}
    >
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black font-bold px-6 py-3 rounded-full shadow-2xl ui-font text-lg">
        +{xp} XP
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full blur-md opacity-60 -z-10" />
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Burst Animation Background */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 4, opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <div className="w-full h-full bg-gradient-radial from-blue-500/30 via-purple-500/20 to-transparent" />
          </motion.div>

          <motion.div
            className="relative solo-panel p-12 text-center max-w-lg mx-4 border-2 border-yellow-400/50"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ type: "spring", duration: 1.2, bounce: 0.4 }}
            style={{
              boxShadow: '0 0 60px rgba(251, 191, 36, 0.6), inset 0 0 60px rgba(251, 191, 36, 0.1)'
            }}
          >
            {/* Glowing Border Animation */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-yellow-400/50"
              animate={{
                borderColor: ['rgba(251, 191, 36, 0.3)', 'rgba(251, 191, 36, 1)', 'rgba(251, 191, 36, 0.3)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Floating Icons */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-400/80 text-2xl"
                style={{
                  left: `${15 + (i * 6)}%`,
                  top: `${10 + (i % 3) * 30}%`,
                }}
                animate={{
                  y: [-15, 15, -15],
                  opacity: [0.4, 1, 0.4],
                  rotate: [0, 360],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                ⭐
              </motion.div>
            ))}

            {/* Main Content */}
            <motion.div
              className="relative z-10"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="text-9xl mb-8"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.3, 1],
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                🆙
              </motion.div>
              
              <h2 className="text-4xl font-bold mb-4 fantasy-font text-yellow-400 text-shadow-glow">
                LEVEL UP!
              </h2>
              
              <p className="text-xl mb-2 ui-font text-blue-100">
                {statName} reached Level {newLevel}!
              </p>
              
              <p className="text-lg text-blue-300/80 mb-8">
                Your power grows stronger, Hunter!
              </p>
              
              <motion.button
                onClick={onClose}
                className="solo-button px-8 py-4 text-lg font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue Your Journey
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Enhanced Stat Card Component
const StatCard = ({ stat }: { stat: any }) => {
  const progress = getXpProgress(stat.xp)
  const currentLevelXp = stat.xp % 100
  
  return (
    <motion.div
      className="stat-card group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glowing Background Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 rounded-2xl group-hover:opacity-10 transition-opacity duration-300`} />
      
      {/* Level Badge */}
      <div className="absolute top-4 right-4">
        <div className="level-badge">
          LV.{stat.level}
        </div>
      </div>

      {/* Stat Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <motion.div 
            className="text-5xl"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {stat.icon}
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-blue-100 fantasy-font">
              {stat.stat_name}
            </h3>
            <p className="text-sm text-blue-300/70 ui-font">
              {STAT_DESCRIPTIONS[stat.stat_name as keyof typeof STAT_DESCRIPTIONS]}
            </p>
          </div>
        </div>

        {/* XP Bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm ui-font">
            <span className="text-blue-300/80">Experience</span>
            <span className="text-blue-100 font-bold">
              {currentLevelXp}/100 XP
            </span>
          </div>
          
          <div className="xp-bar">
            <motion.div
              className="xp-progress"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ 
                duration: 1.2, 
                ease: "easeOut",
                delay: 0.3 
              }}
            />
          </div>
        </div>

        {/* Total XP */}
        <div className="mt-4 text-center">
          <p className="text-xs text-blue-400/60 ui-font">
            Total XP: {stat.xp.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        style={{
          background: `linear-gradient(135deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})`,
          filter: 'blur(20px)',
          zIndex: -1,
        }}
      />
    </motion.div>
  )
}

// Hunter Profile Card
const HunterProfile = () => {
  const powerLevel = calculatePowerLevel(mockStats)
  const hunterRank = getHunterRank(powerLevel)
  const avgLevel = Math.floor(mockStats.reduce((sum, stat) => sum + stat.level, 0) / mockStats.length)
  
  return (
    <motion.div
      className="solo-panel p-6 mb-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-6">
        {/* Avatar */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-blue-400/50">
            <Crown size={32} color="#fbbf24" />
          </div>
          {/* Power Aura */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-blue-400/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
        
        {/* Hunter Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-blue-100 fantasy-font">Hunter: Prithvi</h2>
            <span className={`text-lg ${hunterRank.color} ui-font font-bold`}>
              {hunterRank.icon} {hunterRank.rank}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm ui-font">
            <div className="flex items-center gap-1">
              <Star size={14} color="#fbbf24" />
              <span className="text-blue-300">Avg Level: {avgLevel}</span>
            </div>
            <div className="flex items-center gap-1">
              <Power size={14} color="#ef4444" />
              <span className="text-blue-300">Power: {powerLevel.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap size={14} color="#3b82f6" />
              <span className="text-blue-300">Total XP: {mockStats.reduce((sum, stat) => sum + stat.xp, 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Quest Card Component
const QuestCard = ({ quest, onComplete }: { quest: any, onComplete: (questId: string, event: React.MouseEvent) => void }) => {
  const difficulty = getQuestDifficulty(quest.xp_reward)
  const rarityColors = {
    Common: 'border-gray-400/30 bg-slate-800/10',
    Rare: 'border-blue-400/50 bg-blue-900/10',
    Epic: 'border-purple-400/50 bg-purple-900/10',
    Legendary: 'border-yellow-400/50 bg-yellow-900/10'
  }
  
  return (
    <motion.div
      className={`solo-panel p-4 ${rarityColors[quest.rarity as keyof typeof rarityColors]} cursor-pointer group`}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-1 rounded-full bg-black/30 text-blue-300 ui-font">
              {quest.rarity}
            </span>
            <span className={`text-xs ${difficulty.color} ui-font`}>
              {difficulty.difficulty}
            </span>
          </div>
          
          <h4 className="text-sm font-semibold text-blue-100 mb-1 ui-font">
            {quest.title}
          </h4>
          
          <div className="flex items-center gap-3 text-xs text-blue-300/70">
            <span>Target: {quest.stat_target}</span>
            <span className="text-yellow-400 font-bold">+{quest.xp_reward} XP</span>
          </div>
        </div>
        
        <motion.button
          onClick={(e) => onComplete(quest.id, e)}
          className="solo-button px-4 py-2 text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Complete
        </motion.button>
      </div>
    </motion.div>
  )
}

// System Control Panel
const SystemTooltip = ({ soundEnabled, toggleSound }: { soundEnabled: boolean, toggleSound: () => void }) => {
  return (
    <motion.div
      className="fixed top-4 right-4 z-40 flex gap-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <motion.button
        onClick={toggleSound}
        className="solo-panel p-3 text-blue-400 hover:text-blue-300 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {soundEnabled ? <Volume2 size={18} color="#3b82f6" /> : <VolumeX size={18} color="#3b82f6" />}
      </motion.button>
    </motion.div>
  )
}

export default function DashboardPage() {
  const [floatingXP, setFloatingXP] = useState<Array<{ id: number, xp: number, position: { x: number, y: number } }>>([])
  const [levelUpModal, setLevelUpModal] = useState<{ visible: boolean, statName: string, newLevel: number }>({
    visible: false,
    statName: '',
    newLevel: 0
  })
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [xpCounter, setXpCounter] = useState(0)

  const playSound = (type: 'xp' | 'levelup') => {
    if (!soundEnabled) return
    // Sound implementation would go here
    console.log(`Playing ${type} sound`)
  }

  const completeQuest = (questId: string, event: React.MouseEvent) => {
    const quest = mockQuests.find(q => q.id === questId)
    if (!quest) return

    const rect = (event.target as HTMLElement).getBoundingClientRect()
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }

    // Add floating XP
    const newXpId = xpCounter + 1
    setXpCounter(newXpId)
    setFloatingXP(prev => [...prev, { id: newXpId, xp: quest.xp_reward, position }])

    // Play XP sound
    playSound('xp')

    // Check for level up (simplified logic)
    const targetStat = mockStats.find(s => s.stat_name === quest.stat_target)
    if (targetStat) {
      const newXp = targetStat.xp + quest.xp_reward
      const newLevel = Math.floor(newXp / 100)
      const currentLevel = Math.floor(targetStat.xp / 100)
      
      if (newLevel > currentLevel) {
        setTimeout(() => {
          setLevelUpModal({
            visible: true,
            statName: quest.stat_target,
            newLevel: newLevel
          })
          playSound('levelup')
        }, 1000)
      }
    }

    console.log(`Completed quest: ${quest.title} (+${quest.xp_reward} XP)`)
  }

  const removeFloatingXP = (id: number) => {
    setFloatingXP(prev => prev.filter(xp => xp.id !== id))
  }

  const toggleSound = () => setSoundEnabled(!soundEnabled)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') {
        toggleSound()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <div className="min-h-screen bg-solo-gradient relative overflow-x-hidden">
      {/* Particle Background */}
      <ParticleField />
      
      {/* Mesh Gradient Overlay */}
      <div className="fixed inset-0 bg-mesh-gradient pointer-events-none z-0" />
      
      {/* Main Content */}
      <div className="flex relative z-10">
        <Sidebar />
        
        <main className="flex-1 md:ml-64 p-6 relative">
          {/* System Controls */}
          <SystemTooltip soundEnabled={soundEnabled} toggleSound={toggleSound} />
          
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-4 fantasy-font bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent text-shadow-glow">
              Hunter Dashboard
            </h1>
            <p className="text-xl text-blue-300/80 ui-font">
              Welcome back, Hunter. Your journey to power continues...
            </p>
          </motion.div>

          {/* Hunter Profile */}
          <HunterProfile />

          {/* Stats Grid */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-6 fantasy-font text-blue-100">
              Power Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockStats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <StatCard stat={stat} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Active Quests */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6 fantasy-font text-blue-100">
              Active Quests
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {mockQuests.slice(0, 4).map((quest, index) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <QuestCard quest={quest} onComplete={completeQuest} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>

      {/* Floating XP Badges */}
      <AnimatePresence>
        {floatingXP.map(xp => (
          <FloatingXPBadge
            key={xp.id}
            xp={xp.xp}
            position={xp.position}
            onComplete={() => removeFloatingXP(xp.id)}
          />
        ))}
      </AnimatePresence>

      {/* Level Up Modal */}
      <LevelUpModal
        isVisible={levelUpModal.visible}
        statName={levelUpModal.statName}
        newLevel={levelUpModal.newLevel}
        onClose={() => setLevelUpModal({ visible: false, statName: '', newLevel: 0 })}
      />
    </div>
  )
}