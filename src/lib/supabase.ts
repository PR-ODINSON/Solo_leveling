import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

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

export interface Quest {
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