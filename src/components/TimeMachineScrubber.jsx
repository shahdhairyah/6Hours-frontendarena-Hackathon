import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Clock, Play, Pause, RotateCcw, MapPin, Sparkles } from 'lucide-react'
import { fmtDate, fmtTime } from '../utils/formatters'
import { sound } from '../audio/soundEngine'

/**
 * TimeMachineScrubber: Innovative interactive chronological scrubber with procedural harmonic sonification.
 */
export function TimeMachineScrubber({ receipts, chapters, onSelectReceipt }) {
  const [scrubIndex, setScrubIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const timerRef = useRef(null)

  const sortedReceipts = useMemo(() => {
    return [...receipts].sort((a, b) => a.dt - b.dt)
  }, [receipts])

  const total = sortedReceipts.length
  const currentReceipt = sortedReceipts[Math.min(scrubIndex, total - 1)] || sortedReceipts[0]

  // Find chapter for current receipt
  const currentChapter = useMemo(() => {
    if (!currentReceipt || !chapters) return null
    return (
      chapters.find(
        (ch) => currentReceipt.dt >= ch.start && currentReceipt.dt <= ch.end
      ) || chapters[0]
    )
  }, [currentReceipt, chapters])

  // Playback timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setScrubIndex((prev) => {
          if (prev >= total - 1) {
            setIsPlaying(false)
            return prev
          }
          const next = prev + 1
          const nextReceipt = sortedReceipts[next]
          if (nextReceipt) {
            sound.playSonificationTone(nextReceipt.mood, nextReceipt.energy)
          }
          return next
        })
      }, 350)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, total, sortedReceipts])

  const handleSliderChange = (e) => {
    const val = Number(e.target.value)
    setScrubIndex(val)
    const r = sortedReceipts[val]
    if (r) {
      sound.playSonificationTone(r.mood, r.energy)
    }
  }

  const togglePlayback = () => {
    if (scrubIndex >= total - 1) {
      setScrubIndex(0)
    }
    sound.playTick(1200)
    setIsPlaying(!isPlaying)
  }

  const resetScrubber = () => {
    sound.playTick(1000)
    setIsPlaying(false)
    setScrubIndex(0)
  }

  if (!currentReceipt) return null

  const progressPct = ((scrubIndex / (total - 1)) * 100).toFixed(1)

  return (
    <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-b from-[#0e1017] to-[#07080b] p-6 shadow-2xl space-y-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute -right-20 -top-20 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: currentReceipt.isNight ? '#6366f1' : '#f59e0b' }}
      />

      {/* Header bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
          <Clock className="w-4 h-4 animate-spin-slow" aria-hidden="true" />
          <span className="font-bold tracking-wider uppercase">18-Month Chronological Time Machine</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px]">
            Sonified
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetScrubber}
            title="Reset to Start"
            aria-label="Reset timeline to start"
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={togglePlayback}
            aria-label={isPlaying ? 'Pause timeline playback' : 'Play timeline playback'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-zinc-950 font-mono text-xs font-bold hover:bg-amber-300 transition-colors shadow-md shadow-amber-400/20 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Scrub Life ({progressPct}%)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Slider Track */}
      <div className="space-y-1.5">
        <input
          type="range"
          min="0"
          max={total - 1}
          value={scrubIndex}
          onChange={handleSliderChange}
          aria-label="Time machine slider across 466 receipts"
          className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-ew-resize accent-amber-400 focus:outline-none"
        />
        <div className="flex justify-between text-[10px] font-mono text-zinc-400">
          <span>{fmtDate(sortedReceipts[0]?.dt)}</span>
          <span className="text-amber-400 font-bold">
            Moment {scrubIndex + 1} of {total}
          </span>
          <span>{fmtDate(sortedReceipts[total - 1]?.dt)}</span>
        </div>
      </div>

      {/* Real-Time Scrubbing HUD Card */}
      <div
        onClick={() => onSelectReceipt && onSelectReceipt(currentReceipt)}
        className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-700/60 hover:border-amber-400/50 transition-all cursor-pointer group flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
            <span className="text-zinc-400">{fmtDate(currentReceipt.dt)} · {fmtTime(currentReceipt.dt)}</span>
            {currentChapter && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-zinc-200">
                {currentChapter.name}
              </span>
            )}
            {currentReceipt.city && (
              <span className="flex items-center gap-1 text-emerald-400 text-xs">
                <MapPin className="w-3 h-3" />
                {currentReceipt.city}
              </span>
            )}
            <span className="text-amber-400 uppercase text-[10px] font-bold">
              {currentReceipt.mood} ({currentReceipt.energy}% Energy)
            </span>
          </div>

          <h4 className="font-mono text-sm sm:text-base font-bold text-zinc-100 group-hover:text-amber-300 transition-colors line-clamp-1">
            {currentReceipt.heading}
          </h4>

          {currentReceipt.body && (
            <p className="font-mono text-xs text-zinc-400 line-clamp-1">
              {currentReceipt.body}
            </p>
          )}
        </div>

        <button
          type="button"
          className="shrink-0 px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-200 group-hover:bg-amber-400 group-hover:text-zinc-950 font-mono text-xs font-bold transition-all flex items-center gap-1"
        >
          <span>Inspect Slip</span>
          <Sparkles className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
