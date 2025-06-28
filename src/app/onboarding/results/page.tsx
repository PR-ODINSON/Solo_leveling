'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AssessmentResults {
  answers: Record<string, number>;
  questionSets: Array<{
    traitName: string;
    questionIds: string[];
  }>;
}

interface TraitScore {
  traitName: string;
  score: number;
  maxScore: number;
  percentage: number;
}

const ResultsPage = () => {
  const router = useRouter();
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [traitScores, setTraitScores] = useState<TraitScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load results from localStorage
    const storedResults = localStorage.getItem('assessmentResults');
    if (!storedResults) {
      router.push('/onboarding/assessment');
      return;
    }

    try {
      const parsedResults: AssessmentResults = JSON.parse(storedResults);
      setResults(parsedResults);

      // Calculate trait scores
      const scores: TraitScore[] = parsedResults.questionSets.map(set => {
        const traitAnswers = set.questionIds.map(id => parsedResults.answers[id] || 0);
        const totalScore = traitAnswers.reduce((sum, score) => sum + score, 0);
        const maxPossibleScore = set.questionIds.length * 5;
        const percentage = (totalScore / maxPossibleScore) * 100;

        return {
          traitName: set.traitName,
          score: totalScore,
          maxScore: maxPossibleScore,
          percentage: Math.round(percentage)
        };
      });

      setTraitScores(scores.sort((a, b) => b.percentage - a.percentage));
    } catch (error) {
      console.error('Failed to parse assessment results:', error);
      router.push('/onboarding/assessment');
      return;
    }

    setLoading(false);
  }, [router]);

  const getTraitIcon = (traitName: string) => {
    const icons: Record<string, string> = {
      'Intelligence': '🧠',
      'Strength': '💪',
      'Agility': '⚡',
      'Perception': '👁️',
      'Sense': '🔍',
      'Magic Power': '✨',
      'default': '⭐'
    };
    return icons[traitName] || icons.default;
  };

  const getTraitColor = (percentage: number) => {
    if (percentage >= 80) return 'from-yellow-400 to-orange-500';
    if (percentage >= 60) return 'from-green-400 to-emerald-500';
    if (percentage >= 40) return 'from-blue-400 to-cyan-500';
    return 'from-gray-400 to-gray-500';
  };

  const getRankTitle = (averageScore: number) => {
    if (averageScore >= 90) return { title: 'S-Rank Hunter', color: 'text-yellow-400' };
    if (averageScore >= 80) return { title: 'A-Rank Hunter', color: 'text-orange-400' };
    if (averageScore >= 70) return { title: 'B-Rank Hunter', color: 'text-green-400' };
    if (averageScore >= 60) return { title: 'C-Rank Hunter', color: 'text-blue-400' };
    if (averageScore >= 50) return { title: 'D-Rank Hunter', color: 'text-purple-400' };
    return { title: 'E-Rank Hunter', color: 'text-gray-400' };
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
          <p className="text-cyan-400 text-xl font-mono">Processing Results...</p>
        </motion.div>
      </div>
    );
  }

  const averageScore = traitScores.length > 0 
    ? traitScores.reduce((sum, trait) => sum + trait.percentage, 0) / traitScores.length 
    : 0;
  
  const rank = getRankTitle(averageScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
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
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Assessment Complete
          </h1>
          <p className="text-gray-400 text-xl">
            Your Hunter Profile has been analyzed
          </p>
        </motion.div>

        {/* Rank Card */}
        <motion.div
          className="bg-black/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 mb-8 text-center shadow-2xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="text-8xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🏅
          </motion.div>
          <h2 className={`text-4xl font-bold mb-2 ${rank.color}`}>
            {rank.title}
          </h2>
          <p className="text-gray-400 text-lg">
            Overall Score: <span className="text-cyan-400 font-bold">{Math.round(averageScore)}%</span>
          </p>
        </motion.div>

        {/* Trait Scores */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {traitScores.map((trait, index) => (
            <motion.div
              key={trait.traitName}
              className="bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{getTraitIcon(trait.traitName)}</div>
                <h3 className="text-xl font-bold text-white mb-2">{trait.traitName}</h3>
                <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  {trait.percentage}%
                </p>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${getTraitColor(trait.percentage)} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${trait.percentage}%` }}
                  transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                />
              </div>
              
              <p className="text-sm text-gray-400 mt-2 text-center">
                {trait.score}/{trait.maxScore} points
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recommendations */}
        <motion.div
          className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-6 text-center">
            Hunter Recommendations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/30 rounded-2xl p-6">
              <h4 className="text-xl font-bold text-green-400 mb-3">🎯 Focus Areas</h4>
              <ul className="space-y-2 text-gray-300">
                {traitScores.slice(0, 2).map(trait => (
                  <li key={trait.traitName} className="flex items-center">
                    <span className="text-cyan-400 mr-2">▶</span>
                    Develop {trait.traitName.toLowerCase()} through daily quests
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-black/30 rounded-2xl p-6">
              <h4 className="text-xl font-bold text-blue-400 mb-3">📈 Growth Potential</h4>
              <ul className="space-y-2 text-gray-300">
                {traitScores.slice(-2).reverse().map(trait => (
                  <li key={trait.traitName} className="flex items-center">
                    <span className="text-purple-400 mr-2">▶</span>
                    Improve {trait.traitName.toLowerCase()} for rank advancement
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link href="/onboarding/goals">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-xl font-bold hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎯 Choose Your Path
            </motion.button>
          </Link>
          
          <Link href="/dashboard">
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full text-lg font-bold hover:from-gray-500 hover:to-gray-600 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Skip to Dashboard
            </motion.button>
          </Link>
          
          <motion.button
            onClick={() => {
              localStorage.removeItem('assessmentResults');
              router.push('/onboarding/assessment');
            }}
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-full text-sm font-bold hover:from-orange-500 hover:to-red-500 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retake Assessment
          </motion.button>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <p className="text-gray-500 text-sm">
            Your results have been saved to your Hunter profile
          </p>
        </motion.div>
      </div>
    </div>
  );
  };

export default ResultsPage; 