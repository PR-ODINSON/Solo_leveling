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
  Power,
  Users,
  Activity
} from 'lucide-react'

import { useStatsStore, useQuestsStore, useUIStore } from '../../../lib/store'
import { 
  STAT_ICONS, 
  STAT_DESCRIPTIONS, 
  calculateLevel, 
  getXpProgress, 
  calculatePowerLevel, 
  getHunterRank,
  getQuestDifficulty 
} from '../../../lib/utils'
import { generateQuestsForHunter, Quest, TraitScores, Goal } from '../../../lib/questGenerator'
import { getQuestsGroupedByCategory, getRecommendedQuests, QuestWithTasks } from '../../../lib/questService'
import { EnhancedQuestCard } from '../../../components/EnhancedQuestCard'

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
  { id: '1', title: 'Complete Morning Training Routine', stat_target: 'Strength', xp_reward: 50, rarity: 'Common', category: 'Daily', icon: '🗡️', due_date: new Date().toISOString(), completed: false },
  { id: '2', title: 'Study Advanced Magic Theory', stat_target: 'Intelligence', xp_reward: 75, rarity: 'Rare', category: 'Weekly', icon: '📜', due_date: new Date().toISOString(), completed: false },
  { id: '3', title: 'Clear B-Rank Dungeon', stat_target: 'Dexterity', xp_reward: 120, rarity: 'Epic', category: 'Boss Fight', icon: '💎', due_date: new Date().toISOString(), completed: false },
  { id: '4', title: 'Defeat Shadow Monarch', stat_target: 'Wisdom', xp_reward: 250, rarity: 'Legendary', category: 'Boss Fight', icon: '👑', due_date: new Date().toISOString(), completed: false }
]



