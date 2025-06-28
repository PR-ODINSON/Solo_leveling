'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface TraitQuestion {
  id: string;
  trait_name: string;
  question_text: string;
  question_order?: number;
}

interface Answer {
  questionId: string;
  traitName: string;
  score: number;
}

// Trait icons and descriptions
const TRAIT_CONFIG = {
  Discipline: {
    icon: '🛡️',
    subtitle: 'Your ability to stay consistent and follow through on commitments',
    color: 'from-blue-500 to-indigo-600',
    glow: 'shadow-blue-500/30'
  },
  Focus: {
    icon: '🎯',
    subtitle: 'Your capacity to maintain concentration and avoid distractions',
    color: 'from-purple-500 to-violet-600',
    glow: 'shadow-purple-500/30'
  },
  Energy: {
    icon: '⚡',
    subtitle: 'Your vitality and stamina for sustained effort',
    color: 'from-yellow-500 to-orange-600',
    glow: 'shadow-yellow-500/30'
  },
  Curiosity: {
    icon: '🔮',
    subtitle: 'Your drive to explore, learn, and discover new things',
    color: 'from-cyan-500 to-teal-600',
    glow: 'shadow-cyan-500/30'
  },
  'Learning Agility': {
    icon: '📚',
    subtitle: 'Your ability to quickly absorb and apply new knowledge',
    color: 'from-emerald-500 to-green-600',
    glow: 'shadow-emerald-500/30'
  },
  'Social Courage': {
    icon: '🗣️',
    subtitle: 'Your willingness to speak up and engage in social situations',
    color: 'from-red-500 to-pink-600',
    glow: 'shadow-red-500/30'
  },
  Confidence: {
    icon: '👑',
    subtitle: 'Your belief in your abilities and self-worth',
    color: 'from-amber-500 to-yellow-600',
    glow: 'shadow-amber-500/30'
  },
  Initiative: {
    icon: '🚀',
    subtitle: 'Your tendency to take action and lead without being asked',
    color: 'from-indigo-500 to-purple-600',
    glow: 'shadow-indigo-500/30'
  },
  'Digital Minimalism': {
    icon: '📱',
    subtitle: 'Your ability to maintain healthy boundaries with technology',
    color: 'from-slate-500 to-gray-600',
    glow: 'shadow-slate-500/30'
  },
  'Emotional Resilience': {
    icon: '💎',
    subtitle: 'Your capacity to bounce back from setbacks and stress',
    color: 'from-rose-500 to-pink-600',
    glow: 'shadow-rose-500/30'
  },
  'Self Mastery': {
    icon: '🧘',
    subtitle: 'Your awareness and control over your thoughts and emotions',
    color: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/30'
  },
  Consistency: {
    icon: '⏰',
    subtitle: 'Your ability to maintain steady progress over time',
    color: 'from-blue-600 to-cyan-600',
    glow: 'shadow-blue-500/30'
  }
};

