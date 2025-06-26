'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  Gift, 
  Star, 
  Zap, 
  Lock,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Filter,
  ArrowUpDown,
  Brain,
  Dumbbell,
  Eye,
  Heart,
  Shield,
  Target,
  Crown,
  Gem
} from 'lucide-react'


// Mock data for demo since auth is disabled
const mockRewards = [
  { id: '1', title: 'Watch Anime for 30 mins', description: 'Relax and enjoy your favorite anime series', requirement_xp: 100, stat_target: 'Wisdom', claimed: false, tier: 'common' },
  { id: '2', title: 'Gaming Session (2 hours)', description: 'Play your favorite video games guilt-free', requirement_xp: 200, stat_target: 'Dexterity', claimed: false, tier: 'common' },
  { id: '3', title: 'Order Favorite Meal', description: 'Treat yourself to a delicious meal delivery', requirement_xp: 300, stat_target: 'Charisma', claimed: true, tier: 'uncommon' },
  { id: '4', title: 'Movie Night', description: 'Watch a movie with snacks and drinks', requirement_xp: 400, stat_target: 'Wisdom', claimed: false, tier: 'uncommon' },
  { id: '5', title: 'Buy New Book', description: 'Purchase a book you\'ve been wanting to read', requirement_xp: 500, stat_target: 'Intelligence', claimed: false, tier: 'rare' },
  { id: '6', title: 'Gym Equipment Upgrade', description: 'Invest in better workout equipment', requirement_xp: 750, stat_target: 'Strength', claimed: false, tier: 'rare' },
  { id: '7', title: 'Weekend Getaway', description: 'Plan a short vacation or day trip', requirement_xp: 1000, stat_target: 'Discipline', claimed: false, tier: 'epic' },
  { id: '8', title: 'New Tech Gadget', description: 'Buy that gadget you\'ve been eyeing', requirement_xp: 1500, stat_target: 'Intelligence', claimed: false, tier: 'legendary' }
]

const statIcons = {
  Intelligence: Brain,
  Strength: Dumbbell,
  Wisdom: Eye,
  Charisma: Heart,
  Dexterity: Zap,
  Discipline: Shield
}

const tierColors = {
  common: 'from-gray-500 to-gray-600',
  uncommon: 'from-green-500 to-green-600',
  rare: 'from-blue-500 to-blue-600',
  epic: 'from-purple-500 to-purple-600',
  legendary: 'from-yellow-500 to-orange-500'
}

const tierGlows = {
  common: 'shadow-gray-500/50',
  uncommon: 'shadow-green-500/50',
  rare: 'shadow-blue-500/50',
  epic: 'shadow-purple-500/50',
  legendary: 'shadow-yellow-500/50'
}

// Confetti Effect Component
const ConfettiEffect = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: [0, Math.random() * 360],
            y: [0, Math.random() * 200 - 100],
            x: [0, Math.random() * 200 - 100],
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            ease: "easeOut",
            onComplete: i === 0 ? onComplete : undefined
          }}
        >
          <div className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-yellow-400' : 'bg-blue-400'} rounded-full`} />
        </motion.div>
      ))}
    </div>
  )
}

