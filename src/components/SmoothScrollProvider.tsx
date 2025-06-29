'use client'

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

interface SmoothScrollContextType {
  scrollY: number
  scrollProgress: number
  isScrolling: boolean
  scrollDirection: 'up' | 'down' | null
  scrollToTop: () => void
  scrollToBottom: () => void
  scrollToElement: (elementId: string) => void
}

const SmoothScrollContext = createContext<SmoothScrollContextType | null>(null)

export const useSmoothScrollContext = () => {
  const context = useContext(SmoothScrollContext)
  if (!context) {
    throw new Error('useSmoothScrollContext must be used within SmoothScrollProvider')
  }
  return context
}

interface SmoothScrollProviderProps {
  children: ReactNode
  showScrollIndicator?: boolean
  enableScrollRestoration?: boolean
}

export const SmoothScrollProvider = ({ 
  children, 
  showScrollIndicator = true,
  enableScrollRestoration = true 
}: SmoothScrollProviderProps) => {
  const [scrollY, setScrollY] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Enhanced scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      setIsScrolling(true)

      // Determine scroll direction
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down')
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up')
      }
      lastScrollY.current = currentScrollY

      // Clear existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }

      // Set scrolling to false after scroll ends
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false)
        setScrollDirection(null)
      }, 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [])

  // Scroll restoration on page load
  useEffect(() => {
    if (!enableScrollRestoration) return

    const restoreScrollPosition = () => {
      const savedPosition = sessionStorage.getItem('scrollPosition')
      if (savedPosition) {
        const position = parseInt(savedPosition, 10)
        setTimeout(() => {
          window.scrollTo({
            top: position,
            behavior: 'smooth'
          })
        }, 100)
      }
    }

    // Save scroll position before unload
    const saveScrollPosition = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString())
    }

    window.addEventListener('beforeunload', saveScrollPosition)
    restoreScrollPosition()

    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition)
    }
  }, [enableScrollRestoration])

  // Smooth scroll functions
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    })
  }

  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      const headerOffset = 80 // Account for fixed headers
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 100])

  const contextValue: SmoothScrollContextType = {
    scrollY,
    scrollProgress: scrollProgress.get(),
    isScrolling,
    scrollDirection,
    scrollToTop,
    scrollToBottom,
    scrollToElement
  }

  return (
    <SmoothScrollContext.Provider value={contextValue}>
      <div className="smooth-scroll">
        {/* Scroll Progress Indicator */}
        {showScrollIndicator && (
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 origin-left z-50"
            style={{ scaleX }}
            initial={{ scaleX: 0 }}
          />
        )}

        {/* Scroll to Top Button */}
        <motion.button
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 z-40"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: scrollY > 400 ? 1 : 0,
            scale: scrollY > 400 ? 1 : 0
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 19V5M5 12L12 5L19 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>

        {/* Enhanced scroll container */}
        <div className="scroll-container">
          {children}
        </div>
      </div>
    </SmoothScrollContext.Provider>
  )
}

// Scroll-triggered animation component
interface ScrollRevealProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  duration?: number
  distance?: number
  className?: string
}

export const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 50,
  className = ''
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance }
      case 'down':
        return { y: -distance }
      case 'left':
        return { x: distance }
      case 'right':
        return { x: -distance }
      default:
        return { y: distance }
    }
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        ...getInitialPosition()
      }}
      animate={isInView ? {
        opacity: 1,
        x: 0,
        y: 0
      } : {}}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.25, 0.25, 0.75]
      }}
    >
      {children}
    </motion.div>
  )
}

// Parallax scroll component
interface ParallaxScrollProps {
  children: ReactNode
  speed?: number
  className?: string
}

export const ParallaxScroll = ({ 
  children, 
  speed = 0.5, 
  className = '' 
}: ParallaxScrollProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y }}
    >
      {children}
    </motion.div>
  )
}

export default SmoothScrollProvider 