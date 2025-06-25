'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Clock, Trash2, Calendar, Target, Zap } from 'lucide-react'
import { CATEGORY_COLORS, formatDate, getDaysUntilDue, isQuestOverdue } from '@/lib/utils'
import { useQuestsStore } from '@/lib/store'
import type { Quest } from '@/lib/supabase'

interface QuestCardProps {
  quest: Quest
}

export default function QuestCard({ quest }: QuestCardProps) {
  const { completeQuest, deleteQuest } = useQuestsStore()
  
  const daysUntilDue = getDaysUntilDue(quest.due_date)
  const isOverdue = isQuestOverdue(quest.due_date)
  const categoryGradient = CATEGORY_COLORS[quest.category]

  const handleComplete = async () => {
    if (!quest.completed) {
      await completeQuest(quest.id)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this quest?')) {
      await deleteQuest(quest.id)
    }
  }

  return (
    <motion.div
      className={`quest-card ${quest.completed ? 'opacity-60' : ''}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Category Gradient Bar */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${categoryGradient} rounded-t-lg`} />
      
      <div className="pt-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className={`font-semibold ${quest.completed ? 'line-through text-gray-500' : 'text-white'}`}>
              {quest.title}
            </h3>
            
            {/* Category Badge */}
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${categoryGradient} text-white`}>
                {quest.category}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!quest.completed && (
              <button
                onClick={handleComplete}
                className="p-2 text-green-500 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                title="Complete Quest"
              >
                <CheckCircle size={20} />
              </button>
            )}
            
            <button
              onClick={handleDelete}
              className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Delete Quest"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Quest Details */}
        <div className="space-y-2 text-sm">
          {/* Target Stat */}
          <div className="flex items-center gap-2 text-gray-400">
            <Target size={16} />
            <span>Target: <span className="text-cyberpunk-primary">{quest.stat_target}</span></span>
          </div>

          {/* XP Reward */}
          <div className="flex items-center gap-2 text-gray-400">
            <Zap size={16} />
            <span>Reward: <span className="text-cyberpunk-accent">+{quest.xp_reward} XP</span></span>
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span className={`${
              isOverdue 
                ? 'text-red-400' 
                : daysUntilDue <= 1 
                ? 'text-yellow-400' 
                : 'text-gray-400'
            }`}>
              Due: {formatDate(quest.due_date)}
              {!quest.completed && (
                <span className="ml-2">
                  {isOverdue 
                    ? '(Overdue)' 
                    : daysUntilDue === 0 
                    ? '(Today)' 
                    : `(${daysUntilDue} days)`
                  }
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Completion Status */}
        {quest.completed && (
          <motion.div
            className="flex items-center gap-2 mt-3 p-2 bg-green-500/10 border border-green-500/30 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-green-400 text-sm font-medium">Quest Completed!</span>
          </motion.div>
        )}

        {/* Overdue Warning */}
        {!quest.completed && isOverdue && (
          <motion.div
            className="flex items-center gap-2 mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Clock size={16} className="text-red-500" />
            <span className="text-red-400 text-sm font-medium">Quest Overdue!</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
} 