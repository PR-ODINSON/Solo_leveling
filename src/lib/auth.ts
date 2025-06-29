import { supabase, dbHelpers, UserProfile, HunterRank } from './supabase'
import { User, AuthError } from '@supabase/supabase-js'

export interface AuthUser extends User {
  profile?: UserProfile
}

export interface SignUpData {
  email: string
  password: string
  username?: string
  displayName?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthResponse {
  user: AuthUser | null
  error: AuthError | null
}

export class AuthService {
  // Sign up new user
  static async signUp({ email, password, username, displayName }: SignUpData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
            display_name: displayName || username || email.split('@')[0]
          }
        }
      })

      if (error) {
        console.error('Sign up error:', error)
        return { user: null, error }
      }

      if (data.user) {
        // The user profile will be created automatically by the database trigger
        // Let's wait a moment and then fetch it
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const profile = await dbHelpers.getUserProfile(data.user.id)
        const userWithProfile: AuthUser = {
          ...data.user,
          profile: profile || undefined
        }

        return { user: userWithProfile, error: null }
      }

      return { user: null, error: new Error('User creation failed') as AuthError }
    } catch (err) {
      console.error('Sign up error:', err)
      return { user: null, error: err as AuthError }
    }
  }

  // Sign in existing user
  static async signIn({ email, password }: SignInData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Sign in error:', error)
        return { user: null, error }
      }

      if (data.user) {
        const profile = await dbHelpers.getUserProfile(data.user.id)
        const userWithProfile: AuthUser = {
          ...data.user,
          profile: profile || undefined
        }

        // Update last login session
        await this.updateUserSession(data.user.id)

        return { user: userWithProfile, error: null }
      }

      return { user: null, error: new Error('Sign in failed') as AuthError }
    } catch (err) {
      console.error('Sign in error:', err)
      return { user: null, error: err as AuthError }
    }
  }

  // Sign out user
  static async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Sign out error:', error)
        return { error }
      }

      return { error: null }
    } catch (err) {
      console.error('Sign out error:', err)
      return { error: err as AuthError }
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        return null
      }

      const profile = await dbHelpers.getUserProfile(user.id)
      return {
        ...user,
        profile: profile || undefined
      }
    } catch (err) {
      console.error('Get current user error:', err)
      return null
    }
  }

  // Update user profile
  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      return await dbHelpers.updateUserProfile(userId, updates)
    } catch (err) {
      console.error('Update profile error:', err)
      return false
    }
  }

  // Complete assessment
  static async completeAssessment(
    userId: string, 
    answers: Array<{questionId: string, score: number}>,
    traitScores: Record<string, number>
  ): Promise<boolean> {
    try {
      // Save assessment answers
      const answersSuccess = await dbHelpers.saveAssessmentAnswers(userId, answers)
      if (!answersSuccess) return false

      // Calculate hunter rank based on average trait scores
      const avgScore = Object.values(traitScores).reduce((a, b) => a + b, 0) / Object.values(traitScores).length
      let hunterRank: HunterRank = 'E-Class'
      
      if (avgScore >= 9.0) hunterRank = 'S-Class'
      else if (avgScore >= 8.0) hunterRank = 'A-Class'
      else if (avgScore >= 6.5) hunterRank = 'B-Class'
      else if (avgScore >= 5.0) hunterRank = 'C-Class'
      else if (avgScore >= 3.5) hunterRank = 'D-Class'

      // Update user profile with assessment results
      const profileSuccess = await dbHelpers.updateUserProfile(userId, {
        trait_scores: traitScores,
        hunter_rank: hunterRank,
        assessment_completed: true,
        assessment_completed_at: new Date().toISOString()
      })

      if (!profileSuccess) return false

      // Log assessment completion
      await supabase.from('activity_log').insert({
        user_id: userId,
        action_type: 'assessment_completed',
        action_data: {
          trait_scores: traitScores,
          hunter_rank: hunterRank,
          avg_score: avgScore
        },
        xp_gained: 100 // Bonus XP for completing assessment
      })

      // Update total XP
      await supabase
        .from('user_profiles')
        .update({ total_xp: 100 })
        .eq('user_id', userId)

      return true
    } catch (err) {
      console.error('Complete assessment error:', err)
      return false
    }
  }

  // Set user goal
  static async setUserGoal(userId: string, goalName: string): Promise<boolean> {
    try {
      const success = await dbHelpers.updateUserProfile(userId, {
        selected_goal: goalName
      })

      if (success) {
        // Log goal selection
        await supabase.from('activity_log').insert({
          user_id: userId,
          action_type: 'goal_selected',
          action_data: { goal: goalName },
          xp_gained: 50
        })

        // Update total XP
        const profile = await dbHelpers.getUserProfile(userId)
        if (profile) {
          await supabase
            .from('user_profiles')
            .update({ total_xp: profile.total_xp + 50 })
            .eq('user_id', userId)
        }
      }

      return success
    } catch (err) {
      console.error('Set user goal error:', err)
      return false
    }
  }

  // Assign initial quests based on user profile
  static async assignInitialQuests(userId: string): Promise<boolean> {
    try {
      const profile = await dbHelpers.getUserProfile(userId)
      if (!profile) return false

      // Get quest templates suitable for the user's level and goal
      const { data: questTemplates, error } = await supabase
        .from('quests')
        .select('*')
        .eq('is_template', true)
        .lte('unlock_level', profile.current_level)
        .limit(5)

      if (error || !questTemplates) {
        console.error('Error fetching quest templates:', error)
        return false
      }

      // Assign quests to user
      const userQuests = questTemplates.map(quest => ({
        user_id: userId,
        quest_id: quest.id,
        status: 'assigned' as const,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      }))

      const { error: assignError } = await supabase
        .from('user_quests')
        .insert(userQuests)

      if (assignError) {
        console.error('Error assigning quests:', assignError)
        return false
      }

      // Log quest assignment
      await supabase.from('activity_log').insert({
        user_id: userId,
        action_type: 'quests_assigned',
        action_data: { quest_count: userQuests.length },
        xp_gained: 0
      })

      return true
    } catch (err) {
      console.error('Assign initial quests error:', err)
      return false
    }
  }

  // Update user session
  private static async updateUserSession(userId: string): Promise<void> {
    try {
      // Get user agent and IP (in a real app, you might get this from headers)
      const userAgent = typeof window !== 'undefined' ? navigator.userAgent : ''
      
      await supabase.from('user_sessions').insert({
        user_id: userId,
        user_agent: userAgent,
        session_start: new Date().toISOString()
      })
    } catch (err) {
      console.error('Update user session error:', err)
    }
  }

  // Check if user has completed onboarding
  static async hasCompletedOnboarding(userId: string): Promise<boolean> {
    try {
      const profile = await dbHelpers.getUserProfile(userId)
      return !!(profile?.assessment_completed && profile?.selected_goal)
    } catch (err) {
      console.error('Check onboarding error:', err)
      return false
    }
  }

  // Get user's current level and XP
  static async getUserProgress(userId: string): Promise<{ level: number, xp: number, rank: HunterRank } | null> {
    try {
      const profile = await dbHelpers.getUserProfile(userId)
      if (!profile) return null

      return {
        level: profile.current_level,
        xp: profile.total_xp,
        rank: profile.hunter_rank
      }
    } catch (err) {
      console.error('Get user progress error:', err)
      return null
    }
  }

  // Subscribe to auth state changes
  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await dbHelpers.getUserProfile(session.user.id)
        callback({
          ...session.user,
          profile: profile || undefined
        })
      } else {
        callback(null)
      }
    })
  }

  // Password reset
  static async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      return { error }
    } catch (err) {
      return { error: err as AuthError }
    }
  }

  // Update password
  static async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      return { error }
    } catch (err) {
      return { error: err as AuthError }
    }
  }
} 