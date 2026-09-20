import { useState } from 'react'
import {
  X,
  Sparkles,
  Code,
  Star
} from 'lucide-react'
import { TYPE_META, MOOD_META } from '../engine/types'
import { fmtDate, fmtCurrency } from '../utils/formatters'
import { sound } from '../audio/soundEngine'

/**
 * ReceiptInspector: Slide-over drawer with full metadata breakdown and thread navigation.
 */
export default function ReceiptInspector({
  receipt,
  onClose,
  threads,
  onSelectReceipt,
  isBookmarked,
  onToggleBookmark
}) {
  const [showRawJson, setShowRawJson] = useState(false)

  if (!receipt) return null

  const meta = TYPE_META[receipt.type] || { label: receipt.type, short: '◈', color: '#f59e0b' }
  const mood = MOOD_META[receipt.mood] || { label: receipt.mood, color: '#94a3b8' }
  const connections = threads.adjacency.get(receipt.id) || []
  const bookmarked = isBookmarked && isBookmarked(receipt.id)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspector-heading"
      className="fixed inset-0 z-50 flex justify-end bg-[#050608]/75 backdrop-blur-sm animate-in fade-in"
    >
      <div className="w-full max-w-lg h-full bg-[#0e1017] border-l border-white/[0.08] shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-5 border-b border-white/[0.08] bg-[#0e1017]/95 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: meta.color }}
              aria-hidden="true"
            />
            <span id="inspector-heading" className="text-xs font-mono-receipt font-bold text-[#f59e0b] uppercase">
              RECEIPT INSPECTOR // № {receipt.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onToggleBookmark && (
              <button
                onClick={() => {
                  sound.playTick(1500)
                  onToggleBookmark(receipt.id)
                }}
                aria-label={bookmarked ? 'Remove saved receipt' : 'Save receipt to favorites'}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#94a3b8] hover:text-[#f59e0b] transition-colors"
              >
                <Star className={`w-4 h-4 ${bookmarked ? 'fill-[#f59e0b] text-[#f59e0b]' : ''}`} />
              </button>
            )}

            <button
              onClick={() => setShowRawJson(!showRawJson)}
              aria-label="Toggle Raw JSON Data"
              className={`p-2 rounded-xl border text-xs font-mono-receipt transition-colors ${
                showRawJson
                  ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#f59e0b]'
                  : 'bg-white/[0.04] border-white/[0.08] text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              <Code className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              aria-label="Close receipt inspector"
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#94a3b8] hover:text-[#fbf9f5] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Thermal Slip Physical Card */}
          <div className="thermal-slip rounded-2xl p-6 shadow-lg border border-[#d6cfbe] space-y-3 font-mono-receipt">
            <div className="flex items-center justify-between text-[11px] text-[#525765] border-b border-dashed border-[#9c9584] pb-2.5">
              <span className="font-bold uppercase tracking-wider">{meta.label} TRANSACTION</span>
              <span>{receipt.timeStr} UTC</span>
            </div>

            <h3 className="font-bold text-base text-[#111217] leading-snug">
              {receipt.heading}
            </h3>

            {receipt.body && (
              <p className="text-xs text-[#474c58] leading-relaxed italic">
                "{receipt.body}"
              </p>
            )}

            <div className="pt-2.5 border-t border-dashed border-[#9c9584] flex items-center justify-between text-[11px] text-[#171920]">
              <span>DATE: {fmtDate(receipt.dt)}</span>
              {receipt.amount ? (
                <span className="font-bold text-sm">{fmtCurrency(receipt.amount, receipt.currency)}</span>
              ) : (
                <span className="text-[#64748b]">MOMENT LOG</span>
              )}
            </div>
          </div>

          {/* Raw JSON or Interpreted Breakdown */}
          {showRawJson ? (
            <div className="space-y-2">
              <span className="text-[11px] font-mono-receipt text-[#94a3b8] uppercase">
                Raw Kaggle Dataset Record
              </span>
              <pre className="p-4 rounded-2xl bg-[#07080c] border border-white/[0.06] text-xs font-mono-receipt text-[#34d399] overflow-x-auto">
                {JSON.stringify(receipt, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Metadata Badges */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono-receipt">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                  <span className="text-[#94a3b8] text-[10px] uppercase tracking-wider block">
                    Emotional Mood
                  </span>
                  <span
                    className="font-bold capitalize"
                    style={{ color: mood.color }}
                  >
                    {mood.label}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                  <span className="text-[#94a3b8] text-[10px] uppercase tracking-wider block">
                    Circadian Time
                  </span>
                  <span className="text-[#fbf9f5] font-bold capitalize">
                    {receipt.timeOfDay} {receipt.isNight ? '(Night Owl)' : ''}
                  </span>
                </div>

                {receipt.city && (
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                    <span className="text-[#94a3b8] text-[10px] uppercase tracking-wider block">
                      Geographic Locus
                    </span>
                    <span className="text-[#f59e0b] font-bold">
                      📍 {receipt.city}
                    </span>
                  </div>
                )}

                {receipt.counterpart && (
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                    <span className="text-[#94a3b8] text-[10px] uppercase tracking-wider block">
                      Human Presence
                    </span>
                    <span className="text-[#fb7185] font-bold">
                      With {receipt.counterpart}
                    </span>
                  </div>
                )}
              </div>

              {/* Tags Section */}
              {receipt.tags?.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono-receipt text-[#94a3b8] uppercase tracking-wider block">
                    Semantic Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {receipt.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono-receipt px-2.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#cbd5e1]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Connected Threads & Echoes */}
              <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono-receipt text-[#f59e0b]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>CONNECTED THREADS & ECHOES ({connections.length})</span>
                  </div>
                </div>

                {connections.length === 0 ? (
                  <p className="text-xs font-mono-receipt text-[#94a3b8] italic py-2">
                    This moment sits as a solitary anchor in the ledger.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {connections.map((edge, eIdx) => {
                      const target = threads.byId.get(edge.toId)
                      if (!target) return null
                      const targetMeta = TYPE_META[target.type] || { short: '◈', color: '#f59e0b' }

                      return (
                        <div
                          key={eIdx}
                          onClick={() => {
                            sound.playPaperRustle()
                            onSelectReceipt(target)
                          }}
                          className="group p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-[#f59e0b]/50 transition-all cursor-pointer space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono-receipt text-[#94a3b8]">
                            <span className="flex items-center gap-1.5 text-[#fbf9f5]">
                              <span style={{ color: targetMeta.color }}>{targetMeta.short}</span>
                              <span className="font-bold uppercase">{target.type}</span>
                              <span>№ {target.id}</span>
                            </span>
                            <span>{fmtDate(target.dt)}</span>
                          </div>

                          <div className="text-xs font-mono-receipt font-bold text-[#fbf9f5] group-hover:text-[#f59e0b] transition-colors truncate">
                            {target.heading}
                          </div>

                          {edge.links?.length > 0 && (
                            <div className="text-[11px] font-sans-ui text-[#94a3b8] italic">
                              ↳ {edge.links[0]?.label}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#07080c] flex items-center justify-between text-[11px] font-mono-receipt text-[#94a3b8]">
          <span>LEDGER ARCHIVE V3.1</span>
          <span>PRESS ESC TO CLOSE</span>
        </div>
      </div>
    </div>
  )
}
