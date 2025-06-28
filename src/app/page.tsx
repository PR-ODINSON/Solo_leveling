'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

// Particle Canvas Component
const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];

    const colors = ['#00f5ff', '#8a2be2', '#ff1493', '#00ff00', '#ffd700'];

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();

        // Draw connections
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = (100 - distance) / 100 * 0.2;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
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
      style={{ background: 'radial-gradient(ellipse at center, rgba(138, 43, 226, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)' }}
    />
  );
};

// Typewriter Component
const TypeWriter = ({ text, delay = 100 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

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

export default function LandingPage() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const features = [
    {
      icon: '⚔️',
      title: 'Quest System',
      description: 'Embark on daily missions and epic challenges',
      glow: 'shadow-cyan-500/50'
    },
    {
      icon: '📊',
      title: 'Hunter Stats',
      description: 'Level up your real-world attributes',
      glow: 'shadow-purple-500/50'
    },
    {
      icon: '🏆',
      title: 'Guild Rewards',
      description: 'Unlock exclusive perks and achievements',
      glow: 'shadow-yellow-500/50'
    },
    {
      icon: '🎒',
      title: 'Arsenal Vault',
      description: 'Collect legendary items and badges',
      glow: 'shadow-green-500/50'
    },
    {
      icon: '🌟',
      title: 'Rank System',
      description: 'Ascend from E-Rank to S-Rank Hunter',
      glow: 'shadow-pink-500/50'
    }
  ]

  const screenshots = [
    { title: 'Hunter Dashboard', desc: 'Track your progression', bg: 'from-blue-600 to-cyan-600' },
    { title: 'Quest Interface', desc: 'Accept and complete missions', bg: 'from-purple-600 to-pink-600' },
    { title: 'Inventory System', desc: 'Manage your artifacts', bg: 'from-green-600 to-emerald-600' },
    { title: 'Reward Center', desc: 'Claim your victories', bg: 'from-yellow-600 to-orange-600' }
  ]

  const steps = [
    { number: '01', title: 'Awaken', desc: 'Register as a Hunter and discover your potential' },
    { number: '02', title: 'Hunt', desc: 'Complete quests and defeat daily challenges' },
    { number: '03', title: 'Ascend', desc: 'Level up your stats and unlock new abilities' }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % screenshots.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleGateEntry = () => {
    setIsTransitioning(true);
    // Add a dramatic pause before navigation
    setTimeout(() => {
      window.location.href = '/onboarding/assessment';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Particle Background */}
      <ParticleCanvas />
      
      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black/50 to-cyan-900/20 pointer-events-none z-10" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 z-20">
        <div className="text-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-12"
          >
            <div className="relative">
              <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6 tracking-wider">
                ASCENDOS
              </h1>
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl"
                animate={{ 
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-2xl md:text-3xl text-gray-300 mb-8 font-light"
            >
              THE HUNTER'S REALITY SYSTEM
            </motion.p>
          </motion.div>

          {/* System Loading */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="mb-16"
          >
            <div className="bg-black/60 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl shadow-cyan-500/20">
              <div className="text-cyan-400 text-xl mb-4">
                <TypeWriter text="HUNTER ASSOCIATION SYSTEM ONLINE..." delay={80} />
              </div>
              <div className="text-purple-400 text-lg mb-3">
                <TypeWriter text="Welcome, potential hunter." delay={60} />
              </div>
              <div className="text-yellow-400 text-base">
                <TypeWriter text="Assessment protocol required for gate access authorization." delay={50} />
              </div>
              
              {/* Loading Bar */}
              <div className="mt-6 bg-gray-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 2, duration: 2, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>

          {/* Assessment Notice */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.8 }}
            className="mb-8"
          >
            <div className="bg-black/40 backdrop-blur-lg border border-yellow-500/30 rounded-2xl p-6 max-w-2xl mx-auto shadow-2xl shadow-yellow-500/10">
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="text-4xl mr-3"
                >
                  ⚠️
                </motion.div>
                <h3 className="text-xl font-bold text-yellow-400">HUNTER ASSESSMENT REQUIRED</h3>
              </div>
              <p className="text-gray-300 text-center leading-relaxed">
                Before entering the gate, all potential hunters must undergo the{' '}
                <span className="text-cyan-400 font-semibold">Hunter Awakening Assessment</span> to determine their 
                innate abilities and rank classification.
              </p>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.5, duration: 0.8 }}
          >
              <motion.button
                onClick={handleGateEntry}
                disabled={isTransitioning}
                className="relative group px-16 py-6 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full text-2xl font-bold overflow-hidden shadow-2xl shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!isTransitioning ? { scale: 1.05 } : {}}
                whileTap={!isTransitioning ? { scale: 0.95 } : {}}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    🌀
                  </motion.span>
                  ENTER THE GATE
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ⚡
                  </motion.span>
                </span>
                
                {/* Hover Gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Pulsing Glow */}
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full"
                  animate={{ 
                    opacity: [0, 0.3, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Border Animation */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
                  animate={{ 
                    borderColor: ['rgba(6, 182, 212, 0.5)', 'rgba(147, 51, 234, 0.5)', 'rgba(6, 182, 212, 0.5)']
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                                 />
              </motion.button>
            
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4, duration: 0.8 }}
              className="text-gray-400 mt-4 text-sm"
            >
              Begin your hunter awakening assessment
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Features Panel */}
      <section className="relative py-32 px-4 z-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-6">
              HUNTER ABILITIES
            </h2>
            <p className="text-xl text-gray-400">Unlock your true potential in the real world</p>
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
                className="relative group perspective-1000"
              >
                <div className={`bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 h-full hover:border-cyan-500/70 transition-all duration-500 shadow-2xl ${feature.glow} hover:shadow-2xl`}>
                  <div className="text-7xl mb-6 text-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-center text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-center text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Glow Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Animated Border */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100"
                    style={{ 
                      background: 'linear-gradient(45deg, transparent, transparent), linear-gradient(45deg, #00f5ff, #8a2be2)',
                      backgroundClip: 'padding-box, border-box',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshot Carousel */}
      <section className="relative py-32 px-4 z-20 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-6">
              HUNTER INTERFACE
            </h2>
            <p className="text-xl text-gray-400">Experience the next-generation RPG system</p>
          </motion.div>

          <div className="relative h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 300, rotateY: 15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -300, rotateY: -15 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className={`absolute inset-0 bg-gradient-to-br ${screenshots[currentSlide].bg} flex items-center justify-center`}
              >
      <div className="text-center">
                  <div className="text-8xl mb-4">🎮</div>
                  <h3 className="text-3xl font-bold mb-2">{screenshots[currentSlide].title}</h3>
                  <p className="text-xl opacity-80">{screenshots[currentSlide].desc}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {screenshots.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white scale-125' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-32 px-4 z-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent mb-6">
              HUNTER'S PATH
            </h2>
            <p className="text-xl text-gray-400">Your journey from E-Rank to S-Rank Hunter</p>
          </motion.div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-500 to-purple-500 opacity-30" />
            
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.3 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-20 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Step Number */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold shadow-2xl"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {step.number}
                  </motion.div>
                </div>
                
                {/* Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-16' : 'text-left pl-16'}`}>
                  <motion.div
                    className="bg-black/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl"
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {step.desc}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-4 z-20 bg-gradient-to-r from-purple-900/30 to-cyan-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-7xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-8">
              READY TO ASCEND?
            </h2>
            <p className="text-2xl text-gray-300 mb-16 leading-relaxed">
              Join the elite ranks of Hunters who've transformed<br />
              their reality into an epic adventure
            </p>
            
            <Link href="/onboarding/assessment">
              <motion.button
                className="relative group px-20 py-8 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full text-3xl font-bold overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">BEGIN ASSESSMENT</span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ 
                    opacity: [0, 0.5, 0],
                    scale: [1, 1.5, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-cyan-500/50 to-purple-500/50 blur-2xl opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-4 z-20 bg-black/60 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
                ASCENDOS
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                The ultimate reality RPG system that transforms your daily life into an epic hunter's journey.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 text-white">Hunter Portal</h4>
              <div className="space-y-3">
                <Link href="/dashboard" className="block text-gray-400 hover:text-cyan-400 transition-colors">Dashboard</Link>
                <Link href="/quests" className="block text-gray-400 hover:text-cyan-400 transition-colors">Quests</Link>
                <Link href="/rewards" className="block text-gray-400 hover:text-cyan-400 transition-colors">Rewards</Link>
                <Link href="/inventory" className="block text-gray-400 hover:text-cyan-400 transition-colors">Inventory</Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 text-white">Connect</h4>
              <div className="flex space-x-6">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="text-3xl text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  🐦
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  className="text-3xl text-gray-400 hover:text-purple-400 transition-colors"
                >
                  💼
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="text-3xl text-gray-400 hover:text-pink-400 transition-colors"
                >
                  🐙
                </motion.a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800/50 pt-8 text-center">
            <p className="text-gray-400 mb-2 text-lg">
              Crafted by <span className="text-cyan-400 font-bold">Prithviraj Verma</span>
            </p>
            <p className="text-gray-500">
              Inspired by Solo Leveling • Hunter Association © 2024
            </p>
          </div>
      </div>
      </footer>

      {/* Gate Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <motion.div
                className="text-8xl mb-8"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🌀
              </motion.div>
              
              <motion.h2
                className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                ACCESSING HUNTER GATE
              </motion.h2>
              
              <motion.p
                className="text-xl text-gray-400 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                Initiating Hunter Assessment Protocol...
              </motion.p>
              
              <motion.div
                className="w-64 h-2 bg-gray-800 rounded-full mx-auto overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.2, duration: 1.5, ease: "easeInOut" }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 