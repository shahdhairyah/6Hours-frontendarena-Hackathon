// Procedural Web Audio API Sound Synthesizer
// Provides interactive tactile feedback (paper rustle, receipt ticks, harmonic chimes)
// and an adaptive low-fi ambient drone without any external audio asset dependencies.

class SoundEngine {
  constructor() {
    this.ctx = null
    this.ambientGain = null
    this.isMuted = true
    this.isAmbientPlaying = false
    this.ambientNodes = []
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  toggleMute() {
    this.init()
    this.isMuted = !this.isMuted
    if (this.isMuted) {
      this.stopAmbient()
    } else {
      this.playChime(520, 'sine', 0.1)
      this.startAmbient()
    }
    return !this.isMuted
  }

  // Tactile receipt tick / typewriter click
  playTick(pitch = 1200) {
    if (this.isMuted || !this.ctx) return
    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const now = this.ctx.currentTime

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(pitch, now)
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.4, now + 0.03)

      gain.gain.setValueAtTime(0.04, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.04)
    } catch {
      // safe fallback
    }
  }

  // Soft paper rustle effect
  playPaperRustle() {
    if (this.isMuted || !this.ctx) return
    try {
      const bufferSize = this.ctx.sampleRate * 0.06
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }

      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 1400
      filter.Q.value = 1.2

      const gain = this.ctx.createGain()
      const now = this.ctx.currentTime
      gain.gain.setValueAtTime(0.025, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      noise.start(now)
      noise.stop(now + 0.06)
    } catch {
      // safe fallback
    }
  }

  // Musical / cinematic chime for story progression
  playChime(freq = 440, type = 'sine', duration = 0.8) {
    if (this.isMuted || !this.ctx) return
    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const now = this.ctx.currentTime

      osc.type = type
      osc.frequency.setValueAtTime(freq, now)

      gain.gain.setValueAtTime(0.06, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + duration)
    } catch {
      // safe fallback
    }
  }

  // Harmonic mood sonification: maps mood and energy to pentatonic musical frequencies
  playSonificationTone(mood = 'neutral', energy = 50) {
    if (this.isMuted || !this.ctx) return
    try {
      const baseFreqs = {
        melancholic: 220.0,  // A3 - deep contemplative
        anxious: 246.94,      // B3 - searching
        restless: 293.66,     // D4 - unsettled
        wistful: 329.63,      // E4 - nostalgic
        neutral: 349.23,      // F4 - ground level
        hopeful: 392.0,       // G4 - uplifting
        warm: 440.0,          // A4 - rich golden
        driven: 493.88,       // B4 - purposeful
        bright: 523.25,       // C5 - radiant
      }
      const base = baseFreqs[mood] || 392.0
      const freq = base * (0.92 + (energy / 100) * 0.16)
      this.playChime(freq, 'sine', 0.4)
    } catch {
      // safe fallback
    }
  }

  // Warm analog ambient tape drone
  startAmbient() {
    if (this.isMuted || !this.ctx || this.isAmbientPlaying) return
    try {
      this.isAmbientPlaying = true
      const now = this.ctx.currentTime

      const masterGain = this.ctx.createGain()
      masterGain.gain.setValueAtTime(0.015, now)
      masterGain.connect(this.ctx.destination)
      this.ambientGain = masterGain

      // Sub-harmonic warm chord (F# - C# - A#)
      const freqs = [92.5, 138.6, 233.1]
      this.ambientNodes = freqs.map((f) => {
        const osc = this.ctx.createOscillator()
        const filter = this.ctx.createBiquadFilter()
        const gain = this.ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(f, now)

        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(260, now)

        gain.gain.setValueAtTime(0.3, now)

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(masterGain)

        osc.start(now)
        return osc
      })
    } catch {
      // safe fallback
    }
  }

  stopAmbient() {
    if (!this.isAmbientPlaying) return
    this.isAmbientPlaying = false
    try {
      this.ambientNodes.forEach((node) => {
        try {
          node.stop()
          node.disconnect()
        } catch {
          // ignore
        }
      })
      this.ambientNodes = []
      if (this.ambientGain) {
        this.ambientGain.disconnect()
        this.ambientGain = null
      }
    } catch {
      // ignore
    }
  }
}

export const sound = new SoundEngine()
