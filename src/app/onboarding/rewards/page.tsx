'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Reward {
  id: string;
  title: string;
  description: string;
  xp_value: number;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  unlocked: boolean;
  claimed: boolean;
  unlock_condition: string;
  category: 'Achievement' | 'Milestone' | 'Skill' | 'Special';
}

const RewardsPage = () => {
  const router = useRouter();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);

  // Mock rewards data (fallback if no Supabase table exists)
  const mockRewards: Reward[] = [
    {
      id: '1',
      title: 'Assessment Complete',
      description: 'Completed your first Hunter assessment',
      xp_value: 100,
      icon: '🏆',
      rarity: 'Common',
      unlocked: true,
      claimed: false,
      unlock_condition: 'Complete the Hunter Assessment',
      category: 'Achievement'
    },
    {
      id: '2',
      title: 'Trait Master',
      description: 'Achieved 80%+ in any trait category',
      xp_value: 250,
      icon: '⭐',
      rarity: 'Rare',
      unlocked: true,
      claimed: false,
      unlock_condition: 'Score 80% or higher in a trait',
      category: 'Skill'
    },
    {
      id: '3',
      title: 'Perfect Score',
      description: 'Achieved 100% in a trait category',
      xp_value: 500,
      icon: '💎',
      rarity: 'Epic',
      unlocked: false,
      claimed: false,
      unlock_condition: 'Score 100% in any trait',
      category: 'Skill'
    },
    {
      id: '4',
      title: 'S-Rank Hunter',
      description: 'Achieved S-Rank Hunter status',
      xp_value: 1000,
      icon: '👑',
      rarity: 'Legendary',
      unlocked: false,
      claimed: false,
      unlock_condition: 'Reach S-Rank Hunter status',
      category: 'Milestone'
    },
    {
      id: '5',
      title: 'First Steps',
      description: 'Began your Hunter journey',
      xp_value: 50,
      icon: '🚀',
      rarity: 'Common',
      unlocked: true,
      claimed: true,
      unlock_condition: 'Start the onboarding process',
      category: 'Achievement'
    },
    {
      id: '6',
      title: 'Dedicated Hunter',
      description: 'Completed 10 daily quests',
      xp_value: 300,
      icon: '🎯',
      rarity: 'Rare',
      unlocked: false,
      claimed: false,
      unlock_condition: 'Complete 10 daily quests',
      category: 'Milestone'
    },
    {
      id: '7',
      title: 'Legendary Hunter',
      description: 'Reached the pinnacle of Hunter abilities',
      xp_value: 2000,
      icon: '🌟',
      rarity: 'Mythic',
      unlocked: false,
      claimed: false,
      unlock_condition: 'Achieve mastery in all traits',
      category: 'Special'
    },
    {
      id: '8',
      title: 'Knowledge Seeker',
      description: 'Excelled in Intelligence trait',
      xp_value: 200,
      icon: '🧠',
      rarity: 'Rare',
      unlocked: true,
      claimed: false,
      unlock_condition: 'Score 70%+ in Intelligence',
      category: 'Skill'
    }
  ];

  useEffect(() => {
    const loadRewards = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from Supabase first
        const { data: userRewards, error } = await supabase
          .from('user_rewards')
          .select('*')
          .order('created_at', { ascending: false });

        if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist
          console.error('Error fetching rewards:', error);
        }

        if (userRewards && userRewards.length > 0) {
          // Use Supabase data if available
          setRewards(userRewards);
        } else {
          // Use mock data as fallback
          console.log('Using mock rewards data');
          setRewards(mockRewards);
        }

      } catch (err) {
        console.error('Error loading rewards:', err);
        // Fallback to mock data
        setRewards(mockRewards);
      } finally {
        setLoading(false);
      }
    };

    loadRewards();
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'from-gray-400 to-gray-600';
      case 'Rare': return 'from-blue-400 to-blue-600';
      case 'Epic': return 'from-purple-400 to-purple-600';
      case 'Legendary': return 'from-yellow-400 to-orange-500';
      case 'Mythic': return 'from-pink-400 to-red-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'shadow-gray-500/50';
      case 'Rare': return 'shadow-blue-500/50';
      case 'Epic': return 'shadow-purple-500/50';
      case 'Legendary': return 'shadow-yellow-500/50';
      case 'Mythic': return 'shadow-pink-500/50';
      default: return 'shadow-gray-500/50';
    }
  };

  const handleClaimReward = async (reward: Reward) => {
    if (!reward.unlocked || reward.claimed) return;

    setSelectedReward(reward);
    setShowClaimModal(true);
  };

  const confirmClaim = async () => {
    if (!selectedReward) return;

    try {
      // Update local state
      setRewards(prev => prev.map(reward => 
        reward.id === selectedReward.id 
          ? { ...reward, claimed: true }
          : reward
      ));

      // TODO: Update Supabase if table exists
      // await supabase
      //   .from('user_rewards')
      //   .update({ claimed: true })
      //   .eq('id', selectedReward.id);

      setShowClaimModal(false);
      setSelectedReward(null);
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  const unlockedRewards = rewards.filter(r => r.unlocked);
  const lockedRewards = rewards.filter(r => !r.unlocked);
  const totalXP = rewards.filter(r => r.claimed).reduce((sum, r) => sum + r.xp_value, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-yellow-400 text-xl font-mono">Loading Reward Vault...</p>
          <p className="text-gray-400 text-sm mt-2">Accessing your achievements</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [0.5, 1.5, 0.5],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
            Reward Vault
          </h1>
          <p className="text-gray-400 text-xl md:text-2xl mb-6">
            Your Hunter achievements and unlocked rewards
          </p>
          
          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-400">{unlockedRewards.length}</p>
              <p className="text-gray-400 text-sm">Unlocked</p>
            </div>
            <div className="w-px h-12 bg-gray-600"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">{rewards.filter(r => r.claimed).length}</p>
              <p className="text-gray-400 text-sm">Claimed</p>
            </div>
            <div className="w-px h-12 bg-gray-600"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">{totalXP}</p>
              <p className="text-gray-400 text-sm">Total XP</p>
            </div>
          </div>

          <motion.div
            className="w-40 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        {/* Unlocked Rewards */}
        {unlockedRewards.length > 0 && (
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-8 text-center">
              🏆 Unlocked Rewards
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {unlockedRewards.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  className={`relative bg-black/60 backdrop-blur-xl border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 group ${
                    reward.claimed 
                      ? 'border-green-500/50 bg-green-900/20' 
                      : `border-transparent bg-gradient-to-br ${getRarityColor(reward.rarity)}/10 hover:border-yellow-400/70 hover:shadow-2xl ${getRarityGlow(reward.rarity)}`
                  }`}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: reward.claimed ? 1 : 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleClaimReward(reward)}
                >
                  {/* Rarity Border */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${getRarityColor(reward.rarity)} opacity-20 group-hover:opacity-30 transition-opacity`} />
                  
                  {/* Claimed Badge */}
                  {reward.claimed && (
                    <motion.div
                      className="absolute -top-3 -right-3 bg-green-500 rounded-full p-2 shadow-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className="text-white text-sm">✓</span>
                    </motion.div>
                  )}

                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      className="text-6xl mb-4 text-center"
                      animate={reward.claimed ? {} : { 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      {reward.icon}
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-2 text-center">
                      {reward.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 text-center leading-relaxed">
                      {reward.description}
                    </p>

                    {/* Rarity & XP */}
                    <div className="flex justify-between items-center mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRarityColor(reward.rarity)} text-white`}>
                        {reward.rarity}
                      </span>
                      <span className="text-yellow-400 font-bold">
                        +{reward.xp_value} XP
                      </span>
                    </div>

                    {/* Claim Button */}
                    {!reward.claimed && (
                      <motion.button
                        className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full font-bold text-white hover:from-yellow-400 hover:to-orange-500 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Claim Reward
                      </motion.button>
                    )}

                    {reward.claimed && (
                      <div className="w-full py-3 bg-green-600 rounded-full font-bold text-white text-center">
                        Claimed ✓
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Locked Rewards */}
        {lockedRewards.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent mb-8 text-center">
              🔒 Locked Rewards
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {lockedRewards.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  className="relative bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 group"
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Lock Overlay */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20">
                    <motion.div
                      className="text-6xl opacity-80"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🔒
                    </motion.div>
                  </div>

                  <div className="relative z-10 opacity-40">
                    {/* Icon */}
                    <div className="text-6xl mb-4 text-center blur-sm">
                      {reward.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-2 text-center">
                      {reward.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 text-center leading-relaxed">
                      {reward.description}
                    </p>

                    {/* Unlock Condition */}
                    <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-400 text-center">
                        <span className="font-bold text-yellow-400">Unlock:</span> {reward.unlock_condition}
                      </p>
                    </div>

                    {/* Rarity & XP */}
                    <div className="flex justify-between items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRarityColor(reward.rarity)} text-white opacity-60`}>
                        {reward.rarity}
                      </span>
                      <span className="text-yellow-400 font-bold opacity-60">
                        +{reward.xp_value} XP
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Navigation */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="/dashboard">
            <motion.button
              className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-xl font-bold hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue to Dashboard
            </motion.button>
          </Link>
          
          <Link href="/onboarding/assessment">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full text-lg font-bold hover:from-gray-500 hover:to-gray-600 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retake Assessment
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Claim Modal */}
      <AnimatePresence>
        {showClaimModal && selectedReward && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowClaimModal(false)}
          >
            <motion.div
              className="bg-black/90 backdrop-blur-xl border border-yellow-500/50 rounded-3xl p-8 max-w-md w-full text-center"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="text-8xl mb-6"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {selectedReward.icon}
              </motion.div>
              
              <h3 className="text-3xl font-bold text-yellow-400 mb-4">
                Claim Reward!
              </h3>
              
              <h4 className="text-xl font-bold text-white mb-2">
                {selectedReward.title}
              </h4>
              
              <p className="text-gray-300 mb-6">
                {selectedReward.description}
              </p>
              
              <div className="bg-yellow-500/20 rounded-lg p-4 mb-6">
                <p className="text-yellow-400 font-bold text-2xl">
                  +{selectedReward.xp_value} XP
                </p>
              </div>
              
              <div className="flex gap-4">
                <motion.button
                  onClick={() => setShowClaimModal(false)}
                  className="flex-1 py-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full font-bold hover:from-gray-500 hover:to-gray-600 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  onClick={confirmClaim}
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full font-bold hover:from-yellow-400 hover:to-orange-500 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Claim Now!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RewardsPage; 