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

const AssessmentPage = () => {
  const router = useRouter();
  const [allQuestions, setAllQuestions] = useState<TraitQuestion[]>([]);
  const [currentBatch, setCurrentBatch] = useState<TraitQuestion[]>([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const QUESTIONS_PER_BATCH = 4; // Show 4 questions per step

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

  const handleNext = () => {
    if (currentBatchIndex < totalBatches - 1) {
      setCurrentBatchIndex(prev => prev + 1);
    } else {
      // Assessment complete - prepare data for results
      const traitScores: Record<string, { total: number; count: number }> = {};
      
      // Calculate scores per trait
      allQuestions.forEach(question => {
        const score = answers[question.id] || 0;
        if (!traitScores[question.trait_name]) {
          traitScores[question.trait_name] = { total: 0, count: 0 };
        }
        traitScores[question.trait_name].total += score;
        traitScores[question.trait_name].count += 1;
      });

      const assessmentData = {
        answers,
        traitScores,
        totalQuestions: allQuestions.length,
        completedAt: new Date().toISOString()
      };
      
      // Store in localStorage for results page
      localStorage.setItem('assessmentResults', JSON.stringify(assessmentData));
      router.push('/onboarding/results');
    }
  };

  const handleBack = () => {
    if (currentBatchIndex > 0) {
      setCurrentBatchIndex(prev => prev - 1);
    }
  };

  const getProgressPercentage = () => {
    if (totalBatches === 0) return 0;
    return ((currentBatchIndex + 1) / totalBatches) * 100;
  };

  const getAnsweredCount = () => {
    return currentBatch.filter(q => answers[q.id] !== undefined).length;
  };

  const LikertScale = ({ questionId, currentScore, onScoreChange }: {
    questionId: string;
    currentScore?: number;
    onScoreChange: (score: number) => void;
  }) => {
    const scores = [
      { value: 1, emoji: '😟', label: 'Strongly Disagree', color: 'red' },
      { value: 2, emoji: '😐', label: 'Disagree', color: 'orange' },
      { value: 3, emoji: '😊', label: 'Neutral', color: 'yellow' },
      { value: 4, emoji: '😄', label: 'Agree', color: 'green' },
      { value: 5, emoji: '🤩', label: 'Strongly Agree', color: 'purple' }
    ];

    return (
      <div className="flex justify-center space-x-2 sm:space-x-4 mt-6">
        {scores.map((score) => (
          <motion.button
            key={score.value}
            onClick={() => onScoreChange(score.value)}
            className={`relative p-3 sm:p-4 rounded-full border-2 transition-all duration-300 ${
              currentScore === score.value
                ? 'border-cyan-400 bg-cyan-400/20 shadow-lg shadow-cyan-400/50 scale-110'
                : 'border-gray-600 bg-black/30 hover:border-purple-400 hover:bg-purple-400/10 hover:scale-105'
            }`}
            whileHover={{ scale: currentScore === score.value ? 1.1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={score.label}
          >
            <span className="text-xl sm:text-2xl">{score.emoji}</span>
            <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
              {score.value}
            </div>
            
            {/* Enhanced glow effect for selected */}
            {currentScore === score.value && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full bg-cyan-400/30 blur-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1.3 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </>
            )}
          </motion.button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-cyan-400 text-xl font-mono">Loading Hunter Assessment...</p>
          <p className="text-gray-400 text-sm mt-2">Preparing your trait evaluation</p>
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
          <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
            <motion.div 
              className="text-6xl mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⚠️
            </motion.div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Assessment Error</h2>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-bold hover:scale-105 transition-transform"
              >
                Retry Assessment
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full font-bold hover:scale-105 transition-transform"
              >
                Return to Dashboard
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
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-300 mb-4">No Questions Available</h2>
          <p className="text-gray-400 mb-6">The assessment database appears to be empty.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-bold hover:scale-105 transition-transform"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.6, 0.1],
              scale: [0.5, 1.5, 0.5],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Hunter Assessment
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Discover your unique traits and unlock your potential
          </p>
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto mt-4 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        {/* Enhanced Progress Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm text-gray-400">
              <span className="font-mono">Step {currentBatchIndex + 1} of {totalBatches}</span>
              <span className="ml-2 text-xs">({allQuestions.length} total questions)</span>
            </div>
            <div className="text-sm text-cyan-400 font-mono font-bold">
              {Math.round(getProgressPercentage())}%
            </div>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Enhanced Question Batch */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBatchIndex}
            className="bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl"
            initial={{ opacity: 0, x: 100, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -100, rotateY: 15 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            {/* Batch Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
                Question Set {currentBatchIndex + 1}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
            </motion.div>

            {/* Questions Grid */}
            <div className="space-y-8">
              {currentBatch.map((question, index) => (
                <motion.div
                  key={question.id}
                  className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-6 border border-gray-600/30 hover:border-purple-500/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-purple-400 uppercase tracking-wide">
                        {question.trait_name}
                      </span>
                    </div>
                    {answers[question.id] && (
                      <motion.div
                        className="text-green-400 text-sm"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        ✓ Answered
                      </motion.div>
                    )}
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-semibold text-gray-200 mb-6 leading-relaxed">
                    {question.question_text}
                  </h3>
                  
                  <LikertScale
                    questionId={question.id}
                    currentScore={answers[question.id]}
                    onScoreChange={(score) => handleAnswerChange(question.id, score)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Navigation */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.button
            onClick={handleBack}
            disabled={currentBatchIndex === 0}
            className={`px-8 py-4 rounded-full font-bold transition-all duration-300 ${
              currentBatchIndex === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-lg'
            }`}
            whileHover={currentBatchIndex > 0 ? { scale: 1.05 } : {}}
            whileTap={currentBatchIndex > 0 ? { scale: 0.95 } : {}}
          >
            ← Previous
          </motion.button>

          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">
              <span className="font-bold text-cyan-400">{getAnsweredCount()}</span> of{' '}
              <span className="font-bold">{currentBatch.length}</span> answered
            </p>
            {!isCurrentBatchComplete() && (
              <p className="text-xs text-yellow-400 animate-pulse">
                Please answer all questions to continue
              </p>
            )}
          </div>

          <motion.button
            onClick={handleNext}
            disabled={!isCurrentBatchComplete()}
            className={`px-8 py-4 rounded-full font-bold transition-all duration-300 relative overflow-hidden ${
              isCurrentBatchComplete()
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
            whileHover={isCurrentBatchComplete() ? { scale: 1.05 } : {}}
            whileTap={isCurrentBatchComplete() ? { scale: 0.95 } : {}}
          >
            {currentBatchIndex === totalBatches - 1 ? 'Complete Assessment' : 'Next →'}
            
            {/* Enhanced glow effect when enabled */}
            {isCurrentBatchComplete() && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-purple-400/30 blur-xl"
                animate={{ opacity: [0, 0.7, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>
        </motion.div>

        {/* Enhanced Helper Text */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className="text-gray-500 text-sm mb-2">
            Rate each statement based on how well it describes you
          </p>
          <div className="flex justify-center space-x-4 text-xs text-gray-600">
            <span>1 = Strongly Disagree</span>
            <span>•</span>
            <span>5 = Strongly Agree</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AssessmentPage; 