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
  normalizedScore: number;
  feedback: string;
}

// Enhanced trait configurations for AscendOS
const TRAIT_CONFIG = {
  Discipline: {
    icon: '🛡️',
    description: 'Your unwavering commitment to follow through on goals',
    color: 'from-blue-500 to-indigo-600',
    glow: 'shadow-blue-500/30',
    feedbacks: [
      'Unbreakable will. You are forged in iron.',
      'Strong discipline. Your resolve guides you.',
      'Solid foundation. Room to strengthen your core.',
      'Developing willpower. The forge awaits.',
      'Hidden strength lies dormant within.'
    ]
  },
  Focus: {
    icon: '🎯',
    description: 'Your ability to maintain laser-sharp concentration',
    color: 'from-purple-500 to-violet-600',
    glow: 'shadow-purple-500/30',
    feedbacks: [
      'Laser precision. Nothing escapes your sight.',
      'Sharp focus. You see what others miss.',
      'Good concentration. Sharpen your aim.',
      'Scattered attention. Center your mind.',
      'Untapped focus awaits awakening.'
    ]
  },
  Energy: {
    icon: '⚡',
    description: 'Your vitality and stamina for sustained effort',
    color: 'from-yellow-500 to-orange-600',
    glow: 'shadow-yellow-500/30',
    feedbacks: [
      'Boundless energy. You are a force of nature.',
      'High vitality. Your spark ignites others.',
      'Steady energy. Fuel your inner fire.',
      'Low reserves. Recharge your batteries.',
      'Dormant power waits to be unleashed.'
    ]
  },
  Curiosity: {
    icon: '🔮',
    description: 'Your insatiable drive to explore and discover',
    color: 'from-cyan-500 to-teal-600',
    glow: 'shadow-cyan-500/30',
    feedbacks: [
      'Insatiable wonder. The universe calls to you.',
      'Strong curiosity. You seek hidden truths.',
      'Good explorer instincts. Keep questioning.',
      'Limited interest. Open your mind wider.',
      'Sleeping wonder awaits your call.'
    ]
  },
  'Learning Agility': {
    icon: '📚',
    description: 'Your capacity to rapidly absorb new knowledge',
    color: 'from-emerald-500 to-green-600',
    glow: 'shadow-emerald-500/30',
    feedbacks: [
      'Lightning-fast learner. Knowledge bends to you.',
      'Quick adaptation. You master new domains.',
      'Solid learning speed. Keep growing.',
      'Slow absorption. Take time to digest.',
      'Untapped learning potential lies within.'
    ]
  },
  'Social Courage': {
    icon: '🗣️',
    description: 'Your boldness in social situations and leadership',
    color: 'from-red-500 to-pink-600',
    glow: 'shadow-red-500/30',
    feedbacks: [
      'Natural leader. Others rally to your cause.',
      'Brave communicator. You inspire confidence.',
      'Growing courage. Step into the spotlight.',
      'Quiet presence. Find your voice.',
      'Hidden charisma waits to emerge.'
    ]
  },
  Confidence: {
    icon: '👑',
    description: 'Your unshakeable belief in your own abilities',
    color: 'from-amber-500 to-yellow-600',
    glow: 'shadow-amber-500/30',
    feedbacks: [
      'Unshakeable belief. You are unstoppable.',
      'Strong self-trust. You know your worth.',
      'Building confidence. Believe in yourself.',
      'Self-doubt clouds your power. Rise up.',
      'Inner strength awaits recognition.'
    ]
  },
  Initiative: {
    icon: '🚀',
    description: 'Your tendency to take action without being asked',
    color: 'from-indigo-500 to-purple-600',
    glow: 'shadow-indigo-500/30',
    feedbacks: [
      'Action incarnate. You make things happen.',
      'Strong starter. You lead by example.',
      'Good initiative. Keep pushing forward.',
      'Hesitant to act. Trust your instincts.',
      'Dormant drive awaits activation.'
    ]
  },
  'Digital Minimalism': {
    icon: '📱',
    description: 'Your mastery over technology and digital distractions',
    color: 'from-slate-500 to-gray-600',
    glow: 'shadow-slate-500/30',
    feedbacks: [
      'Digital master. Technology serves you.',
      'Good boundaries. You control the screen.',
      'Balanced usage. Maintain your guard.',
      'Easily distracted. Reclaim your focus.',
      'Hidden discipline waits to surface.'
    ]
  },
  'Emotional Resilience': {
    icon: '💎',
    description: 'Your ability to bounce back from adversity',
    color: 'from-rose-500 to-pink-600',
    glow: 'shadow-rose-500/30',
    feedbacks: [
      'Unbreakable spirit. You rise from any fall.',
      'Strong recovery. Setbacks fuel your growth.',
      'Good resilience. Keep bouncing back.',
      'Fragile state. Build your inner armor.',
      'Hidden strength waits to be forged.'
    ]
  },
  'Self Mastery': {
    icon: '🧘',
    description: 'Your control over thoughts, emotions, and impulses',
    color: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/30',
    feedbacks: [
      'Complete mastery. You are your own master.',
      'Strong control. You guide your destiny.',
      'Good awareness. Keep practicing mindfulness.',
      'Reactive patterns. Learn to pause and breathe.',
      'Inner wisdom awaits cultivation.'
    ]
  },
  Consistency: {
    icon: '⏰',
    description: 'Your ability to maintain steady progress over time',
    color: 'from-blue-600 to-cyan-600',
    glow: 'shadow-blue-500/30',
    feedbacks: [
      'Unwavering consistency. You are relentless.',
      'Strong habits. You build lasting progress.',
      'Good routine. Keep showing up daily.',
      'Inconsistent patterns. Find your rhythm.',
      'Hidden persistence waits to emerge.'
    ]
  }
};

