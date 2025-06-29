import { create } from 'zustand'
import { AuthService, AuthUser } from './auth'
import { 
  dbHelpers, 
  UserProfile, 
  Stat, 
  UserQuest, 
  Quest, 
  Reward, 
  Streak, 
  ActivityLog,
  Goal,
  TraitQuestion,
  HunterRank
} from './supabase'
import { calculateLevel } from './utils'
import toast from 'react-hot-toast'

// Auth Store
interface AuthState {
  user: AuthUser | null
  profile: UserProfile | null
  loading: boolean
  initialized: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string, username?: string, displayName?: string) => Promise<boolean>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>
  refreshProfile: () => Promise<void>
  hasCompletedOnboarding: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  initialize: async () => {
    if (get().initialized) return
    
    try {
      set({ loading: true })
      
      // Get current user
      const user = await AuthService.getCurrentUser()
      set({ user, profile: user?.profile || null })
      
      // Subscribe to auth changes
      AuthService.onAuthStateChange((user) => {
        set({ user, profile: user?.profile || null })
        
        // If user signed in, fetch their data
        if (user) {
          get().refreshProfile()
        }
      })
      
      set({ initialized: true })
    } catch (error) {
      console.error('Auth initialization error:', error)
    } finally {
      set({ loading: false })
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true })
    try {
      const { user, error } = await AuthService.signIn({ email, password })
      
      if (error) {
        toast.error(error.message || 'Sign in failed')
        return false
      }
      
      if (user) {
        set({ user, profile: user.profile || null })
        toast.success('Welcome back, Hunter!')
        return true
      }
      
      return false
    } catch (error: any) {
      toast.error(error.message || 'Sign in failed')
      return false
    } finally {
      set({ loading: false })
    }
  },

  signUp: async (email: string, password: string, username?: string, displayName?: string) => {
    set({ loading: true })
    try {
      const { user, error } = await AuthService.signUp({ 
        email, 
        password, 
        username, 
        displayName 
      })
      
      if (error) {
        toast.error(error.message || 'Sign up failed')
        return false
      }
      
      if (user) {
        set({ user, profile: user.profile || null })
        toast.success('Welcome to AscendOS! Your hunter journey begins now.')
        return true
      }
      
      return false
    } catch (error: any) {
      toast.error(error.message || 'Sign up failed')
      return false
    } finally {
      set({ loading: false })
    }
  },

  signOut: async () => {
    try {
      await AuthService.signOut()
      set({ user: null, profile: null })
      toast.success('Logged out successfully')
    } catch (error: any) {
      toast.error('Error signing out')
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    const { user } = get()
    if (!user) return false

    try {
      const success = await AuthService.updateProfile(user.id, updates)
      if (success) {
        // Refresh profile
        await get().refreshProfile()
        toast.success('Profile updated successfully')
      }
      return success
    } catch (error) {
      toast.error('Failed to update profile')
      return false
    }
  },

  refreshProfile: async () => {
    const { user } = get()
    if (!user) return

    try {
      const profile = await dbHelpers.getUserProfile(user.id)
      set({ profile })
    } catch (error) {
      console.error('Error refreshing profile:', error)
    }
  },

  hasCompletedOnboarding: () => {
    const { profile } = get()
    return !!(profile?.assessment_completed && profile?.selected_goal)
  }
}))

// Stats Store
interface StatsState {
  stats: Stat[]
  loading: boolean
  fetchStats: () => Promise<void>
  updateStat: (statName: string, xpChange: number) => Promise<void>
  getStatByName: (statName: string) => Stat | undefined
  getTotalXP: () => number
  getAverageLevel: () => number
}

export const useStatsStore = create<StatsState>((set, get) => ({
  stats: [],
  loading: false,

  fetchStats: async () => {
    const { user } = useAuthStore.getState()
    if (!user) return

    set({ loading: true })
    try {
      const stats = await dbHelpers.getUserStats(user.id)
      set({ stats })
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

      const success = await dbHelpers.updateUserStat(user.id, statName, newXp)
      
      if (success) {
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
        }
      }
    } catch (error) {
      console.error('Error updating stat:', error)
      toast.error('Failed to update stat')
    }
  },

  getStatByName: (statName: string) => {
    return get().stats.find(s => s.stat_name === statName)
  },

  getTotalXP: () => {
    return get().stats.reduce((total, stat) => total + stat.xp, 0)
  },

  getAverageLevel: () => {
    const { stats } = get()
    if (stats.length === 0) return 0
    return stats.reduce((total, stat) => total + stat.level, 0) / stats.length
  }
}))

// Quests Store
interface QuestsState {
  userQuests: UserQuest[]
  questTemplates: Quest[]
  loading: boolean
  fetchUserQuests: () => Promise<void>
  fetchQuestTemplates: () => Promise<void>
  completeQuest: (userQuestId: string) => Promise<void>
  startQuest: (userQuestId: string) => Promise<void>
  getActiveQuests: () => UserQuest[]
  getCompletedQuests: () => UserQuest[]
}

