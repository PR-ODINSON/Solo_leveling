// Quest Generation Service for AscendOS
import { supabase } from './supabase';

export interface TraitScores {
  confidence: number;
  consistency: number;
  curiosity: number;
  digital_minimalism: number;
  discipline: number;
  emotional_resilience: number;
  energy: number;
  focus: number;
  initiative: number;
  learning_agility: number;
  self_mastery: number;
  social_courage: number;
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'monthly' | 'milestone';
  difficulty: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  xp_reward: number;
  primary_trait: string;
  secondary_traits: string[];
  estimated_time: string;
  tasks: Task[];
  unlock_conditions: {
    level: number;
    required_traits?: Record<string, number>;
    prerequisite_quests?: string[];
  };
  hunter_notes: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'habit' | 'action' | 'learning' | 'social' | 'creative';
  completion_criteria: string;
  xp_reward: number;
  completed: boolean;
}

export class QuestGenerator {
  private traitScores: TraitScores;
  private selectedGoal: Goal;
  private hunterLevel: number;

  constructor(traitScores: TraitScores, selectedGoal: Goal, hunterLevel: number = 1) {
    this.traitScores = traitScores;
    this.selectedGoal = selectedGoal;
    this.hunterLevel = hunterLevel;
  }

  // Analyze trait scores to determine focus areas
  private analyzeTraits() {
    const traits = Object.entries(this.traitScores);
    const weakTraits = traits.filter(([_, score]) => score <= 20).map(([trait, _]) => trait);
    const mediumTraits = traits.filter(([_, score]) => score > 20 && score <= 40).map(([trait, _]) => trait);
    const strongTraits = traits.filter(([_, score]) => score > 40).map(([trait, _]) => trait);

    return { weakTraits, mediumTraits, strongTraits };
  }

  // Get goal-specific trait priorities
  private getGoalTraitPriorities(): string[] {
    const goalTraitMap: Record<string, string[]> = {
      'intelligence': ['curiosity', 'learning_agility', 'focus'],
      'strength': ['energy', 'discipline', 'consistency'],
      'charisma': ['social_courage', 'confidence', 'initiative'],
      'digital_sage': ['digital_minimalism', 'focus', 'learning_agility'],
      'wellness': ['emotional_resilience', 'self_mastery', 'energy'],
      'creativity': ['curiosity', 'initiative', 'self_mastery'],
      'leadership': ['initiative', 'confidence', 'social_courage'],
      'custom': ['self_mastery', 'initiative', 'focus'] // Default for custom goals
    };

    return goalTraitMap[this.selectedGoal.id] || goalTraitMap['custom'];
  }

  // Generate daily quests (E-D rank)
  private generateDailyQuests(): Quest[] {
    const priorityTraits = this.getGoalTraitPriorities();
    
    const questTemplates = [
      {
        id: 'morning_ritual',
        title: 'Morning Shadow Training',
        baseDescription: 'Establish a consistent morning routine',
        category: 'daily' as const,
        difficulty: 'E' as const,
        xp_reward: 25,
        estimated_time: '15 minutes'
      },
      {
        id: 'skill_practice',
        title: 'Mana Circuit Practice',
        baseDescription: 'Practice a skill related to your goal',
        category: 'daily' as const,
        difficulty: 'D' as const,
        xp_reward: 35,
        estimated_time: '30 minutes'
      },
      {
        id: 'focus_session',
        title: 'Mind Palace Construction',
        baseDescription: 'Complete focused work without distractions',
        category: 'daily' as const,
        difficulty: 'D' as const,
        xp_reward: 30,
        estimated_time: '25 minutes'
      },
      {
        id: 'reflection',
        title: 'Hunter\'s Journal',
        baseDescription: 'Reflect on progress and learnings',
        category: 'daily' as const,
        difficulty: 'E' as const,
        xp_reward: 20,
        estimated_time: '10 minutes'
      },
      {
        id: 'energy_boost',
        title: 'Vitality Restoration',
        baseDescription: 'Take care of physical and mental energy',
        category: 'daily' as const,
        difficulty: 'E' as const,
        xp_reward: 25,
        estimated_time: '20 minutes'
      }
    ];

    return questTemplates.map((template, index) => {
      const primaryTrait = priorityTraits[index % priorityTraits.length];
      return this.createQuestFromTemplate(template, primaryTrait);
    });
  }

