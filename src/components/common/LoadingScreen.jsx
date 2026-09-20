import { Sparkles } from 'lucide-react'

/**
 * Polished loading screen during dataset compilation and chapter segmentation.
 */
export function LoadingScreen() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen bg-[#07080b] flex flex-col items-center justify-center space-y-5 text-center px-4"
    >
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f59e0b] via-[#fb7185] to-[#6366f1] flex items-center justify-center text-[#07080b] font-mono-receipt font-bold text-2xl shadow-[0_0_35px_rgba(245,158,11,0.3)] animate-pulse">
          §
        </div>
        <Sparkles className="w-4 h-4 text-[#f59e0b] absolute -top-1 -right-1 animate-spin" />
      </div>

      <div className="space-y-1.5 max-w-sm">
        <h2 className="font-serif-story text-2xl sm:text-3xl text-[#fbf9f5]">
          Reading The Ledger...
        </h2>
        <p className="text-xs font-mono-receipt text-[#8a92a5]">
          Segmenting chapters, weaving emotional threads & calculating circadian curves
        </p>
      </div>

      <span className="sr-only">Loading digital life receipts...</span>
    </div>
  )
}
