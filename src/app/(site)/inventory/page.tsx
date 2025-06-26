'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lock, 
  CheckCircle, 
  Zap, 
  Shield, 
  Brain, 
  Dumbbell, 
  Eye, 
  Heart, 
  Crown, 
  Sword, 
  Star, 
  Trophy,
  X,
  Sparkles,
  Flame,
  Target,
  Users,
  Activity
} from 'lucide-react'

// Mock inventory data
const inventoryItems = [
  {
    id: '1',
    name: 'Iron Will Badge',
    description: 'A badge earned through unwavering determination and consistent daily habits.',
    lore: 'Forged in the fires of discipline, this badge grants the bearer +5 Discipline and immunity to procrastination debuffs.',
    statBoosted: 'Discipline',
    statIcon: '🛡️',
    xpRequired: 500,
    currentXp: 480,
    unlocked: false,
    rarity: 'Common',
    category: 'Badge',
    icon: '🥉',
    color: 'from-gray-500 to-slate-400'
  },
  {
    id: '2',
    name: 'Scholar\'s Tome',
    description: 'Ancient knowledge crystallized into a mystical artifact.',
    lore: 'This tome contains the wisdom of countless scholars. Reading it grants +10 Intelligence and unlocks advanced learning abilities.',
    statBoosted: 'Intelligence',
    statIcon: '🧠',
    xpRequired: 300,
    currentXp: 450,
    unlocked: true,
    rarity: 'Rare',
    category: 'Artifact',
    icon: '📚',
    color: 'from-blue-500 to-cyan-400'
  },
  {
    id: '3',
    name: 'Titan\'s Gauntlet',
    description: 'Legendary gauntlets that amplify physical prowess.',
    lore: 'Once worn by the legendary Titan King, these gauntlets grant immense physical power and the ability to shatter any obstacle.',
    statBoosted: 'Strength',
    statIcon: '⚔️',
    xpRequired: 800,
    currentXp: 520,
    unlocked: false,
    rarity: 'Legendary',
    category: 'Equipment',
    icon: '🥊',
    color: 'from-red-500 to-orange-400'
  },
  {
    id: '4',
    name: 'Mystic Focus Crystal',
    description: 'A crystal that enhances mental clarity and wisdom.',
    lore: 'Mined from the depths of the Wisdom Caverns, this crystal grants +15 Wisdom and enhanced decision-making abilities.',
    statBoosted: 'Wisdom',
    statIcon: '🔮',
    xpRequired: 600,
    currentXp: 610,
    unlocked: true,
    rarity: 'Epic',
    category: 'Crystal',
    icon: '💎',
    color: 'from-purple-500 to-indigo-400'
  },
  {
    id: '5',
    name: 'Swift Shadow Boots',
    description: 'Boots that grant incredible speed and agility.',
    lore: 'Crafted by the Shadow Clan\'s master artisans, these boots allow the wearer to move like the wind itself.',
    statBoosted: 'Dexterity',
    statIcon: '🏹',
    xpRequired: 400,
    currentXp: 380,
    unlocked: false,
    rarity: 'Rare',
    category: 'Equipment',
    icon: '👟',
    color: 'from-green-500 to-emerald-400'
  },
  {
    id: '6',
    name: 'Crown of Leadership',
    description: 'A majestic crown that commands respect and authority.',
    lore: 'Worn by the greatest leaders in history, this crown grants +20 Charisma and the ability to inspire others to greatness.',
    statBoosted: 'Charisma',
    statIcon: '👑',
    xpRequired: 700,
    currentXp: 290,
    unlocked: false,
    rarity: 'Legendary',
    category: 'Crown',
    icon: '👑',
    color: 'from-yellow-500 to-amber-400'
  },
  {
    id: '7',
    name: 'Hunter\'s Mark',
    description: 'The ultimate badge of a true hunter.',
    lore: 'Only the most elite hunters earn this mark. It grants access to S-Rank dungeons and legendary quests.',
    statBoosted: 'All Stats',
    statIcon: '⭐',
    xpRequired: 2000,
    currentXp: 1850,
    unlocked: false,
    rarity: 'Mythic',
    category: 'Badge',
    icon: '🏆',
    color: 'from-pink-500 to-rose-400'
  },
  {
    id: '8',
    name: 'Beginner\'s Luck Charm',
    description: 'A simple charm that brings good fortune to new hunters.',
    lore: 'Every hunter starts their journey with this humble charm. Though simple, it carries the hopes and dreams of countless adventures.',
    statBoosted: 'All Stats',
    statIcon: '🍀',
    xpRequired: 0,
    currentXp: 100,
    unlocked: true,
    rarity: 'Common',
    category: 'Charm',
    icon: '🍀',
    color: 'from-green-400 to-teal-400'
  }
]