  // Generate weekly quests (D-C rank)
  private generateWeeklyQuests(): Quest[] {
    const priorityTraits = this.getGoalTraitPriorities();
    
    const weeklyTemplates = [
      {
        id: 'skill_deep_dive',
        title: 'Dungeon Master\'s Challenge',
        baseDescription: 'Complete an intensive learning project',
        category: 'weekly' as const,
        difficulty: 'C' as const,
        xp_reward: 150,
        estimated_time: '3 hours'
      },
      {
        id: 'habit_formation',
        title: 'Shadow Clone Mastery',
        baseDescription: 'Build and maintain a new beneficial habit',
        category: 'weekly' as const,
        difficulty: 'D' as const,
        xp_reward: 120,
        estimated_time: '2 hours'
      },
      {
        id: 'social_challenge',
        title: 'Guild Networking Quest',
        baseDescription: 'Engage in meaningful social interactions',
        category: 'weekly' as const,
        difficulty: 'C' as const,
        xp_reward: 180,
        estimated_time: '4 hours'
      },
      {
        id: 'creative_project',
        title: 'Artifact Creation',
        baseDescription: 'Complete a creative project related to your goal',
        category: 'weekly' as const,
        difficulty: 'C' as const,
        xp_reward: 200,
        estimated_time: '5 hours'
      }
    ];

    return weeklyTemplates.map((template, index) => {
      const primaryTrait = priorityTraits[index % priorityTraits.length];
      return this.createQuestFromTemplate(template, primaryTrait);
    });
  }

  // Generate monthly quests (C-B rank)
  private generateMonthlyQuests(): Quest[] {
    const priorityTraits = this.getGoalTraitPriorities();
    
    const monthlyTemplates = [
      {
        id: 'major_milestone',
        title: 'Beast King Subjugation',
        baseDescription: 'Achieve a significant milestone in your goal area',
        category: 'monthly' as const,
        difficulty: 'B' as const,
        xp_reward: 500,
        estimated_time: '15 hours'
      },
      {
        id: 'teaching_others',
        title: 'Mentor\'s Awakening',
        baseDescription: 'Share knowledge and help others grow',
        category: 'monthly' as const,
        difficulty: 'C' as const,
        xp_reward: 400,
        estimated_time: '10 hours'
      },
      {
        id: 'system_optimization',
        title: 'Stat Reallocation',
        baseDescription: 'Optimize your personal systems and routines',
        category: 'monthly' as const,
        difficulty: 'B' as const,
        xp_reward: 600,
        estimated_time: '20 hours'
      }
    ];

    return monthlyTemplates.map((template, index) => {
      const primaryTrait = priorityTraits[index % priorityTraits.length];
      return this.createQuestFromTemplate(template, primaryTrait);
    });
  }

  // Generate milestone quests (B-A rank)
  private generateMilestoneQuests(): Quest[] {
    const priorityTraits = this.getGoalTraitPriorities();
    
    const milestoneTemplates = [
      {
        id: 'rank_advancement',
        title: 'Hunter Rank Advancement',
        baseDescription: 'Achieve mastery level in your chosen domain',
        category: 'milestone' as const,
        difficulty: 'A' as const,
        xp_reward: 1000,
        estimated_time: '50 hours'
      },
      {
        id: 'legendary_achievement',
        title: 'Shadow Monarch\'s Trial',
        baseDescription: 'Complete the ultimate challenge in your field',
        category: 'milestone' as const,
        difficulty: 'S' as const,
        xp_reward: 2500,
        estimated_time: '100 hours'
      }
    ];

    return milestoneTemplates.map((template, index) => {
      const primaryTrait = priorityTraits[index % priorityTraits.length];
      return this.createQuestFromTemplate(template, primaryTrait);
    });
  }

