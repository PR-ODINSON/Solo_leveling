'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Lock, Check, Gift } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import { useRewardsStore, useStatsStore } from '@/lib/store'

export default function RewardsPage() {
  const { rewards, fetchRewards, claimReward, loading } = useRewardsStore()
  const { stats } = useStatsStore()

  useEffect(() => {
    fetchRewards()
  }, [fetchRewards])

  const totalXp = stats.reduce((sum, stat) => sum + stat.xp, 0)

  // Mock rewards for demo if no rewards exist
  const mockRewards = [
    {
      id: 'reward-1',
      title: '1 Hour Gaming Session',
      description: 'Enjoy your favorite game guilt-free',
      requirement_xp: 100,
      claimed: false,
      user_id: '',
      created_at: new Date().toISOString()
    },
    {
      id: 'reward-2',
      title: 'Favorite Meal',
      description: 'Order from your favorite restaurant',
      requirement_xp: 250,
      claimed: false,
      user_id: '',
      created_at: new Date().toISOString()
    },
    {
      id: 'reward-3',
      title: 'Movie Night',
      description: 'Watch a movie of your choice',
      requirement_xp: 500,
      claimed: false,
      user_id: '',
      created_at: new Date().toISOString()
    },
    {
      id: 'reward-4',
      title: 'New Book Purchase',
      description: 'Buy that book you\'ve been wanting',
      requirement_xp: 750,
      claimed: false,
      user_id: '',
      created_at: new Date().toISOString()
    },
    {
      id: 'reward-5',
      title: 'Weekend Adventure',
      description: 'Plan a special weekend activity',
      requirement_xp: 1000,
      claimed: false,
      user_id: '',
      created_at: new Date().toISOString()
    }
  ]

  const displayRewards = rewards.length > 0 ? rewards : mockRewards
  const availableRewards = displayRewards.filter(r => !r.claimed && totalXp >= r.requirement_xp)
  const lockedRewards = displayRewards.filter(r => !r.claimed && totalXp < r.requirement_xp)
  const claimedRewards = displayRewards.filter(r => r.claimed)

  const handleClaimReward = async (rewardId: string) => {
    await claimReward(rewardId)
  }

  const RewardCard = ({ reward, isAvailable, isClaimed }: { 
    reward: any, 
    isAvailable: boolean, 
    isClaimed: boolean 
  }) => (
    <motion.div
      className={`cyberpunk-border rounded-xl p-6 relative overflow-hidden ${
        isClaimed ? 'opacity-60' : ''
      } ${isAvailable && !isClaimed ? 'hover:scale-105' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={isAvailable && !isClaimed ? { y: -2 } : {}}
    >
      {/* Status Indicator */}
      <div className="absolute top-4 right-4">
        {isClaimed ? (
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Check size={16} className="text-white" />
          </div>
        ) : isAvailable ? (
          <div className="w-8 h-8 bg-cyberpunk-primary rounded-full flex items-center justify-center animate-pulse">
            <Gift size={16} className="text-cyberpunk-dark" />
          </div>
        ) : (
          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
            <Lock size={16} className="text-white" />
          </div>
        )}
      </div>

      {/* Reward Icon */}
      <div className="mb-4">
        <Trophy 
          size={32} 
          className={`${
            isClaimed ? 'text-green-500' 
            : isAvailable ? 'text-cyberpunk-primary' 
            : 'text-gray-500'
          }`} 
        />
      </div>

      {/* Reward Info */}
      <div className="mb-4">
        <h3 className={`text-lg font-bold mb-2 ${
          isClaimed ? 'text-green-400 line-through' 
          : isAvailable ? 'text-white' 
          : 'text-gray-400'
        }`}>
          {reward.title}
        </h3>
        <p className="text-gray-400 text-sm mb-3">
          {reward.description}
        </p>
        
        {/* XP Requirement */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Required XP:</span>
          <span className={`font-mono font-bold ${
            totalXp >= reward.requirement_xp ? 'text-cyberpunk-primary' : 'text-gray-500'
          }`}>
            {reward.requirement_xp.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-gray-400">Progress</span>
          <span className={`${
            totalXp >= reward.requirement_xp ? 'text-cyberpunk-primary' : 'text-gray-400'
          }`}>
            {Math.min(100, (totalXp / reward.requirement_xp) * 100).toFixed(0)}%
          </span>
        </div>
        <div className="h-2 bg-cyberpunk-gray rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              totalXp >= reward.requirement_xp 
                ? 'bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-secondary' 
                : 'bg-gray-600'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (totalXp / reward.requirement_xp) * 100)}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
      </div>

      {/* Action Button */}
      {isAvailable && !isClaimed && (
        <button
          onClick={() => handleClaimReward(reward.id)}
          className="w-full cyberpunk-button flex items-center justify-center gap-2"
        >
          <Gift size={16} />
          Claim Reward
        </button>
      )}

      {isClaimed && (
        <div className="w-full p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
          <span className="text-green-400 font-medium">Claimed!</span>
        </div>
      )}
    </motion.div>
  )

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
            Reward System
          </h1>
          <p className="text-gray-400">
            Claim your well-earned rewards for reaching XP milestones
          </p>
        </motion.div>

        {/* XP Summary */}
        <motion.div
          className="cyberpunk-border rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Your Total XP</h2>
              <p className="text-3xl font-bold text-cyberpunk-primary">
                {totalXp.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Available Rewards</p>
              <p className="text-2xl font-bold text-cyberpunk-secondary">
                {availableRewards.length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Reward Sections */}
        <div className="space-y-8">
          {/* Available Rewards */}
          {availableRewards.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Gift className="text-cyberpunk-primary" />
                Available Rewards ({availableRewards.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableRewards.map((reward) => (
                  <RewardCard 
                    key={reward.id} 
                    reward={reward} 
                    isAvailable={true} 
                    isClaimed={false} 
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* Locked Rewards */}
          {lockedRewards.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Lock className="text-gray-400" />
                Locked Rewards ({lockedRewards.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lockedRewards.map((reward) => (
                  <RewardCard 
                    key={reward.id} 
                    reward={reward} 
                    isAvailable={false} 
                    isClaimed={false} 
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* Claimed Rewards */}
          {claimedRewards.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Check className="text-green-500" />
                Claimed Rewards ({claimedRewards.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {claimedRewards.map((reward) => (
                  <RewardCard 
                    key={reward.id} 
                    reward={reward} 
                    isAvailable={false} 
                    isClaimed={true} 
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="cyberpunk-border rounded-xl p-6 animate-pulse">
                  <div className="h-40 bg-cyberpunk-gray/30 rounded"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 