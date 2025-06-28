'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

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
  normalizedScore: number; // 0-10 scale for radar chart
}

// Enhanced trait configurations matching assessment page
const TRAIT_CONFIG = {
  Discipline: {
    icon: '🛡️',
    description: 'Your unwavering commitment to follow through on goals',
    color: 'from-blue-500 to-indigo-600',
    glow: 'shadow-blue-500/30'
  },
  Focus: {
    icon: '🎯',
    description: 'Your ability to maintain laser-sharp concentration',
    color: 'from-purple-500 to-violet-600',
    glow: 'shadow-purple-500/30'
  },
  Energy: {
    icon: '⚡',
    description: 'Your vitality and stamina for sustained effort',
    color: 'from-yellow-500 to-orange-600',
    glow: 'shadow-yellow-500/30'
  },
  Curiosity: {
    icon: '🔮',
    description: 'Your insatiable drive to explore and discover',
    color: 'from-cyan-500 to-teal-600',
    glow: 'shadow-cyan-500/30'
  },
  'Learning Agility': {
    icon: '📚',
    description: 'Your capacity to rapidly absorb new knowledge',
    color: 'from-emerald-500 to-green-600',
    glow: 'shadow-emerald-500/30'
  },
  'Social Courage': {
    icon: '🗣️',
    description: 'Your boldness in social situations and leadership',
    color: 'from-red-500 to-pink-600',
    glow: 'shadow-red-500/30'
  },
  Confidence: {
    icon: '👑',
    description: 'Your unshakeable belief in your own abilities',
    color: 'from-amber-500 to-yellow-600',
    glow: 'shadow-amber-500/30'
  },
  Initiative: {
    icon: '🚀',
    description: 'Your tendency to take action without being asked',
    color: 'from-indigo-500 to-purple-600',
    glow: 'shadow-indigo-500/30'
  },
  'Digital Minimalism': {
    icon: '📱',
    description: 'Your mastery over technology and digital distractions',
    color: 'from-slate-500 to-gray-600',
    glow: 'shadow-slate-500/30'
  },
  'Emotional Resilience': {
    icon: '💎',
    description: 'Your ability to bounce back from adversity',
    color: 'from-rose-500 to-pink-600',
    glow: 'shadow-rose-500/30'
  },
  'Self Mastery': {
    icon: '🧘',
    description: 'Your control over thoughts, emotions, and impulses',
    color: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/30'
  },
  Consistency: {
    icon: '⏰',
    description: 'Your ability to maintain steady progress over time',
    color: 'from-blue-600 to-cyan-600',
    glow: 'shadow-blue-500/30'
  }
};

// Rank system with detailed classifications
const RANK_SYSTEM = {
  'S-Class': { 
    threshold: 8.5, 
    title: 'S-Class Ascendant', 
    subtitle: 'Legendary Potential',
    color: 'from-yellow-400 via-orange-500 to-red-500',
    textColor: 'text-yellow-400',
    glow: 'shadow-yellow-500/50',
    description: 'You possess extraordinary potential that transcends normal limitations.'
  },
  'A-Class': { 
    threshold: 7.5, 
    title: 'A-Class Elite', 
    subtitle: 'Superior Abilities',
    color: 'from-orange-400 via-red-500 to-pink-500',
    textColor: 'text-orange-400',
    glow: 'shadow-orange-500/50',
    description: 'Your capabilities far exceed the average person in multiple areas.'
  },
  'B-Class': { 
    threshold: 6.5, 
    title: 'B-Class Specialist', 
    subtitle: 'Above Average',
    color: 'from-green-400 via-emerald-500 to-teal-500',
    textColor: 'text-green-400',
    glow: 'shadow-green-500/50',
    description: 'You demonstrate strong competencies with clear areas of expertise.'
  },
  'C-Class': { 
    threshold: 5.0, 
    title: 'C-Class Explorer', 
    subtitle: 'Balanced Foundation',
    color: 'from-blue-400 via-cyan-500 to-teal-500',
    textColor: 'text-blue-400',
    glow: 'shadow-blue-500/50',
    description: 'You have a solid foundation with room for significant growth.'
  },
  'D-Class': { 
    threshold: 3.5, 
    title: 'D-Class Initiate', 
    subtitle: 'Emerging Potential',
    color: 'from-purple-400 via-violet-500 to-indigo-500',
    textColor: 'text-purple-400',
    glow: 'shadow-purple-500/50',
    description: 'Your journey is just beginning, with untapped potential waiting to emerge.'
  },
  'E-Class': { 
    threshold: 0, 
    title: 'E-Class Awakening', 
    subtitle: 'Hidden Power',
    color: 'from-gray-400 via-slate-500 to-gray-600',
    textColor: 'text-gray-400',
    glow: 'shadow-gray-500/50',
    description: 'Every legend starts somewhere. Your awakening has just begun.'
  }
};