// Claim Modal Component
const ClaimModal = ({ isVisible, reward, onClose }: { isVisible: boolean, reward: any, onClose: () => void }) => {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true)
    }
  }, [isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {showConfetti && (
            <ConfettiEffect onComplete={() => setShowConfetti(false)} />
          )}
          
          <motion.div
            className="relative bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl border-2 border-yellow-400/50 rounded-3xl p-8 max-w-lg mx-4 text-center"
            initial={{ scale: 0, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 10, opacity: 0 }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
            style={{
              boxShadow: '0 0 60px rgba(255, 215, 0, 0.4), inset 0 0 60px rgba(255, 215, 0, 0.1)'
            }}
          >
            {/* Glowing Border Animation */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-yellow-400/30"
              animate={{
                borderColor: ['rgba(255, 215, 0, 0.3)', 'rgba(255, 215, 0, 0.8)', 'rgba(255, 215, 0, 0.3)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Floating Gems */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-400/60"
                style={{
                  left: `${20 + (i * 12)}%`,
                  top: `${15 + (i % 2) * 70}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.4, 0.8, 0.4],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                💎
              </motion.div>
            ))}

            <div className="relative z-10">
              <motion.div
                className="text-8xl mb-6"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                🪙
              </motion.div>

              <motion.h2 
                className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                SYSTEM REWARD UNLOCKED!
              </motion.h2>

              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-white text-xl mb-2">You've earned:</p>
                <p className="text-2xl font-bold text-yellow-400">"{reward?.title}"</p>
                <p className="text-gray-300 mt-2">{reward?.description}</p>
              </motion.div>

              <motion.button
                onClick={onClose}
                className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                CLAIM REWARD
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState(mockRewards)
  const [sortBy, setSortBy] = useState('xp_asc')
  const [filterStat, setFilterStat] = useState('All')
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [claimingReward, setClaimingReward] = useState<any>(null)

  // Mock user XP (in real app, this would come from stats)
  const totalXp = 850

  const availableRewards = rewards.filter(r => !r.claimed && totalXp >= r.requirement_xp)
  const lockedRewards = rewards.filter(r => !r.claimed && totalXp < r.requirement_xp)
  const claimedRewards = rewards.filter(r => r.claimed)

  // Next reward calculation
  const nextReward = lockedRewards.sort((a, b) => a.requirement_xp - b.requirement_xp)[0]
  const progressToNext = nextReward ? (totalXp / nextReward.requirement_xp) * 100 : 100

  const sortRewards = (rewardsList: any[]) => {
    const sorted = [...rewardsList]
    switch (sortBy) {
      case 'xp_asc':
        return sorted.sort((a, b) => a.requirement_xp - b.requirement_xp)
      case 'xp_desc':
        return sorted.sort((a, b) => b.requirement_xp - a.requirement_xp)
      case 'tier':
        const tierOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 }
        return sorted.sort((a, b) => tierOrder[a.tier as keyof typeof tierOrder] - tierOrder[b.tier as keyof typeof tierOrder])
      default:
        return sorted
    }
  }

  const filterRewards = (rewardsList: any[]) => {
    if (filterStat === 'All') return rewardsList
    return rewardsList.filter(r => r.stat_target === filterStat)
  }

  const claimReward = (reward: any) => {
    setClaimingReward(reward)
    setShowClaimModal(true)
  }

  const handleClaimComplete = () => {
    if (claimingReward) {
      setRewards(prev => prev.map(r => 
        r.id === claimingReward.id ? { ...r, claimed: true } : r
      ))
    }
    setShowClaimModal(false)
    setClaimingReward(null)
  }

  return (
    <>
      {/* Claim Modal */}
      <ClaimModal 
        isVisible={showClaimModal} 
        reward={claimingReward} 
        onClose={handleClaimComplete} 
      />


        {/* Treasure Vault Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        >
          <div className="relative bg-gradient-to-r from-yellow-600/10 to-orange-600/10 backdrop-blur-xl border border-yellow-400/20 rounded-2xl p-6 overflow-hidden">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
            
            <div className="relative flex items-center justify-between">
              <div>
                <motion.h1 
                  className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  🏆 HUNTER'S TREASURE VAULT
                </motion.h1>
                <motion.p 
                  className="text-yellow-300 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Claim digital rewards earned through your achievements
                </motion.p>
              </div>
              
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-right">
                  <div className="text-3xl font-bold text-yellow-400">{totalXp.toLocaleString()}</div>
                  <div className="text-yellow-300 text-sm">Total XP Earned</div>
                </div>
                <motion.div
                  className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Crown className="text-white" size={32} />
                </motion.div>
              </motion.div>
            </div>

            {/* Progress to Next Reward */}
            {nextReward && (
              <motion.div
                className="mt-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-400/20 rounded-xl p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-300 text-sm">Next Reward: {nextReward.title}</span>
                  <span className="text-blue-300 text-sm">{totalXp}/{nextReward.requirement_xp} XP</span>
                </div>
                <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progressToNext, 100)}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Filter and Sort Controls */}
        <motion.div
          className="mb-8 flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={filterStat}
              onChange={(e) => setFilterStat(e.target.value)}
              className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-400/50 transition-all duration-300"
            >
              <option value="All" className="bg-slate-800">All Stats</option>
              {Object.keys(statIcons).map(stat => (
                <option key={stat} value={stat} className="bg-slate-800">{stat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown size={16} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-400/50 transition-all duration-300"
            >
              <option value="xp_asc" className="bg-slate-800">XP: Low to High</option>
              <option value="xp_desc" className="bg-slate-800">XP: High to Low</option>
              <option value="tier" className="bg-slate-800">By Tier</option>
            </select>
          </div>
        </motion.div>

        {/* Available Rewards Section */}
        {availableRewards.length > 0 && (
          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Gift className="text-green-400" />
              </motion.div>
              Available Rewards ({filterRewards(sortRewards(availableRewards)).length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterRewards(sortRewards(availableRewards)).map((reward, index) => (
                <RewardCard 
                  key={reward.id} 
                  reward={reward} 
                  index={index} 
                  status="available"
                  onClaim={() => claimReward(reward)}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Locked Rewards Section */}
        {lockedRewards.length > 0 && (
          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Lock className="text-blue-400" />
              </motion.div>
              Locked Rewards ({filterRewards(sortRewards(lockedRewards)).length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterRewards(sortRewards(lockedRewards)).map((reward, index) => (
                <RewardCard 
                  key={reward.id} 
                  reward={reward} 
                  index={index} 
                  status="locked"
                  totalXp={totalXp}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Claimed Rewards Section */}
        {claimedRewards.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <CheckCircle className="text-yellow-400" />
              </motion.div>
              Claimed Rewards ({filterRewards(sortRewards(claimedRewards)).length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterRewards(sortRewards(claimedRewards)).map((reward, index) => (
                <RewardCard 
                  key={reward.id} 
                  reward={reward} 
                  index={index} 
                  status="claimed"
                />
              ))}
            </div>
          </motion.section>
        )}
    </>
  )
}

// Reward Card Component
const RewardCard = ({ reward, index, status, onClaim, totalXp }: {
  reward: any,
  index: number,
  status: 'available' | 'locked' | 'claimed',
  onClaim?: () => void,
  totalXp?: number
}) => {
  const StatIcon = statIcons[reward.stat_target as keyof typeof statIcons] || Target
  const tierColor = tierColors[reward.tier as keyof typeof tierColors]
  const tierGlow = tierGlows[reward.tier as keyof typeof tierGlows]

  const getCardStyles = () => {
    switch (status) {
      case 'available':
        return 'border-green-400/30 hover:border-green-400/60 shadow-green-500/20'
      case 'locked':
        return 'border-blue-400/30 hover:border-blue-400/50 shadow-blue-500/20'
      case 'claimed':
        return 'border-gray-400/30 opacity-75 grayscale'
      default:
        return 'border-white/10'
    }
  }

  const getGlowAnimation = () => {
    switch (status) {
      case 'available':
        return { boxShadow: ['0 0 20px rgba(34, 197, 94, 0.3)', '0 0 40px rgba(34, 197, 94, 0.6)', '0 0 20px rgba(34, 197, 94, 0.3)'] }
      case 'locked':
        return { boxShadow: ['0 0 20px rgba(59, 130, 246, 0.2)', '0 0 30px rgba(59, 130, 246, 0.4)', '0 0 20px rgba(59, 130, 246, 0.2)'] }
      default:
        return {}
    }
  }

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        ...getGlowAnimation()
      }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        bounce: 0.3,
        boxShadow: { duration: 3, repeat: Infinity }
      }}
      whileHover={{ 
        scale: status !== 'claimed' ? 1.05 : 1,
        rotateY: status !== 'claimed' ? 5 : 0,
        rotateX: status !== 'claimed' ? 5 : 0,
        z: 50
      }}
      style={{ perspective: 1000 }}
    >
      {/* Tier Glow Effect */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-r ${tierColor} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`}
        whileHover={{ scale: 1.1 }}
      />
      
      <motion.div
        className={`relative bg-white/5 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-500 shadow-2xl ${getCardStyles()}`}
        animate={status === 'locked' ? { 
          borderColor: ['rgba(59, 130, 246, 0.3)', 'rgba(59, 130, 246, 0.6)', 'rgba(59, 130, 246, 0.3)']
        } : {}}
        transition={status === 'locked' ? { duration: 2, repeat: Infinity } : {}}
      >
        {/* Tier Gradient Bar */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${tierColor} rounded-t-2xl`} />
        
        {/* Status Overlay */}
        {status === 'locked' && (
          <div className="absolute inset-0 bg-blue-500/5 rounded-2xl" />
        )}

        <div className="relative pt-2">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div 
                className={`w-12 h-12 bg-gradient-to-r ${tierColor} rounded-xl flex items-center justify-center shadow-lg`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <StatIcon className="text-white" size={20} />
              </motion.div>
              
              <div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${tierColor} text-white shadow-lg capitalize`}>
                  {reward.tier}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-400">Cost</div>
              <div className={`text-lg font-bold ${
                status === 'available' ? 'text-green-400' : 
                status === 'locked' ? 'text-blue-400' : 
                'text-gray-400'
              }`}>
                {reward.requirement_xp.toLocaleString()} XP
              </div>
            </div>
          </div>

          {/* Reward Details */}
          <div className="mb-4">
            <h3 className={`text-lg font-semibold mb-2 ${
              status === 'claimed' ? 'text-gray-300' : 'text-white'
            }`}>
              {reward.title}
            </h3>
            <p className="text-gray-400 text-sm mb-3">
              {reward.description}
            </p>
            
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Target size={14} />
              <span>Target: <span className="text-purple-400">{reward.stat_target}</span></span>
            </div>
          </div>

          {/* Action Button or Status */}
          {status === 'available' && (
            <motion.button
              onClick={onClaim}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Gift size={16} />
              CLAIM REWARD
            </motion.button>
          )}

          {status === 'locked' && totalXp && (
            <div className="w-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2">
              <Lock size={16} />
              Need {(reward.requirement_xp - totalXp).toLocaleString()} more XP
            </div>
          )}

          {status === 'claimed' && (
            <div className="w-full bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2">
              <CheckCircle size={16} />
              REWARD CLAIMED
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
} 