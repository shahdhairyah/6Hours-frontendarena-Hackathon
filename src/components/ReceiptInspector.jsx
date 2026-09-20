import { useState } from 'react'
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Sparkles,
  DollarSign,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Code,
  FileText,
  User
} from 'lucide-react'
import { TYPE_META, MOOD_META } from '../engine/types'
import { fmtDate, fmtTime, fmtCurrency } from '../utils/formatters'
import { sound } from '../audio/soundEngine'

export default function ReceiptInspector({
  receipt,
  onClose,
  threads,
  onSelectReceipt
}) {
  const [showRawJson, setShowRawJson] = useState(false)

  if (!receipt) return null

  const meta = TYPE_META[receipt.type] || { label: receipt.type, short: '◈', color: '#e0a458' }
  const mood = MOOD_META[receipt.mood] || { label: receipt.mood, color: '#9aa0a6' }
  const connections = threads.adjacency.get(receipt.id) || []

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#050608]/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg h-full bg-[#10121a] border-l border-[#242838] shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-5 border-b border-[#1f2332] bg-[#10121a]/95 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: meta.color }}
            />
            <span className="text-xs font-mono-receipt font-bold text-[#e0a458] uppercase">
              RECEIPT INSPECTOR // № {receipt.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              title="Toggle Raw Kaggle JSON Data"
              className={`p-1.5 rounded-lg border text-xs font-mono-receipt transition-colors ${
                showRawJson
                  ? 'bg-[#e0a458]/20 border-[#e0a458] text-[#e0a458]'
                  : 'bg-[#151822] border-[#222736] text-[#71788a] hover:text-[#d3d8e5]'
              }`}
            >
              <Code className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#151822] hover:bg-[#202434] text-[#798194] hover:text-[#f0f3fa] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Thermal Slip Physical Card */}
          <div className="bg-[#f8f6f0] text-[#1c1d22] rounded-xl p-5 shadow-lg border border-[#d8d3c5] space-y-3 font-mono-receipt">
            <div className="flex items-center justify-between text-[11px] text-[#5c616f] border-b border-dashed border-[#aca698] pb-2">
              <span className="font-bold uppercase tracking-wider">{meta.label} TRANSACTION</span>
              <span>{receipt.timeStr} UTC</span>
            </div>

            <h3 className="font-bold text-base text-[#111215] leading-snug">
              {receipt.heading}
            </h3>

            {receipt.body && (
              <p className="text-xs text-[#4b505c] leading-relaxed italic">
                "{receipt.body}"
              </p>
            )}

            <div className="pt-2 border-t border-dashed border-[#aca698] flex items-center justify-between text-[11px] text-[#424652]">
              <span>DATE: {fmtDate(receipt.dt)}</span>
              {receipt.amount ? (
                <span className="font-bold">{fmtCurrency(receipt.amount, receipt.currency)}</span>
              ) : (
                <span className="text-[#7d8392]">MOMENT LOG</span>
              )}
            </div>
          </div>

          {/* Raw JSON or Interpreted Breakdown */}
          {showRawJson ? (
            <div className="space-y-2">
              <span className="text-[11px] font-mono-receipt text-[#687082] uppercase">
                Raw Kaggle Dataset Record
              </span>
              <pre className="p-4 rounded-xl bg-[#0a0b10] border border-[#1b1e2a] text-xs font-mono-receipt text-[#7fc6a8] overflow-x-auto">
                {JSON.stringify(receipt, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Metadata Badges */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono-receipt">
                <div className="p-3 rounded-xl bg-[#141722] border border-[#202534] space-y-1">
                  <span className="text-[#656d80] text-[10px] uppercase tracking-wider block">
                    Emotional Mood
                  </span>
                  <span
                    className="font-bold capitalize"
                    style={{ color: mood.color }}
                  >
                    {mood.label}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#141722] border border-[#202534] space-y-1">
                  <span className="text-[#656d80] text-[10px] uppercase tracking-wider block">
                    Circadian Time
                  </span>
                  <span className="text-[#d8dce8] font-bold capitalize">
                    {receipt.timeOfDay} {receipt.isNight ? '(Night Owl)' : ''}
                  </span>
                </div>

                {receipt.city && (
                  <div className="p-3 rounded-xl bg-[#141722] border border-[#202534] space-y-1">
                    <span className="text-[#656d80] text-[10px] uppercase tracking-wider block">
                      Geographic Locus
                    </span>
                    <span className="text-[#e0a458] font-bold">
                      📍 {receipt.city}
                    </span>
                  </div>
                )}

                {receipt.counterpart && (
                  <div className="p-3 rounded-xl bg-[#141722] border border-[#202534] space-y-1">
                    <span className="text-[#656d80] text-[10px] uppercase tracking-wider block">
                      Human Presence
                    </span>
                    <span className="text-[#d2869a] font-bold">
                      With {receipt.counterpart}
                    </span>
                  </div>
                )}
              </div>

              {/* Tags Section */}
              {receipt.tags?.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono-receipt text-[#62697b] uppercase tracking-wider block">
                    Semantic Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {receipt.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono-receipt px-2 py-0.5 rounded-md bg-[#161924] border border-[#232738] text-[#9ba3b8]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Connected Threads & Echoes */}
              <div className="space-y-3 pt-4 border-t border-[#1e2230]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono-receipt text-[#e0a458]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>CONNECTED THREADS & ECHOES ({connections.length})</span>
                  </div>
                </div>

                {connections.length === 0 ? (
                  <p className="text-xs font-mono-receipt text-[#656d7e] italic py-2">
                    This moment sits as a solitary anchor in the ledger.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {connections.map((edge, eIdx) => {
                      const target = threads.byId.get(edge.toId)
                      if (!target) return null
                      const targetMeta = TYPE_META[target.type] || { short: '◈', color: '#e0a458' }

                      return (
                        <div
                          key={eIdx}
                          onClick={() => {
                            sound.playPaperRustle()
                            onSelectReceipt(target)
                          }}
                          className="group p-3 rounded-xl bg-[#131620] hover:bg-[#181c28] border border-[#212636] hover:border-[#e0a458]/50 transition-all cursor-pointer space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono-receipt text-[#6e7689]">
                            <span className="flex items-center gap-1 text-[#d5dae7]">
                              <span style={{ color: targetMeta.color }}>{targetMeta.short}</span>
                              <span className="font-bold uppercase">{target.type}</span>
                              <span>№ {target.id}</span>
                            </span>
                            <span>{fmtDate(target.dt)}</span>
                          </div>

                          <div className="text-xs font-mono-receipt font-semibold text-[#f0ede6] group-hover:text-[#e0a458] transition-colors truncate">
                            {target.heading}
                          </div>

                          {edge.links?.length > 0 && (
                            <div className="text-[11px] font-sans-ui text-[#9098ac] italic">
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
        <div className="p-4 border-t border-[#1f2332] bg-[#0c0d12] flex items-center justify-between text-[11px] font-mono-receipt text-[#62697b]">
          <span>LEDGER ENGINE V2.0</span>
          <span>PRESS ESC TO CLOSE</span>
        </div>
      </div>
    </div>
  )
}
