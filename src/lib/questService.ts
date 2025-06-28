// Dynamic Quest Service for AscendOS
import { supabase, Quest, Task } from './supabase';

export interface QuestWithTasks extends Quest {
  tasks: Task[];
}

export interface QuestFilters {
  goal_id?: string;
  category?: 'daily' | 'weekly' | 'monthly' | 'milestone';
  difficulty?: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  primary_trait?: string;
  max_level?: number;
  limit?: number;
}

/**
 * Get quests by hunter's selected goal with optional filters
 */
export async function getQuestsByGoal(
  goal_id: string, 
  filters: Omit<QuestFilters, 'goal_id'> = {}
): Promise<Quest[]> {
  try {
    let query = supabase
      .from('quests')
      .select('*');

    // Apply goal-based filtering by primary trait
    const goalTraitMap: Record<string, string[]> = {
      'master_of_knowledge': ['curiosity', 'learning_agility', 'focus'],
      'physical_titan': ['energy', 'discipline', 'consistency'],
      'social_commander': ['social_courage', 'confidence', 'initiative'],
      'digital_sage': ['digital_minimalism', 'focus', 'learning_agility'],
      'wellness_guardian': ['emotional_resilience', 'self_mastery', 'energy'],
      'creative_visionary': ['curiosity', 'initiative', 'self_mastery'],
      'leadership_sovereign': ['initiative', 'confidence', 'social_courage']
    };

    const goalTraits = goalTraitMap[goal_id];
    if (goalTraits) {
      query = query.in('primary_trait', goalTraits);
    }

    // Apply additional filters
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }
    
    if (filters.primary_trait) {
      query = query.eq('primary_trait', filters.primary_trait);
    }
    
    if (filters.max_level) {
      query = query.lte('unlock_level', filters.max_level);
    }

    // Apply limit
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    // Order by category priority and difficulty
    query = query.order('category', { ascending: true })
                 .order('difficulty', { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching quests by goal:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getQuestsByGoal:', error);
    throw error;
  }
}

/**
 * Get tasks for a specific quest
 */
export async function getTasksByQuestId(quest_id: string): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('quest_id', quest_id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getTasksByQuestId:', error);
    throw error;
  }
}

/**
 * Get quests with their associated tasks
 */
export async function getQuestsWithTasks(
  goal_id: string,
  filters: Omit<QuestFilters, 'goal_id'> = {}
): Promise<QuestWithTasks[]> {
  try {
    const quests = await getQuestsByGoal(goal_id, filters);
    
    const questsWithTasks = await Promise.all(
      quests.map(async (quest) => {
        const tasks = await getTasksByQuestId(quest.id);
        return { ...quest, tasks };
      })
    );

    return questsWithTasks;
  } catch (error) {
    console.error('Error in getQuestsWithTasks:', error);
    throw error;
  }
}

/**
 * Get all unique categories for a specific goal
 */
export async function getAllCategoriesForGoal(goal_id: string): Promise<string[]> {
  try {
    const quests = await getQuestsByGoal(goal_id);
    const categorySet = new Set(quests.map(quest => quest.category));
    const categories = Array.from(categorySet);
    
    // Sort categories by priority
    const categoryOrder = ['daily', 'weekly', 'monthly', 'milestone'];
    return categories.sort((a, b) => 
      categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
    );
  } catch (error) {
    console.error('Error in getAllCategoriesForGoal:', error);
    throw error;
  }
}

/**
 * Get quests grouped by category for a specific goal
 */
export async function getQuestsGroupedByCategory(
  goal_id: string,
  filters: Omit<QuestFilters, 'goal_id'> = {}
): Promise<Record<string, QuestWithTasks[]>> {
  try {
    const questsWithTasks = await getQuestsWithTasks(goal_id, filters);
    
    const grouped = questsWithTasks.reduce((acc, quest) => {
      const category = quest.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(quest);
      return acc;
    }, {} as Record<string, QuestWithTasks[]>);

    return grouped;
  } catch (error) {
    console.error('Error in getQuestsGroupedByCategory:', error);
    throw error;
  }
}

/**
 * Get recommended quests based on trait scores
 */
