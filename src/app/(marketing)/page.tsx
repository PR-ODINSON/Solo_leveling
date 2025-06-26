'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

// Animated Background Component
const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      color: string;
    }> = [];

    const colors = ['#00f5ff', '#8a2be2', '#ff1493', '#00ff00', '#ffd700'];

    // Create stars
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = -10;
          star.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity;
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = star.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(138, 43, 226, 0.15) 0%, rgba(0, 0, 0, 0.9) 70%)'
      }}
    />
  );
};

// Typewriter Component
const TypeWriter = ({ 
  texts, 
  delay = 100, 
  pauseTime = 2000 
}: { 
  texts: string[]; 
  delay?: number; 
  pauseTime?: number; 
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[currentTextIndex];
    
    if (!isDeleting && currentIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && currentIndex === currentText.length) {
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseTime);
      return () => clearTimeout(timeout);
    } else if (isDeleting && currentIndex > 0) {
      const timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, currentIndex - 1));
        setCurrentIndex(prev => prev - 1);
      }, delay / 2);
      return () => clearTimeout(timeout);
    } else if (isDeleting && currentIndex === 0) {
      setIsDeleting(false);
      setCurrentTextIndex(prev => (prev + 1) % texts.length);
    }
  }, [currentIndex, currentTextIndex, isDeleting, texts, delay, pauseTime]);

  return (
    <span className="font-mono">
      {displayText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="text-cyan-400"
      >
        |
      </motion.span>
    </span>
  );
};