export const useQuestsStore = create<QuestsState>((set, get) => ({
  userQuests: [],
  questTemplates: [],
  loading: false,

  fetchUserQuests: async () => {
    const { user } = useAuthStore.getState()
    if (!user) return

    set({ loading: true })
    try {
      const userQuests = await dbHelpers.getUserQuests(user.id)
      set({ userQuests })
    } catch (error) {
      console.error('Error fetching user quests:', error)
      toast.error('Failed to load quests')
    } finally {
      set({ loading: false })
    }
  },

  fetchQuestTemplates: async () => {
    try {
      // This would be implemented when we have quest templates
      // For now, we'll skip this
    } catch (error) {
      console.error('Error fetching quest templates:', error)
    }
  },

  completeQuest: async (userQuestId: string) => {
    const { userQuests } = get()
    const userQuest = userQuests.find(q => q.id === userQuestId)
    if (!userQuest || userQuest.status === 'completed') return

    try {
      const success = await dbHelpers.completeQuest(userQuestId)
      
      if (success) {
        // Update local state
        set({
          userQuests: userQuests.map(q =>
            q.id === userQuestId 
              ? { ...q, status: 'completed', completed_at: new Date().toISOString(), progress_percentage: 100 }
              : q
          )
        })

        // The database trigger will handle XP updates automatically
        toast.success('🎉 Quest completed! XP has been awarded.')
        
        // Refresh user profile to get updated XP and level
        await useAuthStore.getState().refreshProfile()
        
        // Refresh stats
        await useStatsStore.getState().fetchStats()
      }
    } catch (error) {
      console.error('Error completing quest:', error)
      toast.error('Failed to complete quest')
    }
  },

  startQuest: async (userQuestId: string) => {
    const { user } = useAuthStore.getState()
    const { userQuests } = get()
    if (!user) return

    try {
      const { error } = await supabase
        .from('user_quests')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString()
        })
        .eq('id', userQuestId)

      if (error) throw error

      // Update local state
      set({
        userQuests: userQuests.map(q =>
          q.id === userQuestId 
            ? { ...q, status: 'in_progress', started_at: new Date().toISOString() }
            : q
        )
      })

      toast.success('Quest started! Good luck, Hunter!')
    } catch (error) {
      console.error('Error starting quest:', error)
      toast.error('Failed to start quest')
    }
  },

  getActiveQuests: () => {
    return get().userQuests.filter(q => q.status === 'assigned' || q.status === 'in_progress')
  },

  getCompletedQuests: () => {
    return get().userQuests.filter(q => q.status === 'completed')
  }
}))

// Assessment Store
interface AssessmentState {
  questions: TraitQuestion[]
  answers: Record<string, number>
  loading: boolean
  fetchQuestions: () => Promise<void>
  setAnswer: (questionId: string, score: number) => void
  submitAssessment: () => Promise<boolean>
  calculateTraitScores: () => Record<string, number>
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  questions: [],
  answers: {},
  loading: false,

  fetchQuestions: async () => {
    set({ loading: true })
    try {
      const questions = await dbHelpers.getTraitQuestions()
      set({ questions })
    } catch (error) {
      console.error('Error fetching questions:', error)
      toast.error('Failed to load assessment questions')
    } finally {
      set({ loading: false })
    }
  },

  setAnswer: (questionId: string, score: number) => {
    set({
      answers: {
        ...get().answers,
        [questionId]: score
      }
    })
  },

  submitAssessment: async () => {
    const { user } = useAuthStore.getState()
    const { answers, questions } = get()
    if (!user) return false

    try {
      // Convert answers to the format expected by the service
      const answersArray = Object.entries(answers).map(([questionId, score]) => ({
        questionId,
        score
      }))

      // Calculate trait scores
      const traitScores = get().calculateTraitScores()

      // Submit assessment
      const success = await AuthService.completeAssessment(user.id, answersArray, traitScores)
      
      if (success) {
        toast.success('Assessment completed! Your hunter rank has been determined.')
        // Refresh user profile
        await useAuthStore.getState().refreshProfile()
      }
      
      return success
    } catch (error) {
      console.error('Error submitting assessment:', error)
      toast.error('Failed to submit assessment')
      return false
    }
  },

  calculateTraitScores: () => {
    const { questions, answers } = get()
    const traitScores: Record<string, number> = {}

    // Group questions by trait
    const traitQuestions = questions.reduce((acc, question) => {
      if (!acc[question.trait_name]) {
        acc[question.trait_name] = []
      }
      acc[question.trait_name].push(question)
      return acc
    }, {} as Record<string, TraitQuestion[]>)

    // Calculate score for each trait
    Object.entries(traitQuestions).forEach(([traitName, traitQuestionList]) => {
      let totalScore = 0
      let totalWeight = 0

      traitQuestionList.forEach(question => {
        const answer = answers[question.id]
        if (answer !== undefined) {
          let score = answer
          if (question.reverse_scoring) {
            score = 6 - score // Reverse the score (1->5, 2->4, 3->3, 4->2, 5->1)
          }
          totalScore += score * question.trait_weight
          totalWeight += question.trait_weight
        }
      })

      traitScores[traitName] = totalWeight > 0 ? totalScore / totalWeight : 0
    })

    return traitScores
  }
}))

