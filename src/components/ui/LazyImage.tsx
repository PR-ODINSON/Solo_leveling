'use client'

import { forwardRef, ImgHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { useImageLazyLoad } from '../../hooks/useImageLazyLoad'
import { cn } from '../../lib/utils'

interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string
  placeholderSrc?: string
  fallbackSrc?: string
}

export const LazyImage = forwardRef<HTMLImageElement, LazyImageProps>(
  ({ 
    src, 
    placeholderSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
    fallbackSrc,
    className,
    alt,
    ...props 
  }, ref) => {
    const { imageSrc, isLoaded, imgRef } = useImageLazyLoad(src, { placeholderSrc })

    return (
      <div className={cn('relative overflow-hidden', className)}>
        <motion.img
          ref={(node) => {
            if (typeof ref === 'function') ref(node)
            else if (ref) ref.current = node
            if (imgRef) imgRef.current = node
          }}
          src={imageSrc || placeholderSrc}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-70'
          )}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: isLoaded ? 1 : 0.7,
            scale: isLoaded ? 1 : 1.1
          }}
          transition={{ duration: 0.5 }}
          onError={(e) => {
            if (fallbackSrc) {
              (e.target as HTMLImageElement).src = fallbackSrc
            }
          }}
          {...props}
        />
        
        {/* Loading spinner overlay */}
        {!isLoaded && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-gray-900/50"
            initial={{ opacity: 1 }}
            animate={{ opacity: isLoaded ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </div>
    )
  }
)

LazyImage.displayName = 'LazyImage'