const AssessmentPage = () => {
  const router = useRouter();
  const [allQuestions, setAllQuestions] = useState<TraitQuestion[]>([]);
  const [currentBatch, setCurrentBatch] = useState<TraitQuestion[]>([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const QUESTIONS_PER_BATCH = 3; // Show 3 questions per step for better focus

  // Load questions from Supabase
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Loading questions from Supabase...');
        
        // Fetch all questions grouped by trait
        const { data: questions, error } = await supabase
          .from('trait_questions')
          .select('*')
          .order('trait_name', { ascending: true });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('Fetched questions:', questions);

        if (!questions || questions.length === 0) {
          setError('No questions found in the database. Please ensure the trait_questions table has data.');
          return;
        }

        // Group questions by trait and take 2 random per trait
        const groupedQuestions: Record<string, TraitQuestion[]> = {};
        
        questions.forEach((question) => {
          if (!groupedQuestions[question.trait_name]) {
            groupedQuestions[question.trait_name] = [];
          }
          groupedQuestions[question.trait_name].push(question);
        });

        console.log('Grouped questions:', groupedQuestions);

        // Create flattened list with 2 random questions per trait
        const selectedQuestions: TraitQuestion[] = [];
        
        Object.entries(groupedQuestions).forEach(([traitName, traitQuestions]) => {
          // Shuffle and take first 2 questions
          const shuffled = [...traitQuestions].sort(() => Math.random() - 0.5);
          const selected = shuffled.slice(0, 2);
          selectedQuestions.push(...selected);
        });

        console.log('Selected questions:', selectedQuestions);

        // Shuffle all selected questions for variety
        const shuffledAll = [...selectedQuestions].sort(() => Math.random() - 0.5);
        
        setAllQuestions(shuffledAll);
        
        // Calculate total batches
        const batches = Math.ceil(shuffledAll.length / QUESTIONS_PER_BATCH);
        setTotalBatches(batches);
        
        // Set first batch
        const firstBatch = shuffledAll.slice(0, QUESTIONS_PER_BATCH);
        setCurrentBatch(firstBatch);
        
        console.log(`Created ${batches} batches with ${shuffledAll.length} total questions`);
        
      } catch (err) {
        console.error('Error loading questions:', err);
        setError(`Failed to load assessment questions: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // Update current batch when batch index changes
  useEffect(() => {
    if (allQuestions.length > 0) {
      const startIndex = currentBatchIndex * QUESTIONS_PER_BATCH;
      const endIndex = startIndex + QUESTIONS_PER_BATCH;
      const batch = allQuestions.slice(startIndex, endIndex);
      setCurrentBatch(batch);
    }
  }, [currentBatchIndex, allQuestions]);

  const handleAnswerChange = (questionId: string, score: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: score
    }));
  };

  const isCurrentBatchComplete = () => {
    return currentBatch.every(q => answers[q.id] !== undefined);
  };

  const getTotalAnsweredQuestions = () => {
    return Object.keys(answers).length;
  };

  const handleNext = async () => {
    setIsTransitioning(true);
    
    // Add a small delay for transition effect
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (currentBatchIndex < totalBatches - 1) {
      setCurrentBatchIndex(prev => prev + 1);
    } else {
      // Assessment complete - prepare data for results
      console.log('Assessment completed! Processing results...');
      
      // Group questions by trait and collect their IDs
      const questionSets: Array<{
        traitName: string;
        questionIds: string[];
      }> = [];
      
      const traitGroups: Record<string, string[]> = {};
      
      // Group question IDs by trait
      allQuestions.forEach(question => {
        if (!traitGroups[question.trait_name]) {
          traitGroups[question.trait_name] = [];
        }
        traitGroups[question.trait_name].push(question.id);
      });
      
      // Convert to the format expected by results page
      Object.entries(traitGroups).forEach(([traitName, questionIds]) => {
        questionSets.push({
          traitName,
          questionIds
        });
      });

      const assessmentData = {
        answers,
        questionSets,
        totalQuestions: allQuestions.length,
        completedAt: new Date().toISOString()
      };
      
      console.log('Saving assessment data:', assessmentData);
      
      // Store in localStorage for results page
      localStorage.setItem('assessmentResults', JSON.stringify(assessmentData));
      
      // Small delay to ensure data is saved
      setTimeout(() => {
        console.log('Redirecting to results...');
        router.push('/onboarding/results');
      }, 100);
    }
    
    setIsTransitioning(false);
  };

  const handleBack = () => {
    if (currentBatchIndex > 0) {
      setCurrentBatchIndex(prev => prev - 1);
    }
  };

  const getProgressPercentage = () => {
    if (allQuestions.length === 0) return 0;
    return (getTotalAnsweredQuestions() / allQuestions.length) * 100;
  };

  const getAnsweredCount = () => {
    return currentBatch.filter(q => answers[q.id] !== undefined).length;
  };

  // Enhanced Likert Scale with magical glyphs
  const MagicalLikertScale = ({ questionId, currentScore, onScoreChange }: {
    questionId: string;
    currentScore?: number;
    onScoreChange: (score: number) => void;
  }) => {
    const scores = [
      { value: 1, glyph: '❌', label: 'Strongly Disagree', color: 'from-red-500 to-red-600', textColor: 'text-red-400' },
      { value: 2, glyph: '⚠️', label: 'Disagree', color: 'from-orange-500 to-orange-600', textColor: 'text-orange-400' },
      { value: 3, glyph: '⚖️', label: 'Neutral', color: 'from-yellow-500 to-yellow-600', textColor: 'text-yellow-400' },
      { value: 4, glyph: '✅', label: 'Agree', color: 'from-green-500 to-green-600', textColor: 'text-green-400' },
      { value: 5, glyph: '⭐', label: 'Strongly Agree', color: 'from-purple-500 to-purple-600', textColor: 'text-purple-400' }
    ];

    return (
      <div className="flex justify-center space-x-3 sm:space-x-6 mt-8">
        {scores.map((score, index) => (
          <motion.button
            key={score.value}
            onClick={() => onScoreChange(score.value)}
            className={`relative group p-4 sm:p-6 rounded-2xl border-2 transition-all duration-500 ${
              currentScore === score.value
                ? `border-white/50 bg-gradient-to-br ${score.color} shadow-2xl scale-110`
                : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10 hover:scale-105'
            }`}
            whileHover={{ 
              scale: currentScore === score.value ? 1.1 : 1.05,
              rotateY: 5 
            }}
            whileTap={{ scale: 0.95 }}
            title={score.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            {/* Magical glow effect */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${score.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
            
            {/* Glyph */}
            <div className="relative z-10">
              <span className="text-2xl sm:text-3xl block mb-2">{score.glyph}</span>
              <div className={`text-xs font-bold ${currentScore === score.value ? 'text-white' : score.textColor}`}>
                {score.value}
              </div>
            </div>
            
                         {/* Selected state effects */}
             {currentScore === score.value && (
               <>
                 {/* Inner glow */}
                 <motion.div
                   className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${score.color} opacity-30 blur-xl`}
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 0.3, scale: 1.2 }}
                   transition={{ duration: 0.5 }}
                 />
                 
                 {/* Magic pulse rings */}
                 <motion.div
                   className="absolute inset-0 rounded-2xl border-2 border-white/60"
                   initial={{ scale: 1, opacity: 1 }}
                   animate={{ 
                     scale: [1, 1.3, 1], 
                     opacity: [0.8, 0.2, 0.8] 
                   }}
                   transition={{ 
                     duration: 2, 
                     repeat: Infinity, 
                     ease: "easeInOut" 
                   }}
                 />
                 <motion.div
                   className={`absolute inset-0 rounded-2xl border-2 border-gradient-to-r ${score.color.replace('to-', 'via-')} border-opacity-60`}
                   initial={{ scale: 1, opacity: 1 }}
                   animate={{ 
                     scale: [1, 1.5, 1], 
                     opacity: [0.6, 0, 0.6] 
                   }}
                   transition={{ 
                     duration: 2.5, 
                     repeat: Infinity, 
                     ease: "easeInOut",
                     delay: 0.3
                   }}
                 />
                 <motion.div
                   className="absolute inset-0 rounded-2xl border border-cyan-400/40"
                   initial={{ scale: 1, opacity: 1 }}
                   animate={{ 
                     scale: [1, 1.8, 1], 
                     opacity: [0.4, 0, 0.4] 
                   }}
                   transition={{ 
                     duration: 3, 
                     repeat: Infinity, 
                     ease: "easeInOut",
                     delay: 0.6
                   }}
                 />
                 
                 {/* Sparkle effects */}
                 <motion.div
                   className="absolute -top-2 -right-2 text-yellow-300"
                   initial={{ scale: 0, rotate: 0 }}
                   animate={{ scale: 1, rotate: 360 }}
                   transition={{ duration: 0.5 }}
                 >
                   ✨
                 </motion.div>
                 <motion.div
                   className="absolute -bottom-1 -left-1 text-purple-300"
                   initial={{ scale: 0, rotate: 0 }}
                   animate={{ 
                     scale: [0, 1, 0], 
                     rotate: [0, 180, 360] 
                   }}
                   transition={{ 
                     duration: 2, 
                     repeat: Infinity,
                     delay: 0.8 
                   }}
                 >
                   ⭐
                 </motion.div>
               </>
             )}
          </motion.button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.5, 0.5],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.div
          className="text-center z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="w-20 h-20 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            🧙‍♂️ Initializing Character Assessment
          </h2>
          <p className="text-gray-400 text-lg">Preparing your trait evaluation...</p>
          <motion.div
            className="mt-4 text-purple-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ✨ Gathering mystical insights ✨
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-red-500/20 border border-red-500/50 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
            <motion.div 
              className="text-6xl mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔮💥
            </motion.div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Assessment Ritual Failed</h2>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-600 rounded-full font-bold hover:scale-105 transition-transform"
              >
                🔄 Retry Ritual
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full font-bold hover:scale-105 transition-transform"
              >
                🏠 Return to Base
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (allQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-4">📜✨</div>
          <h2 className="text-2xl font-bold text-gray-300 mb-4">No Assessment Scrolls Found</h2>
          <p className="text-gray-400 mb-6">The mystical assessment archive appears to be empty.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-600 rounded-full font-bold hover:scale-105 transition-transform"
          >
            🏠 Return to Base
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Magical background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.8, 0.1],
              scale: [0.5, 2, 0.5],
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
        
        {/* Mystical grid */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 bg-[size:50px_50px] bg-[image:radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Magical Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ 
              rotateY: [0, 10, 0, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🧙‍♂️
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Character Assessment Ritual
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Discover your mystical traits and unlock your true potential through this ancient evaluation
          </p>
          <motion.div
            className="w-40 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 mx-auto mt-6 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          />
        </motion.div>

        {/* Enhanced Progress Bar */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-300">
              <span className="font-bold text-cyan-400">✨ Step {currentBatchIndex + 1}</span> of {totalBatches}
            </div>
            <div className="text-sm text-purple-400 font-bold">
              {Math.round(getProgressPercentage())}% Complete
            </div>
          </div>
          <div className="relative w-full bg-black/30 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: [-100, 200] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Question Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBatchIndex}
            className="space-y-8 mb-12"
            initial={{ opacity: 0, x: 100, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -100, rotateY: 15 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {currentBatch.map((question, index) => {
              const traitConfig = TRAIT_CONFIG[question.trait_name as keyof typeof TRAIT_CONFIG] || {
                icon: '❓',
                subtitle: 'Assess your abilities in this area',
                color: 'from-gray-500 to-gray-600',
                glow: 'shadow-gray-500/30'
              };

              return (
                <motion.div
                  key={question.id}
                  className={`relative group`}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  {/* Glassmorphic card */}
                  <div className={`relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl ${traitConfig.glow} transition-all duration-500 group-hover:bg-white/15 group-hover:border-white/30`}>
                    {/* Magical border glow */}
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${traitConfig.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                    
                    {/* Question header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <motion.div
                          className={`w-16 h-16 bg-gradient-to-br ${traitConfig.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          {traitConfig.icon}
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {question.trait_name}
                          </h3>
                          <p className="text-sm text-gray-300 max-w-md">
                            {traitConfig.subtitle}
                          </p>
                        </div>
                      </div>
                      
                      {/* Answer indicator */}
                      {answers[question.id] && (
                        <motion.div
                          className="flex items-center space-x-2 text-green-400"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <span className="text-2xl">✨</span>
                          <span className="text-sm font-bold">Answered</span>
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Question text */}
                    <div className="mb-8">
                      <p className="text-lg text-gray-100 leading-relaxed font-medium">
                        "{question.question_text}"
                      </p>
                    </div>
                    
                    {/* Magical Likert Scale */}
                    <MagicalLikertScale
                      questionId={question.id}
                      currentScore={answers[question.id]}
                      onScoreChange={(score) => handleAnswerChange(question.id, score)}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Navigation */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.button
            onClick={handleBack}
            disabled={currentBatchIndex === 0}
            className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
              currentBatchIndex === 0
                ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                : 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white shadow-lg'
            }`}
            whileHover={currentBatchIndex > 0 ? { scale: 1.05, y: -2 } : {}}
            whileTap={currentBatchIndex > 0 ? { scale: 0.95 } : {}}
          >
            ← Previous Scroll
          </motion.button>

          <div className="text-center">
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-bold text-cyan-400">{getAnsweredCount()}</span> of{' '}
              <span className="font-bold">{currentBatch.length}</span> questions answered
            </p>
            {!isCurrentBatchComplete() && (
              <motion.p 
                className="text-xs text-yellow-400 flex items-center justify-center space-x-1"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span>✨</span>
                <span>Answer all questions to continue your journey</span>
                <span>✨</span>
              </motion.p>
            )}
          </div>

          <motion.button
            onClick={handleNext}
            disabled={!isCurrentBatchComplete() || isTransitioning}
            className={`relative px-8 py-4 rounded-2xl font-bold transition-all duration-500 overflow-hidden ${
              isCurrentBatchComplete() && !isTransitioning
                ? 'bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-400 hover:to-cyan-500 text-white shadow-2xl'
                : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
            }`}
            whileHover={isCurrentBatchComplete() && !isTransitioning ? { scale: 1.05, y: -2 } : {}}
            whileTap={isCurrentBatchComplete() && !isTransitioning ? { scale: 0.95 } : {}}
          >
            {isTransitioning ? (
              <span className="flex items-center space-x-2">
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Transitioning...</span>
              </span>
            ) : currentBatchIndex === totalBatches - 1 ? (
              '🎉 Complete Assessment'
            ) : (
              'Next Scroll →'
            )}
            
            {/* Enhanced glow effect when enabled */}
            {isCurrentBatchComplete() && !isTransitioning && (
              <>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-cyan-400/30 blur-xl"
                  animate={{ opacity: [0, 0.8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-cyan-400/20"
                  animate={{ x: [-100, 200] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </>
            )}
          </motion.button>
        </motion.div>

                 {/* RPG Helper Text */}
         <motion.div
           className="text-center mt-12"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1, duration: 0.8 }}
         >
           <motion.div
             className="relative mb-6"
             animate={{ 
               textShadow: [
                 "0 0 20px rgba(168, 85, 247, 0.4)",
                 "0 0 30px rgba(168, 85, 247, 0.6)",
                 "0 0 20px rgba(168, 85, 247, 0.4)"
               ]
             }}
             transition={{ duration: 3, repeat: Infinity }}
           >
             <p className="text-purple-300 text-lg font-semibold mb-2 tracking-wide">
               🔮 Your answers shape your destiny. Choose wisely. 🔮
             </p>
             <motion.div
               className="w-64 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto"
               animate={{ opacity: [0.3, 0.8, 0.3] }}
               transition={{ duration: 2, repeat: Infinity }}
             />
           </motion.div>
           
           <p className="text-gray-400 text-sm mb-4 italic">
             "Channel your inner truth through the mystical evaluation scales"
           </p>
           
           <div className="flex justify-center space-x-8 text-xs text-gray-500">
             <motion.span 
               className="flex items-center space-x-2 bg-red-900/20 px-3 py-1 rounded-full border border-red-500/30"
               whileHover={{ scale: 1.05, backgroundColor: "rgba(127, 29, 29, 0.3)" }}
             >
               <span className="text-red-400">❌</span>
               <span>Reject</span>
             </motion.span>
             
             <motion.span 
               className="flex items-center space-x-1 text-gray-400"
               animate={{ opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 2, repeat: Infinity, delay: 1 }}
             >
               <span>⚔️</span>
               <span>to</span>
               <span>⚔️</span>
             </motion.span>
             
             <motion.span 
               className="flex items-center space-x-2 bg-purple-900/20 px-3 py-1 rounded-full border border-purple-500/30"
               whileHover={{ scale: 1.05, backgroundColor: "rgba(88, 28, 135, 0.3)" }}
             >
               <span className="text-purple-400">⭐</span>
               <span>Embrace</span>
             </motion.span>
           </div>
           
           <motion.p 
             className="text-xs text-cyan-400/60 mt-4 font-mono"
             animate={{ opacity: [0.4, 0.8, 0.4] }}
             transition={{ duration: 4, repeat: Infinity }}
           >
             ✨ Ancient wisdom flows through honest reflection ✨
           </motion.p>
         </motion.div>
      </div>
    </div>
  );
};

export default AssessmentPage; 