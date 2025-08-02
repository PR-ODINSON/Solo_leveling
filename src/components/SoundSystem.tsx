'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface SoundContextType {
  soundEnabled: boolean
  toggleSound: () => void
  playSound: (type: SoundType) => void
}

type SoundType = 'xp' | 'levelup' | 'quest_complete' | 'click' | 'hover' | 'success' | 'error'

const SoundContext = createContext<SoundContextType | undefined>(undefined)

export const useSoundSystem = () => {
  const context = useContext(SoundContext)
  if (!context) {
    throw new Error('useSoundSystem must be used within a SoundProvider')
  }
  return context
}

interface SoundProviderProps {
  children: ReactNode
}

export const SoundProvider = ({ children }: SoundProviderProps) => {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  const initAudioContext = useCallback(() => {
    if (!audioContext && typeof window !== 'undefined') {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      setAudioContext(ctx)
      return ctx
    }
    return audioContext
  }, [audioContext])

  const generateSound = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1) => {
    const ctx = initAudioContext()
    if (!ctx || !soundEnabled) return

    // Resume context if suspended (required by many browsers)
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
    oscillator.type = type
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  }, [initAudioContext, soundEnabled])

  const playSound = useCallback((type: SoundType) => {
    if (!soundEnabled) return
    
    switch (type) {
      case 'xp':
        // Ascending chime for XP gain
        generateSound(523, 0.2) // C5
        setTimeout(() => generateSound(659, 0.2), 100) // E5
        setTimeout(() => generateSound(784, 0.3), 200) // G5
        break
        
      case 'levelup':
        // Epic level up fanfare
        generateSound(261, 0.3, 'square') // C4
        setTimeout(() => generateSound(392, 0.3, 'square'), 150) // G4
        setTimeout(() => generateSound(523, 0.4, 'square'), 300) // C5
        setTimeout(() => generateSound(659, 0.5, 'triangle'), 450) // E5
        break
        
      case 'quest_complete':
        // Success sound
        generateSound(440, 0.2) // A4
        setTimeout(() => generateSound(554, 0.3), 100) // C#5
        break
        
      case 'click':
        // Subtle click sound
        generateSound(800, 0.1, 'square', 0.05)
        break
        
      case 'hover':
        // Gentle hover sound
        generateSound(600, 0.05, 'sine', 0.03)
        break
        
      case 'success':
        // Success confirmation
        generateSound(698, 0.2) // F5
        setTimeout(() => generateSound(880, 0.3), 150) // A5
        break
        
      case 'error':
        // Error sound
        generateSound(220, 0.3, 'square', 0.08) // A3
        setTimeout(() => generateSound(185, 0.4, 'square', 0.08), 200) // F#3
        break
    }
  }, [generateSound, soundEnabled])

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev)
    playSound('click')
  }, [playSound])

  // Initialize audio context on first user interaction
  const handleFirstInteraction = useCallback(() => {
    initAudioContext()
    document.removeEventListener('click', handleFirstInteraction)
    document.removeEventListener('keydown', handleFirstInteraction)
  }, [initAudioContext])

  // Add event listeners for first user interaction
  if (typeof window !== 'undefined' && !audioContext) {
    document.addEventListener('click', handleFirstInteraction, { once: true })
    document.addEventListener('keydown', handleFirstInteraction, { once: true })
  }

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, playSound }}>
      {children}
    </SoundContext.Provider>
  )
}