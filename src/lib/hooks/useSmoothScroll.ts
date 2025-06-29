import { useCallback, useRef } from 'react'

interface ScrollOptions {
  duration?: number
  easing?: 'easeInOut' | 'easeIn' | 'easeOut' | 'linear'
  offset?: number
}

interface ScrollToOptions extends ScrollOptions {
  behavior?: 'smooth' | 'auto'
}

export const useSmoothScroll = () => {
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const easeInOutQuad = useCallback((t: number): number => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }, [])

  const easeInQuad = useCallback((t: number): number => {
    return t * t
  }, [])

  const easeOutQuad = useCallback((t: number): number => {
    return t * (2 - t)
  }, [])

  const linear = useCallback((t: number): number => {
    return t
  }, [])

  const getEasingFunction = useCallback((easing: string) => {
    switch (easing) {
      case 'easeIn':
        return easeInQuad
      case 'easeOut':
        return easeOutQuad
      case 'linear':
        return linear
      case 'easeInOut':
      default:
        return easeInOutQuad
    }
  }, [easeInOutQuad, easeInQuad, easeOutQuad, linear])

  const scrollToPosition = useCallback((
    targetPosition: number,
    options: ScrollOptions = {}
  ) => {
    const {
      duration = 800,
      easing = 'easeInOut',
      offset = 0
    } = options

    const startPosition = window.pageYOffset
    const distance = targetPosition - startPosition + offset
    const easingFunction = getEasingFunction(easing)
    let startTime: number | null = null

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      const easedProgress = easingFunction(progress)

      window.scrollTo(0, startPosition + distance * easedProgress)

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }, [getEasingFunction])

  const scrollToElement = useCallback((
    element: HTMLElement | string,
    options: ScrollOptions = {}
  ) => {
    const targetElement = typeof element === 'string' 
      ? document.querySelector(element) as HTMLElement
      : element

    if (!targetElement) {
      console.warn('Element not found for smooth scroll')
      return
    }

    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset
    scrollToPosition(elementPosition, options)
  }, [scrollToPosition])

  const scrollToTop = useCallback((options: ScrollOptions = {}) => {
    scrollToPosition(0, options)
  }, [scrollToPosition])

  const scrollToBottom = useCallback((options: ScrollOptions = {}) => {
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    )
    const windowHeight = window.innerHeight
    scrollToPosition(documentHeight - windowHeight, options)
  }, [scrollToPosition])

  const scrollIntoView = useCallback((
    element: HTMLElement | string,
    options: ScrollToOptions = {}
  ) => {
    const targetElement = typeof element === 'string' 
      ? document.querySelector(element) as HTMLElement
      : element

    if (!targetElement) {
      console.warn('Element not found for scroll into view')
      return
    }

    // Use native scrollIntoView for better performance if no custom options
    if (!options.duration && !options.easing) {
      targetElement.scrollIntoView({
        behavior: options.behavior || 'smooth',
        block: 'start',
        inline: 'nearest'
      })
      return
    }

    // Use custom smooth scroll for advanced options
    scrollToElement(targetElement, options)
  }, [scrollToElement])

  const scrollToSection = useCallback((
    sectionId: string,
    options: ScrollOptions = {}
  ) => {
    const section = document.getElementById(sectionId)
    if (section) {
      scrollToElement(section, options)
    }
  }, [scrollToElement])

  // Smooth scroll with momentum and physics
  const smoothScrollWithMomentum = useCallback((
    targetPosition: number,
    options: ScrollOptions & { momentum?: number } = {}
  ) => {
    const {
      duration = 1200,
      momentum = 0.1,
      offset = 0
    } = options

    const startPosition = window.pageYOffset
    const distance = targetPosition - startPosition + offset
    let currentVelocity = 0
    let currentPosition = startPosition
    let startTime: number | null = null

    const animateWithMomentum = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)

      // Apply momentum-based easing
      const targetVelocity = (distance * (1 - progress)) * momentum
      currentVelocity += (targetVelocity - currentVelocity) * 0.1
      currentPosition += currentVelocity

      window.scrollTo(0, currentPosition)

      if (progress < 1 && Math.abs(currentVelocity) > 0.1) {
        requestAnimationFrame(animateWithMomentum)
      } else {
        // Ensure we end at the exact target
        window.scrollTo(0, targetPosition + offset)
      }
    }

    requestAnimationFrame(animateWithMomentum)
  }, [])

  // Debounced scroll to prevent excessive calls
  const debouncedScrollTo = useCallback((
    target: HTMLElement | string | number,
    options: ScrollOptions = {},
    delay: number = 100
  ) => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (typeof target === 'number') {
        scrollToPosition(target, options)
      } else {
        scrollToElement(target, options)
      }
    }, delay)
  }, [scrollToPosition, scrollToElement])

  return {
    scrollToPosition,
    scrollToElement,
    scrollToTop,
    scrollToBottom,
    scrollIntoView,
    scrollToSection,
    smoothScrollWithMomentum,
    debouncedScrollTo
  }
}

export default useSmoothScroll 