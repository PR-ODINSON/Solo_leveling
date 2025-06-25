'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../../components/Sidebar'
import QuestCard from '../../components/QuestCard'
import CreateQuestModal from '../../components/CreateQuestModal'
import { Plus, Filter } from 'lucide-react'
import { useQuestsStore, useUIStore } from '../../lib/store'
import { QUEST_CATEGORIES } from '../../lib/utils'

export default function QuestsPage() {
  const { quests, loading } = useQuestsStore()
  const { setShowCreateQuestModal } = useUIStore()
  const [filter, setFilter] = useState('all')
  const [category, setCategory] = useState('all')

  const filteredQuests = quests.filter(quest => {
    const statusMatch = filter === 'all' || 
      (filter === 'active' && !quest.completed) ||
      (filter === 'completed' && quest.completed)
    
    const categoryMatch = category === 'all' || quest.category === category
    
    return statusMatch && categoryMatch
  })

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-cyberpunk-primary mb-2">
                Quests
              </h1>
              <p className="text-gray-400">
                Track your progress and complete challenges
              </p>
            </div>
            <button
              onClick={() => setShowCreateQuestModal(true)}
              className="cyberpunk-button flex items-center gap-2"
            >
              <Plus size={16} />
              New Quest
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-6 flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-cyberpunk-gray border border-cyberpunk-primary/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyberpunk-primary"
            >
              <option value="all">All Quests</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-cyberpunk-gray border border-cyberpunk-primary/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyberpunk-primary"
          >
            <option value="all">All Categories</option>
            {QUEST_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </motion.div>

        {/* Quest Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="cyberpunk-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Total Quests</h3>
            <p className="text-2xl font-bold text-cyberpunk-primary">{quests.length}</p>
          </div>
          
          <div className="cyberpunk-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Active</h3>
            <p className="text-2xl font-bold text-cyberpunk-secondary">
              {quests.filter(q => !q.completed).length}
            </p>
          </div>
          
          <div className="cyberpunk-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Completed</h3>
            <p className="text-2xl font-bold text-green-500">
              {quests.filter(q => q.completed).length}
            </p>
          </div>
        </motion.div>

        {/* Quests List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="cyberpunk-border rounded-lg p-4 animate-pulse">
                  <div className="h-32 bg-cyberpunk-gray/30 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredQuests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="cyberpunk-border rounded-xl p-8 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {filter === 'all' ? 'No quests yet' : `No ${filter} quests`}
                </h3>
                <p className="text-gray-400 mb-6">
                  {filter === 'all' 
                    ? 'Create your first quest to start your journey!'
                    : `No quests match the ${filter} filter.`
                  }
                </p>
                {filter === 'all' && (
                  <button
                    onClick={() => setShowCreateQuestModal(true)}
                    className="cyberpunk-button"
                  >
                    Create Your First Quest
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <CreateQuestModal />
    </div>
  )
} 