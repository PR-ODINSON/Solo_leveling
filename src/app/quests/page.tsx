'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Filter, Search, Target } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import QuestCard from '@/components/QuestCard'
import CreateQuestModal from '@/components/CreateQuestModal'
import { useQuestsStore, useUIStore } from '@/lib/store'
import { QUEST_CATEGORIES } from '@/lib/utils'

export default function QuestsPage() {
  const { quests, fetchQuests, loading } = useQuestsStore()
  const { setShowCreateQuestModal } = useUIStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [showCompleted, setShowCompleted] = useState(true)

  useEffect(() => {
    fetchQuests()
  }, [fetchQuests])

  // Filter quests
  const filteredQuests = quests.filter(quest => {
    const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || quest.category === selectedCategory
    const matchesCompleted = showCompleted || !quest.completed
    return matchesSearch && matchesCategory && matchesCompleted
  })

  const activeQuests = filteredQuests.filter(q => !q.completed)
  const completedQuests = filteredQuests.filter(q => q.completed)

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
                Quest Management
              </h1>
              <p className="text-gray-400">
                Track your daily missions and level up
              </p>
            </div>
            <button
              onClick={() => setShowCreateQuestModal(true)}
              className="cyberpunk-button flex items-center gap-2"
            >
              <Plus size={20} />
              New Quest
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="cyberpunk-border rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search quests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-cyberpunk-gray/50 border border-cyberpunk-primary/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyberpunk-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-cyberpunk-gray/50 border border-cyberpunk-primary/30 rounded-lg text-white focus:outline-none focus:border-cyberpunk-primary appearance-none"
              >
                <option value="All">All Categories</option>
                {QUEST_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Show Completed Toggle */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                  className="w-4 h-4 text-cyberpunk-primary bg-cyberpunk-gray border-cyberpunk-primary/30 rounded focus:ring-cyberpunk-primary"
                />
                <span className="text-gray-300">Show Completed</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Quest Lists */}
        <div className="space-y-8">
          {/* Active Quests */}
          {activeQuests.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Target className="text-cyberpunk-primary" />
                Active Quests ({activeQuests.length})
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </div>
            </motion.section>
          )}

          {/* Completed Quests */}
          {completedQuests.length > 0 && showCompleted && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                Completed Quests ({completedQuests.length})
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {completedQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </div>
            </motion.section>
          )}

          {/* Empty State */}
          {filteredQuests.length === 0 && !loading && (
            <motion.div
              className="cyberpunk-border rounded-xl p-12 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Quests Found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || selectedCategory !== 'All' 
                  ? 'Try adjusting your filters or search terms'
                  : 'Start your journey by creating your first quest'
                }
              </p>
              <button
                onClick={() => setShowCreateQuestModal(true)}
                className="cyberpunk-button"
              >
                Create New Quest
              </button>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="cyberpunk-border rounded-lg p-4 animate-pulse">
                  <div className="h-32 bg-cyberpunk-gray/30 rounded"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <CreateQuestModal />
    </div>
  )
} 