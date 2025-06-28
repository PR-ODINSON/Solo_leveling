export const STAT_NAMES = [
  'Intelligence',
  'Strength', 
  'Dexterity',
  'Wisdom',
  'Charisma',
  'Discipline'
] as const

// Solo Leveling inspired stat icons
export const STAT_ICONS = {
  Intelligence: '🧠',
  Strength: '⚔️',
  Dexterity: '🏹',
  Wisdom: '🔮',
  Charisma: '👑',
  Discipline: '🛡️'
}

// Fantasy-themed stat descriptions
export const STAT_DESCRIPTIONS = {
  Intelligence: 'Magical knowledge and learning prowess',
  Strength: 'Physical might and combat power',
  Dexterity: 'Agility, precision, and technical mastery',
  Wisdom: 'Insight, intuition, and strategic thinking',
  Charisma: 'Leadership and social influence',
  Discipline: 'Mental fortitude and unwavering focus'
}

// Solo Leveling quest categories
export const QUEST_CATEGORIES = ['daily', 'weekly', 'monthly', 'milestone'] as const

// Legacy quest categories for backward compatibility
export const LEGACY_QUEST_CATEGORIES = ['Academic', 'Emotional', 'Physical'] as const

// Quest rarity system
export const QUEST_RARITIES = ['Common', 'Rare', 'Epic', 'Legendary'] as const

export const RARITY_COLORS = {
  Common: 'from-gray-500 to-gray-600',
  Rare: 'from-blue-500 to-blue-600',
  Epic: 'from-purple-500 to-purple-600',
  Legendary: 'from-yellow-500 to-orange-500'
}

export const RARITY_GLOWS = {
  Common: 'shadow-gray-500/30',
  Rare: 'shadow-blue-500/30',
  Epic: 'shadow-purple-500/30',
  Legendary: 'shadow-yellow-500/30'
}

export const CATEGORY_COLORS = {
  daily: 'from-blue-500 to-cyan-500',
  weekly: 'from-purple-500 to-pink-500',
  monthly: 'from-green-500 to-emerald-500',
  milestone: 'from-red-500 to-orange-500'
}

export const LEGACY_CATEGORY_COLORS = {
  Academic: 'from-blue-500 to-cyan-500',
  Emotional: 'from-purple-500 to-pink-500',
  Physical: 'from-green-500 to-emerald-500'
}

// Power level calculation (Solo Leveling style)
export function calculatePowerLevel(stats: any[]): number {
  return stats.reduce((total, stat) => total + (stat.level * 10) + Math.floor(stat.xp / 10), 0)
}

// Hunter rank system
export function getHunterRank(powerLevel: number): { rank: string, color: string, icon: string } {
  if (powerLevel < 100) return { rank: 'E-Rank', color: 'text-gray-400', icon: '🔹' }
  if (powerLevel < 300) return { rank: 'D-Rank', color: 'text-green-400', icon: '🔸' }
  if (powerLevel < 600) return { rank: 'C-Rank', color: 'text-blue-400', icon: '💎' }
  if (powerLevel < 1000) return { rank: 'B-Rank', color: 'text-purple-400', icon: '⭐' }
  if (powerLevel < 1500) return { rank: 'A-Rank', color: 'text-yellow-400', icon: '👑' }
  return { rank: 'S-Rank', color: 'text-red-400', icon: '🔥' }
}

// XP and Level calculations
export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100)
}

export function getXpForCurrentLevel(xp: number): number {
  return xp % 100
}

export function getXpForNextLevel(): number {
  return 100
}

export function getXpProgress(xp: number): number {
  return (getXpForCurrentLevel(xp) / getXpForNextLevel()) * 100
}

// Quest difficulty and rewards
export function getQuestDifficulty(xpReward: number): { difficulty: string, color: string, multiplier: number } {
  if (xpReward <= 25) return { difficulty: 'Easy', color: 'text-green-400', multiplier: 1 }
  if (xpReward <= 50) return { difficulty: 'Normal', color: 'text-blue-400', multiplier: 1.2 }
  if (xpReward <= 75) return { difficulty: 'Hard', color: 'text-purple-400', multiplier: 1.5 }
  return { difficulty: 'Nightmare', color: 'text-red-400', multiplier: 2 }
}

// Date utilities
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

export function isQuestOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date()
}

export function getDaysUntilDue(dueDate: string): number {
  const now = new Date()
  const due = new Date(dueDate)
  const diffTime = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Validation
export function isValidStatName(statName: string): boolean {
  return STAT_NAMES.includes(statName as any)
}

export function isValidQuestCategory(category: string): boolean {
  return QUEST_CATEGORIES.includes(category as any)
}

// Solo Leveling themed mock data generators
export function generateMockStats(userId: string) {
  return STAT_NAMES.map((statName, index) => ({
    id: `stat-${index}`,
    user_id: userId,
    stat_name: statName,
    xp: Math.floor(Math.random() * 500) + 100, // Higher XP for more impressive stats
    level: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }))
}

export function generateMockQuests(userId: string) {
  const questTitles = [
    // Daily Quests
    'Complete Morning Training Routine',
    'Study Advanced Magic Theory',
    'Practice Sword Techniques',
    'Meditate to Increase Mana',
    'Complete Guild Paperwork',
    'Train Physical Conditioning',
    
    // Weekly Quests  
    'Clear B-Rank Dungeon',
    'Master New Combat Skill',
    'Complete Guild Mission',
    'Upgrade Equipment',
    
    // Boss Fights
    'Defeat Shadow Monarch',
    'Conquer Red Gate',
    'Face the Architect'
  ]

  const rarities = ['Common', 'Rare', 'Epic', 'Legendary']
  const categories = ['Daily', 'Weekly', 'Boss Fight']

  return questTitles.map((title, index) => {
    const category = categories[Math.floor(index / 5)] || 'Daily'
    const rarity = rarities[Math.floor(Math.random() * rarities.length)]
    const baseXP = category === 'Boss Fight' ? 100 : category === 'Weekly' ? 75 : 25
    const rarityMultiplier = rarity === 'Legendary' ? 3 : rarity === 'Epic' ? 2 : rarity === 'Rare' ? 1.5 : 1
    
    return {
      id: `quest-${index}`,
      user_id: userId,
      title,
      category,
      rarity,
      stat_target: STAT_NAMES[index % STAT_NAMES.length],
      xp_reward: Math.floor(baseXP * rarityMultiplier),
      due_date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      completed: Math.random() > 0.8,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  })
} 