'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Filter, 
  Target, 
  Trophy, 
  Clock, 
  Zap, 
  CheckCircle, 
  XCircle,
  Calendar,
  Flame,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Shield,
  Brain,
  Dumbbell,
  Eye,
  Heart
} from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { useQuestsStore, useUIStore } from '../../lib/store'

// Mock data for demo since auth is disabled
const mockQuests = [
  { id: '1', title: 'Complete Morning Workout', category: 'Physical', stat_target: 'Strength', xp_reward: 50, due_date: new Date().toISOString(), completed: false, missed: false },
  { id: '2', title: 'Read 30 Pages of Technical Book', category: 'Academic', stat_target: 'Intelligence', xp_reward: 40, due_date: new Date(Date.now() + 86400000).toISOString(), completed: false, missed: false },
  { id: '3', title: 'Meditate for 15 Minutes', category: 'Emotional', stat_target: 'Wisdom', xp_reward: 35, due_date: new Date(Date.now() + 172800000).toISOString(), completed: false, missed: false },
  { id: '4', title: 'Practice JavaScript Algorithms', category: 'Academic', stat_target: 'Intelligence', xp_reward: 60, due_date: new Date(Date.now() - 86400000).toISOString(), completed: true, missed: false },
  { id: '5', title: 'Network with 3 New People', category: 'Social', stat_target: 'Charisma', xp_reward: 45, due_date: new Date(Date.now() - 172800000).toISOString(), completed: false, missed: true }
]

const questCategories = ['All', 'Academic', 'Physical', 'Emotional', 'Social']
const statIcons = {
  Intelligence: Brain,
  Strength: Dumbbell,
  Wisdom: Eye,
  Charisma: Heart,
  Dexterity: Zap,
  Discipline: Shield
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
      <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold px-4 py-2 rounded-full shadow-lg">
        +{xp} XP
      </div>
    </motion.div>
  )
}

// Failure Effect Component
const FailureEffect = ({ position, onComplete }: { position: { x: number, y: number }, onComplete: () => void }) => {
  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{ left: position.x, top: position.y }}
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={{ 
        opacity: [0, 1, 1, 0], 
        scale: [0, 1.2, 1, 0.8], 
        y: -80 
      }}
      transition={{ 
        duration: 2,
        ease: "easeOut"
      }}
      onAnimationComplete={onComplete}
    >
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
        ⚠ MISSION FAILED — -10 XP
      </div>
    </motion.div>
  )
}