// Epic rank system for AscendOS - Updated with mystical theme colors
const RANK_SYSTEM = {
  'S-Class': { 
    threshold: 8.5, 
    title: 'S-Class Ascendant', 
    subtitle: 'Legendary Potential',
    color: 'from-yellow-400 via-orange-500 to-red-500',
    textColor: 'text-yellow-400',
    glow: 'shadow-yellow-500/50 shadow-2xl',
    description: 'You possess extraordinary potential that transcends normal limitations. The system recognizes you as a rare individual with the power to reshape reality itself.',
    badge: '⭐'
  },
  'A-Class': { 
    threshold: 7.5, 
    title: 'A-Class Elite', 
    subtitle: 'Superior Abilities',
    color: 'from-orange-400 via-pink-500 to-red-500',
    textColor: 'text-orange-400',
    glow: 'shadow-orange-500/50 shadow-xl',
    description: 'Your capabilities far exceed the average person in multiple areas. You are among the elite few with exceptional potential.',
    badge: '🔥'
  },
  'B-Class': { 
    threshold: 6.5, 
    title: 'B-Class Specialist', 
    subtitle: 'Above Average',
    color: 'from-cyan-400 via-purple-500 to-pink-500',
    textColor: 'text-cyan-400',
    glow: 'shadow-cyan-500/50 shadow-lg',
    description: 'You demonstrate strong competencies with clear areas of expertise. Your balanced abilities mark you as highly capable.',
    badge: '💎'
  },
  'C-Class': { 
    threshold: 5.0, 
    title: 'C-Class Explorer', 
    subtitle: 'Balanced Foundation',
    color: 'from-blue-400 via-cyan-500 to-purple-500',
    textColor: 'text-blue-400',
    glow: 'shadow-blue-500/50 shadow-lg',
    description: 'You have a solid foundation with room for significant growth. Your journey of ascension has strong potential.',
    badge: '🔷'
  },
  'D-Class': { 
    threshold: 3.5, 
    title: 'D-Class Initiate', 
    subtitle: 'Emerging Potential',
    color: 'from-purple-400 via-violet-500 to-indigo-500',
    textColor: 'text-purple-400',
    glow: 'shadow-purple-500/50',
    description: 'Your journey is just beginning, with untapped potential waiting to emerge. Great power often starts small.',
    badge: '🔮'
  },
  'E-Class': { 
    threshold: 0, 
    title: 'E-Class Awakening', 
    subtitle: 'Hidden Power',
    color: 'from-slate-400 via-gray-500 to-slate-600',
    textColor: 'text-slate-400',
    glow: 'shadow-slate-500/50',
    description: 'Every legend starts somewhere. Your awakening has just begun, and hidden power lies dormant within.',
    badge: '⚡'
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
  const [averageScore, setAverageScore] = useState(0);

  // Get feedback based on score
  const getFeedback = (traitName: string, normalizedScore: number): string => {
    const config = TRAIT_CONFIG[traitName as keyof typeof TRAIT_CONFIG];
    if (!config) return 'Your potential awaits discovery.';
    
    const feedbacks = config.feedbacks;
    if (normalizedScore >= 8.5) return feedbacks[0];
    if (normalizedScore >= 6.5) return feedbacks[1];
    if (normalizedScore >= 5.0) return feedbacks[2];
    if (normalizedScore >= 3.5) return feedbacks[3];
    return feedbacks[4];
  };

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
        const normalizedScore = (totalScore / maxPossibleScore) * 10;

        return {
          traitName: set.traitName,
          score: totalScore,
          maxScore: maxPossibleScore,
          percentage: Math.round(percentage),
          normalizedScore: Math.round(normalizedScore * 10) / 10,
          feedback: getFeedback(set.traitName, normalizedScore)
        };
      });

      setTraitScores(scores.sort((a, b) => b.normalizedScore - a.normalizedScore));

      // Calculate rank
      const avgScore = scores.reduce((sum, trait) => sum + trait.normalizedScore, 0) / scores.length;
      setAverageScore(avgScore);

      // Determine rank
      const rank = Object.entries(RANK_SYSTEM)
        .find(([_, rankData]) => avgScore >= rankData.threshold)?.[1] || RANK_SYSTEM['E-Class'];
      
      setCurrentRank(rank);

      // Sequence animations
      setTimeout(() => setLoading(false), 1000);
      setTimeout(() => setShowChart(true), 3000);
      setTimeout(() => setShowStats(true), 5000);

    } catch (error) {
      console.error('Error loading results:', error);
      router.push('/onboarding/assessment');
    }
  }, [router]);

  // Prepare chart data
  const chartData = traitScores.map(trait => ({
    trait: trait.traitName,
    score: trait.normalizedScore,
    fullMark: 10
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="text-6xl mb-6"
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
          >
            🧬
          </motion.div>
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Analyzing Your Essence...
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 font-mono"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            [ SYSTEM PROCESSING... ]
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-30"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
        
        {/* Energy grid */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Epic Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          {/* System scanning message */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.p 
              className="text-2xl md:text-3xl text-cyan-400 font-mono mb-4"
              animate={{ 
                textShadow: [
                  "0 0 10px rgba(34, 211, 238, 0.5)",
                  "0 0 20px rgba(34, 211, 238, 0.8)",
                  "0 0 10px rgba(34, 211, 238, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              [ ESSENCE ANALYSIS COMPLETE ]
            </motion.p>
            <motion.p 
              className="text-lg md:text-xl text-gray-300 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              "The System has scanned your essence and revealed your true nature..."
            </motion.p>
          </motion.div>

          <motion.h1 
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            🧬 Ascension Complete
          </motion.h1>
        </motion.div>

        {/* Rank Reveal */}
        {currentRank && (
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            {/* Rank Badge */}
            <motion.div
              className="relative inline-block mb-8"
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 2.5
              }}
            >
              {/* Pulsing aura */}
              <motion.div
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${currentRank.color} opacity-30 blur-xl`}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Main badge */}
              <motion.div
                className={`relative w-64 h-64 mx-auto rounded-full bg-gradient-to-r ${currentRank.color} p-1 ${currentRank.glow}`}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-full h-full rounded-full bg-black/80 backdrop-blur-xl border-4 border-white/20 flex flex-col items-center justify-center">
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {currentRank.badge}
                  </motion.div>
                  <motion.div
                    className={`text-4xl font-bold ${currentRank.textColor}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3 }}
                  >
                    {currentRank.title.charAt(0)}-CLASS
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

                                      {/* Clean & Modern Rank Display */}
             <motion.div
               className="mb-12"
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 3.5 }}
             >
               {/* Simple elegant card */}
               <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 md:p-12">
                 {/* Header */}
                 <motion.div
                   className="text-center mb-8"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 4 }}
                 >
                   <h2 className="text-2xl md:text-3xl font-medium text-white/90 mb-2 font-sans">
                     Classification Complete
                   </h2>
                   <p className="text-base text-white/60 font-sans">
                     Your assessment results
                   </p>
                 </motion.div>
                 
                 {/* Main rank display */}
                 <motion.div
                   className="text-center mb-8"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 4.5, duration: 0.6 }}
                 >
                   {/* Rank badge */}
                   <motion.div
                     className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${currentRank.color} mb-6 shadow-lg`}
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     transition={{ delay: 5, type: "spring", stiffness: 200 }}
                   >
                     <span className="text-3xl">{currentRank.badge}</span>
                   </motion.div>
                   
                   {/* Rank title */}
                   <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 5.2 }}
                   >
                     <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 font-sans">
                       {currentRank.title}
                     </h1>
                     <p className="text-xl md:text-2xl text-white/80 font-sans font-light">
                       {currentRank.subtitle}
                     </p>
                   </motion.div>
                 </motion.div>
                 
                 {/* Power level section */}
                 <motion.div
                   className="text-center"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 5.5 }}
                 >
                   <div className="flex items-center justify-center space-x-6 mb-6">
                     {/* Score display */}
                     <div className="text-center">
                       <div className={`text-5xl font-bold ${currentRank.textColor} font-mono`}>
                         {averageScore.toFixed(1)}
                       </div>
                       <div className="text-white/60 text-sm font-sans mt-1">
                         Power Level
                       </div>
                     </div>
                     
                     {/* Divider */}
                     <div className="w-px h-16 bg-white/20"></div>
                     
                     {/* Status */}
                     <div className="text-center">
                       <div className="text-2xl font-semibold text-white font-sans">
                         Active
                       </div>
                       <div className="text-white/60 text-sm font-sans mt-1">
                         Status
                       </div>
                     </div>
                   </div>
                   
                   {/* Progress bar */}
                   <motion.div
                     className="w-full bg-white/10 rounded-full h-3 overflow-hidden"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 6 }}
                   >
                     <motion.div
                       className={`h-full bg-gradient-to-r ${currentRank.color} rounded-full`}
                       initial={{ width: 0 }}
                       animate={{ width: `${(averageScore / 10) * 100}%` }}
                       transition={{ delay: 6.2, duration: 1.5, ease: "easeOut" }}
                     />
                   </motion.div>
                   
                   <motion.p
                     className="text-white/70 text-sm mt-4 font-sans leading-relaxed max-w-lg mx-auto"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 6.5 }}
                   >
                     {currentRank.description}
                   </motion.p>
                 </motion.div>
               </div>
             </motion.div>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 4 }}
            >
              {currentRank.description}
            </motion.p>
          </motion.div>
        )}

        {/* Radar Chart */}
        <AnimatePresence>
          {showChart && (
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
            >
              <motion.h3 
                className="text-3xl md:text-4xl font-bold text-center text-white mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Your Core Stats
              </motion.h3>
              
              <motion.div
                className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="h-96 md:h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={chartData}>
                      <PolarGrid 
                        stroke="rgba(255,255,255,0.2)" 
                        strokeWidth={1}
                      />
                      <PolarAngleAxis 
                        dataKey="trait" 
                        tick={{ fill: '#e5e7eb', fontSize: 12 }}
                        className="text-sm"
                      />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 10]} 
                        tick={{ fill: '#9ca3af', fontSize: 10 }}
                      />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#06b6d4"
                        fill="#06b6d4"
                        fillOpacity={0.3}
                        strokeWidth={3}
                        dot={{ fill: '#06b6d4', strokeWidth: 2, r: 6 }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                <motion.p 
                  className="text-center text-gray-400 mt-6 italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  "These are your starting stats. Your journey to ascension begins now."
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detailed Stats */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              className="mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <motion.h3 
                className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Detailed Analysis
              </motion.h3>
              
                             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                 {traitScores.map((trait, index) => {
                   const config = TRAIT_CONFIG[trait.traitName as keyof typeof TRAIT_CONFIG];
                   if (!config) return null;
                   
                   return (
                     <motion.div
                       key={trait.traitName}
                       className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 hover:bg-white/8 transition-colors duration-300"
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: index * 0.05, duration: 0.4 }}
                     >
                       {/* Header with icon and score */}
                       <div className="flex items-start justify-between mb-4">
                         <div className="flex items-center space-x-3">
                           <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center text-xl shadow-sm`}>
                             {config.icon}
                           </div>
                           <div>
                             <h4 className="text-lg font-semibold text-white font-sans">
                               {trait.traitName}
                             </h4>
                             <p className="text-white/60 text-sm font-sans">
                               {trait.percentage}% complete
                             </p>
                           </div>
                         </div>
                         
                         {/* Score badge */}
                         <div className="text-right">
                           <div className={`text-2xl font-bold ${config.color.includes('yellow') ? 'text-yellow-400' : config.color.includes('cyan') ? 'text-cyan-400' : config.color.includes('purple') ? 'text-purple-400' : config.color.includes('blue') ? 'text-blue-400' : config.color.includes('emerald') ? 'text-emerald-400' : config.color.includes('red') ? 'text-red-400' : config.color.includes('amber') ? 'text-amber-400' : config.color.includes('indigo') ? 'text-indigo-400' : config.color.includes('slate') ? 'text-slate-400' : config.color.includes('rose') ? 'text-rose-400' : config.color.includes('violet') ? 'text-violet-400' : 'text-blue-400'} font-mono`}>
                             {trait.normalizedScore}
                           </div>
                           <div className="text-white/50 text-sm font-sans">
                             / 10
                           </div>
                         </div>
                       </div>
                       
                       {/* Progress bar */}
                       <div className="mb-4">
                         <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                           <motion.div
                             className={`h-full bg-gradient-to-r ${config.color} rounded-full`}
                             initial={{ width: 0 }}
                             animate={{ width: `${trait.percentage}%` }}
                             transition={{ delay: index * 0.05 + 0.3, duration: 1, ease: "easeOut" }}
                           />
                         </div>
                       </div>
                       
                       {/* Description */}
                       <p className="text-white/70 text-sm font-sans leading-relaxed mb-4">
                         {config.description}
                       </p>
                       
                       {/* Feedback */}
                       <div className="bg-black/20 rounded-lg p-3 border-l-3 border-l-white/20">
                         <p className="text-white/80 text-sm font-sans italic">
                           {trait.feedback}
                         </p>
                       </div>
                     </motion.div>
                   );
                 })}
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 6, duration: 1 }}
        >
          <motion.h3 
            className="text-3xl md:text-4xl font-bold text-white mb-8"
            animate={{ 
              textShadow: [
                "0 0 20px rgba(168, 85, 247, 0.5)",
                "0 0 40px rgba(168, 85, 247, 0.8)",
                "0 0 20px rgba(168, 85, 247, 0.5)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Choose Your Path
          </motion.h3>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
            <Link href="/onboarding/goals" className="w-full sm:w-auto">
              <motion.button
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(168, 85, 247, 0.6)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                🎯 Set Your Goals
              </motion.button>
            </Link>
            
            <Link href="/dashboard" className="w-full sm:w-auto">
              <motion.button
                className="w-full px-8 py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold text-lg rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(71, 85, 105, 0.8)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                ⚡ Enter Dashboard
              </motion.button>
            </Link>
          </div>
          
          <motion.p 
            className="text-gray-400 mt-6 italic"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            "Your ascension awaits. The choice is yours."
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPage; 