const rarityColors = {
  Common: 'border-gray-400/50 shadow-gray-400/20',
  Rare: 'border-blue-400/50 shadow-blue-400/30',
  Epic: 'border-purple-400/50 shadow-purple-400/30',
  Legendary: 'border-yellow-400/50 shadow-yellow-400/30',
  Mythic: 'border-pink-400/50 shadow-pink-400/30'
}

const rarityGlow = {
  Common: 'shadow-gray-400/20',
  Rare: 'shadow-blue-400/30',
  Epic: 'shadow-purple-400/30',
  Legendary: 'shadow-yellow-400/30',
  Mythic: 'shadow-pink-400/30'
}

interface ItemModalProps {
  item: typeof inventoryItems[0] | null
  isOpen: boolean
  onClose: () => void
}

const ItemModal = ({ item, isOpen, onClose }: ItemModalProps) => {
  if (!item) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="solo-panel p-8 max-w-2xl w-full relative overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", bounce: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 text-blue-400 hover:text-blue-300 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} />
            </motion.button>

            {/* Item Header */}
            <div className="flex items-center gap-6 mb-6">
              <motion.div
                className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-3xl shadow-lg`}
                animate={{
                  boxShadow: [
                    `0 0 20px ${rarityGlow[item.rarity as keyof typeof rarityGlow]}`,
                    `0 0 30px ${rarityGlow[item.rarity as keyof typeof rarityGlow]}`,
                    `0 0 20px ${rarityGlow[item.rarity as keyof typeof rarityGlow]}`
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {item.icon}
              </motion.div>
              
              <div className="flex-1">
                <h2 className="text-3xl font-bold fantasy-font text-blue-100 mb-2">{item.name}</h2>
                <div className="flex items-center gap-4 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${rarityColors[item.rarity as keyof typeof rarityColors]} bg-black/30`}>
                    {item.rarity}
                  </span>
                  <span className="text-blue-300 ui-font">{item.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.statIcon}</span>
                  <span className="text-blue-300 ui-font">Boosts: {item.statBoosted}</span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="mb-6">
              {item.unlocked ? (
                <motion.div
                  className="flex items-center gap-2 text-green-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <CheckCircle size={20} />
                  <span className="font-semibold ui-font">OWNED</span>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-red-400">
                    <Lock size={20} />
                    <span className="font-semibold ui-font">LOCKED</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm ui-font">
                      <span className="text-blue-300">Progress:</span>
                      <span className="text-blue-100">{item.currentXp} / {item.xpRequired} XP</span>
                    </div>
                    <div className="w-full bg-slate-800/50 rounded-full h-2">
                      <motion.div
                        className={`h-2 bg-gradient-to-r ${item.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.currentXp / item.xpRequired) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-blue-100 mb-3 fantasy-font">Description</h3>
              <p className="text-blue-200 ui-font leading-relaxed">{item.description}</p>
            </div>

            {/* Lore */}
            <div className="border-t border-blue-400/20 pt-6">
              <h3 className="text-xl font-bold text-blue-100 mb-3 fantasy-font flex items-center gap-2">
                <Sparkles size={20} className="text-purple-400" />
                Ancient Lore
              </h3>
              <p className="text-blue-200/80 ui-font leading-relaxed italic">{item.lore}</p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-blue-500/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-radial from-purple-500/10 to-transparent pointer-events-none" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface InventoryItemCardProps {
  item: typeof inventoryItems[0]
  index: number
  onClick: () => void
}

const InventoryItemCard = ({ item, index, onClick }: InventoryItemCardProps) => {
  const progressPercentage = (item.currentXp / item.xpRequired) * 100

  return (
    <motion.div
      className={`
        solo-panel p-6 cursor-pointer transition-all duration-300 relative overflow-hidden group
        ${item.unlocked ? 'hover:scale-105' : 'grayscale hover:grayscale-0'}
        ${rarityColors[item.rarity as keyof typeof rarityColors]}
      `}
      initial={{ opacity: 0, y: 20, rotateY: -15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ 
        scale: 1.05, 
        rotateY: 5,
        boxShadow: `0 20px 40px ${rarityGlow[item.rarity as keyof typeof rarityGlow]}`
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{ perspective: '1000px' }}
    >
      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          repeatDelay: 3,
          ease: "easeInOut"
        }}
      />

      {/* Status Badge */}
      <div className="absolute top-3 right-3">
        {item.unlocked ? (
          <motion.div
            className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
            animate={{ 
              scale: [1, 1.2, 1],
              boxShadow: ['0 0 10px rgba(34, 197, 94, 0.5)', '0 0 20px rgba(34, 197, 94, 0.8)', '0 0 10px rgba(34, 197, 94, 0.5)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CheckCircle size={14} className="text-white" />
          </motion.div>
        ) : (
          <div className="w-6 h-6 bg-red-500/70 rounded-full flex items-center justify-center">
            <Lock size={14} className="text-white" />
          </div>
        )}
      </div>

      {/* Item Icon */}
      <motion.div
        className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-2xl mb-4 mx-auto shadow-lg`}
        animate={item.unlocked ? {
          rotate: [0, 5, -5, 0],
          boxShadow: [
            `0 0 15px ${rarityGlow[item.rarity as keyof typeof rarityGlow]}`,
            `0 0 25px ${rarityGlow[item.rarity as keyof typeof rarityGlow]}`,
            `0 0 15px ${rarityGlow[item.rarity as keyof typeof rarityGlow]}`
          ]
        } : {}}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {item.icon}
      </motion.div>

      {/* Item Info */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-blue-100 mb-2 fantasy-font">{item.name}</h3>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-lg">{item.statIcon}</span>
          <span className="text-sm text-blue-300 ui-font">{item.statBoosted}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${rarityColors[item.rarity as keyof typeof rarityColors]} bg-black/30`}>
          {item.rarity}
        </span>
      </div>

      {/* Progress Bar */}
      {!item.unlocked && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs ui-font">
            <span className="text-blue-300">XP Required:</span>
            <span className="text-blue-100">{item.currentXp} / {item.xpRequired}</span>
          </div>
          <div className="w-full bg-slate-800/50 rounded-full h-2">
            <motion.div
              className={`h-2 bg-gradient-to-r ${item.color} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${item.color.split(' ')[1]}, ${item.color.split(' ')[3]})`,
          filter: 'blur(20px)',
          zIndex: -1,
        }}
      />
    </motion.div>
  )
}

export default function InventoryPage() {
  const [selectedItem, setSelectedItem] = useState<typeof inventoryItems[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openItemModal = (item: typeof inventoryItems[0]) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const closeItemModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedItem(null), 300)
  }

  const ownedItems = inventoryItems.filter(item => item.unlocked)
  const lockedItems = inventoryItems.filter(item => !item.unlocked)

  return (
    <>
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl font-bold mb-4 fantasy-font bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent text-shadow-glow">
          🎒 Inventory — Artifacts & Badges
        </h1>
        <p className="text-xl text-blue-300/80 ui-font">
          Your collection of mystical artifacts and hard-earned achievements
        </p>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        className="solo-panel p-6 mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-green-400 fantasy-font">{ownedItems.length}</div>
            <div className="text-blue-300 ui-font">Items Owned</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-400 fantasy-font">{lockedItems.length}</div>
            <div className="text-blue-300 ui-font">Items Locked</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400 fantasy-font">{Math.round((ownedItems.length / inventoryItems.length) * 100)}%</div>
            <div className="text-blue-300 ui-font">Collection Progress</div>
          </div>
        </div>
      </motion.div>

      {/* Inventory Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {inventoryItems.map((item, index) => (
          <InventoryItemCard
            key={item.id}
            item={item}
            index={index}
            onClick={() => openItemModal(item)}
          />
        ))}
      </motion.div>

      {/* Item Modal */}
      <ItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={closeItemModal}
      />
    </>
  )
} 