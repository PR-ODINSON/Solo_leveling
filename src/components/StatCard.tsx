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

  // Color mapping for different stats
  const statColors = {
    Intelligence: 'from-blue-500 to-cyan-400',
    Strength: 'from-red-500 to-orange-400',
    Dexterity: 'from-green-500 to-emerald-400',
    Wisdom: 'from-purple-500 to-indigo-400',
    Charisma: 'from-yellow-500 to-amber-400',
    Discipline: 'from-gray-500 to-slate-400'
  }

  const statColor = statColors[stat.stat_name as keyof typeof statColors] || 'from-blue-500 to-cyan-400'

  return (
    <motion.div
      className={`stat-card group cursor-pointer ${isLevelingUp ? 'animate-level-up-burst' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glowing Background Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${statColor} opacity-5 rounded-2xl group-hover:opacity-10 transition-opacity duration-300`} />
      
      {/* Level Badge */}
      <div className="absolute top-4 right-4">
        <motion.div 
          className="level-badge"
          animate={isLevelingUp ? {
            scale: [1, 1.2, 1],
            boxShadow: [
              '0 4px 8px rgba(0, 0, 0, 0.3)',
              '0 8px 16px rgba(251, 191, 36, 0.8)',
              '0 4px 8px rgba(0, 0, 0, 0.3)'
            ]
          } : {}}
          transition={{ duration: 0.5, repeat: isLevelingUp ? Infinity : 0 }}
        >
          LV.{stat.level}
        </motion.div>
      </div>

      {/* Stat Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <motion.div 
            className="text-5xl"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: isLevelingUp ? [1, 1.2, 1] : 1
            }}
            transition={{ 
              rotate: { duration: 4, repeat: Infinity },
              scale: { duration: 0.5, repeat: isLevelingUp ? Infinity : 0 }
            }}
          >
            {icon}
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-blue-100 fantasy-font">
              {stat.stat_name}
            </h3>
            <p className="text-sm text-blue-300/70 ui-font">
              {description}
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
              animate={{ width: `${xpProgress}%` }}
              transition={{ 
                duration: 1.2, 
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

      {/* Hover Glow Effect */}
      <motion.div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        style={{
          background: `linear-gradient(135deg, ${statColor.split(' ')[1]}, ${statColor.split(' ')[3]})`,
          filter: 'blur(20px)',
          zIndex: -1,
        }}
      />

      {/* Level Up Effect */}
      {isLevelingUp && (
        <>
          <motion.div
            className="absolute inset-0 border-2 border-yellow-400/50 rounded-2xl pointer-events-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              scale: [0.9, 1.05, 1.05, 1],
            }}
            transition={{ duration: 2, times: [0, 0.1, 0.9, 1] }}
          />
          
          {/* Burst particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i * Math.PI * 2) / 8) * 100,
                y: Math.sin((i * Math.PI * 2) / 8) * 100,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                ease: "easeOut"
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  )
} 