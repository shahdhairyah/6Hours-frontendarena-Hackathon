import { useState } from 'react'
import {
  Lightbulb,
  Moon,
  Heart,
  MapPin,
  Coffee,
  Calendar,
  Compass,
  Sparkles,
  ShieldCheck,
  RotateCw,
  FileText
} from 'lucide-react'
import { sound } from '../audio/soundEngine'
import { fmtDateShort } from '../utils/formatters'

/**
 * InsightsView: Algorithmic pattern investigations answering "What does it all mean?".
 */
export default function InsightsView({
  stats,
  receipts,
  onSelectReceipt
}) {
  const [selectedHourScrub, setSelectedHourScrub] = useState(2) // Default to 2 AM
  const [isPassportFlipped, setIsPassportFlipped] = useState(false)

  const hours = stats.byHour || Array.from({ length: 24 }, () => 0)
  const maxHourCount = Math.max(...hours, 1)

  // Receipts during the scrubbed hour
  const receiptsAtHour = (receipts || []).filter((r) => r.hour === selectedHourScrub).slice(0, 6)

  return (
    <div
      role="tabpanel"
      id="panel-insights"
      aria-labelledby="tab-insights"
      className="max-w-6xl mx-auto px-4 py-8 space-y-16"
    >
      {/* Dossier Cover Header */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono-receipt text-[#f59e0b]">
          <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="tracking-wider">PATTERN DOSSIER // WHAT DOES IT ALL MEAN?</span>
        </div>

        <h1 className="font-serif-story text-3xl sm:text-6xl text-[#fbf9f5] font-normal tracking-tight">
          The Life Hidden Beneath The Ledger
        </h1>

        <p className="font-sans-ui text-sm sm:text-lg text-[#94a3b8] max-w-3xl leading-relaxed">
          Raw data only answers <span className="text-[#fbf9f5] italic">what happened</span>. These algorithmic investigations reveal <span className="text-[#f59e0b] font-semibold">what it meant</span>: how circadian rhythms exposed unspoken anxiety, how another human stabilized the clock, and how a city was revisited by a completely transformed self.
        </p>
      </section>

      {/* 6 Key Investigation Dossiers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Insight 1: The 2 AM Curve with Interactive Hour Scrubber */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0d0f17] p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-receipt px-3 py-1 rounded-full bg-[#6366f1]/15 text-[#818cf8] border border-[#6366f1]/30 flex items-center gap-2">
              <Moon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>THE 2 A.M. CURVE</span>
            </span>
            <span className="text-xs font-mono-receipt text-[#94a3b8]">
              Circadian Clock Analysis
            </span>
          </div>

          <h3 className="font-serif-story text-2xl sm:text-3xl text-[#fbf9f5] font-normal">
            When Insomnia Kept Its Own Ledger
          </h3>

          <p className="text-sm font-sans-ui text-[#cbd5e1] leading-relaxed">
            In Act II (Spring/Summer 2024), <strong>62% of all digital moments</strong> occurred between midnight and 4:00 AM. Inquiries like <em>"why can't I sleep"</em> and late-night Bon Iver cluster heavily at 02:40. Click any hour bar below to inspect what was logged:
          </p>

          {/* Interactive 24-Hour Bar Scrubber */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono-receipt text-[#94a3b8]">
              <span className="flex items-center gap-1.5">
                <Moon className="w-3 h-3 text-[#818cf8]" />
                <span>Selected Hour: {String(selectedHourScrub).padStart(2, '0')}:00 UTC</span>
              </span>
              <span className="text-[#f59e0b] font-bold">{hours[selectedHourScrub]} Receipts Recorded</span>
            </div>

            <div className="grid grid-cols-24 gap-1 h-24 items-end bg-[#07080c] p-3 rounded-2xl border border-white/[0.06]">
              {hours.map((count, h) => {
                const heightPct = Math.round((count / maxHourCount) * 100)
                const isSelected = selectedHourScrub === h
                const isNight = h >= 0 && h <= 4
                return (
                  <button
                    key={h}
                    onClick={() => {
                      sound.playTick(1000 + h * 50)
                      setSelectedHourScrub(h)
                    }}
                    aria-label={`Inspect ${count} receipts logged at ${h}:00`}
                    className="h-full flex flex-col justify-end group relative focus:outline-none"
                  >
                    <div
                      style={{ height: `${Math.max(heightPct, 8)}%` }}
                      className={`w-full rounded-sm transition-all ${
                        isSelected
                          ? 'bg-[#f59e0b] ring-2 ring-white scale-y-105'
                          : isNight
                          ? 'bg-[#6366f1] opacity-80 group-hover:opacity-100'
                          : 'bg-[#f59e0b] opacity-50 group-hover:opacity-90'
                      }`}
                    />
                  </button>
                )
              })}
            </div>

            <div className="flex justify-between text-[10px] font-mono-receipt text-[#64748b] px-1">
              <span>00:00 (Midnight)</span>
              <span>06:00 (Dawn)</span>
              <span>12:00 (Noon)</span>
              <span>18:00 (Dusk)</span>
              <span>23:00</span>
            </div>

            {/* Screen Reader Accessible 24-Hour Table */}
            <table className="sr-only">
              <caption>24-Hour Circadian Activity Distribution</caption>
              <thead>
                <tr>
                  <th scope="col">Hour (UTC)</th>
                  <th scope="col">Receipt Count</th>
                </tr>
              </thead>
              <tbody>
                {hours.map((count, h) => (
                  <tr key={h}>
                    <td>{String(h).padStart(2, '0')}:00</td>
                    <td>{count} receipts</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Scrubbed Hour Receipts Live Peek */}
            {receiptsAtHour.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <span className="text-[10px] font-mono-receipt text-[#94a3b8] uppercase tracking-wider block">
                  Receipts At {String(selectedHourScrub).padStart(2, '0')}:00:
                </span>
                <div className="space-y-1">
                  {receiptsAtHour.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => onSelectReceipt(r)}
                      className="text-xs font-mono-receipt text-[#e2e8f0] hover:text-[#f59e0b] flex items-center justify-between cursor-pointer truncate"
                    >
                      <span className="truncate">↳ [{r.type.toUpperCase()}] {r.heading}</span>
                      <span className="text-[10px] text-[#94a3b8] shrink-0 ml-2">{fmtDateShort(r.dt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Insight 2: The Maya Inflection Point */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0d0f17] p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-receipt px-3 py-1 rounded-full bg-[#f43f5e]/15 text-[#fb7185] border border-[#f43f5e]/30 flex items-center gap-2">
              <Heart className="w-3.5 h-3.5" aria-hidden="true" />
              <span>THE MAYA INFLECTION POINT</span>
            </span>
            <span className="text-xs font-mono-receipt text-[#94a3b8]">
              Interpersonal Impact
            </span>
          </div>

          <h3 className="font-serif-story text-2xl sm:text-3xl text-[#fbf9f5] font-normal">
            The Person Who Reset The Clock
          </h3>

          <p className="text-sm font-sans-ui text-[#cbd5e1] leading-relaxed">
            The first message from Maya arrives on <strong>Sep 1 at 22:14</strong>. The mathematical shift before and after this single receipt is undeniable:
          </p>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-[#08090f] border border-white/[0.06] space-y-2">
              <span className="text-[10px] font-mono-receipt uppercase tracking-widest text-[#94a3b8] block">
                BEFORE MAYA (JAN–AUG 2024)
              </span>
              <div className="text-2xl font-mono-receipt font-bold text-[#818cf8]">
                46% Night Owl
              </div>
              <p className="text-xs text-[#94a3b8] font-sans-ui">
                Avg mood 0.42 (Restless / Melancholic). Solitary midnight searches.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#08090f] border border-white/[0.06] space-y-2">
              <span className="text-[10px] font-mono-receipt uppercase tracking-widest text-[#f59e0b] block">
                AFTER MAYA (SEP 2024–JUN 2025)
              </span>
              <div className="text-2xl font-mono-receipt font-bold text-[#f59e0b]">
                27% Night Owl
              </div>
              <p className="text-xs text-[#cbd5e1] font-sans-ui">
                Avg mood 0.74 (Warm / Bright). Paired breakfasts and shared tickets.
              </p>
            </div>
          </div>

          <div className="text-xs font-serif-story italic text-[#cbd5e1] pt-1 border-l-2 border-[#fb7185]/60 pl-3">
            "Purchases change from solitary insomnia teas to paired breakfasts and shared train tickets."
          </div>
        </div>

        {/* Insight 3: The Anchor of The Kiln */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0d0f17] p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-receipt px-3 py-1 rounded-full bg-[#eab308]/15 text-[#facc15] border border-[#eab308]/30 flex items-center gap-2">
              <Coffee className="w-3.5 h-3.5" aria-hidden="true" />
              <span>THE KILN CAFE ANCHOR</span>
            </span>
            <span className="text-xs font-mono-receipt text-[#94a3b8]">
              Spatial Psychology
            </span>
          </div>

          <h3 className="font-serif-story text-2xl sm:text-3xl text-[#fbf9f5] font-normal">
            From Anonymous Coffee To The Regular Table
          </h3>

          <p className="text-sm font-sans-ui text-[#cbd5e1] leading-relaxed">
            Five receipts in the ledger share the exact merchant address: <strong>The Kiln</strong>. Their sequence documents a gradual psychological anchoring:
          </p>

          <div className="space-y-2.5 text-xs font-mono-receipt text-[#cbd5e1]">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#08090f] border border-white/[0.04]">
              <span className="text-[#f59e0b] font-bold shrink-0">1. SEP 8:</span>
              <span>1x Espresso (£2.80) — "Sat in corner wondering what to build next."</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#08090f] border border-white/[0.04]">
              <span className="text-[#f59e0b] font-bold shrink-0">2. SEP 22:</span>
              <span>2x Flat Whites (£6.40) — "Maya brought a notebook with blue ink."</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#08090f] border border-white/[0.04]">
              <span className="text-[#f59e0b] font-bold shrink-0">3. DEC 14:</span>
              <span>Note: "Six months ago nights were all that stayed. Now I have a table at the Kiln that knows my order."</span>
            </div>
          </div>
        </div>

        {/* Insight 4: Same City, Different Self */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0d0f17] p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-receipt px-3 py-1 rounded-full bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5" aria-hidden="true" />
              <span>SAME CITY, DIFFERENT SELF</span>
            </span>
            <span className="text-xs font-mono-receipt text-[#94a3b8]">
              Geographic Mirror
            </span>
          </div>

          <h3 className="font-serif-story text-2xl sm:text-3xl text-[#fbf9f5] font-normal">
            Lisbon Bookends: A 16-Month Mirror
          </h3>

          <p className="text-sm font-sans-ui text-[#cbd5e1] leading-relaxed">
            Lisbon appears at both ends of this digital ledger. The data proves it was not the city that changed, but the person walking its cobblestones:
          </p>

          <div className="grid grid-cols-2 gap-4 pt-1 text-xs font-mono-receipt">
            <div className="p-4 rounded-2xl bg-[#08090f] border border-white/[0.06] space-y-2">
              <span className="text-[#fb7185] font-bold text-xs block">LISBON · FEB 2024</span>
              <p className="text-[#94a3b8] font-sans-ui leading-relaxed">
                Single hostel bunk, 45L backpack, "cheap hostels lisbon" query. Note: "I keep checking flight prices like a personality trait."
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#08090f] border border-white/[0.06] space-y-2">
              <span className="text-[#10b981] font-bold text-xs block">LISBON · JUN 2025</span>
              <p className="text-[#94a3b8] font-sans-ui leading-relaxed">
                Two tickets, apartment rental with balcony over Alfama, ceramics for the new studio. Note: "I finally know what I was leaving."
              </p>
            </div>
          </div>
        </div>

        {/* Insight 5: The 8-Day Digital Silence */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0d0f17] p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-receipt px-3 py-1 rounded-full bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>THE 8-DAY DIGITAL SILENCE</span>
            </span>
            <span className="text-xs font-mono-receipt text-[#94a3b8]">
              Negative Space
            </span>
          </div>

          <h3 className="font-serif-story text-2xl sm:text-3xl text-[#fbf9f5] font-normal">
            When Life Outgrew The Screen
          </h3>

          <p className="text-sm font-sans-ui text-[#cbd5e1] leading-relaxed">
            The longest gap in the entire 18-month ledger occurred from <strong>Dec 20 to Dec 29, 2024 (8 consecutive days)</strong>. Not a single search, photo, or music track was recorded.
          </p>

          <div className="p-5 rounded-2xl bg-[#08090f] border border-white/[0.06] text-xs sm:text-sm font-serif-story italic text-[#cbd5e1] leading-relaxed">
            "Receipts are honest about absence. When a person is in genuine crisis or deep presence, the digital trail goes completely quiet. The silence ended on Dec 29 with a single purchase: two bus tickets into Cornwall."
          </div>
        </div>

        {/* Insight 6: Geographic Life Map */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0d0f17] p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-receipt px-3 py-1 rounded-full bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              <span>GEOGRAPHIC LIFE MAP</span>
            </span>
            <span className="text-xs font-mono-receipt text-[#94a3b8]">
              Spatial Odyssey
            </span>
          </div>

          <h3 className="font-serif-story text-2xl sm:text-3xl text-[#fbf9f5] font-normal">
            6 Cities Across 18 Months
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono-receipt pt-2">
            {[
              { city: 'Bristol', count: 184, role: 'The Home Base' },
              { city: 'Brighton', count: 72, role: 'The Coastal Respite' },
              { city: 'Lisbon', count: 96, role: 'The Mirror City' },
              { city: 'Porto', count: 38, role: 'The Rain & Rails' },
              { city: 'Cornwall', count: 44, role: 'The Turning Shore' },
              { city: 'Interlaken', count: 28, role: 'The High Alps' },
            ].map((loc) => (
              <div key={loc.city} className="p-3.5 rounded-2xl bg-[#08090f] border border-white/[0.06]">
                <div className="font-bold text-[#fbf9f5] text-sm">{loc.city}</div>
                <div className="text-[11px] text-[#f59e0b] mt-0.5">{loc.count} receipts</div>
                <div className="text-[10px] text-[#94a3b8] mt-0.5">{loc.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Innovative Psychological Persona Matrix & Interactive Life Passport */}
      <section className="rounded-3xl border border-amber-500/20 bg-gradient-to-b from-[#10131d] via-[#0b0d14] to-[#07080b] p-8 sm:p-12 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs font-mono-receipt text-amber-400">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>BEHAVIORAL SYNTHESIS // DIGITAL ARCHAEOLOGY</span>
            </div>
            <h2 className="font-serif-story text-2xl sm:text-4xl text-[#fbf9f5] font-normal">
              Psychological Persona & Life Passport
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playTick(1300)
                setIsPassportFlipped(!isPassportFlipped)
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono-receipt text-zinc-200 transition-all border border-zinc-700 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{isPassportFlipped ? 'Show Psychometrics' : 'Inspect Passport Stamps'}</span>
            </button>
            <button
              onClick={() => {
                sound.playTick(1500)
                window.print()
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono-receipt text-xs font-bold transition-all shadow-md shadow-amber-400/20 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Print Life Passport</span>
            </button>
          </div>
        </div>

        {/* Dynamic Card Face (Front: Psychometrics, Back: Passport Stamps) */}
        {!isPassportFlipped ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Persona Badge */}
            <div className="p-6 rounded-2xl bg-[#07080c] border border-amber-500/30 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-mono-receipt uppercase tracking-widest text-amber-400 block">
                  Determined Archetype
                </span>
                <h3 className="font-serif-story text-2xl text-[#fbf9f5] font-bold">
                  The Grounded Artisan
                </h3>
                <p className="font-sans-ui text-xs text-[#94a3b8] leading-relaxed">
                  Migrated from nocturnal existential wandering into grounded creative agency and interpersonal commitment.
                </p>
              </div>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono-receipt">
                <span className="text-zinc-400">Persona Confidence:</span>
                <span className="text-emerald-400 font-bold">96.4%</span>
              </div>
            </div>

            {/* Metric 1: Chronotype Evolution */}
            <div className="p-6 rounded-2xl bg-[#07080c] border border-white/[0.06] space-y-3">
              <span className="text-[10px] font-mono-receipt uppercase tracking-widest text-indigo-400 block">
                Sleep Chronotype
              </span>
              <div className="text-lg font-bold text-zinc-100 font-mono-receipt">
                Night Owl → Dawn Craftsman
              </div>
              <p className="font-sans-ui text-xs text-zinc-400 leading-relaxed">
                62% nocturnal density in Act II collapsed to under 7% by Act IV as 06:00 AM darkroom sessions took over.
              </p>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-amber-400 h-full w-[88%]" />
              </div>
            </div>

            {/* Metric 2: Emotional Resilience */}
            <div className="p-6 rounded-2xl bg-[#07080c] border border-white/[0.06] space-y-3">
              <span className="text-[10px] font-mono-receipt uppercase tracking-widest text-emerald-400 block">
                Emotional Resilience
              </span>
              <div className="text-3xl font-bold text-emerald-300 font-mono-receipt">
                89 <span className="text-sm font-normal text-zinc-400">/ 100</span>
              </div>
              <p className="font-sans-ui text-xs text-zinc-400 leading-relaxed">
                Measured by recovery velocity following the 8-day silence and the sustained +0.48 mood delta across 18 months.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-mono-receipt text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>High Adaptive Stability</span>
              </div>
            </div>

            {/* Metric 3: Social Gravitational Pull */}
            <div className="p-6 rounded-2xl bg-[#07080c] border border-white/[0.06] space-y-3">
              <span className="text-[10px] font-mono-receipt uppercase tracking-widest text-rose-400 block">
                Interpersonal Gravity
              </span>
              <div className="text-lg font-bold text-zinc-100 font-mono-receipt">
                Maya Arc (0.86 Index)
              </div>
              <p className="font-sans-ui text-xs text-zinc-400 leading-relaxed">
                18 paired receipts, 22 reciprocal messages, and the permanent relocation of coffee rituals to The Kiln.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-mono-receipt text-rose-400">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Anchored Partnership</span>
              </div>
            </div>
          </div>
        ) : (
          /* Back of Passport: Physical Passport Stamps & Visas */
          <div className="p-8 rounded-2xl bg-[#fbf9f3] text-[#171920] font-mono-receipt border-2 border-dashed border-[#a39c89] space-y-6">
            <div className="flex items-center justify-between border-b border-[#a39c89] pb-4">
              <div>
                <span className="text-xs font-bold tracking-widest block uppercase">OFFICIAL CITIZEN LIFE PASSPORT</span>
                <span className="text-[10px] text-[#525765]">REGISTRATION № L-2024-0466-UK</span>
              </div>
              <span className="px-3 py-1 bg-[#171920] text-[#fbf9f3] rounded text-xs font-bold">
                18-MONTH STAMP DOSSIER
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="border-2 border-dashed border-[#857d6b] p-3.5 rounded-xl text-center space-y-1 transform -rotate-1 bg-[#f4ede0]">
                <div className="text-[9px] uppercase tracking-wider text-[#636b7b]">PORTUGAL IMMIGRATION</div>
                <div className="font-bold text-sm">LISBOA · SANTA APOLÓNIA</div>
                <div className="text-[10px] text-amber-800">14 FEB 2024 · SOLO</div>
                <div className="text-[8px] text-[#857d6b]">STAMP № 0042</div>
              </div>

              <div className="border-2 border-dashed border-[#4f46e5] p-3.5 rounded-xl text-center space-y-1 transform rotate-2 bg-[#eef2ff]">
                <div className="text-[9px] uppercase tracking-wider text-indigo-700">THE NOCTURNAL ZONE</div>
                <div className="font-bold text-sm text-indigo-950">2 AM CURVE ENTRY</div>
                <div className="text-[10px] text-indigo-800">03 JUN 2024 · INSOMNIA</div>
                <div className="text-[8px] text-indigo-500">RADIUS 02:00–04:00</div>
              </div>

              <div className="border-2 border-dashed border-[#e11d48] p-3.5 rounded-xl text-center space-y-1 transform -rotate-2 bg-[#fff1f2]">
                <div className="text-[9px] uppercase tracking-wider text-rose-700">THE KILN SANCTUARY</div>
                <div className="font-bold text-sm text-rose-950">SHARED TABLE PERMIT</div>
                <div className="text-[10px] text-rose-800">01 SEP 2024 · WITH MAYA</div>
                <div className="text-[8px] text-rose-500">WHALE MUG APPROVED</div>
              </div>

              <div className="border-2 border-dashed border-[#16a34a] p-3.5 rounded-xl text-center space-y-1 transform rotate-1 bg-[#f0fdf4]">
                <div className="text-[9px] uppercase tracking-wider text-emerald-700">LISBOA RETURN</div>
                <div className="font-bold text-sm text-emerald-950">TWO TICKETS CONFIRMED</div>
                <div className="text-[10px] text-emerald-800">18 JUN 2025 · FULL CIRCLE</div>
                <div className="text-[8px] text-emerald-500">JOURNEY COMPLETE</div>
              </div>
            </div>

            <div className="text-center text-[10px] text-[#525765] pt-2 italic">
              "Authenticated by 466 discrete life receipts. No further validation required."
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
