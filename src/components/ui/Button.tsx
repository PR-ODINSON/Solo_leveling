'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { useSoundSystem } from '../SoundSystem'
import { cn } from '../../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  soundEffect?: boolean
  children: React.ReactNode
}

const buttonVariants = {
  primary: 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:from-cyan-700 hover:to-purple-700 focus:ring-cyan-500/50',
  secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 focus:ring-gray-500/50',
  success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 focus:ring-green-500/50',
  danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500/50',
  ghost: 'bg-transparent text-blue-300 hover:bg-blue-500/10 hover:text-blue-200 focus:ring-blue-500/50 border border-blue-500/30'
}

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm min-h-[32px]',
  md: 'px-4 py-2 text-base min-h-[40px]',
  lg: 'px-6 py-3 text-lg min-h-[48px]',
  xl: 'px-8 py-4 text-xl min-h-[56px]'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    soundEffect = true,
    children, 
    onClick,
    onMouseEnter,
    ...props 
  }, ref) => {
    const { playSound } = useSoundSystem()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (soundEffect) playSound('click')
      onClick?.(e)
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (soundEffect) playSound('hover')
      onMouseEnter?.(e)
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 touch-manipulation overflow-hidden shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        whileHover={!props.disabled && !isLoading ? { scale: 1.02, y: -1 } : {}}
        whileTap={!props.disabled && !isLoading ? { scale: 0.98 } : {}}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
        
        {/* Button content */}
        <span className={cn('relative z-10 flex items-center justify-center gap-2', isLoading && 'opacity-0')}>
          {children}
        </span>
        
        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 bg-white/10 opacity-0 rounded-xl"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      </motion.button>
    )
  }
)

Button.displayName = 'Button'