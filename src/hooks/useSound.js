import { useState, useCallback, useEffect } from 'react'
import { sound } from '../audio/soundEngine'

/**
 * Custom hook for procedural audio synthesis and Web Speech API narrator.
 */
export function useSound() {
  const [isAudioActive, setIsAudioActive] = useState(false)
  const [isNarrating, setIsNarrating] = useState(false)
  const [activeNarratorParagraph, setActiveNarratorParagraph] = useState(null)

  const toggleSound = useCallback(() => {
    const active = sound.toggleMute()
    setIsAudioActive(active)
    return active
  }, [])

  const playTick = useCallback((pitch = 1200) => {
    sound.playTick(pitch)
  }, [])

  const playPaperRustle = useCallback(() => {
    sound.playPaperRustle()
  }, [])

  const playChime = useCallback((freq = 440, type = 'sine', duration = 0.8) => {
    sound.playChime(freq, type, duration)
  }, [])

  const playSonification = useCallback((mood, energy) => {
    sound.playSonificationTone(mood, energy)
  }, [])

  // Web Speech API Native Narrator for Chapter Prose
  const speakParagraphs = useCallback(
    (paragraphs, onParagraphChange, onComplete) => {
      if (!window.speechSynthesis) return

      window.speechSynthesis.cancel()
      if (isNarrating) {
        setIsNarrating(false)
        setActiveNarratorParagraph(null)
        return
      }

      setIsNarrating(true)
      let pIdx = 0

      const speakNext = () => {
        if (pIdx >= paragraphs.length) {
          setIsNarrating(false)
          setActiveNarratorParagraph(null)
          if (onComplete) onComplete()
          return
        }

        const text = paragraphs[pIdx]
        setActiveNarratorParagraph(pIdx)
        if (onParagraphChange) onParagraphChange(pIdx)

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.95
        utterance.pitch = 1.0

        utterance.onend = () => {
          pIdx++
          speakNext()
        }

        utterance.onerror = () => {
          setIsNarrating(false)
          setActiveNarratorParagraph(null)
        }

        window.speechSynthesis.speak(utterance)
      }

      speakNext()
    },
    [isNarrating]
  )

  const stopNarration = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsNarrating(false)
    setActiveNarratorParagraph(null)
  }, [])

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  return {
    isAudioActive,
    toggleSound,
    playTick,
    playPaperRustle,
    playChime,
    playSonification,
    isNarrating,
    activeNarratorParagraph,
    speakParagraphs,
    stopNarration,
  }
}
