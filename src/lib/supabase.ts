import { createClient } from '@supabase/supabase-js'

// Environment variables with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Validate environment variables at runtime (not build time)
if (typeof window !== 'undefined') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL is not set. Supabase features will not work.')
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Supabase features will not work.')
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Stat {
  id: string
  user_id: string
  stat_name: string
  xp: number
  level: number
  created_at: string
  updated_at: string
}

// Updated Quest interface to match new database structure
export interface Quest {
  id: string
  title: string
  description: string
  category: 'daily' | 'weekly' | 'monthly' | 'milestone'
  difficulty: 'E' | 'D' | 'C' | 'B' | 'A' | 'S'
  xp_reward: number
  primary_trait: string
  secondary_traits: string[]
  estimated_time: string
  unlock_level: number
  required_traits: Record<string, number> | null
  prerequisite_quests: string[]
  hunter_notes: string
  created_at?: string
  updated_at?: string
}

// New Task interface for the tasks table
export interface Task {
  id: string
  quest_id: string
  title: string
  description: string
  type: 'habit' | 'action' | 'learning' | 'social' | 'creative'
  completion_criteria: string
  xp_reward: number
  created_at?: string
}

// Legacy interfaces for backward compatibility
export interface LegacyQuest {
  id: string
  user_id: string
  title: string
  category: 'Academic' | 'Emotional' | 'Physical'
  stat_target: string
  xp_reward: number
  due_date: string
  completed: boolean
  created_at: string
  updated_at: string
}

export interface Reward {
  id: string
  user_id: string
  title: string
  description: string
  requirement_xp: number
  claimed: boolean
  created_at: string
}

export interface Streak {
  id: string
  user_id: string
  current_streak: number
  last_completed_date: string
  created_at: string
  updated_at: string
}

// User profile interface for storing assessment results and goals
export interface UserProfile {
  id: string
  user_id: string
  selected_goal: string
  trait_scores: Record<string, number>
  current_level: number
  total_xp: number
  created_at: string
  updated_at: string
} 