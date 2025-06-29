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
export type QuestCategory = 'daily' | 'weekly' | 'monthly' | 'milestone'
export type QuestDifficulty = 'E' | 'D' | 'C' | 'B' | 'A' | 'S'
export type TaskType = 'habit' | 'action' | 'learning' | 'social' | 'creative'
export type HunterRank = 'E-Class' | 'D-Class' | 'C-Class' | 'B-Class' | 'A-Class' | 'S-Class'
export type QuestStatus = 'assigned' | 'in_progress' | 'completed' | 'failed' | 'abandoned'

// User Profile interface
export interface UserProfile {
  id: string
  user_id: string
  username?: string
  display_name?: string
  selected_goal?: string
  trait_scores: Record<string, number>
  assessment_completed: boolean
  assessment_completed_at?: string
  current_level: number
  total_xp: number
  hunter_rank: HunterRank
  created_at: string
  updated_at: string
}

// Stats interface
export interface Stat {
  id: string
  user_id: string
  stat_name: string
  xp: number
  level: number
  created_at: string
  updated_at: string
}

// Trait Questions interface
export interface TraitQuestion {
  id: string
  trait_name: string
  question_text: string
  trait_weight: number
  reverse_scoring: boolean
  difficulty: string
  category: string
  created_at: string
}

// User Assessment Answers interface
export interface UserAssessmentAnswer {
  id: string
  user_id: string
  question_id: string
  answer_score: number
  created_at: string
}

// Goals interface
export interface Goal {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  benefits?: string[]
  difficulty: string
  created_at: string
}

// Quest interface (template)
export interface Quest {
  id: string
  title: string
  description?: string
  category: QuestCategory
  difficulty: QuestDifficulty
  xp_reward: number
  primary_trait: string
  secondary_traits: string[]
  estimated_time?: string
  unlock_level: number
  required_traits?: Record<string, number>
  prerequisite_quests?: string[]
  hunter_notes?: string
  goal_id?: string
  is_template: boolean
  created_at: string
  updated_at: string
}

// User Quest interface (assigned to user)
export interface UserQuest {
  id: string
  user_id: string
  quest_id: string
  status: QuestStatus
  assigned_at: string
  started_at?: string
  completed_at?: string
  due_date?: string
  progress_percentage: number
  notes?: string
  created_at: string
  updated_at: string
  // Joined data
  quest?: Quest
}

// Task interface
export interface Task {
  id: string
  quest_id: string
  title: string
  description?: string
  type: TaskType
  completion_criteria?: string
  xp_reward: number
  order_index: number
  is_required: boolean
  created_at: string
}

// User Task Progress interface
export interface UserTaskProgress {
  id: string
  user_id: string
  user_quest_id: string
  task_id: string
  completed: boolean
  completed_at?: string
  notes?: string
  created_at: string
  updated_at: string
  // Joined data
  task?: Task
}

// Reward interface
export interface Reward {
  id: string
  user_id: string
  title: string
  description?: string
  requirement_type: string
  requirement_value: number
  reward_type: string
  reward_data?: Record<string, any>
  claimed: boolean
  claimed_at?: string
  created_at: string
}

// Streak interface
export interface Streak {
  id: string
  user_id: string
  streak_type: string
  current_streak: number
  longest_streak: number
  last_activity_date?: string
  created_at: string
  updated_at: string
}

// Activity Log interface
export interface ActivityLog {
  id: string
  user_id: string
  action_type: string
  action_data?: Record<string, any>
  xp_gained: number
  created_at: string
}

// User Session interface
export interface UserSession {
  id: string
  user_id: string
  session_start: string
  session_end?: string
  ip_address?: string
  user_agent?: string
  created_at: string
}

// Database helper functions
export const dbHelpers = {
  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
    
    return data
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error updating user profile:', error)
      return false
    }
    
    return true
  },

  // Get user stats
  async getUserStats(userId: string): Promise<Stat[]> {
    const { data, error } = await supabase
      .from('stats')
      .select('*')
      .eq('user_id', userId)
      .order('stat_name')
    
    if (error) {
      console.error('Error fetching user stats:', error)
      return []
    }
    
    return data || []
  },

  // Update user stat
  async updateUserStat(userId: string, statName: string, xp: number): Promise<boolean> {
    const level = Math.floor(Math.sqrt(xp / 100))
    
    const { error } = await supabase
      .from('stats')
      .upsert({
        user_id: userId,
        stat_name: statName,
        xp,
        level
      }, {
        onConflict: 'user_id,stat_name'
      })
    
    if (error) {
      console.error('Error updating user stat:', error)
      return false
    }
    
    return true
  },

  // Get trait questions
  async getTraitQuestions(): Promise<TraitQuestion[]> {
    const { data, error } = await supabase
      .from('trait_questions')
      .select('*')
      .order('trait_name', { ascending: true })
    
    if (error) {
      console.error('Error fetching trait questions:', error)
      return []
    }
    
    return data || []
  },

  // Save assessment answers
  async saveAssessmentAnswers(userId: string, answers: Array<{questionId: string, score: number}>): Promise<boolean> {
    const assessmentData = answers.map(answer => ({
      user_id: userId,
      question_id: answer.questionId,
      answer_score: answer.score
    }))

    const { error } = await supabase
      .from('user_assessment_answers')
      .upsert(assessmentData, {
        onConflict: 'user_id,question_id'
      })
    
    if (error) {
      console.error('Error saving assessment answers:', error)
      return false
    }
    
    return true
  },

  // Get goals
  async getGoals(): Promise<Goal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('Error fetching goals:', error)
      return []
    }
    
    return data || []
  },

  // Get user quests
  async getUserQuests(userId: string): Promise<UserQuest[]> {
    const { data, error } = await supabase
      .from('user_quests')
      .select(`
        *,
        quest:quests(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching user quests:', error)
      return []
    }
    
    return data || []
  },

  // Complete quest
  async completeQuest(userQuestId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_quests')
      .update({
        status: 'completed' as QuestStatus,
        completed_at: new Date().toISOString(),
        progress_percentage: 100
      })
      .eq('id', userQuestId)
    
    if (error) {
      console.error('Error completing quest:', error)
      return false
    }
    
    return true
  },

  // Get user streaks
  async getUserStreaks(userId: string): Promise<Streak[]> {
    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error fetching user streaks:', error)
      return []
    }
    
    return data || []
  },

  // Get user activity log
  async getUserActivity(userId: string, limit: number = 10): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Error fetching user activity:', error)
      return []
    }
    
    return data || []
  },

  // Get user rewards
  async getUserRewards(userId: string): Promise<Reward[]> {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching user rewards:', error)
      return []
    }
    
    return data || []
  }
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