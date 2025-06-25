'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Gift, Star, Zap } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { useRewardsStore, useStatsStore } from '../../lib/store'

export default function RewardsPage() {
  const { rewards, fetchRewards, loading } = useRewardsStore()
  const { stats } = useStatsStore()

  useEffect(() => {
    fetchRewards()
  }, [fetchRewards])

  const totalXp = stats.reduce((sum, stat) => sum + stat.xp, 0)
  const availableRewards = rewards.filter(r => !r.claimed && totalXp >= r.requirement_xp)
  const claimedRewards = rewards.filter(r => r.claimed)

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
            Rewards
          </h1>
          <p className="text-gray-400">
            Claim your achievements and unlock new possibilities
          </p>
        </motion.div>

        {/* XP Summary */}
        <motion.div
          className="cyberpunk-border rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-cyberpunk-primary/20 rounded-xl flex items-center justify-center">
              <Zap className="text-cyberpunk-primary" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {totalXp.toLocaleString()} XP
              </h2>
              <p className="text-gray-400">Total Experience Points</p>
            </div>
          </div>
        </motion.div>

        {/* Available Rewards */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Gift className="text-cyberpunk-secondary" />
            Available Rewards ({availableRewards.length})
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="cyberpunk-border rounded-lg p-6 animate-pulse">
                  <div className="h-32 bg-cyberpunk-gray/30 rounded"></div>
                </div>
              ))}
            </div>
          ) : availableRewards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableRewards.map((reward) => (
                <div key={reward.id} className="cyberpunk-border rounded-lg p-6 hover:border-cyberpunk-primary/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-cyberpunk-secondary/20 rounded-lg flex items-center justify-center">
                      <Trophy className="text-cyberpunk-secondary" size={24} />
                    </div>
                                         <div className="text-right">
                       <div className="text-sm text-gray-400">Cost</div>
                       <div className="text-lg font-bold text-cyberpunk-primary">
                         {reward.requirement_xp.toLocaleString()} XP
                       </div>
                     </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {reward.title}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {reward.description}
                  </p>
                  
                  <button className="w-full cyberpunk-button">
                    Claim Reward
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="cyberpunk-border rounded-xl p-8 text-center">
              <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Available Rewards</h3>
              <p className="text-gray-400">
                Keep completing quests to unlock more rewards!
              </p>
            </div>
          )}
        </motion.section>

        {/* Claimed Rewards */}
        {claimedRewards.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Star className="text-yellow-500" />
              Claimed Rewards ({claimedRewards.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {claimedRewards.map((reward) => (
                <div key={reward.id} className="cyberpunk-border rounded-lg p-6 opacity-75">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <Star className="text-yellow-500" size={24} />
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Claimed</div>
                      <div className="text-sm text-green-500">✓</div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {reward.title}
                  </h3>
                  <p className="text-gray-400">
                    {reward.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </main>
    </div>
  )
} 