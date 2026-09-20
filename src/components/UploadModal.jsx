import { useState } from 'react'
import {
  X,
  UploadCloud,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Database
} from 'lucide-react'
import { sound } from '../audio/soundEngine'

/**
 * UploadModal: Ingest custom Kaggle life receipts CSV and dynamically recalculate story arcs.
 */
export default function UploadModal({
  isOpen,
  onClose,
  onLoadCustomCsv,
  onResetBundled,
  isCustomData,
  currentCount
}) {
  const [csvText, setCsvText] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [statusMsg, setStatusMsg] = useState('')

  if (!isOpen) return null

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result
      if (typeof content === 'string') {
        tryLoad(content)
      }
    }
    reader.readAsText(file)
  }

  const tryLoad = (raw) => {
    try {
      setErrorMsg('')
      const success = onLoadCustomCsv(raw)
      if (success) {
        sound.playChime(600, 'sine', 0.6)
        setStatusMsg('Successfully ingested and built life story from CSV!')
        setTimeout(() => {
          onClose()
        }, 1200)
      } else {
        setErrorMsg('CSV parsing failed. Ensure standard columns (id, type, at, heading, body).')
      }
    } catch (err) {
      setErrorMsg(`Failed to parse CSV: ${err.message}`)
    }
  }

  const handlePasteSubmit = () => {
    if (!csvText.trim()) return
    tryLoad(csvText)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-heading"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050608]/85 backdrop-blur-md p-4 animate-in fade-in"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0e1017] border border-white/[0.08] shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-[#f59e0b]" aria-hidden="true" />
            <span id="upload-heading" className="text-xs font-mono-receipt font-bold text-[#fbf9f5]">
              DATASET & KAGGLE CSV INGESTION
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close upload dialog"
            className="p-1.5 rounded-xl bg-white/[0.04] text-[#94a3b8] hover:text-[#fbf9f5] focus-visible:ring-2 focus-visible:ring-[#f59e0b] outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Status */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs font-mono-receipt">
          <div className="space-y-0.5">
            <span className="text-[#94a3b8] block">ACTIVE LEDGER DATASET:</span>
            <span className="font-bold text-[#fbf9f5]">
              {isCustomData ? 'Custom Ingested CSV' : 'Official Kaggle 466-Record Dataset'}
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30">
            {currentCount} Moments
          </span>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div className="space-y-3">
          <label htmlFor="csv-file-input" className="text-xs font-mono-receipt text-[#cbd5e1] block">
            Upload Kaggle CSV File:
          </label>
          <label className="border-2 border-dashed border-white/[0.1] hover:border-[#f59e0b]/60 bg-[#07080c] rounded-2xl p-8 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-colors group">
            <UploadCloud className="w-8 h-8 text-[#64748b] group-hover:text-[#f59e0b] transition-colors" />
            <span className="text-xs font-mono-receipt text-[#cbd5e1]">
              Click to browse or drop Kaggle <code className="text-[#f59e0b]">receipts.csv</code>
            </span>
            <span className="text-[10px] font-mono-receipt text-[#94a3b8]">
              Expected columns: id, type, at, heading, body, mood, tags, city
            </span>
            <input
              id="csv-file-input"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Paste Raw CSV Alternative */}
        <div className="space-y-2">
          <label htmlFor="csv-text-area" className="text-xs font-mono-receipt text-[#cbd5e1] block">
            Or Paste Raw CSV Content:
          </label>
          <textarea
            id="csv-text-area"
            rows={3}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="id,type,at,heading,body,tags,mood,energy,amount,currency..."
            className="w-full p-3.5 rounded-2xl bg-[#07080c] border border-white/[0.08] text-xs font-mono-receipt text-[#fbf9f5] placeholder-[#64748b] focus:outline-none focus:border-[#f59e0b]"
          />
          {csvText.trim() && (
            <button
              onClick={handlePasteSubmit}
              className="w-full py-2.5 rounded-xl bg-[#f59e0b] text-[#07080b] font-mono-receipt font-bold text-xs hover:opacity-90 transition-all shadow-md active:scale-98"
            >
              Parse & Rebuild Story From CSV Text
            </button>
          )}
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div role="alert" className="p-3.5 rounded-2xl bg-[#f43f5e]/15 border border-[#f43f5e]/40 text-[#fca5a5] text-xs font-mono-receipt flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {statusMsg && (
          <div role="status" className="p-3.5 rounded-2xl bg-[#10b981]/15 border border-[#10b981]/40 text-[#6ee7b7] text-xs font-mono-receipt flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Reset to Bundled Kaggle Dataset */}
        {isCustomData && (
          <div className="pt-2 border-t border-white/[0.08]">
            <button
              onClick={() => {
                sound.playTick(1000)
                onResetBundled()
                onClose()
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-mono-receipt bg-white/[0.03] hover:bg-white/[0.07] text-[#cbd5e1] border border-white/[0.08] transition-colors focus-visible:ring-2 focus-visible:ring-[#f59e0b] outline-none"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Original 466 Kaggle Receipts</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
