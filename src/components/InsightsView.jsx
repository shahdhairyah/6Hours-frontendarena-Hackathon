import { useState } from 'react'
import {
  Lightbulb,
  Moon,
  Clock,
  Heart,
  MapPin,
  Coffee,
  Volume2,
  Calendar,
  ArrowRight,
  TrendingUp,
  Compass,
  CheckCircle2,
  Sparkles,
  Sun,
  ShieldCheck,
  Zap
} from 'lucide-react'
import { sound } from '../audio/soundEngine'

export default function InsightsView({
  narrative,
  stats,
  chapters,
  onSelectReceipt,
  onSwitchTab
}) {
  const hours = stats.byHour || new Array(24).fill(0)
  const maxHourCount = Math.max(...hours, 1)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-16">
      {/* Dossier Cover Header */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono-receipt text-[#f59e0b]">
          <Lightbulb className="w-3.5 h-3.5" />
          <span className="tracking-wider">PATTERN DOSSIER // WHAT DOES IT ALL MEAN?</span>
        </div>

        <h1 className="font-serif-story text-3xl sm:text-6xl text-[#fbf9f5] font-normal tracking-tight">
          The Life Hidden Beneath The Ledger
        </h1>

        <p className="font-sans-ui text-sm sm:text-lg text-[#9da5b8] max-w-3xl leading-relaxed">
          Raw data only answers <span className="text-[#fbf9f5] italic">what happened</span>. These algorithmic investigations reveal <span className="text-[#f59e0b] font-semibold">what it meant</span>: how circadian rhythms exposed unspoken anxiety, how another human stabilized the clock, and how a city was revisited by a completely transformed self.
        </p>
      </section>

      {/* 6 Key Investigation Dossiers in a Masterpiece Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Insight 1: The 2 AM Curve */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0d0f17] p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-receipt px-3 py-1 rounded-full bg-[#6366f1]/15 text-[#818cf8] border border-[#6366f1]/30 flex items-center gap-2">
              <Moon className="w-3.5 h-3.5" />
              <span>THE 2 A.M. CURVE</span>
            </span>
            <span className="text-xs font-mono-receipt text-[#62697b]">
              Circadian Clock Analysis
            </span>
          </div>

          <h3 className="font-serif-story text-2xl sm:text-3xl text-[#fbf9f5] font-normal">
            When Insomnia Kept Its Own Ledger
          </h3>

          <p className="text-sm font-sans-ui text-[#9ea6ba] leading-relaxed">
            In Act II (Spring/Summer 2024), <strong>62% of all digital moments</strong> occurred between midnight and 4:00 AM. Inquiries like <em>"why can't I sleep"</em> and late-night listening to Bon Iver cluster heavily at 02:40. By Act IV, this nocturnal spike collapsed to 2% as early dawns took over.
          </p>

          {/* 24-Hour Circadian Bar Histogram */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono-receipt text-[#6f778c]">
              <span className="flex items-center gap-1.5">
                <Moon className="w-3 h-3 text-[#818cf8]" />
                <span>24-Hour Activity Spread (00h → 23h)</span>
              </span>
              <span className="text-[#f59e0b] font-bold">Peak Nocturnal Spike: 02:00 – 03:00 AM</span>
            </div>

            <div className="grid grid-cols-24 gap-1 h-24 items-end bg-[#07080c] p-3 rounded-2xl border border-white/[0.06]">
              {hours.map((count, h) => {
                const heightPct = Math.round((count / maxHourCount) * 100)
                const isNight = h >= 0 && h <= 4
                return (
                  <div
                    key={h}
                    title={`${h}:00 — ${count} receipts`}
                    className="h-full flex flex-col justify-end group relative cursor-pointer"
                  >
                    <div
                      style={{ height: `${Math.max(heightPct, 8)}%` }}
                      className={`w-full rounded-sm transition-all group-hover:scale-y-110 ${
                        isNight ? 'bg-[#6366f1] opacity-90' : 'bg-[#f59e0b] opacity-60'
                      }`}
                    />
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between text-[10px] font-mono-receipt text-[#555d70] px-1">
              <span>00:00 (Midnight)</span>
              <span>06:00 (Dawn)</span>
              <span>12:00 (Noon)</span>
              <span>18:00 (Dusk)</span>
              <span>23:00</span>
            </div>
          </div>
        </div>

        {/* Insight 2: The Maya Inflection Point */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0d0f17] p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-receipt px-3 py-1 rounded-full bg-[#f43f5e]/15 text-[#fb7185] border border-[#f43f5e]/30 flex items-center gap-2">
              <Heart className="w-3.5 h-3.5" />
              <span>THE MAYA INFLECTION POINT</span>
            </span>
            <span className="text-xs font-mono-receipt text-[#62697b]">
              Interpersonal Impact
            </span>
          </div>

          <h3 className="font-serif-story text-2xl sm:text-3xl text-[#fbf9f5] font-normal">
            The Person Who Reset The Clock
          </h3>

          <p className="text-sm font-sans-ui text-[#9ea6ba] leading-relaxed">
            The first message from Maya arrives on <strong>Sep 1 at 22:14</strong>. The mathematical shift before and after this single receipt is undeniable:
          </p>

          {/* Before & After Comparative Matrix */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-[#08090f] border border-white/[0.06] space-y-2">
              <span className="text-[10px] font-mono-receipt uppercase tracking-widest text-[#687084] block">
                BEFORE MAYA (JAN–AUG 2024)
              </span>
              <div className="text-2xl font-mono-receipt font-bold text-[#818cf8]">
                46% Night Owl
              </div>
              <p className="text-xs text-[#6e778c] font-sans-ui">
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
              <p className="text-xs text-[#9aa3b6] font-sans-ui">
                Avg mood 0.74 (Warm / Bright). Paired breakfasts and shared tickets.
              </p>
            </div>
          </div>

          <div className="text-xs font-serif-story italic text-[#a3abc0] pt-1 border-l-2 border-[#fb7185]/60 pl-3">
            "Purchases change from solitary insomnia teas to paired breakfasts and shared train tickets."
          </div>
        </div>

        {/* Insight 3: The Anchor of The Kiln */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0d0f17] p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-receipt px-3 py-1 rounded-full bg-[#eab308]/15 text-[#facc15] border border-[#eab308]/30 flex items-center gap-2">
              <Coffee className="w-3.5 h-3.5" />
              <span>THE KILN CAFE ANCHOR</span>
            </span>
            <span className="text-xs font-mono-receipt text-[#62697b]">
              Spatial Psychology
            </span>
          </div>

          <h3 className="font-serif-story text-2xl sm:text-3xl text-[#fbf9f5] font-normal">
            From Anonymous Coffee To The Regular Table
          </h3>

          <p className="text-sm font-sans-ui text-[#9ea6ba] leading-relaxed">
            Five receipts in the ledger share the exact merchant address: <strong>The Kiln</strong>. Their sequence documents a gradual psychological anchoring:
          </p>

          <div className="space-y-2.5 text-xs font-mono-receipt text-[#8d95a7]">
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

        {/* Insight 4: Same City, Different Self (Lisbon Bookends) */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0d0f17] p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-receipt px-3 py-1 rounded-full bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5" />
              <span>SAME CITY, DIFFERENT SELF</span>
            </span>
            <span className="text-xs font-mono-receipt text-[#62697b]">
              Geographic Mirror
            </span>
          </div>

          <h3 className="font-serif-story text-2xl sm:text-3xl text-[#fbf9f5] font-normal">
            Lisbon Bookends: A 16-Month Mirror
          </h3>

          <p className="text-sm font-sans-ui text-[#9ea6ba] leading-relaxed">
            Lisbon appears at both ends of this digital ledger. The data proves it was not the city that changed, but the person walking its cobblestones:
          </p>

          <div className="grid grid-cols-2 gap-4 pt-1 text-xs font-mono-receipt">
            <div className="p-4 rounded-2xl bg-[#08090f] border border-white/[0.06] space-y-2">
              <span className="text-[#fb7185] font-bold text-xs block">LISBON · FEB 2024</span>
              <p className="text-[#848c9f] font-sans-ui leading-relaxed">
                Single hostel bunk, 45L backpack, "cheap hostels lisbon" query. Note: "I keep checking flight prices like a personality trait."
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#08090f] border border-white/[0.06] space-y-2">
              <span className="text-[#10b981] font-bold text-xs block">LISBON · JUN 2025</span>
              <p className="text-[#848c9f] font-sans-ui leading-relaxed">
                Two tickets, apartment rental with balcony over Alfama, ceramics for the new studio. Note: "I finally know what I was leaving."
              </p>
            </div>
          </div>
        </div>

        {/* Insight 5: The 8-Day Digital Silence */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0d0f17] p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-receipt px-3 py-1 rounded-full bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>THE 8-DAY DIGITAL SILENCE</span>
            </span>
            <span className="text-xs font-mono-receipt text-[#62697b]">
              Negative Space
            </span>
          </div>

          <h3 className="font-serif-story text-2xl sm:text-3xl text-[#fbf9f5] font-normal">
            When Life Outgrew The Screen
          </h3>

          <p className="text-sm font-sans-ui text-[#9ea6ba] leading-relaxed">
            The longest gap in the entire 18-month ledger occurred from <strong>Dec 20 to Dec 29, 2024 (8 consecutive days)</strong>. Not a single search, photo, or music track was recorded.
          </p>

          <div className="p-5 rounded-2xl bg-[#08090f] border border-white/[0.06] text-xs sm:text-sm font-serif-story italic text-[#c4cbd9] leading-relaxed">
            "Receipts are honest about absence. When a person is in genuine crisis or deep presence, the digital trail goes completely quiet. The silence ended on Dec 29 with a single purchase: two bus tickets into Cornwall."
          </div>
        </div>

        {/* Insight 6: Geographic Life Map */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0d0f17] p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-receipt px-3 py-1 rounded-full bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>GEOGRAPHIC LIFE MAP</span>
            </span>
            <span className="text-xs font-mono-receipt text-[#62697b]">
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
                <div className="text-[10px] text-[#636b7f] mt-0.5">{loc.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
