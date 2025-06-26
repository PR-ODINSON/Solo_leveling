'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Clock, Trash2, Calendar, Target, Zap, Sword, Crown, Shield } from 'lucide-react'
import { CATEGORY_COLORS, formatDate, getDaysUntilDue, isQuestOverdue, getQuestDifficulty } from '@/lib/utils'
import { useQuestsStore } from '@/lib/store'
import type { Quest } from '@/lib/supabase'

interface QuestCardProps {
  quest: Quest & { rarity?: string }
}

export default function QuestCard({ quest }: QuestCardProps) {
  const { completeQuest, deleteQuest } = useQuestsStore()
  
  const daysUntilDue = getDaysUntilDue(quest.due_date)
  const isOverdue = isQuestOverdue(quest.due_date)
  const categoryGradient = CATEGORY_COLORS[quest.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS['Daily']
  const difficulty = getQuestDifficulty(quest.xp_reward)

  // Rarity styling
  const rarityStyles = {
    Common: 'border-gray-400/30 bg-slate-800/10',
    Rare: 'border-blue-400/50 bg-blue-900/10',
    Epic: 'border-purple-400/50 bg-purple-900/10',
    Legendary: 'border-yellow-400/50 bg-yellow-900/10'
  }

  const rarity = quest.rarity || 'Common'
  const rarityStyle = rarityStyles[rarity as keyof typeof rarityStyles] || rarityStyles.Common

  // Category icons
  const categoryIcons = {
    Daily: Target,
    Weekly: Sword,
    'Boss Fight': Crown
  }

  const CategoryIcon = categoryIcons[quest.category as keyof typeof categoryIcons] || Target

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
      className={`solo-panel p-4 ${rarityStyle} cursor-pointer group ${quest.completed ? 'opacity-60' : ''}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      {/* Category Gradient Bar */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${categoryGradient} rounded-t-2xl`} />
      
      <div className="pt-2">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {/* Quest Metadata */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-1 rounded-full bg-black/30 text-blue-300 ui-font">
                {rarity}
              </span>
              <span className={`text-xs ${difficulty.color} ui-font`}>
                {difficulty.difficulty}
              </span>
              <div className="flex items-center gap-1">
                <CategoryIcon size={12} className="text-blue-400" />
                <span className="text-xs text-blue-300/70 ui-font">{quest.category}</span>
              </div>
            </div>

            <h3 className={`font-semibold ui-font ${quest.completed ? 'line-through text-gray-500' : 'text-blue-100'}`}>
              {quest.title}
            </h3>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!quest.completed && (
              <motion.button
                onClick={handleComplete}
                className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-colors"
                title="Complete Quest"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <CheckCircle size={18} />
              </motion.button>
            )}
            
            <motion.button
              onClick={handleDelete}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
              title="Delete Quest"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 size={16} />
            </motion.button>
          </div>
        </div>

        {/* Quest Details */}
        <div className="space-y-2 text-sm">
          {/* Target Stat */}
          <div className="flex items-center gap-2 text-blue-300/70">
            <Shield size={14} />
            <span className="ui-font">Target: <span className="text-blue-100">{quest.stat_target}</span></span>
          </div>

          {/* XP Reward */}
          <div className="flex items-center gap-2 text-blue-300/70">
            <Zap size={14} />
            <span className="ui-font">Reward: <span className="text-yellow-400 font-bold">+{quest.xp_reward} XP</span></span>
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span className={`ui-font ${
              isOverdue 
                ? 'text-red-400' 
                : daysUntilDue <= 1 
                ? 'text-yellow-400' 
                : 'text-blue-300/70'
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
            className="flex items-center gap-2 mt-3 p-2 bg-green-500/20 border border-green-400/30 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle size={16} className="text-green-400" />
            <span className="text-green-400 text-sm font-medium ui-font">Quest Completed!</span>
          </motion.div>
        )}

        {/* Overdue Warning */}
        {!quest.completed && isOverdue && (
          <motion.div
            className="flex items-center gap-2 mt-3 p-2 bg-red-500/20 border border-red-400/30 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Clock size={16} className="text-red-400" />
            <span className="text-red-400 text-sm font-medium ui-font">Quest Overdue!</span>
          </motion.div>
        )}

        {/* Hover Glow Effect */}
        <motion.div
          className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          style={{
            background: `linear-gradient(135deg, ${categoryGradient.split(' ')[1]}, ${categoryGradient.split(' ')[3]})`,
            filter: 'blur(15px)',
            zIndex: -1,
          }}
        />
      </div>
    </motion.div>
  )
} 