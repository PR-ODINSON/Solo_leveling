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
  TrendingUp
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

export default function DashboardPage() {
  const [stats, setStats] = useState(mockStats)
  const [quests, setQuests] = useState(mockQuests)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpStat, setLevelUpStat] = useState('')
  const [streak, setStreak] = useState(7)
  const [todayXP, setTodayXP] = useState(50)

  // Calculate total level and XP
  const totalXP = stats.reduce((sum, stat) => sum + stat.xp, 0)
  const avgLevel = Math.floor(stats.reduce((sum, stat) => sum + stat.level, 0) / stats.length)

  const completeQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId)
    if (!quest) return

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
        setShowLevelUp(true)
        setTimeout(() => setShowLevelUp(false), 3000)
      }
    }

    setTodayXP(prev => prev + quest.xp_reward)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <Sidebar />

      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-8 text-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                ⚡
              </motion.div>
              <h2 className="text-3xl font-bold text-blue-400 mb-2">LEVEL UP!</h2>
              <p className="text-white text-xl">Your {levelUpStat} has increased!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="md:ml-64 p-6 relative z-10">
        {/* Header Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
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
                <p className="text-blue-300 text-lg mt-2">Level {avgLevel} • Total XP: {totalXP.toLocaleString()}</p>
              </div>
              
              <div className="flex items-center gap-6">
                {/* Streak Counter */}
                <motion.div
                  className="flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 rounded-xl px-4 py-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Flame className="text-orange-400" size={24} />
                  <div>
                    <div className="text-orange-400 font-bold text-xl">{streak}</div>
                    <div className="text-orange-300 text-sm">Day Streak</div>
                  </div>
                </motion.div>

                {/* Today's XP */}
                <motion.div
                  className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-xl px-4 py-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <TrendingUp className="text-green-400" size={24} />
                  <div>
                    <div className="text-green-400 font-bold text-xl">+{todayXP}</div>
                    <div className="text-green-300 text-sm">Today's XP</div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* System Notification */}
            <motion.div
              className="mt-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-xl p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-blue-300">📈 System Alert: You gained +{todayXP} XP in Wisdom today</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Stats Section */}
          <div className="xl:col-span-2">
            <motion.h2
              className="text-2xl font-bold text-white mb-6 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="text-blue-400" />
              Hunter Statistics
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon
                const progress = (stat.xp % 100) / 100
                const nextLevelXP = (stat.level + 1) * 100

                return (
                  <motion.div
                    key={stat.id}
                    className="group relative"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 5,
                    }}
                  >
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-300`} />
                    
                    <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-blue-400/30 transition-all duration-300">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                          <IconComponent className="text-white" size={24} />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">Lv.{stat.level}</div>
                          <div className="text-sm text-gray-400">{stat.xp} XP</div>
                        </div>
                      </div>

                      {/* Stat Name */}
                      <h3 className="text-lg font-semibold text-white mb-3">{stat.stat_name}</h3>

                      {/* XP Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>{stat.xp % 100} / 100 XP</span>
                          <span>Next: Lv.{stat.level + 1}</span>
                        </div>
                        
                        <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${stat.color} rounded-full relative overflow-hidden`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.8 }}
                          >
                            {/* Shimmer Effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                              animate={{ x: [-100, 200] }}
                              transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
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

          {/* Right Column */}
          <div className="space-y-8">
            {/* Active Quests */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Target className="text-purple-400" />
                Active Quests
              </h2>

              <div className="space-y-4">
                {quests.map((quest, index) => (
                  <motion.div
                    key={quest.id}
                    className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 backdrop-blur-xl border border-purple-400/20 rounded-xl p-4 hover:border-purple-400/40 transition-all duration-300"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.8 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">{quest.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span>{quest.stat_target}</span>
                          <span>•</span>
                          <span className="text-yellow-400">+{quest.xp_reward} XP</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {!quest.completed ? (
                          <>
                            <motion.button
                              onClick={() => completeQuest(quest.id)}
                              className="w-10 h-10 bg-green-500/20 border border-green-400/30 rounded-lg flex items-center justify-center text-green-400 hover:bg-green-500/30 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <CheckCircle size={16} />
                            </motion.button>
                            <motion.button
                              className="w-10 h-10 bg-red-500/20 border border-red-400/30 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <XCircle size={16} />
                            </motion.button>
                          </>
                        ) : (
                          <div className="w-10 h-10 bg-green-500/20 border border-green-400/30 rounded-lg flex items-center justify-center text-green-400">
                            <CheckCircle size={16} />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Rewards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Trophy className="text-yellow-400" />
                Recent Rewards
              </h2>

              <div className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 backdrop-blur-xl border border-yellow-400/20 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <Gift className="text-yellow-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Gym Session Unlocked!</h3>
                    <p className="text-gray-400 text-sm">Earned with 500 Strength XP</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}