// Floating Orb Component
const FloatingOrb = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-xl"
    animate={{
      x: [0, 100, -50, 0],
      y: [0, -100, 50, 0],
      scale: [1, 1.2, 0.8, 1],
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  />
);

export default function MarketingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const [currentPreview, setCurrentPreview] = useState(0);

  const features = [
    {
      icon: '📘',
      title: 'Epic Quests',
      description: 'Transform daily tasks into legendary missions with XP rewards',
      gradient: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/50'
    },
    {
      icon: '🧠',
      title: 'Hunter Stats',
      description: 'Level up your mind, body, and spirit with tracked progression',
      gradient: 'from-purple-500 to-pink-500',
      glow: 'shadow-purple-500/50'
    },
    {
      icon: '🏅',
      title: 'Victory Rewards',
      description: 'Unlock meaningful real-world perks for your achievements',
      gradient: 'from-yellow-500 to-orange-500',
      glow: 'shadow-yellow-500/50'
    },
    {
      icon: '🎒',
      title: 'Legend Vault',
      description: 'Collect rare titles, badges, and artifacts of your journey',
      gradient: 'from-green-500 to-emerald-500',
      glow: 'shadow-green-500/50'
    },
    {
      icon: '🎮',
      title: 'Hunter Interface',
      description: 'Immersive Solo Leveling inspired command center',
      gradient: 'from-red-500 to-rose-500',
      glow: 'shadow-red-500/50'
    }
  ];

  const previews = [
    { 
      title: 'Hunter Command Center', 
      desc: 'Monitor your level, stats, and legendary progress',
      route: '/dashboard',
      bg: 'from-blue-600 to-cyan-600'
    },
    { 
      title: 'Quest Terminal', 
      desc: 'Accept daily missions and epic challenges',
      route: '/quests',
      bg: 'from-purple-600 to-pink-600'
    },
    { 
      title: 'Victory Hall', 
      desc: 'Claim your hard-earned rewards and trophies',
      route: '/rewards',
      bg: 'from-yellow-600 to-orange-600'
    },
    { 
      title: 'Arsenal Vault', 
      desc: 'Manage your collection of legendary artifacts',
      route: '/inventory',
      bg: 'from-green-600 to-emerald-600'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Awaken Your Hunter',
      description: 'Create your profile and distribute skill points across life domains',
      icon: '⚡'
    },
    {
      number: '02', 
      title: 'Conquer Daily Quests',
      description: 'Complete missions, defeat challenges, and watch your XP soar',
      icon: '⚔️'
    },
    {
      number: '03',
      title: 'Ascend to Legend',
      description: 'Build unstoppable habits and unlock your true potential',
      icon: '🏆'
    }
  ];

  const typewriterTexts = [
    "Hunter System Online... 57%...",
    "Loading Guild Database...",
    "Initialization Complete... Welcome, Legend."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPreview((prev) => (prev + 1) % previews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <FloatingOrb delay={0} />
        <FloatingOrb delay={5} />
        <FloatingOrb delay={10} />
      </div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-black/60 to-cyan-900/10 pointer-events-none z-20" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 z-30">
        <div className="text-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="mb-12"
          >
            <div className="relative">
              <h1 className="text-7xl md:text-9xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6 tracking-wider">
                ASCENDOS
              </h1>
              <motion.div
                className="absolute -inset-8 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl rounded-full"
                animate={{ 
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-3xl md:text-4xl text-gray-300 mb-4 font-light"
            >
              Level Up Your Reality
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-400 mb-12"
            >
              Where every goal becomes an epic quest, every habit a legendary skill
            </motion.p>
          </motion.div>

          {/* Typewriter Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 1 }}
            className="mb-16"
          >
            <div className="bg-black/60 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl shadow-cyan-500/20">
              <div className="text-cyan-400 text-lg md:text-xl">
                <TypeWriter texts={typewriterTexts} delay={80} pauseTime={1500} />
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6 bg-gray-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 3, duration: 3, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>

          {/* Hero CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4, duration: 0.8 }}
          >
            <Link href="/login">
              <motion.button
                className="relative group px-16 py-6 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full text-2xl font-bold overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Begin Your Ascension</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                {/* Enhanced Glow Effect */}
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-cyan-500/50 to-purple-500/50 blur-xl opacity-0 group-hover:opacity-100 rounded-full"
                  transition={{ duration: 0.3 }}
                />
                {/* Particle Effect */}
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  animate={{ 
                    opacity: [0, 0.3, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-32 px-4 z-30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-6">
              Forge Your Legend
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Master the ancient art of self-improvement through our legendary RPG system
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 100, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -20, 
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className="relative group"
              >
                <div className={`bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 h-full hover:border-cyan-500/70 transition-all duration-500 shadow-2xl ${feature.glow} hover:shadow-2xl`}>
                  <div className="text-6xl mb-6 text-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-center text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-center text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Animated Gradient Border */}
                  <motion.div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enter Your Command Center */}
      <section className="relative py-32 px-4 z-30 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-6">
              Enter Your Command Center
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto">
              A sleek, RPG-inspired dashboard crafted to track your growth, quests, and real-world victories
            </p>
          </motion.div>

          {/* Main Preview Display */}
          <div className="relative h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 mb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPreview}
                initial={{ opacity: 0, x: 300, rotateY: 15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -300, rotateY: -15 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className={`absolute inset-0 bg-gradient-to-br ${previews[currentPreview].bg} flex items-center justify-center`}
              >
                <div className="text-center">
                  <div className="text-8xl mb-6">🎮</div>
                  <h3 className="text-4xl font-bold mb-4">{previews[currentPreview].title}</h3>
                  <p className="text-xl opacity-90 mb-6">{previews[currentPreview].desc}</p>
                  <Link href={previews[currentPreview].route}>
                    <motion.button
                      className="px-8 py-3 bg-white/20 backdrop-blur-sm rounded-full font-semibold hover:bg-white/30 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Access {previews[currentPreview].title}
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Preview Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {previews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPreview(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentPreview 
                      ? 'bg-white scale-125' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Horizontal Scrolling Preview Cards */}
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {previews.map((preview, index) => (
              <motion.div
                key={preview.title}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-80"
              >
                <div className="bg-black/60 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300">
                  <div className={`aspect-video bg-gradient-to-br ${preview.bg} rounded-lg mb-4 flex items-center justify-center`}>
                    <div className="text-4xl">🎮</div>
                  </div>
                  <h4 className="text-lg font-bold mb-2">{preview.title}</h4>
                  <p className="text-gray-400 text-sm">{preview.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-32 px-4 z-30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent mb-6">
              The Path to Ascension
            </h2>
            <p className="text-xl text-gray-400">
              Three legendary steps to transform your ordinary life into an epic adventure
            </p>
          </motion.div>

          <div className="relative">
            {/* Flowing Connection Lines */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-cyan-500 to-purple-500 opacity-30 transform -translate-y-1/2 hidden lg:block" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.3 }}
                  viewport={{ once: true }}
                  className="relative text-center"
                >
                  {/* Step Number Circle */}
                  <motion.div
                    className="relative z-10 w-24 h-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold shadow-2xl mx-auto mb-8"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-white">{step.number}</span>
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-full"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  
                  {/* Step Icon */}
                  <div className="text-6xl mb-6">{step.icon}</div>
                  
                  {/* Step Content */}
                  <motion.div
                    className="bg-black/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl"
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-4 z-30 bg-gradient-to-r from-purple-900/20 to-cyan-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-8">
              Your Legend Awaits
            </h2>
            <p className="text-2xl text-gray-300 mb-16 leading-relaxed">
              Join the elite guild of hunters who've transformed their daily routines<br />
              into legendary quests with epic rewards
            </p>
            
            <Link href="/login">
              <motion.button
                className="relative group px-20 py-8 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full text-3xl font-bold overflow-hidden shadow-2xl border-2 border-transparent hover:border-cyan-400/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Claim Your Destiny</span>
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  animate={{ 
                    opacity: [0, 0.3, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-cyan-500/50 to-purple-500/50 blur-2xl opacity-0 group-hover:opacity-100 rounded-full"
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-4 z-30 bg-black/80 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
                AscendOS
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                The legendary productivity system that transforms your daily life into an epic RPG adventure where every goal becomes a quest worth conquering.
              </p>
              <div className="flex space-x-6">
                <motion.a
                  href="https://github.com/prithviverma"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="text-2xl text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  🐙
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/prithviverma"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="text-2xl text-gray-400 hover:text-blue-400 transition-colors"
                >
                  💼
                </motion.a>
                <motion.a
                  href="https://medium.com/@prithviverma"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="text-2xl text-gray-400 hover:text-green-400 transition-colors"
                >
                  📝
                </motion.a>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 text-white">Hunter Portal</h4>
              <div className="space-y-3">
                <Link href="/login" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                  Begin Quest
                </Link>
                <Link href="/dashboard" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                  Command Center
                </Link>
                <Link href="/quests" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                  Quest Terminal
                </Link>
                <Link href="/rewards" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                  Victory Hall
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800/50 pt-8 text-center">
            <p className="text-gray-400 mb-2 text-lg">
              Forged with ⚡ by <span className="text-cyan-400 font-bold">@Prithvi Verma</span>
            </p>
            <p className="text-gray-500">
              Inspired by Solo Leveling & Cyberpunk Interfaces • © 2024 AscendOS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 