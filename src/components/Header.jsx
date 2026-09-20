import {
  BookOpen,
  Receipt,
  Network,
  Lightbulb,
  Film,
  VolumeX,
  Printer,
  UploadCloud,
  Star
} from 'lucide-react'
import { sound } from '../audio/soundEngine'

/**
 * Accessible luxury header with tab navigation, ambient sound equalizer, and quick actions.
 */
export default function Header({
  activeTab,
  setActiveTab,
  stats,
  onOpenCinema,
  onOpenPrint,
  onOpenUpload,
  isCustomData,
  bookmarkCount = 0,
  onToggleSavedOnly,
  isShowingSavedOnly
}) {
  const isAudioActive = !sound.isMuted

  const handleToggleSound = () => {
    sound.toggleMute()
  }

  const navItems = [
    { id: 'story', label: 'Story & Narrative', icon: BookOpen, badge: '4 Acts' },
    { id: 'ledger', label: 'Thermal Ledger', icon: Receipt, badge: `${stats?.total || 466}` },
    { id: 'graph', label: 'Constellations', icon: Network, badge: 'Echoes' },
    { id: 'insights', label: 'Pattern Dossier', icon: Lightbulb, badge: 'Analysis' },
  ]

  return (
    <header role="banner" className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#08090d]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3.5 shrink-0">
            <button
              onClick={() => setActiveTab('story')}
              aria-label="LEDGER Home - View Life Story"
              className="relative group cursor-pointer focus-visible:ring-2 focus-visible:ring-[#f59e0b] rounded-xl outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b]/25 via-[#f43f5e]/20 to-[#6366f1]/25 border border-[#f59e0b]/40 flex items-center justify-center text-[#f59e0b] shadow-[0_0_20px_rgba(245,158,11,0.15)] group-hover:scale-105 transition-transform">
                <Receipt className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#10b981] border-2 border-[#08090d]" title="Engine Active" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-receipt font-bold tracking-wider text-base text-[#fbf9f5]">
                  LEDGER
                </span>
                <span className="text-[9px] uppercase tracking-widest font-mono-receipt px-1.5 py-0.5 rounded-full bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30">
                  LIFE IN RECEIPTS
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#94a3b8] font-mono-receipt hidden sm:flex">
                <span>18-Month Chronicle</span>
                <span>·</span>
                <span className="text-[#cbd5e1]">Bristol → Lisbon → The Alps</span>
              </div>
            </div>
          </div>

          {/* Center Navigation Bar */}
          <nav role="tablist" aria-label="Main Navigation" className="hidden md:flex items-center gap-1.5 bg-[#0f1118]/80 p-1.5 rounded-2xl border border-white/[0.08] shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  role="tab"
                  id={`tab-${item.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${item.id}`}
                  onClick={() => {
                    sound.playTick(1400)
                    setActiveTab(item.id)
                  }}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-sans-ui font-medium transition-all focus-visible:ring-2 focus-visible:ring-[#f59e0b] outline-none ${
                    isActive
                      ? 'bg-gradient-to-r from-white/[0.12] to-white/[0.05] text-[#fbf9f5] shadow-sm border border-white/[0.12]'
                      : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#f59e0b]' : 'text-[#64748b]'}`} aria-hidden="true" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono-receipt px-1.5 py-0.2 rounded-md ${
                        isActive
                          ? 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30'
                          : 'bg-[#151822] text-[#64748b]'
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
            {/* Bookmarked / Saved Receipts Quick Filter */}
            {bookmarkCount > 0 && onToggleSavedOnly && (
              <button
                onClick={onToggleSavedOnly}
                aria-label={`View ${bookmarkCount} saved receipts`}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono-receipt border transition-all focus-visible:ring-2 focus-visible:ring-[#f59e0b] outline-none ${
                  isShowingSavedOnly
                    ? 'bg-[#f59e0b]/25 border-[#f59e0b] text-[#f59e0b]'
                    : 'bg-[#13151f] border-white/[0.08] text-[#e2e8f0] hover:border-[#f59e0b]/40'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                <span className="font-bold">{bookmarkCount}</span>
                <span className="hidden xl:inline text-[10px] text-[#94a3b8]">Saved</span>
              </button>
            )}

            {/* Cinema Reel Launch */}
            <button
              onClick={() => {
                sound.playChime(660, 'triangle', 1.2)
                onOpenCinema()
              }}
              aria-label="Launch Guided Cinematic Experience"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans-ui font-semibold bg-gradient-to-r from-[#f59e0b] via-[#fb7185] to-[#6366f1] text-[#07080b] hover:opacity-95 hover:shadow-[0_0_24px_rgba(245,158,11,0.35)] transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-white outline-none"
            >
              <Film className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
              <span className="hidden sm:inline font-bold">Cinema Reel</span>
            </button>

            {/* Print Slip */}
            <button
              onClick={() => {
                sound.playPaperRustle()
                onOpenPrint()
              }}
              aria-label="Generate and Print Thermal Life Receipt"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-sans-ui font-medium bg-[#13151f] border border-white/[0.08] text-[#e2e8f0] hover:border-[#f59e0b]/40 hover:text-[#fbf9f5] transition-all focus-visible:ring-2 focus-visible:ring-[#f59e0b] outline-none"
            >
              <Printer className="w-3.5 h-3.5 text-[#f59e0b]" aria-hidden="true" />
              <span className="hidden lg:inline">Print Slip</span>
            </button>

            {/* Audio Toggle with Equalizer */}
            <button
              onClick={handleToggleSound}
              aria-label={isAudioActive ? 'Mute ambient soundscape' : 'Enable ambient soundscape and tactile audio'}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-all focus-visible:ring-2 focus-visible:ring-[#f59e0b] outline-none ${
                isAudioActive
                  ? 'bg-[#f59e0b]/15 border-[#f59e0b]/40 text-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-[#13151f] border-white/[0.08] text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              {isAudioActive ? (
                <>
                  <div className="flex items-end gap-0.5 h-3.5" aria-hidden="true">
                    <span className="w-0.5 bg-[#f59e0b] animate-sound-1 rounded-full" />
                    <span className="w-0.5 bg-[#f59e0b] animate-sound-2 rounded-full" />
                    <span className="w-0.5 bg-[#f59e0b] animate-sound-3 rounded-full" />
                  </div>
                  <span className="hidden xl:inline font-mono-receipt text-[10px]">SOUND ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" aria-hidden="true" />
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
              aria-label="Dataset Configuration and Kaggle CSV Upload"
              className={`p-2 rounded-xl border transition-all focus-visible:ring-2 focus-visible:ring-[#f59e0b] outline-none ${
                isCustomData
                  ? 'bg-[#10b981]/15 border-[#10b981]/40 text-[#10b981]'
                  : 'bg-[#13151f] border-white/[0.08] text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              <UploadCloud className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div role="tablist" aria-label="Mobile Navigation Tabs" className="flex md:hidden items-center justify-between py-2.5 border-t border-white/[0.06] gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  sound.playTick(1400)
                  setActiveTab(item.id)
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans-ui whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#181b26] text-[#f59e0b] border border-[#f59e0b]/30'
                    : 'text-[#94a3b8]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}
