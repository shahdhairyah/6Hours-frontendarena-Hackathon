import { useState, useEffect } from 'react'
import {
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Volume2,
  Calendar,
  Clock,
  MapPin,
  Heart
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { sound } from '../audio/soundEngine'
import { TYPE_META, MOOD_META } from '../engine/types'
import { fmtDate, fmtTime } from '../utils/formatters'

export default function CinemaModal({
  isOpen,
  onClose,
  receipts,
  chapters,
  threads,
  onSelectReceipt
}) {
  if (!isOpen) return null

  // 10 Curated Pivotal Milestones
  const milestones = [
    {
      act: 'ACT I',
      title: 'The Search In The Dark',
      date: '6 Jan 2024 · 23:42',
      quote: "I keep checking flight prices like it's a personality trait.",
      narrative: 'A quiet Saturday night in Bristol turns restless. A search for flights to Lisbon begins an 18-month journey of reinvention.',
      receiptId: 'r0006',
    },
    {
      act: 'ACT I',
      title: 'The Solitary Miradouro',
      date: '26 Feb 2024 · 18:30',
      quote: 'Looking over Alfama with a single espresso and a notebook.',
      narrative: 'Solo travel has a particular silence. In Lisbon, listening to Bon Iver, carrying a 45L backpack, testing if a new self can walk.',
      receiptId: 'r0045',
    },
    {
      act: 'ACT II',
      title: 'The Drift Into 2 AM',
      date: '18 Apr 2024 · 02:40',
      quote: '3:30am, microwave light. The sea is just weather that kept a resolution.',
      narrative: 'Spring brings insomnia. The ledger slips into the nocturnal curve: Lord Huron on repeat, tea at 3 AM, and searches into the dark.',
      receiptId: 'r0112',
    },
    {
      act: 'ACT II',
      title: 'The Quiet Stroll on the Coastal 8',
      date: '14 Jun 2024 · 01:15',
      quote: 'What time does the sea rest?',
      narrative: 'Riding the top deck of the night bus in Brighton. When sleep won’t come, the physical city becomes a shelter.',
      receiptId: 'r0168',
    },
    {
      act: 'ACT II',
      title: 'The Disguised Turning Point',
      date: '18 Jul 2024 · 11:20',
      quote: 'Sunrise alarm clock with natural light simulator.',
      narrative: 'A receipt without drama that changes everything. One day you buy a sunrise clock, and the ledger quietly changes its schedule.',
      receiptId: 'r0215',
    },
    {
      act: 'ACT III',
      title: 'The Arrival of Maya',
      date: '1 Sep 2024 · 22:14',
      quote: 'The whale mugs survived the dishwasher. I checked.',
      narrative: 'The mathematical inflection point of the whole recorded life. After this single message, the 2 AM curve collapses and daytime returns.',
      receiptId: 'r0260',
    },
    {
      act: 'ACT III',
      title: 'A Table at The Kiln',
      date: '8 Oct 2024 · 10:15',
      quote: 'Two flat whites. Maya brought blue ink.',
      narrative: 'The Kiln transforms from an anonymous cafe into an emotional anchor. Solitary teas give way to paired breakfasts and shared plans.',
      receiptId: 'r0310',
    },
    {
      act: 'ACT III',
      title: 'The 8-Day Digital Silence',
      date: '20 Dec – 28 Dec 2024',
      quote: 'When life is lived completely, the paper trail goes quiet.',
      narrative: 'The longest silence in 18 months. No searches, no photos. The life outgrows the ledger, ending in a coastal bus ride into Cornwall.',
      receiptId: 'r0372',
    },
    {
      act: 'ACT IV',
      title: 'The Maker’s Dawn',
      date: '14 Feb 2025 · 06:15',
      quote: 'The morning receipts were a tool. The night receipts were a shelter.',
      narrative: '5 AM studio pottery sessions, medium-format film rolls, darkroom chemistry. Days begin with intention instead of leftovers.',
      receiptId: 'r0418',
    },
    {
      act: 'ACT IV',
      title: 'Full Circle In Lisbon',
      date: '5 Jun 2025 · 19:40',
      quote: 'Two tickets, Alfama balcony, ceramics for the studio. I finally know what I was leaving.',
      narrative: 'Returning to the same city that opened the ledger — this time accompanied, anchored, and creating.',
      receiptId: 'r0466',
    },
  ]

  const [currentIdx, setCurrentIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const activeMilestone = milestones[currentIdx]
  const targetReceipt = receipts.find((r) => r.id === activeMilestone.receiptId) || receipts[0]

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setCurrentIdx((prev) => {
        if (prev >= milestones.length - 1) {
          setIsPlaying(false)
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } })
          return prev
        }
        sound.playTick(1300)
        return prev + 1
      })
    }, 7000)

    return () => clearInterval(timer)
  }, [isPlaying, milestones.length])

  const handleNext = () => {
    sound.playTick(1400)
    if (currentIdx < milestones.length - 1) {
      setCurrentIdx((prev) => prev + 1)
    } else {
      confetti({ particleCount: 60, spread: 60 })
    }
  }

  const handlePrev = () => {
    sound.playTick(1100)
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07080b]/95 backdrop-blur-xl p-4 sm:p-8 animate-in fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl border border-[#272c3d] bg-[#0e1017] p-6 sm:p-12 shadow-2xl flex flex-col justify-between min-h-[580px] overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#e0a458]/15 via-[#d2869a]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Top Control Bar */}
        <div className="relative z-10 flex items-center justify-between pb-6 border-b border-[#1e2230]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono-receipt px-2.5 py-1 rounded bg-[#181c28] text-[#e0a458] border border-[#2b3245]">
              {activeMilestone.act} // SCENE {currentIdx + 1} OF {milestones.length}
            </span>
            <span className="text-xs font-mono-receipt text-[#6e768a]">
              {activeMilestone.date}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#141620] hover:bg-[#1f2332] text-[#8e95a7] hover:text-[#f2f4f8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Main Stage */}
        <div className="relative z-10 py-8 space-y-6 max-w-3xl">
          <h2 className="font-serif-story text-3xl sm:text-5xl font-medium text-[#f5f2eb] leading-tight">
            {activeMilestone.title}
          </h2>

          <div className="p-4 rounded-2xl bg-[#141722] border-l-4 border-[#e0a458] text-[#dcdfe8] font-serif-story italic text-lg sm:text-xl">
            "{activeMilestone.quote}"
          </div>

          <p className="font-sans-ui text-sm sm:text-base text-[#9ba3b8] leading-relaxed">
            {activeMilestone.narrative}
          </p>

          {/* Connected Thermal Slip Sneak Peek */}
          {targetReceipt && (
            <div
              onClick={() => {
                sound.playPaperRustle()
                onSelectReceipt(targetReceipt)
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#f8f6f0] text-[#1c1d22] font-mono-receipt text-xs cursor-pointer hover:scale-102 transition-transform shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e0a458]" />
              <span className="font-bold">INSPECT RECEIPT № {targetReceipt.id}:</span>
              <span className="truncate max-w-xs">{targetReceipt.heading}</span>
            </div>
          )}
        </div>

        {/* Bottom Playback Bar */}
        <div className="relative z-10 pt-6 border-t border-[#1e2230] flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Progress Indicators */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {milestones.map((_, mIdx) => (
              <button
                key={mIdx}
                onClick={() => {
                  sound.playTick(1200 + mIdx * 50)
                  setCurrentIdx(mIdx)
                }}
                className={`h-1.5 rounded-full transition-all ${
                  currentIdx === mIdx
                    ? 'w-8 bg-[#e0a458]'
                    : mIdx < currentIdx
                    ? 'w-3 bg-[#646b7e]'
                    : 'w-3 bg-[#242836]'
                }`}
              />
            ))}
          </div>

          {/* Play/Pause & Nav buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="p-2.5 rounded-xl bg-[#141722] text-[#8e95a7] hover:text-[#f5f2eb] disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e0a458] text-[#0c0d12] font-bold text-xs font-mono-receipt hover:opacity-90 transition-all shadow-md"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'PAUSE STORY' : 'RESUME PLAY'}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIdx === milestones.length - 1}
              className="p-2.5 rounded-xl bg-[#141722] text-[#8e95a7] hover:text-[#f5f2eb] disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
