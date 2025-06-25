import { create } from 'zustand'
import { supabase, type Stat, type Quest, type Reward, type Streak } from './supabase'
import { calculateLevel } from './utils'
import toast from 'react-hot-toast'

interface AuthState {
  user: any | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

interface StatsState {
  stats: Stat[]
  loading: boolean
  fetchStats: () => Promise<void>
  updateStat: (statName: string, xpChange: number) => Promise<void>
  initializeStats: () => Promise<void>
}

interface QuestsState {
  quests: Quest[]
  loading: boolean
  fetchQuests: () => Promise<void>
  createQuest: (quest: Omit<Quest, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  completeQuest: (questId: string) => Promise<void>
  deleteQuest: (questId: string) => Promise<void>
}

interface RewardsState {
  rewards: Reward[]
  loading: boolean
  fetchRewards: () => Promise<void>
  claimReward: (rewardId: string) => Promise<void>
}

interface UIState {
  showCreateQuestModal: boolean
  setShowCreateQuestModal: (show: boolean) => void
  levelUpAnimation: string | null
  setLevelUpAnimation: (statName: string | null) => void
}

// Auth Store
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({ user: session?.user || null, loading: false })
      
      // Listen for auth changes
      supabase.auth.onAuthStateChange((event, session) => {
        set({ user: session?.user || null })
      })
    } catch (error) {
      console.error('Auth initialization error:', error)
      set({ loading: false })
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true })
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success('Welcome back, Hunter!')
    } catch (error: any) {
      toast.error(error.message || 'Sign in failed')
      throw error
    } finally {
      set({ loading: false })
    }
  },

  signUp: async (email: string, password: string) => {
    set({ loading: true })
    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      toast.success('Welcome to AscendOS! Please check your email to verify your account.')
    } catch (error: any) {
      toast.error(error.message || 'Sign up failed')
      throw error
    } finally {
      set({ loading: false })
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logged out successfully')
    } catch (error: any) {
      toast.error('Error signing out')
    }
  }
}))

// Stats Store
export const useStatsStore = create<StatsState>((set, get) => ({
  stats: [],
  loading: false,

  fetchStats: async () => {
    const { user } = useAuthStore.getState()
    if (!user) return

    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error
      
      // Update levels based on XP
      const updatedStats = data.map(stat => ({
        ...stat,
        level: calculateLevel(stat.xp)
      }))
      
      set({ stats: updatedStats })
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Failed to load stats')
    } finally {
      set({ loading: false })
    }
  },

  updateStat: async (statName: string, xpChange: number) => {
    const { user } = useAuthStore.getState()
    const { stats } = get()
    if (!user) return

    try {
      const currentStat = stats.find(s => s.stat_name === statName)
      if (!currentStat) return

      const newXp = Math.max(0, currentStat.xp + xpChange)
      const oldLevel = calculateLevel(currentStat.xp)
      const newLevel = calculateLevel(newXp)

      const { error } = await supabase
        .from('stats')
        .update({ 
          xp: newXp, 
          level: newLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentStat.id)

      if (error) throw error

      // Update local state
      set({
        stats: stats.map(stat =>
          stat.stat_name === statName
            ? { ...stat, xp: newXp, level: newLevel }
            : stat
        )
      })

      // Show appropriate notifications
      if (xpChange > 0) {
        toast.success(`+${xpChange} XP in ${statName}!`)
        if (newLevel > oldLevel) {
          useUIStore.getState().setLevelUpAnimation(statName)
          toast.success(`🎉 Level up! ${statName} is now Level ${newLevel}!`)
        }
      } else if (xpChange < 0) {
        toast.error(`${xpChange} XP in ${statName}`)
      }
    } catch (error) {
      console.error('Error updating stat:', error)
      toast.error('Failed to update stat')
    }
  },

  initializeStats: async () => {
    const { user } = useAuthStore.getState()
    if (!user) return

    try {
      // Check if user already has stats
      const { data: existingStats } = await supabase
        .from('stats')
        .select('*')
        .eq('user_id', user.id)

      if (existingStats && existingStats.length > 0) {
        return get().fetchStats()
      }

      // Create initial stats for new user
      const STAT_NAMES = ['Intelligence', 'Strength', 'Dexterity', 'Wisdom', 'Charisma', 'Discipline']
      const initialStats = STAT_NAMES.map(statName => ({
        user_id: user.id,
        stat_name: statName,
        xp: 0,
        level: 0
      }))

      const { error } = await supabase
        .from('stats')
        .insert(initialStats)

      if (error) throw error

      get().fetchStats()
      toast.success('Welcome! Your adventure begins now!')
    } catch (error) {
      console.error('Error initializing stats:', error)
      toast.error('Failed to initialize stats')
    }
  }
}))

