import { useState } from 'react'
import {
  BookOpen,
  Receipt,
  Network,
  Lightbulb,
  Film,
  Volume2,
  VolumeX,
  Printer,
  UploadCloud,
  Sparkles,
  Compass,
  Activity
} from 'lucide-react'
import { sound } from '../audio/soundEngine'

export default function Header({
  activeTab,
  setActiveTab,
  stats,
  onOpenCinema,
  onOpenPrint,
  onOpenUpload,
  isCustomData
}) {
  const [isAudioActive, setIsAudioActive] = useState(false)

  const handleToggleSound = () => {
    const newState = sound.toggleMute()
    setIsAudioActive(newState)
  }

  const navItems = [
    { id: 'story', label: 'Story & Narrative', icon: BookOpen, badge: '4 Acts' },
    { id: 'ledger', label: 'Thermal Ledger', icon: Receipt, badge: `${stats?.total || 466}` },
    { id: 'graph', label: 'Constellations', icon: Network, badge: 'Echoes' },
    { id: 'insights', label: 'Pattern Dossier', icon: Lightbulb, badge: 'Analysis' },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#08090d]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3.5 shrink-0">
            <div className="relative group cursor-pointer" onClick={() => setActiveTab('story')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b]/25 via-[#f43f5e]/20 to-[#6366f1]/25 border border-[#f59e0b]/40 flex items-center justify-center text-[#f59e0b] shadow-[0_0_20px_rgba(245,158,11,0.15)] group-hover:scale-105 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#10b981] border-2 border-[#08090d]" title="Engine Active" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-receipt font-bold tracking-wider text-base text-[#fbf9f5]">
                  LEDGER
                </span>
                <span className="text-[9px] uppercase tracking-widest font-mono-receipt px-1.5 py-0.5 rounded-full bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30">
                  LIFE IN RECEIPTS
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#71788c] font-mono-receipt hidden sm:flex">
                <span>18-Month Ledger</span>
                <span>·</span>
                <span className="text-[#a4adbf]">Bristol → Lisbon → The Alps</span>
              </div>
            </div>
          </div>

          {/* Center Navigation Bar */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#0f1118]/80 p-1.5 rounded-2xl border border-white/[0.08] shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playTick(1400)
                    setActiveTab(item.id)
                  }}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-sans-ui font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-white/[0.12] to-white/[0.05] text-[#fbf9f5] shadow-sm border border-white/[0.12]'
                      : 'text-[#848b9f] hover:text-[#e2e5ee] hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#f59e0b]' : 'text-[#61687a]'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono-receipt px-1.5 py-0.2 rounded-md ${
                        isActive
                          ? 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30'
                          : 'bg-[#151822] text-[#6b7387]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Right Action Suite */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Cinema Reel Launch */}
            <button
              onClick={() => {
                sound.playChime(660, 'triangle', 1.2)
                onOpenCinema()
              }}
              title="Launch Guided Cinematic Experience"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans-ui font-semibold bg-gradient-to-r from-[#f59e0b] via-[#fb7185] to-[#6366f1] text-[#07080b] hover:opacity-95 hover:shadow-[0_0_24px_rgba(245,158,11,0.35)] transition-all active:scale-95"
            >
              <Film className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline font-bold">Cinema Reel</span>
            </button>

            {/* Print Slip */}
            <button
              onClick={() => {
                sound.playPaperRustle()
                onOpenPrint()
              }}
              title="Generate Printable Thermal Receipt"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-sans-ui font-medium bg-[#13151f] border border-white/[0.08] text-[#c5c9d6] hover:border-[#f59e0b]/40 hover:text-[#fbf9f5] transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span className="hidden lg:inline">Print Slip</span>
            </button>

            {/* Audio Toggle with Equalizer */}
            <button
              onClick={handleToggleSound}
              title={isAudioActive ? 'Mute ambient soundscape' : 'Enable ambient soundscape & tactile feedback'}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-all ${
                isAudioActive
                  ? 'bg-[#f59e0b]/15 border-[#f59e0b]/40 text-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-[#13151f] border-white/[0.08] text-[#71788c] hover:text-[#c5c9d6]'
              }`}
            >
              {isAudioActive ? (
                <>
                  <div className="flex items-end gap-0.5 h-3.5">
                    <span className="w-0.5 bg-[#f59e0b] animate-sound-1 rounded-full" />
                    <span className="w-0.5 bg-[#f59e0b] animate-sound-2 rounded-full" />
                    <span className="w-0.5 bg-[#f59e0b] animate-sound-3 rounded-full" />
                  </div>
                  <span className="hidden xl:inline font-mono-receipt text-[10px]">AMBIENT ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden xl:inline font-mono-receipt text-[10px]">SOUND OFF</span>
                </>
              )}
            </button>

            {/* Dataset Switcher */}
            <button
              onClick={() => {
                sound.playTick(1000)
                onOpenUpload()
              }}
              title="Dataset Details & Kaggle CSV Upload"
              className={`p-2 rounded-xl border transition-all ${
                isCustomData
                  ? 'bg-[#10b981]/15 border-[#10b981]/40 text-[#10b981]'
                  : 'bg-[#13151f] border-white/[0.08] text-[#7a8195] hover:text-[#d3d7e5]'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="flex md:hidden items-center justify-between py-2.5 border-t border-white/[0.06] gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playTick(1400)
                  setActiveTab(item.id)
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans-ui whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#181b26] text-[#f59e0b] border border-[#f59e0b]/30'
                    : 'text-[#7d8495]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}