const ResultsPage = () => {
  const router = useRouter();
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [traitScores, setTraitScores] = useState<TraitScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [currentRank, setCurrentRank] = useState<any>(null);

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
        const normalizedScore = (totalScore / maxPossibleScore) * 10; // 0-10 scale

        return {
          traitName: set.traitName,
          score: totalScore,
          maxScore: maxPossibleScore,
          percentage: Math.round(percentage),
          normalizedScore: Math.round(normalizedScore * 10) / 10
        };
      });

      setTraitScores(scores.sort((a, b) => b.normalizedScore - a.normalizedScore));

      // Calculate rank
      const averageScore = scores.reduce((sum, trait) => sum + trait.normalizedScore, 0) / scores.length;
      const rank = Object.entries(RANK_SYSTEM).find(([_, config]) => averageScore >= config.threshold)?.[1] || RANK_SYSTEM['E-Class'];
      setCurrentRank(rank);

      // Sequence animations
      setTimeout(() => setLoading(false), 1000);
      setTimeout(() => setShowChart(true), 2000);
      setTimeout(() => setShowStats(true), 3500);

    } catch (error) {
      console.error('Failed to parse assessment results:', error);
      router.push('/onboarding/assessment');
      return;
    }
  }, [router]);

  // Prepare data for radar chart
  const radarData = traitScores.map(trait => ({
    trait: trait.traitName.length > 10 ? trait.traitName.substring(0, 10) + '...' : trait.traitName,
    fullName: trait.traitName,
    score: trait.normalizedScore,
    maxScore: 10
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Mystical loading particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 2, 0.5],
                y: [0, -100, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
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
          transition={{ duration: 1 }}
        >
          <motion.div
            className="text-8xl mb-6"
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🧬
          </motion.div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Analyzing Your Essence
          </h2>
          <p className="text-gray-400 text-xl mb-6">Calculating your true potential...</p>
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full"
            animate={{ scaleX: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.p
            className="mt-6 text-purple-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ✨ Channeling mystical energies ✨
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!currentRank || traitScores.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-red-400 text-xl">Error loading results. Please retake the assessment.</p>
      </div>
    );
  }

  const averageScore = traitScores.reduce((sum, trait) => sum + trait.normalizedScore, 0) / traitScores.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Epic background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating mystical orbs */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.6, 0.1],
              scale: [0.5, 2, 0.5],
              x: [0, Math.random() * 200 - 100, 0],
              y: [0, Math.random() * 200 - 100, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
        
        {/* Mystical energy grid */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/3 to-cyan-500/3 bg-[size:100px_100px] bg-[image:radial-gradient(circle_at_center,rgba(255,255,255,0.1)_2px,transparent_2px)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Epic Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <motion.div
            className="text-8xl mb-6"
            animate={{ 
              rotateY: [0, 10, 0, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            🧬
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Ascension Complete
          </motion.h1>
          
          <motion.div
            className={`inline-block px-8 py-4 rounded-3xl bg-gradient-to-r ${currentRank.color} bg-opacity-20 backdrop-blur-xl border border-white/20 ${currentRank.glow} mb-6`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <h2 className={`text-4xl md:text-5xl font-bold ${currentRank.textColor} mb-2`}>
              You Are: {currentRank.title}
            </h2>
            <p className="text-xl text-gray-300">{currentRank.subtitle}</p>
          </motion.div>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            Based on your mystical assessment, this is your current potential...
          </motion.p>
          
          <motion.div
            className="w-48 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 mx-auto mt-6 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 1.5 }}
          />
        </motion.div>

        {/* Radar Chart Section */}
        <AnimatePresence>
          {showChart && (
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 1 }}
            >
              <motion.h3 
                className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                ⚡ Power Analysis ⚡
              </motion.h3>
              
              <div className="relative bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                {/* Animated border glow */}
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <div className="relative z-10 h-96 md:h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid 
                        stroke="#374151" 
                        strokeWidth={1}
                        radialLines={true}
                      />
                      <PolarAngleAxis 
                        dataKey="trait" 
                        tick={{ 
                          fill: '#9CA3AF', 
                          fontSize: 12,
                          fontWeight: 'bold'
                        }}
                        className="text-gray-400"
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 10]}
                        tick={{ 
                          fill: '#6B7280', 
                          fontSize: 10 
                        }}
                        tickCount={6}
                      />
                      <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, delay: 0.5 }}
                      >
                        <Radar
                          name="Current Level"
                          dataKey="score"
                          stroke="#8B5CF6"
                          fill="url(#radarGradient)"
                          fillOpacity={0.3}
                          strokeWidth={3}
                          dot={{ fill: '#A855F7', strokeWidth: 2, r: 6 }}
                        />
                      </motion.g>
                      <defs>
                        <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.6} />
                          <stop offset="50%" stopColor="#06B6D4" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#EC4899" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                <motion.div 
                  className="text-center mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <p className="text-gray-400">
                    Average Power Level: <span className={`font-bold text-2xl ${currentRank.textColor}`}>
                      {averageScore.toFixed(1)}/10
                    </span>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detailed Stat Breakdown */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <motion.h3 
                className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                🔮 Trait Manifestation 🔮
              </motion.h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {traitScores.map((trait, index) => {
                  const config = TRAIT_CONFIG[trait.traitName as keyof typeof TRAIT_CONFIG] || {
                    icon: '❓',
                    description: 'A mysterious trait waiting to be understood',
                    color: 'from-gray-500 to-gray-600',
                    glow: 'shadow-gray-500/30'
                  };

                  return (
                    <motion.div
                      key={trait.traitName}
                      className={`relative group bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl ${config.glow} transition-all duration-500 hover:bg-white/15 hover:border-white/30`}
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      {/* Magical border glow */}
                      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${config.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                      
                      <div className="relative z-10">
                        {/* Trait header */}
                        <div className="flex items-center justify-between mb-4">
                          <motion.div
                            className={`w-14 h-14 bg-gradient-to-br ${config.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.3 }}
                          >
                            {config.icon}
                          </motion.div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
                              {trait.normalizedScore}/10
                            </div>
                            <div className="text-sm text-gray-400">
                              {trait.percentage}%
                            </div>
                          </div>
                        </div>
                        
                        <h4 className="text-xl font-bold text-white mb-2">
                          {trait.traitName}
                        </h4>
                        
                        <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                          {config.description}
                        </p>
                        
                        {/* Animated progress bar */}
                        <div className="relative w-full bg-black/30 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${config.color} rounded-full relative`}
                            initial={{ width: 0 }}
                            animate={{ width: `${trait.percentage}%` }}
                            transition={{ duration: 1.5, delay: 0.5 + index * 0.1 }}
                          >
                            {/* Shimmer effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                              animate={{ x: [-100, 200] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                          </motion.div>
                        </div>
                        
                        <p className="text-xs text-gray-400 mt-2 text-center">
                          {trait.score}/{trait.maxScore} points earned
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rank Description */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className={`bg-gradient-to-br ${currentRank.color} bg-opacity-10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center ${currentRank.glow}`}>
            <motion.div
              className="text-6xl mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🌟
            </motion.div>
            <h3 className={`text-2xl md:text-3xl font-bold ${currentRank.textColor} mb-4`}>
              {currentRank.title} Insights
            </h3>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {currentRank.description}
            </p>
          </div>
        </motion.div>

        {/* Epic CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <motion.h3 
            className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
            animate={{ 
              textShadow: [
                "0 0 20px rgba(251, 191, 36, 0.4)",
                "0 0 30px rgba(251, 191, 36, 0.6)",
                "0 0 20px rgba(251, 191, 36, 0.4)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ⚔️ Choose Your Destiny ⚔️
          </motion.h3>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/onboarding/goals">
              <motion.button
                className="relative px-10 py-5 bg-gradient-to-r from-purple-500 to-cyan-600 rounded-2xl text-xl font-bold text-white shadow-2xl overflow-hidden group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>🎯</span>
                  <span>Choose Your Path</span>
                </span>
                {/* Magical glow effect */}
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
              </motion.button>
            </Link>
            
            <Link href="/dashboard">
              <motion.button
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-lg font-bold text-white hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                🏠 Skip & Enter Dashboard
              </motion.button>
            </Link>
          </div>
          
          <motion.p 
            className="text-sm text-gray-500 mt-8"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ✨ Your destiny awaits, {currentRank.title} ✨
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPage; 