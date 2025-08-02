'use client'

import { useEffect, useRef, useState } from 'react'

interface UseImageLazyLoadOptions {
  rootMargin?: string
  threshold?: number
  placeholderSrc?: string
}

export const useImageLazyLoad = (
  src: string, 
  options: UseImageLazyLoadOptions = {}
) => {
  const { rootMargin = '50px', threshold = 0.1, placeholderSrc } = options
  const [imageSrc, setImageSrc] = useState(placeholderSrc || '')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!imgRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold }
    )

    observer.observe(imgRef.current)

    return () => observer.disconnect()
  }, [rootMargin, threshold])

  useEffect(() => {
    if (isInView && src) {
      const img = new Image()
      img.onload = () => {
        setImageSrc(src)
        setIsLoaded(true)
      }
      img.onerror = () => {
        setIsLoaded(false)
      }
      img.src = src
    }
  }, [isInView, src])

  return { imageSrc, isLoaded, imgRef }
}