// Enhanced RPG User Profile Component
const RPGUserProfile = () => {
  const powerLevel = calculatePowerLevel(mockStats)
  const hunterRank = getHunterRank(powerLevel)
  const totalXP = mockStats.reduce((sum, stat) => sum + stat.xp, 0)
  const avgLevel = Math.floor(mockStats.reduce((sum, stat) => sum + stat.level, 0) / mockStats.length)
  
  // Calculate overall progress to next tier
  const currentTierXP = totalXP % 1000
  const nextTierProgress = (currentTierXP / 1000) * 100

  return (
    <motion.div
      className="solo-panel p-8 mb-8 relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Background Glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-teal-500/10"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative z-10 flex items-center gap-8">
        {/* Avatar Section */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-blue-400/50 relative overflow-hidden">
            {/* Avatar placeholder - could be replaced with actual image */}
            <Crown size={40} color="#fbbf24" />
            
            {/* Rotating Ring */}
            <motion.div
              className="absolute inset-0 border-4 border-transparent border-t-blue-400 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </div>
          
          {/* Power Aura */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-blue-400/30"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Level Badge */}
          <motion.div
            className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full font-bold text-sm ui-font border-2 border-black/20"
            animate={{
              boxShadow: [
                '0 0 10px rgba(251, 191, 36, 0.5)',
                '0 0 20px rgba(251, 191, 36, 0.8)',
                '0 0 10px rgba(251, 191, 36, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            LV.{avgLevel}
          </motion.div>
        </motion.div>
        
        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-3xl font-bold text-blue-100 fantasy-font">Hunter: Prithvi</h2>
            <motion.span 
              className={`text-xl ${hunterRank.color} ui-font font-bold flex items-center gap-2`}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-2xl">{hunterRank.icon}</span>
              {hunterRank.rank}
            </motion.span>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Star size={16} color="#fbbf24" />
              <div>
                <p className="text-xs text-blue-300/70 ui-font">Level</p>
                <p className="text-lg font-bold text-blue-100">{avgLevel}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Power size={16} color="#ef4444" />
              <div>
                <p className="text-xs text-blue-300/70 ui-font">Power</p>
                <p className="text-lg font-bold text-blue-100">{powerLevel.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} color="#3b82f6" />
              <div>
                <p className="text-xs text-blue-300/70 ui-font">Total XP</p>
                <p className="text-lg font-bold text-blue-100">{totalXP.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={16} color="#10b981" />
              <div>
                <p className="text-xs text-blue-300/70 ui-font">Tier Progress</p>
                <p className="text-lg font-bold text-blue-100">{Math.floor(nextTierProgress)}%</p>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm ui-font">
              <span className="text-blue-300/80">Next Tier Progress</span>
              <span className="text-blue-100 font-bold">{currentTierXP}/1000 XP</span>
            </div>
            
            <div className="h-3 bg-slate-800/50 rounded-full overflow-hidden relative border border-slate-700/50">
              <motion.div
                className="h-full rounded-full relative"
                style={{
                  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                }}
                initial={{ width: 0 }}
                animate={{ width: `${nextTierProgress}%` }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: [-100, 200] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Enhanced Quest Card Component removed - now using imported component

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
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black font-bold px-6 py-3 rounded-full shadow-2xl ui-font text-lg relative">
        +{xp} XP
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full blur-md opacity-60 -z-10" />
        
        {/* Burst particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            style={{
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: Math.cos((i * Math.PI * 2) / 6) * 30,
              y: Math.sin((i * Math.PI * 2) / 6) * 30,
              opacity: [1, 0],
              scale: [1, 0],
            }}
            transition={{
              duration: 1,
              delay: 0.2,
              ease: "easeOut"
            }}
          />
        ))}
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
          {/* Epic Background Effect */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 4, opacity: [0, 0.6, 0] }}
            transition={{ duration: 3, ease: "easeOut" }}
          >
            <div className="w-full h-full bg-gradient-radial from-yellow-500/30 via-orange-500/20 to-transparent" />
          </motion.div>

          <motion.div
            className="relative solo-panel p-12 text-center max-w-lg mx-4 border-4 border-yellow-400/70"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ type: "spring", duration: 1.5, bounce: 0.5 }}
            style={{
              boxShadow: '0 0 80px rgba(251, 191, 36, 0.8), inset 0 0 80px rgba(251, 191, 36, 0.2)'
            }}
          >
            {/* Animated Border */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-4 border-yellow-400/50"
              animate={{
                borderColor: [
                  'rgba(251, 191, 36, 0.3)', 
                  'rgba(251, 191, 36, 1)', 
                  'rgba(251, 191, 36, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Floating Stars */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-400/80 text-3xl"
                style={{
                  left: `${10 + (i * 5)}%`,
                  top: `${5 + (i % 4) * 25}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  opacity: [0.3, 1, 0.3],
                  rotate: [0, 360],
                  scale: [0.8, 1.3, 0.8],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                ⭐
              </motion.div>
            ))}

            {/* Main Content */}
            <motion.div
              className="relative z-10"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="text-10xl mb-8"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.4, 1],
                }}
                transition={{ 
                  rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                🆙
              </motion.div>
              
              <motion.h2 
                className="text-5xl font-bold mb-6 fantasy-font text-yellow-400 text-shadow-glow"
                animate={{ 
                  textShadow: [
                    '0 0 10px #fbbf24',
                    '0 0 30px #fbbf24',
                    '0 0 10px #fbbf24'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                LEVEL UP!
              </motion.h2>
              
              <p className="text-2xl mb-3 ui-font text-blue-100">
                {statName} reached Level {newLevel}!
              </p>
              
              <p className="text-lg text-blue-300/80 mb-8">
                Your power grows stronger, Hunter!
              </p>
              
              <motion.button
                onClick={onClose}
                className="solo-button px-10 py-4 text-xl font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    '0 4px 15px rgba(59, 130, 246, 0.4)',
                    '0 8px 30px rgba(59, 130, 246, 0.8)',
                    '0 4px 15px rgba(59, 130, 246, 0.4)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
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
const EnhancedStatCard = ({ stat }: { stat: any }) => {
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
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 rounded-2xl group-hover:opacity-15 transition-opacity duration-300`} />
      
      {/* Level Badge */}
      <div className="absolute top-4 right-4">
        <motion.div 
          className="level-badge"
          whileHover={{ scale: 1.1 }}
        >
          LV.{stat.level}
        </motion.div>
      </div>

      {/* Stat Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <motion.div 
            className="text-6xl"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            whileHover={{ scale: 1.2, rotate: 360 }}
          >
            {stat.icon}
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-blue-100 fantasy-font group-hover:text-white transition-colors">
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
                duration: 1.5, 
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

      {/* Enhanced Hover Glow Effect */}
      <motion.div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        style={{
          background: `linear-gradient(135deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})`,
          filter: 'blur(25px)',
          zIndex: -1,
        }}
      />
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
  const [dynamicQuests, setDynamicQuests] = useState<QuestWithTasks[]>([])
  const [questsLoading, setQuestsLoading] = useState(true)
  const [hunterGoal, setHunterGoal] = useState<Goal | null>(null)

  const playSound = (type: 'xp' | 'levelup') => {
    if (!soundEnabled) return
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

    playSound('xp')

    // Check for level up
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
        }, 1500)
      }
    }

    console.log(`Completed quest: ${quest.title} (+${quest.xp_reward} XP)`)
  }

  const removeFloatingXP = (id: number) => {
    setFloatingXP(prev => prev.filter(xp => xp.id !== id))
  }

  const toggleSound = () => setSoundEnabled(!soundEnabled)

  // Load dynamic quests from database
  useEffect(() => {
    const loadQuests = async () => {
      try {
        // Check if we have hunter goal data
        const hunterGoalData = localStorage.getItem('hunterGoal');
        const questGenerationData = localStorage.getItem('questGenerationData');
        
        if (hunterGoalData) {
          const { selectedGoal } = JSON.parse(hunterGoalData);
          setHunterGoal(selectedGoal);
          
          // Get trait scores for recommendations
          let traitScores = {};
          let hunterLevel = 1;
          
          if (questGenerationData) {
            const data = JSON.parse(questGenerationData);
            traitScores = data.traitScores || {};
            hunterLevel = data.hunterLevel || 1;
          }
          
          // Load recommended quests from database based on goal
          const recommendedQuests = await getRecommendedQuests(
            selectedGoal.id,
            traitScores,
            hunterLevel,
            8 // Get more quests for variety
          );
          
          setDynamicQuests(recommendedQuests);
          console.log('Loaded dynamic quests from database:', recommendedQuests);
        } else {
          // No goal selected - show empty state
          console.log('No hunter goal found, showing empty state');
          setDynamicQuests([]);
        }
      } catch (error) {
        console.error('Error loading dynamic quests:', error);
        // Fallback to mock quests on error
        setDynamicQuests([]);
      } finally {
        setQuestsLoading(false);
      }
    };

    loadQuests();
  }, []);

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
    <>
      {/* System Controls */}
      <SystemTooltip soundEnabled={soundEnabled} toggleSound={toggleSound} />
      
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl font-bold mb-4 fantasy-font bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent text-shadow-glow">
          Hunter Command Center
        </h1>
        <p className="text-xl text-blue-300/80 ui-font">
          Welcome back, Shadow Hunter. Your ascension continues...
        </p>
      </motion.div>

      {/* RPG User Profile */}
      <RPGUserProfile />

      {/* Stats Grid */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-4xl font-bold mb-6 fantasy-font text-blue-100 flex items-center gap-3">
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            ⚡
          </motion.span>
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
              <EnhancedStatCard stat={stat} />
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl font-bold fantasy-font text-blue-100 flex items-center gap-3">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🗡️
            </motion.span>
            {hunterGoal ? `${hunterGoal.name} Quests` : 'Active Quests'}
          </h2>
          {hunterGoal && (
            <div className="text-sm text-blue-300/70 bg-blue-900/20 px-3 py-1 rounded-full border border-blue-500/30">
              Goal: {hunterGoal.name}
            </div>
          )}
        </div>

        {questsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="solo-panel p-6 animate-pulse">
                <div className="h-4 bg-blue-400/20 rounded mb-3"></div>
                <div className="h-3 bg-blue-400/10 rounded mb-2"></div>
                <div className="h-3 bg-blue-400/10 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dynamicQuests.length > 0 ? (
              // Render dynamic quests from database
              dynamicQuests.slice(0, 4).map((quest, index) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <EnhancedQuestCard quest={quest} index={index} onComplete={completeQuest} />
                </motion.div>
              ))
            ) : (
              // Render mock quests as fallback (convert to new format)
              mockQuests.slice(0, 4).map((quest, index) => {
                const convertedQuest: QuestWithTasks = {
                  id: quest.id,
                  title: quest.title,
                  description: `Complete this ${quest.category.toLowerCase()} quest to gain ${quest.xp_reward} XP`,
                  category: quest.category.toLowerCase() as 'daily' | 'weekly' | 'monthly' | 'milestone',
                  difficulty: quest.rarity === 'Legendary' ? 'S' : quest.rarity === 'Epic' ? 'A' : quest.rarity === 'Rare' ? 'B' : 'C',
                  xp_reward: quest.xp_reward,
                  primary_trait: quest.stat_target.toLowerCase().replace(' ', '_'),
                  secondary_traits: [],
                  estimated_time: '30 minutes',
                  unlock_level: 1,
                  required_traits: null,
                  prerequisite_quests: [],
                  hunter_notes: `A ${quest.rarity.toLowerCase()} quest focusing on ${quest.stat_target} development.`,
                  tasks: []
                };
                
                return (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <EnhancedQuestCard quest={convertedQuest} index={index} onComplete={completeQuest} />
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {dynamicQuests.length === 0 && !questsLoading && (
          <motion.div
            className="solo-panel p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-blue-100 mb-2">Complete Your Assessment First</h3>
            <p className="text-blue-300/70 mb-4">
              Take the Hunter Assessment and choose your goal to unlock personalized quests!
            </p>
            <motion.button
              onClick={() => window.location.href = '/onboarding/assessment'}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-400 hover:to-purple-500 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Assessment
            </motion.button>
          </motion.div>
        )}
      </motion.div>

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
    </>
  )
}