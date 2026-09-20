import { useState } from 'react'
import {
  X,
  Printer,
  Copy,
  Check,
  Download
} from 'lucide-react'
import { sound } from '../audio/soundEngine'
import { fmtDate, fmtCurrency } from '../utils/formatters'

/**
 * ThermalReceiptModal: Generates physical thermal paper rolls with print, ASCII copy, and Markdown export.
 */
export default function ThermalReceiptModal({
  isOpen,
  onClose,
  receipts,
  stats
}) {
  const [copied, setCopied] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('highlights')

  if (!isOpen) return null

  // Highlights / sample selection
  const printableList =
    selectedFilter === 'highlights'
      ? receipts?.filter((r) => r.tags?.includes('travel') || r.counterpart || r.tags?.includes('2am-curve') || r.tags?.includes('making')).slice(0, 24)
      : receipts?.slice(0, 40) || []

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

  const handleDownloadMarkdown = () => {
    sound.playChime(550, 'triangle', 0.6)
    const mdContent = `# LEDGER // Your Life, In Receipts
**Digital Paper Trail Archive · Jan 2024 – Jun 2025**

## Life Overview
- **Total Moments Recorded:** ${stats?.total || 466}
- **Span:** ${fmtDate(receipts[0]?.dt)} to ${fmtDate(receipts[receipts.length - 1]?.dt)}
- **Peak Nocturnal Ratio:** 62% in Act II
- **Transformation:** The Restless Wanderer → The Purposeful Maker

## Itemized Chronicle
${printableList
  .map(
    (r) =>
      `### № ${r.id} · ${fmtDate(r.dt)} (${r.timeStr})\n` +
      `- **Type:** ${r.type.toUpperCase()}\n` +
      `- **Title:** ${r.heading}\n` +
      (r.body ? `- **Detail:** *"${r.body}"*\n` : '') +
      (r.amount ? `- **Amount:** ${fmtCurrency(r.amount, r.currency)}\n` : '') +
      `- **Mood:** ${r.mood} | **City:** ${r.city || 'Bristol'}\n`
  )
  .join('\n')}

---
*Preserved from the LEDGER digital exhibition.*
`
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'life-receipts-journal.md')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-modal-heading"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050608]/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0e1017] border border-white/[0.08] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] flex flex-col justify-between">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <Printer className="w-4 h-4 text-[#f59e0b]" aria-hidden="true" />
            <span id="print-modal-heading" className="text-xs font-mono-receipt font-bold text-[#fbf9f5]">
              PHYSICAL THERMAL SLIP GENERATOR
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close print dialog"
            className="p-1.5 rounded-xl bg-white/[0.04] text-[#94a3b8] hover:text-[#fbf9f5] focus-visible:ring-2 focus-visible:ring-[#f59e0b] outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Option Selection */}
        <div className="flex items-center gap-2 text-xs font-mono-receipt">
          <button
            onClick={() => setSelectedFilter('highlights')}
            className={`px-3.5 py-2 rounded-xl border transition-all ${
              selectedFilter === 'highlights'
                ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#f59e0b] font-bold'
                : 'bg-white/[0.03] border-white/[0.08] text-[#94a3b8]'
            }`}
          >
            Curated Highlights (24 Moments)
          </button>
          <button
            onClick={() => setSelectedFilter('extended')}
            className={`px-3.5 py-2 rounded-xl border transition-all ${
              selectedFilter === 'extended'
                ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#f59e0b] font-bold'
                : 'bg-white/[0.03] border-white/[0.08] text-[#94a3b8]'
            }`}
          >
            Extended Roll (40 Moments)
          </button>
        </div>

        {/* Printable Physical Slip Canvas */}
        <div className="thermal-receipt-print overflow-y-auto max-h-[440px] p-6 thermal-slip font-mono-receipt text-xs rounded-2xl shadow-inner border border-[#d6cfbe] space-y-4">
          <div className="text-center space-y-1 border-b border-dashed border-[#8d887a] pb-4">
            <div className="text-sm font-bold tracking-wider">*** THE LEDGER OF A LIFE ***</div>
            <div className="text-[10px] text-[#525765]">OFFICIAL DIGITAL PAPER TRAIL</div>
            <div className="text-[10px] text-[#525765]">STORE № 2024-2025 · BRISTOL / LISBON</div>
            <div className="text-[10px] text-[#525765] pt-1">
              {fmtDate(receipts[0]?.dt)} → {fmtDate(receipts[receipts.length - 1]?.dt)}
            </div>
          </div>

          <div className="divide-y divide-dashed divide-[#cac4b6] text-[11px] space-y-2 py-2">
            {printableList.map((item) => (
              <div key={item.id} className="pt-2 flex justify-between gap-2">
                <div>
                  <span className="font-bold text-[#111215] block">{item.heading}</span>
                  <span className="text-[10px] text-[#525765]">
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
              <span className="font-bold">{stats?.total || 466}</span>
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
          <div className="pt-4 flex flex-col items-center justify-center space-y-1 border-t border-dashed border-[#8d887a]" aria-hidden="true">
            <div className="h-8 w-48 flex items-center justify-between text-[#1c1d22]">
              {Array.from({ length: 40 }).map((_, i) => (
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
            <span className="text-[9px] tracking-widest text-[#525765]">
              * THANK YOU FOR LIVING *
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              aria-label="Copy ASCII receipt to clipboard"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono-receipt bg-white/[0.04] border border-white/[0.08] text-[#cbd5e1] hover:text-[#fbf9f5] hover:bg-white/[0.08] transition-all focus-visible:ring-2 focus-visible:ring-[#f59e0b] outline-none"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy ASCII'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              aria-label="Download full life journal as Markdown"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono-receipt bg-white/[0.04] border border-white/[0.08] text-[#cbd5e1] hover:text-[#fbf9f5] hover:bg-white/[0.08] transition-all focus-visible:ring-2 focus-visible:ring-[#f59e0b] outline-none"
            >
              <Download className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>Export .MD Journal</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            aria-label="Print thermal slip via browser print dialog"
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-mono-receipt font-bold bg-[#f59e0b] text-[#07080b] hover:opacity-90 transition-all shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-white outline-none"
          >
            <Printer className="w-4 h-4" />
            <span>Print Thermal Slip</span>
          </button>
        </div>
      </div>
    </div>
  )
}
