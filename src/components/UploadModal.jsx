import { useState } from 'react'
import {
  X,
  UploadCloud,
  FileText,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowRight
} from 'lucide-react'
import { sound } from '../audio/soundEngine'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050608]/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#11131b] border border-[#262a3c] shadow-2xl p-6 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1f2434]">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#e0a458]" />
            <span className="text-xs font-mono-receipt font-bold text-[#f0ede6]">
              DATASET & KAGGLE CSV INGESTION
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#161924] text-[#80889b] hover:text-[#f0f3fa]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Status */}
        <div className="p-3.5 rounded-xl bg-[#161824] border border-[#24293a] flex items-center justify-between text-xs font-mono-receipt">
          <div className="space-y-0.5">
            <span className="text-[#6d7589] block">ACTIVE DATASET:</span>
            <span className="font-bold text-[#f5f2eb]">
              {isCustomData ? 'Custom Ingested CSV' : 'Official Kaggle 466-Record Dataset'}
            </span>
          </div>
          <span className="px-2 py-1 rounded bg-[#e0a458]/15 text-[#e0a458] border border-[#e0a458]/30">
            {currentCount} Moments Loaded
          </span>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div className="space-y-3">
          <label className="text-xs font-mono-receipt text-[#8a92a5] block">
            Upload CSV File:
          </label>
          <label className="border-2 border-dashed border-[#2d3348] hover:border-[#e0a458]/60 bg-[#0d0f16] rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
            <UploadCloud className="w-8 h-8 text-[#5c657a] group-hover:text-[#e0a458] transition-colors" />
            <span className="text-xs font-mono-receipt text-[#a4acc0]">
              Click to browse or drop Kaggle <code className="text-[#e0a458]">receipts.csv</code>
            </span>
            <span className="text-[10px] font-mono-receipt text-[#5f677a]">
              Supports standard format (id, type, at, heading, body, mood, tags)
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Paste Raw CSV Alternative */}
        <div className="space-y-2">
          <label className="text-xs font-mono-receipt text-[#8a92a5] block">
            Or Paste Raw CSV Content:
          </label>
          <textarea
            rows={3}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="id,type,at,heading,body,tags,mood,energy,amount,currency..."
            className="w-full p-3 rounded-xl bg-[#0b0c12] border border-[#222738] text-xs font-mono-receipt text-[#e8eaef] placeholder-[#4d5366] focus:outline-none focus:border-[#e0a458]"
          />
          {csvText.trim() && (
            <button
              onClick={handlePasteSubmit}
              className="w-full py-2 rounded-xl bg-[#e0a458] text-[#0d0f14] font-mono-receipt font-bold text-xs hover:opacity-90 transition-all"
            >
              Parse & Build Story From Text
            </button>
          )}
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#d0675c]/15 border border-[#d0675c]/40 text-[#f29a91] text-xs font-mono-receipt flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {statusMsg && (
          <div className="p-3 rounded-xl bg-[#5da88b]/15 border border-[#5da88b]/40 text-[#7fc6a8] text-xs font-mono-receipt flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Reset to Bundled Kaggle Dataset */}
        {isCustomData && (
          <div className="pt-2 border-t border-[#1e2332]">
            <button
              onClick={() => {
                sound.playTick(1000)
                onResetBundled()
                onClose()
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-mono-receipt bg-[#1a1d29] hover:bg-[#222636] text-[#b0b8cb] border border-[#2b3144] transition-colors"
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
