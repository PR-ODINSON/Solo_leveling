'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Zap, Target } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import StatCard from '../../components/StatCard'
import QuestCard from '../../components/QuestCard'
import CreateQuestModal from '../../components/CreateQuestModal'
import { useStatsStore, useQuestsStore, useUIStore } from '../../lib/store'

export default function DashboardPage() {
  const { stats, fetchStats, loading: statsLoading } = useStatsStore()
  const { quests, fetchQuests, loading: questsLoading } = useQuestsStore()
  const { setShowCreateQuestModal } = useUIStore()

  useEffect(() => {
    fetchStats()
    fetchQuests()
  }, [fetchStats, fetchQuests])

  const recentQuests = quests.slice(0, 5)
  const totalXp = stats.reduce((sum, stat) => sum + stat.xp, 0)
  const completedQuests = quests.filter(q => q.completed).length
  const activeQuests = quests.filter(q => !q.completed).length

  return (
    <div className="min-h-screen bg-cyberpunk-dark">
      <Sidebar />
      
      <main className="md:ml-64 p-6">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-cyberpunk-primary mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400">
            Welcome back, Hunter. Ready to level up?
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="cyberpunk-border rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyberpunk-primary/20 rounded-lg flex items-center justify-center">
                <Zap className="text-cyberpunk-primary" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {totalXp.toLocaleString()}
                </h3>
                <p className="text-gray-400">Total XP</p>
              </div>
            </div>
          </div>

          <div className="cyberpunk-border rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Target className="text-green-500" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {completedQuests}
                </h3>
                <p className="text-gray-400">Completed Quests</p>
              </div>
            </div>
          </div>

          <div className="cyberpunk-border rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyberpunk-secondary/20 rounded-lg flex items-center justify-center">
                <Target className="text-cyberpunk-secondary" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {activeQuests}
                </h3>
                <p className="text-gray-400">Active Quests</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Stats Grid */}
          <div className="xl:col-span-2">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">Your Stats</h2>
              
              {statsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="cyberpunk-border rounded-xl p-6 animate-pulse">
                      <div className="h-20 bg-cyberpunk-gray/30 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stats.map((stat) => (
                    <StatCard key={stat.id} stat={stat} />
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Recent Quests */}
          <div>
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Recent Quests</h2>
                <button
                  onClick={() => setShowCreateQuestModal(true)}
                  className="cyberpunk-button flex items-center gap-2"
                >
                  <Plus size={16} />
                  New Quest
                </button>
              </div>

              {questsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="cyberpunk-border rounded-lg p-4 animate-pulse">
                      <div className="h-16 bg-cyberpunk-gray/30 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : recentQuests.length > 0 ? (
                <div className="space-y-4">
                  {recentQuests.map((quest) => (
                    <QuestCard key={quest.id} quest={quest} />
                  ))}
                </div>
              ) : (
                <div className="cyberpunk-border rounded-lg p-6 text-center">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400 mb-4">No quests yet</p>
                  <button
                    onClick={() => setShowCreateQuestModal(true)}
                    className="cyberpunk-button"
                  >
                    Create Your First Quest
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <CreateQuestModal />
    </div>
  )
}