// Quests Store
export const useQuestsStore = create<QuestsState>((set, get) => ({
  quests: [],
  loading: false,

  fetchQuests: async () => {
    const { user } = useAuthStore.getState()
    if (!user) return

    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ quests: data || [] })
    } catch (error) {
      console.error('Error fetching quests:', error)
      toast.error('Failed to load quests')
    } finally {
      set({ loading: false })
    }
  },

  createQuest: async (questData) => {
    const { user } = useAuthStore.getState()
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('quests')
        .insert({
          ...questData,
          user_id: user.id,
          completed: false
        })
        .select()
        .single()

      if (error) throw error

      set({ quests: [data, ...get().quests] })
      toast.success('New quest created!')
    } catch (error) {
      console.error('Error creating quest:', error)
      toast.error('Failed to create quest')
    }
  },

  completeQuest: async (questId: string) => {
    const { quests } = get()
    const quest = quests.find(q => q.id === questId)
    if (!quest || quest.completed) return

    try {
      const { error } = await supabase
        .from('quests')
        .update({ 
          completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', questId)

      if (error) throw error

      // Update local state
      set({
        quests: quests.map(q =>
          q.id === questId ? { ...q, completed: true } : q
        )
      })

      // Add XP to the target stat
      await useStatsStore.getState().updateStat(quest.stat_target, quest.xp_reward)
      
      toast.success('🎉 Quest completed!')
    } catch (error) {
      console.error('Error completing quest:', error)
      toast.error('Failed to complete quest')
    }
  },

  deleteQuest: async (questId: string) => {
    try {
      const { error } = await supabase
        .from('quests')
        .delete()
        .eq('id', questId)

      if (error) throw error

      set({ quests: get().quests.filter(q => q.id !== questId) })
      toast.success('Quest deleted')
    } catch (error) {
      console.error('Error deleting quest:', error)
      toast.error('Failed to delete quest')
    }
  }
}))

// Rewards Store
export const useRewardsStore = create<RewardsState>((set, get) => ({
  rewards: [],
  loading: false,

  fetchRewards: async () => {
    const { user } = useAuthStore.getState()
    if (!user) return

    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('user_id', user.id)
        .order('requirement_xp', { ascending: true })

      if (error) throw error
      set({ rewards: data || [] })
    } catch (error) {
      console.error('Error fetching rewards:', error)
      toast.error('Failed to load rewards')
    } finally {
      set({ loading: false })
    }
  },

  claimReward: async (rewardId: string) => {
    try {
      const { error } = await supabase
        .from('rewards')
        .update({ claimed: true })
        .eq('id', rewardId)

      if (error) throw error

      set({
        rewards: get().rewards.map(r =>
          r.id === rewardId ? { ...r, claimed: true } : r
        )
      })

      toast.success('🪙 Reward claimed!')
    } catch (error) {
      console.error('Error claiming reward:', error)
      toast.error('Failed to claim reward')
    }
  }
}))

// UI Store
export const useUIStore = create<UIState>((set) => ({
  showCreateQuestModal: false,
  setShowCreateQuestModal: (show) => set({ showCreateQuestModal: show }),

  levelUpAnimation: null,
  setLevelUpAnimation: (statName) => {
    set({ levelUpAnimation: statName })
    if (statName) {
      setTimeout(() => set({ levelUpAnimation: null }), 2000)
    }
  }
})) 