'use client'

import { motion } from 'framer-motion'
import { STAT_ICONS, STAT_DESCRIPTIONS, getXpProgress } from '@/lib/utils'
import { useUIStore } from '@/lib/store'
import type { Stat } from '@/lib/supabase'

interface StatCardProps {
  stat: Stat
}

export default function StatCard({ stat }: StatCardProps) {
  const { levelUpAnimation } = useUIStore()
  const isLevelingUp = levelUpAnimation === stat.stat_name

  const xpProgress = getXpProgress(stat.xp)
  const currentLevelXp = stat.xp % 100
  const icon = STAT_ICONS[stat.stat_name as keyof typeof STAT_ICONS]
  const description = STAT_DESCRIPTIONS[stat.stat_name as keyof typeof STAT_DESCRIPTIONS]

  return (
    <motion.div
      className={`stat-card ${isLevelingUp ? 'animate-level-up glow-effect' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyberpunk-primary/5 to-cyberpunk-secondary/5 rounded-xl" />
      
      {/* Level Badge */}
      <div className="absolute top-4 right-4">
        <div className="level-badge">
          LV.{stat.level}
        </div>
      </div>

      {/* Stat Icon and Name */}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">{icon}</div>
          <div>
            <h3 className="text-xl font-bold text-cyberpunk-primary">
              {stat.stat_name}
            </h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>

        {/* XP Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">XP</span>
            <span className="text-cyberpunk-primary font-mono">
              {currentLevelXp}/100
            </span>
          </div>
          
          <div className="xp-bar">
            <motion.div
              className="xp-progress"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut",
                delay: 0.2 
              }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </motion.div>
          </div>
        </div>

        {/* Total XP */}
        <div className="mt-3 text-xs text-gray-500 text-center">
          Total XP: {stat.xp.toLocaleString()}
        </div>
      </div>

      {/* Level Up Effect */}
      {isLevelingUp && (
        <motion.div
          className="absolute inset-0 border-2 border-cyberpunk-primary rounded-xl pointer-events-none"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: [0, 1, 1, 0], 
            scale: [0.9, 1.05, 1.05, 1],
          }}
          transition={{ duration: 2, times: [0, 0.1, 0.9, 1] }}
        />
      )}
    </motion.div>
  )
} 