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

interface QuestionSet {
  traitName: string;
  questions: TraitQuestion[];
}

const AssessmentPage = () => {
  const router = useRouter();
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load questions from Supabase
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        
        // Fetch all questions grouped by trait
        const { data: questions, error } = await supabase
          .from('trait_questions')
          .select('*')
          .order('trait_name', { ascending: true })
          .order('question_order', { ascending: true });

        if (error) throw error;

        if (!questions || questions.length === 0) {
          setError('No questions found. Please check your database.');
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

        // Create question sets with 2 random questions per trait
        const sets: QuestionSet[] = Object.entries(groupedQuestions).map(([traitName, traitQuestions]) => {
          // Shuffle and take first 2 questions
          const shuffled = [...traitQuestions].sort(() => Math.random() - 0.5);
          const selectedQuestions = shuffled.slice(0, 2);
          
          return {
            traitName,
            questions: selectedQuestions
          };
        });

        setQuestionSets(sets);
      } catch (err) {
        console.error('Error loading questions:', err);
        setError('Failed to load assessment questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleAnswerChange = (questionId: string, score: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: score
    }));
  };

  const getCurrentSetAnswers = () => {
    if (!questionSets[currentSetIndex]) return {};
    
    const currentQuestions = questionSets[currentSetIndex].questions;
    const currentAnswers: Record<string, number> = {};
    
    currentQuestions.forEach(q => {
      if (answers[q.id] !== undefined) {
        currentAnswers[q.id] = answers[q.id];
      }
    });
    
    return currentAnswers;
  };

  const isCurrentSetComplete = () => {
    if (!questionSets[currentSetIndex]) return false;
    
    const currentQuestions = questionSets[currentSetIndex].questions;
    return currentQuestions.every(q => answers[q.id] !== undefined);
  };

  const handleNext = () => {
    if (currentSetIndex < questionSets.length - 1) {
      setCurrentSetIndex(prev => prev + 1);
    } else {
      // Assessment complete - redirect to results
      const assessmentData = {
        answers,
        questionSets: questionSets.map(set => ({
          traitName: set.traitName,
          questionIds: set.questions.map(q => q.id)
        }))
      };
      
      // Store in localStorage for results page
      localStorage.setItem('assessmentResults', JSON.stringify(assessmentData));
      router.push('/onboarding/results');
    }
  };

  const handleBack = () => {
    if (currentSetIndex > 0) {
      setCurrentSetIndex(prev => prev - 1);
    }
  };

  const getProgressPercentage = () => {
    if (questionSets.length === 0) return 0;
    return ((currentSetIndex + 1) / questionSets.length) * 100;
  };

  const LikertScale = ({ questionId, currentScore, onScoreChange }: {
    questionId: string;
    currentScore?: number;
    onScoreChange: (score: number) => void;
  }) => {
    const scores = [
      { value: 1, emoji: '😟', label: 'Strongly Disagree' },
      { value: 2, emoji: '😐', label: 'Disagree' },
      { value: 3, emoji: '😊', label: 'Neutral' },
      { value: 4, emoji: '😄', label: 'Agree' },
      { value: 5, emoji: '🤩', label: 'Strongly Agree' }
    ];

    return (
      <div className="flex justify-center space-x-4 mt-6">
        {scores.map((score) => (
          <motion.button
            key={score.value}
            onClick={() => onScoreChange(score.value)}
            className={`relative p-4 rounded-full border-2 transition-all duration-300 ${
              currentScore === score.value
                ? 'border-cyan-400 bg-cyan-400/20 shadow-lg shadow-cyan-400/50'
                : 'border-gray-600 bg-black/30 hover:border-purple-400 hover:bg-purple-400/10'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={score.label}
          >
            <span className="text-2xl">{score.emoji}</span>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
              {score.value}
            </div>
            
            {/* Glow effect for selected */}
            {currentScore === score.value && (
              <motion.div
                className="absolute inset-0 rounded-full bg-cyan-400/30 blur-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.2 }}
                transition={{ duration: 0.3 }}
              />
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
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 text-xl font-mono">Loading Assessment...</p>
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
          <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-8 backdrop-blur-xl">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Assessment Error</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-bold hover:scale-105 transition-transform"
            >
              Return to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (questionSets.length === 0) {
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
          <p className="text-gray-400 mb-6">Please check back later or contact support.</p>
        </motion.div>
      </div>
    );
  }

  const currentSet = questionSets[currentSetIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Hunter Assessment
          </h1>
          <p className="text-gray-400 text-lg">
            Discover your unique traits and abilities
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">
              Step {currentSetIndex + 1} of {questionSets.length}
            </span>
            <span className="text-sm text-cyan-400 font-mono">
              {Math.round(getProgressPercentage())}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Question Set */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSetIndex}
            className="bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 mb-8 shadow-2xl"
            initial={{ opacity: 0, x: 50, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -50, rotateY: 15 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {/* Trait Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
                {currentSet.traitName.toUpperCase()}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
            </motion.div>

            {/* Questions */}
            <div className="space-y-12">
              {currentSet.questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-6 border border-gray-600/30"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                >
                  <h3 className="text-xl font-semibold text-gray-200 mb-6 leading-relaxed">
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

        {/* Navigation */}
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.button
            onClick={handleBack}
            disabled={currentSetIndex === 0}
            className={`px-8 py-4 rounded-full font-bold transition-all duration-300 ${
              currentSetIndex === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white hover:scale-105'
            }`}
            whileHover={currentSetIndex > 0 ? { scale: 1.05 } : {}}
            whileTap={currentSetIndex > 0 ? { scale: 0.95 } : {}}
          >
            ← Back
          </motion.button>

          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">
              {Object.keys(getCurrentSetAnswers()).length} of {currentSet.questions.length} answered
            </p>
            {!isCurrentSetComplete() && (
              <p className="text-xs text-yellow-400">
                Please answer all questions to continue
              </p>
            )}
          </div>

          <motion.button
            onClick={handleNext}
            disabled={!isCurrentSetComplete()}
            className={`px-8 py-4 rounded-full font-bold transition-all duration-300 relative overflow-hidden ${
              isCurrentSetComplete()
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
            whileHover={isCurrentSetComplete() ? { scale: 1.05 } : {}}
            whileTap={isCurrentSetComplete() ? { scale: 0.95 } : {}}
          >
            {currentSetIndex === questionSets.length - 1 ? 'Complete Assessment' : 'Next →'}
            
            {/* Glow effect when enabled */}
            {isCurrentSetComplete() && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-xl"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>
        </motion.div>

        {/* Helper Text */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className="text-gray-500 text-sm">
            Rate each statement based on how well it describes you
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AssessmentPage; 