// Goals Store
interface GoalsState {
  goals: Goal[]
  loading: boolean
  fetchGoals: () => Promise<void>
  selectGoal: (goalName: string) => Promise<boolean>
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: [],
  loading: false,

  fetchGoals: async () => {
    set({ loading: true })
    try {
      const goals = await dbHelpers.getGoals()
      set({ goals })
    } catch (error) {
      console.error('Error fetching goals:', error)
      toast.error('Failed to load goals')
    } finally {
      set({ loading: false })
    }
  },

  selectGoal: async (goalName: string) => {
    const { user } = useAuthStore.getState()
    if (!user) return false

    try {
      const success = await AuthService.setUserGoal(user.id, goalName)
      if (success) {
        toast.success(`Goal selected: ${goalName}`)
        // Refresh user profile
        await useAuthStore.getState().refreshProfile()
        
        // Assign initial quests based on the goal
        await AuthService.assignInitialQuests(user.id)
        
        // Refresh quests
        await useQuestsStore.getState().fetchUserQuests()
      }
      return success
    } catch (error) {
      console.error('Error selecting goal:', error)
      toast.error('Failed to select goal')
      return false
    }
  }
}))

// Rewards Store
interface RewardsState {
  rewards: Reward[]
  loading: boolean
  fetchRewards: () => Promise<void>
  claimReward: (rewardId: string) => Promise<void>
  getAvailableRewards: () => Reward[]
  getClaimedRewards: () => Reward[]
}

export const useRewardsStore = create<RewardsState>((set, get) => ({
  rewards: [],
  loading: false,

  fetchRewards: async () => {
    const { user } = useAuthStore.getState()
    if (!user) return

    set({ loading: true })
    try {
      const rewards = await dbHelpers.getUserRewards(user.id)
      set({ rewards })
    } catch (error) {
      console.error('Error fetching rewards:', error)
      toast.error('Failed to load rewards')
    } finally {
      set({ loading: false })
    }
  },

  claimReward: async (rewardId: string) => {
    const { user } = useAuthStore.getState()
    const { rewards } = get()
    if (!user) return

    try {
      const { error } = await supabase
        .from('rewards')
        .update({ 
          claimed: true, 
          claimed_at: new Date().toISOString() 
        })
        .eq('id', rewardId)

      if (error) throw error

      set({
        rewards: rewards.map(r =>
          r.id === rewardId ? { ...r, claimed: true, claimed_at: new Date().toISOString() } : r
        )
      })

      toast.success('🏆 Reward claimed!')
    } catch (error) {
      console.error('Error claiming reward:', error)
      toast.error('Failed to claim reward')
    }
  },

  getAvailableRewards: () => {
    const { profile } = useAuthStore.getState()
    if (!profile) return []

    return get().rewards.filter(reward => {
      if (reward.claimed) return false
      
      switch (reward.requirement_type) {
        case 'xp_total':
          return profile.total_xp >= reward.requirement_value
        case 'level':
          return profile.current_level >= reward.requirement_value
        default:
          return false
      }
    })
  },

  getClaimedRewards: () => {
    return get().rewards.filter(r => r.claimed)
  }
}))

// Activity Store
interface ActivityState {
  activities: ActivityLog[]
  loading: boolean
  fetchActivities: () => Promise<void>
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  loading: false,

  fetchActivities: async () => {
    const { user } = useAuthStore.getState()
    if (!user) return

    set({ loading: true })
    try {
      const activities = await dbHelpers.getUserActivity(user.id, 20)
      set({ activities })
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      set({ loading: false })
    }
  }
}))

// Streaks Store
interface StreaksState {
  streaks: Streak[]
  loading: boolean
  fetchStreaks: () => Promise<void>
  getStreakByType: (type: string) => Streak | undefined
}

export const useStreaksStore = create<StreaksState>((set, get) => ({
  streaks: [],
  loading: false,

  fetchStreaks: async () => {
    const { user } = useAuthStore.getState()
    if (!user) return

    set({ loading: true })
    try {
      const streaks = await dbHelpers.getUserStreaks(user.id)
      set({ streaks })
    } catch (error) {
      console.error('Error fetching streaks:', error)
    } finally {
      set({ loading: false })
    }
  },

  getStreakByType: (type: string) => {
    return get().streaks.find(s => s.streak_type === type)
  }
}))

// UI Store
interface UIState {
  showCreateQuestModal: boolean
  setShowCreateQuestModal: (show: boolean) => void
  levelUpAnimation: string | null
  setLevelUpAnimation: (statName: string | null) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  showCreateQuestModal: false,
  setShowCreateQuestModal: (show) => set({ showCreateQuestModal: show }),

  levelUpAnimation: null,
  setLevelUpAnimation: (statName) => {
    set({ levelUpAnimation: statName })
    if (statName) {
      setTimeout(() => set({ levelUpAnimation: null }), 2000)
    }
  },

  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open })
}))

// Add missing import
import { supabase } from './supabase'