export default function QuestsPage() {
  const [quests, setQuests] = useState(mockQuests)
  const [filter, setFilter] = useState('All')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [floatingEffects, setFloatingEffects] = useState<Array<{ id: number, type: 'xp' | 'failure', xp?: number, position: { x: number, y: number } }>>([])

  const activeQuests = quests.filter(q => !q.completed && !q.missed)
  const completedQuests = quests.filter(q => q.completed)
  const missedQuests = quests.filter(q => q.missed)
  const weeklyStreak = Math.floor(completedQuests.length / 7 * 5) // Mock calculation

  const filteredQuests = filter === 'All' ? quests : quests.filter(q => q.category === filter)

  const completeQuest = (questId: string, event: React.MouseEvent) => {
    const quest = quests.find(q => q.id === questId)
    if (!quest) return

    // Get click position for floating XP
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    const position = { x: rect.left + rect.width / 2, y: rect.top }

    // Add floating XP effect
    const effectId = Date.now()
    setFloatingEffects(prev => [...prev, { id: effectId, type: 'xp', xp: quest.xp_reward, position }])

    // Update quest as completed
    setQuests(prev => prev.map(q => 
      q.id === questId ? { ...q, completed: true } : q
    ))
  }

  const missQuest = (questId: string, event: React.MouseEvent) => {
    const quest = quests.find(q => q.id === questId)
    if (!quest) return

    // Get click position for failure effect
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    const position = { x: rect.left + rect.width / 2, y: rect.top }

    // Add failure effect
    const effectId = Date.now()
    setFloatingEffects(prev => [...prev, { id: effectId, type: 'failure', position }])

    // Update quest as missed
    setQuests(prev => prev.map(q => 
      q.id === questId ? { ...q, missed: true } : q
    ))
  }

  const removeEffect = (id: number) => {
    setFloatingEffects(prev => prev.filter(effect => effect.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        {[...Array(80)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.4, 0],
              scale: [0, 1, 0],
              y: [-20, -100],
              x: [0, Math.random() * 30 - 15],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut"
            }}
          >
            <div className={`w-1 h-1 rounded-full ${Math.random() > 0.5 ? 'bg-blue-400/30' : 'bg-purple-400/30'}`} />
          </motion.div>
        ))}
        
        {/* Grid Pattern */}
        <motion.div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
          animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <Sidebar />

      {/* Floating Effects */}
      {floatingEffects.map(effect => (
        effect.type === 'xp' ? (
          <FloatingXPBadge
            key={effect.id}
            xp={effect.xp!}
            position={effect.position}
            onComplete={() => removeEffect(effect.id)}
          />
        ) : (
          <FailureEffect
            key={effect.id}
            position={effect.position}
            onComplete={() => removeEffect(effect.id)}
          />
        )
      ))}

      <main className="md:ml-64 p-6 relative z-10">
        {/* Hunter Mission Terminal Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        >
          <div className="relative bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-6 overflow-hidden">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
            
            <div className="relative flex items-center justify-between">
              <div>
                <motion.h1 
                  className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  🎯 HUNTER MISSION TERMINAL
                </motion.h1>
                <motion.p 
                  className="text-blue-300 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Select and complete missions to gain XP and level up your stats
                </motion.p>
              </div>
              
              <motion.button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Plus size={20} />
                NEW MISSION
              </motion.button>
            </div>

            {/* Weekly Streak */}
            <motion.div
              className="mt-4 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 backdrop-blur-sm border border-orange-400/20 rounded-xl p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Flame className="text-orange-400" size={24} />
                </motion.div>
                <span className="text-orange-300">🔥 Weekly Quest Streak: {weeklyStreak}/5 missions completed</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Mission Categories Filter */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-wrap gap-3">
            {questCategories.map((category, index) => (
              <motion.button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  filter === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 hover:border-blue-400/30'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Mission Stats Dashboard */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            className="relative bg-white/5 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-6 hover:border-blue-400/40 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <Target className="text-white" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{activeQuests.length}</div>
                <div className="text-blue-300 text-sm">Active Missions</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative bg-white/5 backdrop-blur-xl border border-green-400/20 rounded-2xl p-6 hover:border-green-400/40 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-400 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-white" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{completedQuests.length}</div>
                <div className="text-green-300 text-sm">Completed</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative bg-white/5 backdrop-blur-xl border border-red-400/20 rounded-2xl p-6 hover:border-red-400/40 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <XCircle className="text-white" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{missedQuests.length}</div>
                <div className="text-red-300 text-sm">Failed</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative bg-white/5 backdrop-blur-xl border border-yellow-400/20 rounded-2xl p-6 hover:border-yellow-400/40 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-400 rounded-xl flex items-center justify-center">
                <Trophy className="text-white" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{completedQuests.reduce((sum, q) => sum + q.xp_reward, 0)}</div>
                <div className="text-yellow-300 text-sm">Total XP Earned</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Mission Sections */}
        <div className="space-y-8">
          {/* Active Missions */}
          {activeQuests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Target className="text-blue-400" />
                </motion.div>
                Active Missions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeQuests.filter(q => filter === 'All' || q.category === filter).map((quest, index) => (
                  <QuestCardComponent key={quest.id} quest={quest} index={index} onComplete={completeQuest} onMiss={missQuest} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Completed Missions */}
          {completedQuests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <CheckCircle className="text-green-400" />
                </motion.div>
                Completed Missions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedQuests.filter(q => filter === 'All' || q.category === filter).map((quest, index) => (
                  <QuestCardComponent key={quest.id} quest={quest} index={index} onComplete={completeQuest} onMiss={missQuest} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Failed Missions */}
          {missedQuests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <AlertTriangle className="text-red-400" />
                </motion.div>
                Failed Missions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {missedQuests.filter(q => filter === 'All' || q.category === filter).map((quest, index) => (
                  <QuestCardComponent key={quest.id} quest={quest} index={index} onComplete={completeQuest} onMiss={missQuest} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Create Quest Modal */}
      <CreateQuestModalComponent isVisible={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={(newQuest) => {
        setQuests(prev => [...prev, { ...newQuest, id: Date.now().toString(), completed: false, missed: false }])
        setShowCreateModal(false)
      }} />
    </div>
  )
}

// Quest Card Component
const QuestCardComponent = ({ quest, index, onComplete, onMiss }: { 
  quest: any, 
  index: number, 
  onComplete: (id: string, event: React.MouseEvent) => void,
  onMiss: (id: string, event: React.MouseEvent) => void
}) => {
  const StatIcon = statIcons[quest.stat_target as keyof typeof statIcons] || Target
  const categoryColors = {
    Academic: 'from-blue-500 to-cyan-400',
    Physical: 'from-red-500 to-orange-400', 
    Emotional: 'from-purple-500 to-pink-400',
    Social: 'from-green-500 to-emerald-400'
  }
  const categoryColor = categoryColors[quest.category as keyof typeof categoryColors] || 'from-gray-500 to-gray-400'

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        bounce: 0.3
      }}
      whileHover={{ 
        scale: 1.05,
        rotateY: quest.completed || quest.missed ? 0 : 5,
        rotateX: quest.completed || quest.missed ? 0 : 5,
        z: 50
      }}
      style={{ perspective: 1000 }}
    >
      {/* Glow Effect */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-r ${categoryColor} opacity-0 group-hover:opacity-30 rounded-2xl blur-xl transition-opacity duration-500`}
        whileHover={{ scale: 1.1 }}
      />
      
      {/* Card Shake Animation for Failed Quests */}
      <motion.div
        className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-500 shadow-2xl ${
          quest.completed ? 'border-green-400/30' : quest.missed ? 'border-red-400/30' : 'hover:border-blue-400/30'
        }`}
        animate={quest.missed ? { x: [-2, 2, -2, 2, 0] } : {}}
        transition={quest.missed ? { duration: 0.5, repeat: 2 } : {}}
      >
        {/* Category Gradient Bar */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${categoryColor} rounded-t-2xl`} />
        
        {/* Status Overlay */}
        {(quest.completed || quest.missed) && (
          <div className={`absolute inset-0 ${quest.completed ? 'bg-green-500/10' : 'bg-red-500/10'} rounded-2xl`} />
        )}

        <div className="relative pt-2">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${
                quest.completed ? 'text-green-300 line-through' : 
                quest.missed ? 'text-red-300 line-through' : 
                'text-white'
              }`}>
                {quest.title}
              </h3>
              
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${categoryColor} text-white shadow-lg`}>
                  {quest.category}
                </span>
              </div>
            </div>

            <motion.div 
              className={`w-12 h-12 bg-gradient-to-r ${categoryColor} rounded-xl flex items-center justify-center shadow-lg`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <StatIcon className="text-white" size={20} />
            </motion.div>
          </div>

          {/* Quest Details */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-gray-300">
              <Target size={16} />
              <span>Target: <span className="text-blue-400">{quest.stat_target}</span></span>
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <Zap size={16} />
              <span>Reward: <span className="text-yellow-400">+{quest.xp_reward} XP</span></span>
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <Calendar size={16} />
              <span>Due: <span className="text-purple-400">{new Date(quest.due_date).toLocaleDateString()}</span></span>
            </div>
          </div>

          {/* Action Buttons */}
          {!quest.completed && !quest.missed && (
            <div className="flex gap-3">
              <motion.button
                onClick={(e) => onComplete(quest.id, e)}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-2 px-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircle size={16} />
                Complete
              </motion.button>
              
              <motion.button
                onClick={(e) => onMiss(quest.id, e)}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-2 px-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <XCircle size={16} />
                Failed
              </motion.button>
            </div>
          )}

          {/* Status Messages */}
          {quest.completed && (
            <motion.div
              className="flex items-center gap-2 p-3 bg-green-500/20 border border-green-400/30 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-green-300 font-medium">Mission Completed! +{quest.xp_reward} XP</span>
            </motion.div>
          )}

          {quest.missed && (
            <motion.div
              className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-400/30 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AlertTriangle size={16} className="text-red-400" />
              <span className="text-red-300 font-medium">Mission Failed! -10 XP</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Create Quest Modal Component  
const CreateQuestModalComponent = ({ isVisible, onClose, onSubmit }: {
  isVisible: boolean,
  onClose: () => void,
  onSubmit: (quest: any) => void
}) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Academic',
    stat_target: 'Intelligence',
    xp_reward: 25,
    due_date: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.due_date) return

    onSubmit({
      title: formData.title.trim(),
      category: formData.category,
      stat_target: formData.stat_target,
      xp_reward: formData.xp_reward,
      due_date: new Date(formData.due_date).toISOString()
    })

    setFormData({
      title: '',
      category: 'Academic',
      stat_target: 'Intelligence',
      xp_reward: 25,
      due_date: ''
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl border-2 border-blue-400/30 rounded-3xl p-8 max-w-md w-full mx-4"
            initial={{ scale: 0, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 10, opacity: 0 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow: '0 0 50px rgba(59, 130, 246, 0.3), inset 0 0 50px rgba(59, 130, 246, 0.1)'
            }}
          >
            {/* Glowing Border Animation */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-blue-400/20"
              animate={{
                borderColor: ['rgba(59, 130, 246, 0.2)', 'rgba(59, 130, 246, 0.6)', 'rgba(59, 130, 246, 0.2)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="relative">
              {/* Header */}
              <motion.div
                className="text-center mb-8"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  🎯 CREATE NEW MISSION
                </h2>
                <p className="text-gray-300">Define your next challenge</p>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-blue-300 mb-2">Mission Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter mission description..."
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    required
                  />
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-blue-300 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-400/30 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    >
                      {questCategories.slice(1).map(category => (
                        <option key={category} value={category} className="bg-slate-800">{category}</option>
                      ))}
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-blue-300 mb-2">Target Stat</label>
                    <select
                      value={formData.stat_target}
                      onChange={(e) => setFormData({ ...formData, stat_target: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-400/30 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    >
                      {Object.keys(statIcons).map(stat => (
                        <option key={stat} value={stat} className="bg-slate-800">{stat}</option>
                      ))}
                    </select>
                  </motion.div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-blue-300 mb-2">XP Reward</label>
                    <input
                      type="number"
                      value={formData.xp_reward}
                      onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) || 25 })}
                      min="1"
                      max="100"
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-400/30 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-blue-300 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-400/30 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                      required
                    />
                  </motion.div>
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-gray-600/20 backdrop-blur-sm border border-gray-500/30 text-gray-300 font-semibold rounded-xl hover:bg-gray-600/30 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    disabled={!formData.title.trim() || !formData.due_date}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Plus size={20} />
                    Create Mission
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 