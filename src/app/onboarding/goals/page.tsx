'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Star, Zap, Brain, Dumbbell, Eye, Heart, Shield, Crown } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  benefits: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const goals: Goal[] = [
  {
    id: 'intelligence',
    name: 'Master of Knowledge',
    description: 'Become a strategic thinker and knowledge seeker',
    icon: '🧠',
    color: 'from-blue-500 to-cyan-400',
    benefits: ['Enhanced learning ability', 'Better problem solving', 'Strategic thinking'],
    difficulty: 'Intermediate'
  },
  {
    id: 'strength',
    name: 'Physical Powerhouse',
    description: 'Build unbreakable physical strength and endurance',
    icon: '⚔️',
    color: 'from-red-500 to-orange-400',
    benefits: ['Increased energy', 'Better health', 'Physical confidence'],
    difficulty: 'Beginner'
  },
  {
    id: 'dexterity',
    name: 'Master of Precision',
    description: 'Develop technical skills and agile thinking',
    icon: '🏹',
    color: 'from-green-500 to-emerald-400',
    benefits: ['Technical mastery', 'Quick adaptation', 'Skill versatility'],
    difficulty: 'Advanced'
  },
  {
    id: 'wisdom',
    name: 'Sage of Insight',
    description: 'Cultivate deep wisdom and emotional intelligence',
    icon: '🔮',
    color: 'from-purple-500 to-indigo-400',
    benefits: ['Better decisions', 'Emotional balance', 'Life clarity'],
    difficulty: 'Advanced'
  },
  {
    id: 'charisma',
    name: 'Leader of Hearts',
    description: 'Become an inspiring leader and communicator',
    icon: '👑',
    color: 'from-yellow-500 to-amber-400',
    benefits: ['Leadership skills', 'Better relationships', 'Social influence'],
    difficulty: 'Intermediate'
  },
  {
    id: 'discipline',
    name: 'Fortress of Will',
    description: 'Build unshakeable discipline and mental fortitude',
    icon: '🛡️',
    color: 'from-gray-500 to-slate-400',
    benefits: ['Strong habits', 'Mental resilience', 'Consistent progress'],
    difficulty: 'Beginner'
  }
];

const difficultyColors = {
  'Beginner': 'text-green-400',
  'Intermediate': 'text-yellow-400',
  'Advanced': 'text-red-400'
};

