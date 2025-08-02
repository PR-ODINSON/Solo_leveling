'use client'

import { forwardRef, HTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'quest' | 'stat' | 'profile'
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'yellow'
  interactive?: boolean
  children: React.ReactNode
}

const cardVariants = {
  default: 'bg-white/5 backdrop-blur-xl border border-white/10',
  quest: 'bg-black/40 backdrop-blur-lg border border-cyan-500/30',
  stat: 'bg-slate-900/60 backdrop-blur-20 border border-blue-400/20',
  profile: 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-400/30'
}

const glowColors = {
  blue: 'hover:border-blue-400/40 hover:shadow-blue-500/20',
  purple: 'hover:border-purple-400/40 hover:shadow-purple-500/20',
  green: 'hover:border-green-400/40 hover:shadow-green-500/20',
  red: 'hover:border-red-400/40 hover:shadow-red-500/20',
  yellow: 'hover:border-yellow-400/40 hover:shadow-yellow-500/20'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default', 
    glowColor = 'blue',
    interactive = false,
    children, 
    ...props 
  }, ref) => {
    const Component = interactive ? motion.div : 'div'

    const motionProps = interactive ? {
      whileHover: { y: -4, scale: 1.02 },
      transition: { duration: 0.2 }
    } : {}

    return (
      <Component
        ref={ref}
        className={cn(
          'rounded-2xl p-6 shadow-2xl transition-all duration-300 relative overflow-hidden',
          cardVariants[variant],
          interactive && glowColors[glowColor],
          className
        )}
        {...motionProps}
        {...props}
      >
        {/* Gradient overlay for enhanced depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Animated border for interactive cards */}
        {interactive && (
          <motion.div
            className="absolute inset-0 rounded-2xl border border-transparent"
            style={{
              background: 'linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent)',
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        )}
      </Component>
    )
  }
)

Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-4', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-xl font-bold text-white leading-none tracking-tight', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-gray-300', className)}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4', className)}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'