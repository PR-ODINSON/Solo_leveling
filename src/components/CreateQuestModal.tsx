'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Target, Calendar, Zap } from 'lucide-react'
import { useQuestsStore, useUIStore } from '@/lib/store'
import { STAT_NAMES, LEGACY_QUEST_CATEGORIES } from '@/lib/utils'

export default function CreateQuestModal() {
  const { showCreateQuestModal, setShowCreateQuestModal } = useUIStore()
  const { createQuest } = useQuestsStore()
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Academic' as const,
    stat_target: 'Intelligence',
    xp_reward: 25,
    due_date: ''
  })
  
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.due_date) return

    setLoading(true)
    try {
      await createQuest({
        title: formData.title.trim(),
        category: formData.category,
        stat_target: formData.stat_target,
        xp_reward: formData.xp_reward,
        due_date: new Date(formData.due_date).toISOString(),
        completed: false
      })
      
      // Reset form and close modal
      setFormData({
        title: '',
        category: 'Academic',
        stat_target: 'Intelligence',
        xp_reward: 25,
        due_date: ''
      })
      setShowCreateQuestModal(false)
    } catch (error) {
      console.error('Error creating quest:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setShowCreateQuestModal(false)
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
      {showCreateQuestModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="cyberpunk-border rounded-xl p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-cyberpunk-primary flex items-center gap-2">
                <Plus size={24} />
                Create New Quest
              </h2>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-cyberpunk-gray rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Quest Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quest Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter quest description..."
                  className="w-full px-3 py-2 bg-cyberpunk-gray border border-cyberpunk-primary/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyberpunk-primary"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Target size={16} />
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-cyberpunk-gray border border-cyberpunk-primary/30 rounded-lg text-white focus:outline-none focus:border-cyberpunk-primary"
                >
                  {LEGACY_QUEST_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Target Stat */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Stat
                </label>
                <select
                  value={formData.stat_target}
                  onChange={(e) => setFormData({ ...formData, stat_target: e.target.value })}
                  className="w-full px-3 py-2 bg-cyberpunk-gray border border-cyberpunk-primary/30 rounded-lg text-white focus:outline-none focus:border-cyberpunk-primary"
                >
                  {STAT_NAMES.map(stat => (
                    <option key={stat} value={stat}>{stat}</option>
                  ))}
                </select>
              </div>

              {/* XP Reward */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Zap size={16} />
                  XP Reward
                </label>
                <input
                  type="number"
                  value={formData.xp_reward}
                  onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) || 25 })}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 bg-cyberpunk-gray border border-cyberpunk-primary/30 rounded-lg text-white focus:outline-none focus:border-cyberpunk-primary"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 bg-cyberpunk-gray border border-cyberpunk-primary/30 rounded-lg text-white focus:outline-none focus:border-cyberpunk-primary"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !formData.title.trim() || !formData.due_date}
                className="w-full cyberpunk-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-cyberpunk-primary border-t-transparent" />
                ) : (
                  <>
                    <Plus size={20} />
                    Create Quest
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 