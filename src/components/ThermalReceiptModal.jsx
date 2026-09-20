import { useState } from 'react'
import {
  X,
  Printer,
  Copy,
  Check,
  Sparkles,
  Download,
  Calendar,
  DollarSign
} from 'lucide-react'
import { sound } from '../audio/soundEngine'
import { fmtDate, fmtCurrency } from '../utils/formatters'

export default function ThermalReceiptModal({
  isOpen,
  onClose,
  receipts,
  chapters,
  stats
}) {
  const [copied, setCopied] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('highlights')

  if (!isOpen) return null

  // Highlights / sample selection
  const printableList =
    selectedFilter === 'highlights'
      ? receipts.filter((r) => r.tags.includes('travel') || r.counterpart || r.tags.includes('2am-curve') || r.tags.includes('making')).slice(0, 24)
      : receipts.slice(0, 40)

  const handlePrint = () => {
    sound.playPaperRustle()
    window.print()
  }

  const handleCopyText = () => {
    sound.playTick(1500)
    const lines = [
      '========================================',
      '        THE LEDGER OF A LIFE            ',
      '   Authentic Digital Paper Trail        ',
      '========================================',
      `DATE SPAN: ${fmtDate(receipts[0]?.dt)} - ${fmtDate(receipts[receipts.length - 1]?.dt)}`,
      `TOTAL MOMENTS: ${receipts.length}`,
      '----------------------------------------',
      ...printableList.map(
        (r) =>
          `[${fmtDate(r.dt)}] ${r.heading} ${r.amount ? `(${fmtCurrency(r.amount, r.currency)})` : ''}`
      ),
      '----------------------------------------',
      `SUBTOTAL:    ${receipts.length} MEMORIES`,
      'TAX:         100% RECOVERY & BECOMING',
      'TOTAL:       1 TRANSFORMED LIFE',
      '========================================',
      '       THANK YOU FOR LIVING             ',
      '========================================',
    ]

    navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050608]/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#12141c] border border-[#262b3c] shadow-2xl p-6 space-y-6 max-h-[90vh] flex flex-col justify-between">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1f2434]">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-[#e0a458]" />
            <span className="text-xs font-mono-receipt font-bold text-[#f0ede6]">
              PHYSICAL THERMAL SLIP GENERATOR
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#161924] text-[#80889b] hover:text-[#f0f3fa]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Option Selection */}
        <div className="flex items-center gap-2 text-xs font-mono-receipt">
          <button
            onClick={() => setSelectedFilter('highlights')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              selectedFilter === 'highlights'
                ? 'bg-[#e0a458]/20 border-[#e0a458] text-[#e0a458]'
                : 'bg-[#151822] border-[#222736] text-[#788092]'
            }`}
          >
            Curated Highlights (24 Moments)
          </button>
          <button
            onClick={() => setSelectedFilter('extended')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              selectedFilter === 'extended'
                ? 'bg-[#e0a458]/20 border-[#e0a458] text-[#e0a458]'
                : 'bg-[#151822] border-[#222736] text-[#788092]'
            }`}
          >
            Extended Roll (40 Moments)
          </button>
        </div>

        {/* Printable Physical Slip Canvas */}
        <div className="thermal-receipt-print overflow-y-auto max-h-[480px] p-6 bg-[#f8f6f0] text-[#1c1d22] font-mono-receipt text-xs rounded-xl shadow-inner border border-[#d5d0c2] space-y-4">
          <div className="text-center space-y-1 border-b border-dashed border-[#8d887a] pb-4">
            <div className="text-sm font-bold tracking-wider">*** THE LEDGER OF A LIFE ***</div>
            <div className="text-[10px] text-[#555a67]">OFFICIAL DIGITAL PAPER TRAIL</div>
            <div className="text-[10px] text-[#707583]">STORE № 2024-2025 · BRISTOL / LISBON</div>
            <div className="text-[10px] text-[#555a67] pt-1">
              {fmtDate(receipts[0]?.dt)} → {fmtDate(receipts[receipts.length - 1]?.dt)}
            </div>
          </div>

          <div className="divide-y divide-dashed divide-[#cac4b6] text-[11px] space-y-2 py-2">
            {printableList.map((item) => (
              <div key={item.id} className="pt-2 flex justify-between gap-2">
                <div>
                  <span className="font-bold text-[#111215] block">{item.heading}</span>
                  <span className="text-[10px] text-[#5c6270]">
                    {fmtDate(item.dt)} · {item.type.toUpperCase()}
                  </span>
                </div>
                <span className="font-bold shrink-0">
                  {item.amount ? fmtCurrency(item.amount, item.currency) : '—'}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-[#8d887a] pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span>SUBTOTAL MEMORIES:</span>
              <span className="font-bold">{stats.total}</span>
            </div>
            <div className="flex justify-between">
              <span>ACTS COMPLETED:</span>
              <span className="font-bold">{chapters.length} CHAPTERS</span>
            </div>
            <div className="flex justify-between">
              <span>NIGHT RATIO (ACT II):</span>
              <span className="font-bold">62% (THE 2 AM CURVE)</span>
            </div>
            <div className="flex justify-between border-t border-dashed border-[#8d887a] pt-2 text-sm font-bold">
              <span>BALANCE:</span>
              <span>1 TRANSFORMED LIFE</span>
            </div>
          </div>

          {/* Barcode */}
          <div className="pt-4 flex flex-col items-center justify-center space-y-1 border-t border-dashed border-[#8d887a]">
            <div className="h-8 w-48 flex items-center justify-between text-[#1c1d22]">
              {[...Array(40)].map((_, i) => (
                <span
                  key={i}
                  className="barcode-line"
                  style={{
                    width: `${(i % 3) + 1}px`,
                    opacity: i % 5 === 0 ? 0.4 : 1
                  }}
                />
              ))}
            </div>
            <span className="text-[9px] tracking-widest text-[#727888]">
              * THANK YOU FOR LIVING *
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono-receipt bg-[#171a26] border border-[#262c3e] text-[#c5cbe0] hover:text-[#f5f2eb] hover:bg-[#1f2334] transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#5da88b]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied ASCII Receipt' : 'Copy ASCII'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-mono-receipt font-bold bg-[#e0a458] text-[#0c0e14] hover:opacity-90 transition-all shadow-md active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Thermal Slip</span>
          </button>
        </div>
      </div>
    </div>
  )
}