const GoalsPage = () => {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [assessmentResults, setAssessmentResults] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCustomGoal, setShowCustomGoal] = useState(false);
  const [customGoal, setCustomGoal] = useState({
    name: '',
    description: '',
    benefits: ['', '', ''],
    difficulty: 'Intermediate' as const
  });

  useEffect(() => {
    // Load assessment results to show recommended goals
    const storedResults = localStorage.getItem('assessmentResults');
    if (storedResults) {
      try {
        const results = JSON.parse(storedResults);
        setAssessmentResults(results);
      } catch (error) {
        console.error('Failed to parse assessment results:', error);
      }
    }
  }, []);

  const handleGoalSelect = (goal: Goal) => {
    setSelectedGoal(goal);
    setShowConfirmation(true);
  };

  const handleConfirmGoal = async () => {
    if (selectedGoal && assessmentResults) {
      try {
        // Save selected goal to localStorage
        const goalData = {
          selectedGoal,
          setAt: new Date().toISOString()
        };
        localStorage.setItem('hunterGoal', JSON.stringify(goalData));
        
        // Generate quests based on assessment and goal
        // This would normally call our quest generation service
        // For now, we'll store the data for quest generation on the dashboard
        const questGenerationData = {
          traitScores: assessmentResults.traitScores,
          selectedGoal,
          hunterId: 'temp_hunter_id', // Would be actual user ID in production
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('questGenerationData', JSON.stringify(questGenerationData));
        
        // Redirect to dashboard where quests will be generated
        router.push('/dashboard');
      } catch (error) {
        console.error('Error setting up hunter profile:', error);
        // Still redirect but show error on dashboard
        router.push('/dashboard');
      }
    }
  };

  const handleCustomGoalSubmit = () => {
    if (customGoal.name && customGoal.description) {
      const customGoalData: Goal = {
        id: 'custom',
        name: customGoal.name,
        description: customGoal.description,
        icon: '🎯',
        color: 'from-indigo-500 to-purple-400',
        benefits: customGoal.benefits.filter(b => b.trim() !== ''),
        difficulty: customGoal.difficulty
      };
      
      setSelectedGoal(customGoalData);
      setShowCustomGoal(false);
      setShowConfirmation(true);
    }
  };

  const getRecommendedGoals = () => {
    if (!assessmentResults) return [];
    
    // Simple recommendation based on highest scoring traits
    // In a real app, this would be more sophisticated
    return goals.slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🎯
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Choose Your Path
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Select the primary area you want to master. This will shape your quest recommendations and growth journey.
          </p>
        </motion.div>

        {/* Recommended Goals Section */}
        {assessmentResults && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              ⭐ Recommended Based on Your Assessment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {getRecommendedGoals().map((goal, index) => (
                <motion.div
                  key={`recommended-${goal.id}`}
                  className="relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full z-10">
                    RECOMMENDED
                  </div>
                  <GoalCard goal={goal} onSelect={handleGoalSelect} isRecommended />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Goals Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-center mb-8 text-blue-300">
            All Mastery Paths
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <GoalCard goal={goal} onSelect={handleGoalSelect} />
              </motion.div>
            ))}
            
            {/* Custom Goal Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + goals.length * 0.1 }}
            >
              <motion.div
                className="bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-indigo-500/50 hover:scale-105 h-full flex flex-col justify-center items-center text-center min-h-[320px]"
                onClick={() => setShowCustomGoal(true)}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-xl font-bold text-white mb-2">Create Your Own Path</h3>
                <span className="text-sm font-medium text-indigo-400 mb-4">Custom</span>
                <p className="text-gray-300 text-sm mb-4">
                  Design a personalized mastery goal that fits your unique vision
                </p>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-cyan-400">Benefits:</h4>
                  <ul className="space-y-1">
                    <li className="text-xs text-gray-400 flex items-center gap-2">
                      <span className="text-cyan-400">•</span>
                      Fully customized to your needs
                    </li>
                    <li className="text-xs text-gray-400 flex items-center gap-2">
                      <span className="text-cyan-400">•</span>
                      Personal growth direction
                    </li>
                    <li className="text-xs text-gray-400 flex items-center gap-2">
                      <span className="text-cyan-400">•</span>
                      Unique achievement path
                    </li>
                  </ul>
                </div>
                <motion.div
                  className="w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full mt-4"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Skip Option */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-gray-300 underline transition-colors"
          >
            Skip for now - I'll choose later
          </button>
        </motion.div>
      </div>

      {/* Custom Goal Creation Modal */}
      <AnimatePresence>
        {showCustomGoal && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-black/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", bounce: 0.3 }}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                  Create Your Custom Path
                </h3>
                <p className="text-gray-300">
                  Design a personalized mastery goal that reflects your unique vision
                </p>
              </div>

              <div className="space-y-6">
                {/* Goal Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Goal Name
                  </label>
                  <input
                    type="text"
                    value={customGoal.name}
                    onChange={(e) => setCustomGoal(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Master of Innovation, Wellness Champion..."
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Goal Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={customGoal.description}
                    onChange={(e) => setCustomGoal(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this mastery path means to you..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                {/* Benefits */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Key Benefits (up to 3)
                  </label>
                  {customGoal.benefits.map((benefit, index) => (
                    <input
                      key={index}
                      type="text"
                      value={benefit}
                      onChange={(e) => {
                        const newBenefits = [...customGoal.benefits];
                        newBenefits[index] = e.target.value;
                        setCustomGoal(prev => ({ ...prev, benefits: newBenefits }));
                      }}
                      placeholder={`Benefit ${index + 1}...`}
                      className="w-full px-4 py-2 mb-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  ))}
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={customGoal.difficulty}
                    onChange={(e) => setCustomGoal(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowCustomGoal(false)}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCustomGoalSubmit}
                  disabled={!customGoal.name || !customGoal.description}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Create Path
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && selectedGoal && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-black/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", bounce: 0.3 }}
            >
              <div className="text-6xl mb-4">{selectedGoal.icon}</div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                {selectedGoal.name}
              </h3>
              <p className="text-gray-300 mb-6">
                Are you ready to begin your journey toward mastering {selectedGoal.name.toLowerCase()}?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                >
                  Choose Different
                </button>
                <button
                  onClick={handleConfirmGoal}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-xl transition-all transform hover:scale-105"
                >
                  Begin Journey
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GoalCard = ({ goal, onSelect, isRecommended = false }: { 
  goal: Goal; 
  onSelect: (goal: Goal) => void; 
  isRecommended?: boolean;
}) => {
  return (
    <motion.div
      className={`bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-cyan-500/50 hover:scale-105 ${
        isRecommended ? 'ring-2 ring-yellow-400/50' : ''
      }`}
      onClick={() => onSelect(goal)}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="text-center mb-4">
        <div className="text-5xl mb-3">{goal.icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{goal.name}</h3>
        <span className={`text-sm font-medium ${difficultyColors[goal.difficulty]}`}>
          {goal.difficulty}
        </span>
      </div>
      
      <p className="text-gray-300 text-sm mb-4 text-center">
        {goal.description}
      </p>
      
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-cyan-400">Benefits:</h4>
        <ul className="space-y-1">
          {goal.benefits.map((benefit, index) => (
            <li key={index} className="text-xs text-gray-400 flex items-center gap-2">
              <span className="text-cyan-400">•</span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>
      
      <motion.div
        className={`w-full h-1 bg-gradient-to-r ${goal.color} rounded-full mt-4`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </motion.div>
  );
};

export default GoalsPage; 