export async function getRecommendedQuests(
  goal_id: string,
  trait_scores: Record<string, number>,
  hunter_level: number = 1,
  limit: number = 6
): Promise<QuestWithTasks[]> {
  try {
    // Find weak traits (below 30) to prioritize improvement
    const weakTraits = Object.entries(trait_scores)
      .filter(([_, score]) => score < 30)
      .map(([trait, _]) => trait);

    // Get quests that target weak traits or are appropriate for the hunter's level
    const quests = await getQuestsWithTasks(goal_id, {
      max_level: hunter_level + 2, // Allow quests slightly above current level
      limit: limit * 2 // Get more to filter from
    });

    // Score quests based on trait improvement potential
    const scoredQuests = quests.map(quest => {
      let score = 0;
      
      // Prioritize quests that improve weak traits
      if (weakTraits.includes(quest.primary_trait)) {
        score += 10;
      }
      
      // Boost score for secondary traits that are weak
      quest.secondary_traits.forEach(trait => {
        if (weakTraits.includes(trait)) {
          score += 5;
        }
      });
      
      // Prefer quests at appropriate level
      if (quest.unlock_level <= hunter_level) {
        score += 3;
      }
      
      // Slight preference for daily quests for habit building
      if (quest.category === 'daily') {
        score += 2;
      }

      return { quest, score };
    });

    // Sort by score and return top quests
    return scoredQuests
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.quest);
  } catch (error) {
    console.error('Error in getRecommendedQuests:', error);
    throw error;
  }
}

/**
 * Search quests by title or description
 */
export async function searchQuests(
  searchTerm: string,
  goal_id?: string,
  filters: QuestFilters = {}
): Promise<QuestWithTasks[]> {
  try {
    let query = supabase
      .from('quests')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);

    // Apply goal filtering if provided
    if (goal_id) {
      const goalTraitMap: Record<string, string[]> = {
        'master_of_knowledge': ['curiosity', 'learning_agility', 'focus'],
        'physical_titan': ['energy', 'discipline', 'consistency'],
        'social_commander': ['social_courage', 'confidence', 'initiative'],
        'digital_sage': ['digital_minimalism', 'focus', 'learning_agility'],
        'wellness_guardian': ['emotional_resilience', 'self_mastery', 'energy'],
        'creative_visionary': ['curiosity', 'initiative', 'self_mastery'],
        'leadership_sovereign': ['initiative', 'confidence', 'social_courage']
      };

      const goalTraits = goalTraitMap[goal_id];
      if (goalTraits) {
        query = query.in('primary_trait', goalTraits);
      }
    }

    // Apply other filters
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.difficulty) query = query.eq('difficulty', filters.difficulty);
    if (filters.max_level) query = query.lte('unlock_level', filters.max_level);
    if (filters.limit) query = query.limit(filters.limit);

    const { data, error } = await query;

    if (error) {
      console.error('Error searching quests:', error);
      throw error;
    }

    // Get tasks for each quest
    const questsWithTasks = await Promise.all(
      (data || []).map(async (quest) => {
        const tasks = await getTasksByQuestId(quest.id);
        return { ...quest, tasks };
      })
    );

    return questsWithTasks;
  } catch (error) {
    console.error('Error in searchQuests:', error);
    throw error;
  }
}

/**
 * Get quest statistics for a goal
 */
export async function getQuestStats(goal_id: string): Promise<{
  total: number;
  by_category: Record<string, number>;
  by_difficulty: Record<string, number>;
  by_trait: Record<string, number>;
}> {
  try {
    const quests = await getQuestsByGoal(goal_id);
    
    const stats = {
      total: quests.length,
      by_category: {} as Record<string, number>,
      by_difficulty: {} as Record<string, number>,
      by_trait: {} as Record<string, number>
    };

    quests.forEach(quest => {
      // Count by category
      stats.by_category[quest.category] = (stats.by_category[quest.category] || 0) + 1;
      
      // Count by difficulty
      stats.by_difficulty[quest.difficulty] = (stats.by_difficulty[quest.difficulty] || 0) + 1;
      
      // Count by primary trait
      stats.by_trait[quest.primary_trait] = (stats.by_trait[quest.primary_trait] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Error in getQuestStats:', error);
    throw error;
  }
} 