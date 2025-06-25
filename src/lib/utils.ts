export const STAT_NAMES = [
  'Intelligence',
  'Strength', 
  'Dexterity',
  'Wisdom',
  'Charisma',
  'Discipline'
] as const

export const STAT_ICONS = {
  Intelligence: '📚',
  Strength: '🏋️',
  Dexterity: '💻',
  Wisdom: '🧠',
  Charisma: '🎭',
  Discipline: '🌙'
}

export const STAT_DESCRIPTIONS = {
  Intelligence: 'Knowledge and learning capacity',
  Strength: 'Physical power and endurance',
  Dexterity: 'Technical skills and agility',
  Wisdom: 'Insight and decision making',
  Charisma: 'Social influence and communication',
  Discipline: 'Self-control and consistency'
}

export const QUEST_CATEGORIES = ['Academic', 'Emotional', 'Physical'] as const

export const CATEGORY_COLORS = {
  Academic: 'from-blue-500 to-cyan-500',
  Emotional: 'from-purple-500 to-pink-500',
  Physical: 'from-green-500 to-emerald-500'
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

// Mock data generators (for development)
export function generateMockStats(userId: string) {
  return STAT_NAMES.map((statName, index) => ({
    id: `stat-${index}`,
    user_id: userId,
    stat_name: statName,
    xp: Math.floor(Math.random() * 300),
    level: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }))
}

export function generateMockQuests(userId: string) {
  const questTitles = [
    'Complete 2 hours of coding practice',
    'Read 30 pages of a technical book',
    'Do 50 push-ups',
    'Meditate for 20 minutes',
    'Have a meaningful conversation',
    'Organize workspace'
  ]

  return questTitles.map((title, index) => ({
    id: `quest-${index}`,
    user_id: userId,
    title,
    category: QUEST_CATEGORIES[index % 3],
    stat_target: STAT_NAMES[index % STAT_NAMES.length],
    xp_reward: 25 + Math.floor(Math.random() * 25),
    due_date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    completed: Math.random() > 0.7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }))
} 