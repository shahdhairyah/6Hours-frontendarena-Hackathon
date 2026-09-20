import { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Sparkles,
  DollarSign,
  ChevronRight,
  X,
  Volume2,
  Bookmark,
  Check
} from 'lucide-react'
import { TYPES, TYPE_META, MOODS, MOOD_META, TIME_BUCKETS, TIME_OF_DAY } from '../engine/types'
import { fmtDate, fmtDateShort, fmtTime, fmtCurrency } from '../utils/formatters'
import { sound } from '../audio/soundEngine'

export default function LedgerView({
  receipts,
  chapters,
  threads,
  onSelectReceipt,
  activeFilterType,
  setActiveFilterType
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMood, setSelectedMood] = useState('all')
  const [selectedTimeBucket, setSelectedTimeBucket] = useState('all')
  const [selectedChapter, setSelectedChapter] = useState('all')
  const [sortBy, setSortBy] = useState('chronological-asc')
  const [activePreset, setActivePreset] = useState('all')

  // Curated Hackathon Quick Presets
  const presets = [
    { id: 'all', label: 'All 466 Receipts', icon: '🧾' },
    { id: '2am', label: 'The 2 AM Curve', icon: '🌙' },
    { id: 'maya', label: 'Maya Connection', icon: '❤️' },
    { id: 'lisbon', label: 'Lisbon Odyssey', icon: '✈️' },
    { id: 'kiln', label: 'The Kiln Cafe', icon: '☕' },
    { id: 'maker', label: 'The Maker Hours', icon: '🎨' },
  ]

  const applyPreset = (presetId) => {
    sound.playTick(1300)
    setActivePreset(presetId)
    if (presetId === 'all') {
      clearAllFilters()
    } else if (presetId === '2am') {
      clearAllFilters()
      setSelectedTimeBucket('night')
    } else if (presetId === 'maya') {
      clearAllFilters()
      setSearchQuery('Maya')
    } else if (presetId === 'lisbon') {
      clearAllFilters()
      setSearchQuery('Lisbon')
    } else if (presetId === 'kiln') {
      clearAllFilters()
      setSearchQuery('Kiln')
    } else if (presetId === 'maker') {
      clearAllFilters()
      setSelectedChapter('c04')
    }
  }

  // Filtering & Sorting pipeline
  const filteredReceipts = useMemo(() => {
    let list = receipts

    // Type filter
    if (activeFilterType && activeFilterType !== 'all') {
      list = list.filter((r) => r.type === activeFilterType)
    }

    // Mood filter
    if (selectedMood && selectedMood !== 'all') {
      list = list.filter((r) => r.mood === selectedMood)
    }

    // Time of day filter
    if (selectedTimeBucket && selectedTimeBucket !== 'all') {
      list = list.filter((r) => r.timeOfDay === selectedTimeBucket)
    }

    // Chapter filter
    if (selectedChapter && selectedChapter !== 'all') {
      const ch = chapters.find((c) => c.id === selectedChapter)
      if (ch) {
        list = list.filter((r) => r.dt >= ch.start && r.dt <= ch.end)
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter((r) => {
        return (
          r.heading?.toLowerCase().includes(q) ||
          r.body?.toLowerCase().includes(q) ||
          r.city?.toLowerCase().includes(q) ||
          r.artist?.toLowerCase().includes(q) ||
          r.merchant?.toLowerCase().includes(q) ||
          r.counterpart?.toLowerCase().includes(q) ||
          r.tags?.some((t) => t.toLowerCase().includes(q))
        )
      })
    }

    // Sorting
    const sorted = [...list]
    if (sortBy === 'chronological-asc') {
      sorted.sort((a, b) => a.dt - b.dt)
    } else if (sortBy === 'chronological-desc') {
      sorted.sort((a, b) => b.dt - a.dt)
    } else if (sortBy === 'amount-high') {
      sorted.sort((a, b) => (b.amount || 0) - (a.amount || 0))
    } else if (sortBy === 'energy-high') {
      sorted.sort((a, b) => (b.energy || 0) - (a.energy || 0))
    }

    return sorted
  }, [receipts, chapters, activeFilterType, selectedMood, selectedTimeBucket, selectedChapter, searchQuery, sortBy])

  const clearAllFilters = () => {
    sound.playTick(1000)
    setSearchQuery('')
    setActiveFilterType('all')
    setSelectedMood('all')
    setSelectedTimeBucket('all')
    setSelectedChapter('all')
    setSortBy('chronological-asc')
    setActivePreset('all')
  }

  const hasActiveFilters =
    searchQuery ||
    activeFilterType !== 'all' ||
    selectedMood !== 'all' ||
    selectedTimeBucket !== 'all' ||
    selectedChapter !== 'all' ||
    sortBy !== 'chronological-asc'

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Search, Preset & Filter Control Dock */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0d0f17] p-6 space-y-6 shadow-2xl">
        {/* Curated Story Presets */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono-receipt uppercase tracking-widest text-[#666d80] block">
            Curated Story Presets
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono-receipt transition-all ${
                  activePreset === preset.id
                    ? 'bg-[#f59e0b] text-[#07080b] font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'bg-[#141622] border border-white/[0.06] text-[#8e95a7] hover:bg-[#1a1e2e] hover:text-[#fbf9f5]'
                }`}
              >
                <span>{preset.icon}</span>
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#61687a] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setActivePreset('custom')
              }}
              placeholder="Search receipts by cafe, artist, Maya, flight, tag, or note..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#08090f] border border-white/[0.08] text-sm text-[#fbf9f5] placeholder-[#505668] focus:outline-none focus:border-[#f59e0b]/60 transition-colors font-sans-ui"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#61687a] hover:text-[#fbf9f5]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-[#08090f] border border-white/[0.08] text-xs font-mono-receipt text-[#b0b7c9] focus:outline-none focus:border-[#f59e0b]/60"
            >
              <option value="chronological-asc">Time: Oldest First</option>
              <option value="chronological-desc">Time: Newest First</option>
              <option value="amount-high">Spend: Highest First</option>
              <option value="energy-high">Energy: Highest First</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="shrink-0 px-3.5 py-3 rounded-2xl text-xs font-mono-receipt text-[#fb7185] bg-[#fb7185]/10 hover:bg-[#fb7185]/20 border border-[#fb7185]/30 transition-all"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Activity Type Filters */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono-receipt">
            <span className="uppercase tracking-widest text-[#666e80]">
              Filter By Activity
            </span>
            <span className="text-[#f59e0b]">
              {filteredReceipts.length} of {receipts.length} Moments Shown
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => {
                sound.playTick(1200)
                setActiveFilterType('all')
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono-receipt transition-all ${
                activeFilterType === 'all'
                  ? 'bg-white/[0.15] text-[#fbf9f5] font-bold border border-white/[0.2]'
                  : 'bg-[#12141f] text-[#7d8597] hover:bg-[#181a28] hover:text-[#d4d9e5] border border-white/[0.04]'
              }`}
            >
              All Types ({receipts.length})
            </button>

            {TYPES.map((type) => {
              const meta = TYPE_META[type]
              const count = receipts.filter((r) => r.type === type).length
              const isSelected = activeFilterType === type

              return (
                <button
                  key={type}
                  onClick={() => {
                    sound.playTick(1300)
                    setActiveFilterType(isSelected ? 'all' : type)
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono-receipt transition-all border ${
                    isSelected
                      ? 'border-[#f59e0b] bg-[#f59e0b]/20 text-[#fbf9f5] font-bold shadow-sm'
                      : 'border-white/[0.04] bg-[#12141f] text-[#7d8597] hover:bg-[#181a28] hover:text-[#d4d9e5]'
                  }`}
                >
                  <span style={{ color: meta.color }}>{meta.short}</span>
                  <span>{meta.label}</span>
                  <span className="text-[10px] opacity-60">({count})</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Secondary Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/[0.06]">
          <div>
            <label className="block text-[10px] font-mono-receipt uppercase tracking-widest text-[#5d6475] mb-1.5">
              Emotional Mood
            </label>
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#08090f] border border-white/[0.08] text-xs font-mono-receipt text-[#b0b7c9] focus:outline-none focus:border-[#f59e0b]"
            >
              <option value="all">All Emotional Moods</option>
              {MOODS.map((mood) => (
                <option key={mood} value={mood}>
                  {mood.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono-receipt uppercase tracking-widest text-[#5d6475] mb-1.5">
              Circadian Time Window
            </label>
            <select
              value={selectedTimeBucket}
              onChange={(e) => setSelectedTimeBucket(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#08090f] border border-white/[0.08] text-xs font-mono-receipt text-[#b0b7c9] focus:outline-none focus:border-[#f59e0b]"
            >
              <option value="all">All Hours of Day</option>
              <option value="night">Night (22:00 – 06:00) · 2 AM Curve</option>
              <option value="early">Early Dawn (06:00 – 09:00)</option>
              <option value="day">Daytime (09:00 – 17:00)</option>
              <option value="evening">Evening (17:00 – 22:00)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono-receipt uppercase tracking-widest text-[#5d6475] mb-1.5">
              Life Chapter
            </label>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#08090f] border border-white/[0.08] text-xs font-mono-receipt text-[#b0b7c9] focus:outline-none focus:border-[#f59e0b]"
            >
              <option value="all">All 4 Chapters</option>
              {chapters.map((ch, idx) => (
                <option key={ch.id} value={ch.id}>
                  Act {['I', 'II', 'III', 'IV'][idx]}: {ch.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* The Authentic Thermal Paper Continuous Roll */}
      <div className="relative mx-auto max-w-2xl thermal-slip rounded-3xl p-8 sm:p-12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-[#d6cfbe]">
        {/* Sawtooth Top Decoration */}
        <div className="receipt-sawtooth-top -mt-8 -mx-8 sm:-mt-12 sm:-mx-12 mb-6" />

        {/* Thermal Store Header */}
        <div className="border-b-2 border-dashed border-[#9c9584] pb-6 text-center space-y-2.5">
          <div className="font-mono-receipt text-sm font-bold tracking-widest text-[#15171d]">
            *** THE LEDGER OF A LIFE ***
          </div>
          <div className="text-[11px] font-mono-receipt text-[#525765] tracking-wide">
            TRANSACTION LOG · 18-MONTH CHRONICLE
          </div>
          <div className="inline-block font-mono-receipt text-xs px-3 py-1 bg-[#171920] text-[#fbf9f3] rounded-md font-bold tracking-wider">
            {filteredReceipts.length} TRANSACTIONS RECORDED
          </div>
          <div className="text-[10px] font-mono-receipt text-[#757a87] pt-1">
            TIMELINE: {fmtDate(receipts[0]?.dt)} → {fmtDate(receipts[receipts.length - 1]?.dt)}
          </div>
        </div>

        {/* Empty State */}
        {filteredReceipts.length === 0 ? (
          <div className="py-20 text-center space-y-4 font-mono-receipt text-sm text-[#656a78]">
            <p className="font-bold">NO RECEIPTS MATCH YOUR ACTIVE FILTERS</p>
            <p className="text-xs text-[#7e8494]">Try resetting your search query or selecting "All 466 Receipts"</p>
            <button
              onClick={clearAllFilters}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#171920] text-[#fbf9f3] rounded-xl hover:opacity-90"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Continuous Receipt Line Items */
          <div className="divide-y divide-dashed divide-[#cfc7b4] py-4">
            {filteredReceipts.map((receipt) => {
              const meta = TYPE_META[receipt.type] || { label: receipt.type, short: '◈', color: '#171920' }
              const mood = MOOD_META[receipt.mood] || { label: receipt.mood, color: '#666' }
              const connections = threads.adjacency.get(receipt.id) || []
              const isNight = receipt.isNight

              return (
                <div
                  key={receipt.id}
                  onClick={() => {
                    sound.playPaperRustle()
                    onSelectReceipt(receipt)
                  }}
                  className="py-4 px-3 hover:bg-[#ede7d8] rounded-xl transition-all cursor-pointer group space-y-2 relative"
                >
                  {/* Top Metadata Strip */}
                  <div className="flex items-center justify-between text-[11px] font-mono-receipt text-[#545967]">
                    <span className="flex items-center gap-1.5 font-bold text-[#171920]">
                      <span>{meta.short}</span>
                      <span className="uppercase">{meta.label}</span>
                      <span className="text-[#7c8290] font-normal">№ {receipt.id}</span>
                    </span>

                    <span className="flex items-center gap-2">
                      {isNight && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#171920] text-[#fbf9f3] font-bold">
                          2 AM CURVE
                        </span>
                      )}
                      <span>{fmtDateShort(receipt.dt)} · {receipt.timeStr}</span>
                    </span>
                  </div>

                  {/* Heading & Price */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-mono-receipt font-bold text-sm text-[#111217] group-hover:text-black group-hover:underline leading-snug">
                      {receipt.heading}
                    </h3>
                    {receipt.amount && (
                      <span className="font-mono-receipt font-bold text-sm text-[#111217] shrink-0">
                        {fmtCurrency(receipt.amount, receipt.currency)}
                      </span>
                    )}
                  </div>

                  {/* Body Detail */}
                  {receipt.body && (
                    <p className="font-mono-receipt text-xs text-[#474c58] leading-relaxed">
                      {receipt.body}
                    </p>
                  )}

                  {/* Tags & Connected Echoes */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] font-mono-receipt text-[#696f7e]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded border border-[#b8b09d] text-[#292b34] uppercase font-medium">
                        {mood.label}
                      </span>
                      {receipt.city && (
                        <span className="px-1.5 py-0.5 rounded border border-[#b8b09d] text-[#292b34]">
                          📍 {receipt.city}
                        </span>
                      )}
                      {receipt.counterpart && (
                        <span className="px-1.5 py-0.5 rounded bg-[#171920] text-[#fbf9f3] font-bold">
                          WITH {receipt.counterpart.toUpperCase()}
                        </span>
                      )}
                    </div>

                    {connections.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[#171920] font-bold group-hover:translate-x-1 transition-transform">
                        <span>{connections.length} ECHOES</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Sawtooth Bottom Decoration */}
        <div className="receipt-sawtooth-bottom -mb-8 -mx-8 sm:-mb-12 sm:-mx-12 mt-6" />

        {/* Thermal Slip Footer Summary */}
        <div className="border-t-2 border-dashed border-[#9c9584] pt-6 text-center space-y-4">
          <div className="text-xs font-mono-receipt text-[#525765] space-y-1">
            <div className="flex justify-between font-bold text-sm text-[#171920]">
              <span>TOTAL ITEMS IN LEDGER:</span>
              <span>{filteredReceipts.length} MOMENTS</span>
            </div>
            <div className="flex justify-between">
              <span>NOCTURNAL RATIO:</span>
              <span>
                {filteredReceipts.length
                  ? Math.round((filteredReceipts.filter((r) => r.isNight).length / filteredReceipts.length) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>

          {/* Barcode Strip */}
          <div className="py-2 flex flex-col items-center justify-center space-y-1.5">
            <div className="h-9 w-64 flex items-center justify-between text-[#171920] overflow-hidden">
              {[...Array(56)].map((_, i) => (
                <span
                  key={i}
                  className="barcode-line"
                  style={{
                    width: `${(i % 3) + 1.2}px`,
                    opacity: i % 7 === 0 ? 0.35 : 1
                  }}
                />
              ))}
            </div>
            <span className="font-mono-receipt text-[9px] tracking-widest text-[#666b79]">
              * 2024-2025-OFFICIAL-LIFE-RECORD *
            </span>
          </div>

          <div className="text-[10px] font-mono-receipt text-[#757a87] italic">
            "A life lived in fragments, preserved in paper."
          </div>
        </div>
      </div>
    </div>
  )
}
