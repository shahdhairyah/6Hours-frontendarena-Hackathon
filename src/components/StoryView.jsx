import { useState } from 'react'
import {
  Compass,
  Moon,
  Heart,
  Hammer,
  ArrowRight,
  Sparkles,
  TrendingUp,
  ChevronRight,
  Award,
  Volume2,
  VolumeX,
  Star
} from 'lucide-react'
import { fmtDateShort, fmtMonthYear } from '../utils/formatters'
import { TYPE_META, MOOD_META } from '../engine/types'
import { sound } from '../audio/soundEngine'
import { useSound } from '../hooks/useSound'
import { TimeMachineScrubber } from './TimeMachineScrubber'

/**
 * StoryView: Narrative reader with AI audio narrator and accessible bento acts.
 */
export default function StoryView({
  receipts = [],
  narrative,
  chapters,
  stats,
  threads,
  onSelectReceipt,
  onSwitchTab,
  isBookmarked,
  onToggleBookmark
}) {
  const [selectedChapterIdx, setSelectedChapterIdx] = useState(0)
  const { isNarrating, activeNarratorParagraph, speakParagraphs, stopNarration } = useSound()

  const activeChapter = chapters[selectedChapterIdx] || chapters[0]

  const chapterIcons = [Compass, Moon, Heart, Hammer]
  const chapterColors = {
    wander: {
      accent: '#f59e0b',
      border: 'border-[#f59e0b]/30',
      bg: 'bg-[#f59e0b]/10',
      text: 'text-[#f59e0b]',
      glow: 'shadow-[0_0_40px_rgba(245,158,11,0.12)]',
      gradient: 'from-[#f59e0b]/20 via-[#f59e0b]/5 to-transparent'
    },
    night: {
      accent: '#6366f1',
      border: 'border-[#6366f1]/30',
      bg: 'bg-[#6366f1]/10',
      text: 'text-[#818cf8]',
      glow: 'shadow-[0_0_40px_rgba(99,102,241,0.12)]',
      gradient: 'from-[#6366f1]/20 via-[#6366f1]/5 to-transparent'
    },
    anchor: {
      accent: '#f43f5e',
      border: 'border-[#f43f5e]/30',
      bg: 'bg-[#f43f5e]/10',
      text: 'text-[#fb7185]',
      glow: 'shadow-[0_0_40px_rgba(244,63,94,0.12)]',
      gradient: 'from-[#f43f5e]/20 via-[#f43f5e]/5 to-transparent'
    },
    maker: {
      accent: '#eab308',
      border: 'border-[#eab308]/30',
      bg: 'bg-[#eab308]/10',
      text: 'text-[#facc15]',
      glow: 'shadow-[0_0_40px_rgba(234,179,8,0.12)]',
      gradient: 'from-[#eab308]/20 via-[#eab308]/5 to-transparent'
    },
  }

  const currentTheme = chapterColors[activeChapter?.theme] || chapterColors.wander

  const handleToggleNarrator = () => {
    const paras = narrative.chapters[selectedChapterIdx]?.paragraphs || []
    if (isNarrating) {
      stopNarration()
    } else {
      sound.playChime(520, 'sine', 0.5)
      speakParagraphs(paras)
    }
  }

  return (
    <div
      role="tabpanel"
      id="panel-story"
      aria-labelledby="tab-story"
      className="space-y-16 max-w-6xl mx-auto px-4 py-8"
    >
      {/* Museum Exhibition Hero Cover */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#11131c] via-[#0c0e14] to-[#07080b] p-8 sm:p-14 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#f59e0b]/15 via-[#f43f5e]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-[#6366f1]/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8 max-w-4xl">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono-receipt text-[#f59e0b]">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="tracking-wider">CURATED LIFE EXHIBITION // 18-MONTH TIMELINE</span>
          </div>

          <h1 className="font-serif-story text-3xl sm:text-6xl font-normal tracking-tight text-[#fbf9f5] leading-[1.12]">
            Individually, these moments were digital receipts. Together, they reveal someone <span className="italic underline decoration-[#f59e0b]/50 underline-offset-8">becoming whole</span>.
          </h1>

          <p className="font-serif-story text-base sm:text-xl text-[#cbd5e1] leading-relaxed italic border-l-2 border-[#f59e0b]/60 pl-4 sm:pl-6">
            {narrative.prologue?.thesis}
          </p>

          {/* Visual Mood Trajectory Curve */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono-receipt text-[#94a3b8]">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#f59e0b]" aria-hidden="true" />
                <span>18-Month Emotional Trajectory & Circadian Evolution</span>
              </span>
              <span className="text-[#cbd5e1]">Low Nocturnal (0.12) → Peak Daylight (0.90)</span>
            </div>

            {/* Sparkline Visualizer */}
            <div className="h-16 w-full rounded-2xl bg-[#090b10] border border-white/[0.06] p-2.5 flex items-end justify-between gap-1 overflow-hidden">
              {stats.moodJourney?.map((m, i) => {
                const heightPct = Math.round(m.mood * 100)
                const isPeakNight = m.night > 0.4
                return (
                  <div
                    key={i}
                    title={`${m.label}: Mood ${(m.mood * 10).toFixed(1)}/10, ${Math.round(m.night * 100)}% Nights`}
                    className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
                  >
                    <div
                      style={{ height: `${Math.max(heightPct, 15)}%` }}
                      className={`w-full rounded-md transition-all group-hover:scale-y-110 ${
                        isPeakNight ? 'bg-[#6366f1] opacity-75' : 'bg-gradient-to-t from-[#f59e0b] to-[#f43f5e] opacity-90'
                      }`}
                    />
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between text-[10px] font-mono-receipt text-[#94a3b8]">
              <span>Jan 2024 (Restlessness)</span>
              <span>Jun 2024 (2 AM Curve)</span>
              <span>Nov 2024 (Maya's Anchor)</span>
              <span>Jun 2025 (The Maker)</span>
            </div>

            {/* Screen Reader Accessible Data Table */}
            <table className="sr-only">
              <caption>18-Month Emotional Trajectory and Circadian Breakdown</caption>
              <thead>
                <tr>
                  <th scope="col">Month</th>
                  <th scope="col">Mood Score</th>
                  <th scope="col">Night Ratio</th>
                </tr>
              </thead>
              <tbody>
                {stats.moodJourney?.map((m, i) => (
                  <tr key={i}>
                    <td>{m.label}</td>
                    <td>{(m.mood * 10).toFixed(1)} / 10</td>
                    <td>{Math.round(m.night * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 4 Hero KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.15] transition-all">
              <span className="text-[10px] font-mono-receipt uppercase tracking-widest text-[#94a3b8] block mb-1">
                Life Moments
              </span>
              <span className="text-2xl sm:text-3xl font-mono-receipt font-bold text-[#fbf9f5]">
                {stats.total}
              </span>
              <span className="text-[10px] font-sans-ui text-[#94a3b8] block mt-0.5">Across 9 distinct types</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.15] transition-all">
              <span className="text-[10px] font-mono-receipt uppercase tracking-widest text-[#94a3b8] block mb-1">
                Narrative Acts
              </span>
              <span className="text-2xl sm:text-3xl font-mono-receipt font-bold text-[#f59e0b]">
                {chapters.length} Acts
              </span>
              <span className="text-[10px] font-sans-ui text-[#94a3b8] block mt-0.5">Jan 2024 – Jun 2025</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.15] transition-all">
              <span className="text-[10px] font-mono-receipt uppercase tracking-widest text-[#94a3b8] block mb-1">
                Peak Nocturnal
              </span>
              <span className="text-2xl sm:text-3xl font-mono-receipt font-bold text-[#818cf8]">
                62% Nights
              </span>
              <span className="text-[10px] font-sans-ui text-[#94a3b8] block mt-0.5">During Act II insomnia</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.15] transition-all">
              <span className="text-[10px] font-mono-receipt uppercase tracking-widest text-[#94a3b8] block mb-1">
                Connected Echoes
              </span>
              <span className="text-2xl sm:text-3xl font-mono-receipt font-bold text-[#fb7185]">
                {threads.echoEdges?.length || 90}
              </span>
              <span className="text-[10px] font-sans-ui text-[#94a3b8] block mt-0.5">Cross-temporal threads</span>
            </div>
          </div>
        </div>
      </section>

      {/* Innovative 18-Month Chronological Time Machine Scrubber */}
      {receipts && receipts.length > 0 && (
        <TimeMachineScrubber
          receipts={receipts}
          chapters={chapters}
          onSelectReceipt={onSelectReceipt}
        />
      )}

      {/* Chapter Selector Bento Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-mono-receipt uppercase tracking-widest text-[#94a3b8]">
              Select Life Act & Chapter
            </h2>
            <p className="text-xs text-[#94a3b8] font-sans-ui">
              Each chapter represents a distinct emotional era discovered algorithmically
            </p>
          </div>
          <span className="text-xs font-mono-receipt text-[#f59e0b]">
            Act {selectedChapterIdx + 1} of {chapters.length} Selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {chapters.map((ch, idx) => {
            const Icon = chapterIcons[idx] || Compass
            const isSelected = selectedChapterIdx === idx
            const theme = chapterColors[ch.theme] || chapterColors.wander

            return (
              <button
                key={ch.id}
                onClick={() => {
                  stopNarration()
                  sound.playTick(1200 + idx * 150)
                  setSelectedChapterIdx(idx)
                }}
                className={`text-left p-5 rounded-2xl border transition-all relative overflow-hidden group focus-visible:ring-2 focus-visible:ring-[#f59e0b] outline-none ${
                  isSelected
                    ? `${theme.bg} ${theme.border} ${theme.glow} ring-1 ring-white/20`
                    : 'bg-[#0f1118] border-white/[0.06] hover:border-white/[0.15] hover:bg-[#141622]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono-receipt px-2.5 py-0.5 rounded-full bg-black/40 text-[#cbd5e1] border border-white/[0.08]">
                    ACT {['I', 'II', 'III', 'IV'][idx]}
                  </span>
                  <div className={`p-2 rounded-xl bg-white/[0.04] ${isSelected ? theme.text : 'text-[#64748b]'}`}>
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>

                <h3 className={`font-serif-story text-xl font-medium ${isSelected ? 'text-[#fbf9f5]' : 'text-[#e2e8f0]'}`}>
                  {ch.name}
                </h3>

                <p className="text-xs text-[#94a3b8] font-mono-receipt mt-1">
                  {fmtMonthYear(ch.start)} – {fmtMonthYear(ch.end)}
                </p>

                {/* Night-Owl Indicator Bar */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1">
                  <div className="flex justify-between text-[11px] font-mono-receipt text-[#94a3b8]">
                    <span>{ch.recs?.length} moments</span>
                    <span>{Math.round(ch.nightRatio * 100)}% nights</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-black/40 overflow-hidden">
                    <div
                      style={{ width: `${Math.round(ch.nightRatio * 100)}%` }}
                      className={`h-full rounded-full ${isSelected ? theme.text.replace('text-', 'bg-') : 'bg-[#64748b]'}`}
                    />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Chapter Deep Reading Canvas */}
      <section className={`rounded-3xl border ${currentTheme.border} bg-[#0c0e15] p-8 sm:p-12 space-y-10 shadow-2xl relative overflow-hidden`}>
        {/* Background Ambient Tint */}
        <div className={`absolute top-0 right-0 w-full h-48 bg-gradient-to-b ${currentTheme.gradient} pointer-events-none`} />

        {/* Chapter Header with Narrator Action */}
        <div className="relative z-10 border-b border-white/[0.08] pb-8 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className={`text-xs font-mono-receipt uppercase tracking-widest font-bold ${currentTheme.text}`}>
              ACT {['I', 'II', 'III', 'IV'][selectedChapterIdx]} // ERA: {activeChapter.theme?.toUpperCase()}
            </span>

            {/* Narrator Voice Button */}
            <button
              onClick={handleToggleNarrator}
              aria-label={isNarrating ? 'Pause narrative audio reading' : 'Read chapter prose aloud with audio narrator'}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono-receipt border transition-all focus-visible:ring-2 focus-visible:ring-[#f59e0b] outline-none ${
                isNarrating
                  ? 'bg-[#f59e0b] text-[#07080b] font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-white/[0.05] border-white/[0.1] text-[#e2e8f0] hover:bg-white/[0.1]'
              }`}
            >
              {isNarrating ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#f59e0b]" />}
              <span>{isNarrating ? 'Stop Voice Narrator' : 'Narrate Chapter'}</span>
            </button>
          </div>

          <h2 className="font-serif-story text-3xl sm:text-5xl text-[#fbf9f5] font-normal tracking-tight">
            {activeChapter.name}
          </h2>

          <p className="text-sm sm:text-lg text-[#cbd5e1] font-sans-ui italic max-w-3xl leading-relaxed">
            "{activeChapter.deck}"
          </p>
        </div>

        {/* Narrative Prose with Active Narrator Highlighting */}
        <div className="relative z-10 space-y-6 font-serif-story text-lg sm:text-xl text-[#e2e8f0] leading-relaxed max-w-4xl">
          {narrative.chapters[selectedChapterIdx]?.paragraphs.map((para, pIdx) => {
            const isHighlighted = isNarrating && activeNarratorParagraph === pIdx
            return (
              <p
                key={pIdx}
                className={`transition-all duration-300 p-2 rounded-xl first-letter:text-4xl first-letter:font-semibold first-letter:text-[#f59e0b] first-letter:mr-2 leading-[1.8] ${
                  isHighlighted ? 'bg-[#f59e0b]/15 text-[#fbf9f5] shadow-sm' : ''
                }`}
              >
                {para}
              </p>
            )
          })}
        </div>

        {/* Key Turning Point Moments (Collectible Slips) */}
        <div className="relative z-10 space-y-5 pt-8 border-t border-white/[0.08]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-mono-receipt uppercase tracking-widest text-[#94a3b8]">
                Pivotal Moments In This Act
              </h3>
              <p className="text-xs text-[#94a3b8] font-sans-ui">
                Click any moment slip to trace its interconnected threads and raw data
              </p>
            </div>
            <button
              onClick={() => onSwitchTab('ledger')}
              className="text-xs font-mono-receipt text-[#f59e0b] hover:underline flex items-center gap-1.5 group"
            >
              <span>Explore all {activeChapter.recs?.length} in Ledger</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeChapter.recs.slice(0, 6).map((receipt) => {
              const meta = TYPE_META[receipt.type] || { label: receipt.type, color: '#f59e0b' }
              const mood = MOOD_META[receipt.mood] || { label: receipt.mood, color: '#9aa0a6' }
              const connCount = threads.adjacency.get(receipt.id)?.length || 0
              const bookmarked = isBookmarked && isBookmarked(receipt.id)

              return (
                <div
                  key={receipt.id}
                  onClick={() => {
                    sound.playPaperRustle()
                    onSelectReceipt(receipt)
                  }}
                  className="group cursor-pointer rounded-2xl border border-white/[0.07] bg-[#11131c] hover:bg-[#161824] p-5 transition-all hover:border-[#f59e0b]/50 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1 space-y-3 relative"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono-receipt text-[#94a3b8]">
                    <span className="flex items-center gap-1.5 font-medium text-[#fbf9f5]">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: meta.color }}
                      />
                      {meta.label}
                    </span>
                    <div className="flex items-center gap-2">
                      {onToggleBookmark && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            sound.playTick(1500)
                            onToggleBookmark(receipt.id)
                          }}
                          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark receipt'}
                          className="text-[#94a3b8] hover:text-[#f59e0b] transition-colors"
                        >
                          <Star className={`w-3.5 h-3.5 ${bookmarked ? 'fill-[#f59e0b] text-[#f59e0b]' : ''}`} />
                        </button>
                      )}
                      <span>{fmtDateShort(receipt.dt)} · {receipt.timeStr}</span>
                    </div>
                  </div>

                  <h4 className="font-mono-receipt text-sm font-bold text-[#fbf9f5] group-hover:text-[#f59e0b] transition-colors line-clamp-2 leading-snug">
                    {receipt.heading}
                  </h4>

                  {receipt.body && (
                    <p className="text-xs text-[#cbd5e1] font-sans-ui line-clamp-2 italic">
                      "{receipt.body}"
                    </p>
                  )}

                  <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono-receipt">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-medium"
                      style={{ color: mood.color, backgroundColor: `${mood.color}18` }}
                    >
                      {mood.label}
                    </span>

                    {connCount > 0 ? (
                      <span className="text-[#f59e0b] flex items-center gap-1 text-[10px] font-bold">
                        <span>{connCount} Echoes</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    ) : (
                      <span className="text-[#64748b] text-[10px]">Inspect moment</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Persona Synthesis & Epilogue */}
      <section className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#12141e] to-[#090a10] p-8 sm:p-12 space-y-8 shadow-2xl">
        <div className="flex items-center gap-2.5 text-xs font-mono-receipt uppercase tracking-widest text-[#fb7185]">
          <Award className="w-4 h-4" />
          <span>PERSONA SYNTHESIS // WHO WAS THIS PERSON?</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono-receipt">
          <div className="p-4 rounded-2xl bg-black/30 border border-white/[0.06]">
            <span className="text-[#94a3b8] block text-[10px] mb-1">ACT I ARCHETYPE</span>
            <span className="font-bold text-[#f59e0b] text-sm">The Restless Wanderer</span>
            <p className="text-[11px] text-[#cbd5e1] font-sans-ui mt-1">Seeking escape through searches, hostels, and distant cities.</p>
          </div>
          <div className="p-4 rounded-2xl bg-black/30 border border-white/[0.06]">
            <span className="text-[#94a3b8] block text-[10px] mb-1">ACT II ARCHETYPE</span>
            <span className="font-bold text-[#818cf8] text-sm">The Nocturnal Seeker</span>
            <p className="text-[11px] text-[#cbd5e1] font-sans-ui mt-1">Surrendering to 2 AM insomnia, sad cinema, and solitude.</p>
          </div>
          <div className="p-4 rounded-2xl bg-black/30 border border-white/[0.06]">
            <span className="text-[#94a3b8] block text-[10px] mb-1">ACT III ARCHETYPE</span>
            <span className="font-bold text-[#fb7185] text-sm">The Anchored Partner</span>
            <p className="text-[11px] text-[#cbd5e1] font-sans-ui mt-1">Maya arrives. A coffee shop table becomes home.</p>
          </div>
          <div className="p-4 rounded-2xl bg-black/30 border border-white/[0.06]">
            <span className="text-[#94a3b8] block text-[10px] mb-1">ACT IV ARCHETYPE</span>
            <span className="font-bold text-[#facc15] text-sm">The Purposeful Maker</span>
            <p className="text-[11px] text-[#cbd5e1] font-sans-ui mt-1">6 AM studio mornings, darkroom craft, full-circle confidence.</p>
          </div>
        </div>

        <p className="font-serif-story text-base sm:text-xl text-[#e2e8f0] leading-relaxed italic max-w-4xl">
          "{narrative.epilogue?.text}"
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4">
          <button
            onClick={() => onSwitchTab('graph')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono-receipt bg-[#1a1d2b] border border-white/[0.1] text-[#f59e0b] hover:bg-[#202436] transition-all hover:scale-102"
          >
            <span>Explore The Constellation Network</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSwitchTab('insights')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono-receipt bg-[#1a1d2b] border border-white/[0.1] text-[#818cf8] hover:bg-[#202436] transition-all hover:scale-102"
          >
            <span>Inspect Pattern Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  )
}