  // Create quest from template with personalization
  private createQuestFromTemplate(template: any, primaryTrait: string): Quest {
    const { weakTraits, mediumTraits, strongTraits } = this.analyzeTraits();
    const traitScore = this.traitScores[primaryTrait as keyof TraitScores];
    
    // Generate personalized hunter notes
    let hunterNotes = '';
    if (weakTraits.includes(primaryTrait)) {
      hunterNotes = `This quest targets your ${primaryTrait} development. Start small and build momentum!`;
    } else if (strongTraits.includes(primaryTrait)) {
      hunterNotes = `Your strong ${primaryTrait} (${traitScore}/60) makes you perfect for this challenge!`;
    } else {
      hunterNotes = `This quest will help strengthen your ${primaryTrait} abilities. You're ready for the next level!`;
    }

    // Generate tasks based on trait and goal
    const tasks = this.generateTasksForQuest(template, primaryTrait);

    return {
      id: `${template.id}_${Date.now()}`,
      title: template.title,
      description: this.personalizeDescription(template.baseDescription, primaryTrait),
      category: template.category,
      difficulty: template.difficulty,
      xp_reward: template.xp_reward,
      primary_trait: primaryTrait,
      secondary_traits: this.getSecondaryTraits(primaryTrait),
      estimated_time: template.estimated_time,
      tasks,
      unlock_conditions: {
        level: this.hunterLevel,
        required_traits: traitScore < 20 ? {} : { [primaryTrait]: Math.max(20, traitScore - 10) }
      },
      hunter_notes: hunterNotes,
      status: 'available',
      created_at: new Date().toISOString()
    };
  }

  // Generate tasks for a specific quest
  private generateTasksForQuest(template: any, primaryTrait: string): Task[] {
    const taskCount = template.category === 'daily' ? 2 : template.category === 'weekly' ? 3 : 4;
    const tasks: Task[] = [];

    for (let i = 0; i < taskCount; i++) {
      tasks.push({
        id: `task_${template.id}_${i}`,
        title: `${template.title} - Step ${i + 1}`,
        description: this.generateTaskDescription(template, primaryTrait, i),
        type: this.getTaskType(primaryTrait, i),
        completion_criteria: this.generateCompletionCriteria(template, i),
        xp_reward: Math.floor(template.xp_reward / taskCount),
        completed: false
      });
    }

    return tasks;
  }

  // Helper methods
  private personalizeDescription(baseDescription: string, trait: string): string {
    const goalContext = this.selectedGoal.name;
    return `${baseDescription} focused on ${trait} development to advance your ${goalContext} mastery.`;
  }

  private getSecondaryTraits(primaryTrait: string): string[] {
    const priorityTraits = this.getGoalTraitPriorities();
    return priorityTraits.filter(trait => trait !== primaryTrait).slice(0, 2);
  }

  private getTaskType(trait: string, index: number): Task['type'] {
    const types: Task['type'][] = ['habit', 'action', 'learning', 'social', 'creative'];
    return types[index % types.length];
  }

  private generateTaskDescription(template: any, trait: string, index: number): string {
    // This would be more sophisticated in a real implementation
    return `Complete task ${index + 1} for ${trait} development in your ${this.selectedGoal.name} journey.`;
  }

  private generateCompletionCriteria(template: any, index: number): string {
    return `Mark as complete when you have finished step ${index + 1} of this quest.`;
  }

  // Main method to generate all quests
  public async generateAllQuests(): Promise<Quest[]> {
    const allQuests: Quest[] = [
      ...this.generateDailyQuests(),
      ...this.generateWeeklyQuests(),
      ...this.generateMonthlyQuests(),
      ...this.generateMilestoneQuests()
    ];

    return allQuests;
  }

  // Save quests to database
  public async saveQuestsToDatabase(quests: Quest[], hunterId: string): Promise<void> {
    try {
      const questsForDB = quests.map(quest => ({
        id: quest.id,
        hunter_id: hunterId,
        title: quest.title,
        description: quest.description,
        category: quest.category,
        difficulty: quest.difficulty,
        xp_reward: quest.xp_reward,
        primary_trait: quest.primary_trait,
        secondary_traits: quest.secondary_traits,
        estimated_time: quest.estimated_time,
        tasks: quest.tasks,
        unlock_conditions: quest.unlock_conditions,
        hunter_notes: quest.hunter_notes,
        status: quest.status,
        created_at: quest.created_at
      }));

      const { error } = await supabase
        .from('quests')
        .insert(questsForDB);

      if (error) {
        throw new Error(`Failed to save quests: ${error.message}`);
      }
    } catch (error) {
      console.error('Error saving quests to database:', error);
      throw error;
    }
  }
}

// Utility function to generate quests for a hunter
export async function generateQuestsForHunter(
  traitScores: TraitScores,
  selectedGoal: Goal,
  hunterId: string,
  hunterLevel: number = 1
): Promise<Quest[]> {
  const generator = new QuestGenerator(traitScores, selectedGoal, hunterLevel);
  const quests = await generator.generateAllQuests();
  
  // Save to database
  await generator.saveQuestsToDatabase(quests, hunterId);
  
  return quests;
} 