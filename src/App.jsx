import { useState, useEffect } from 'react'
import Header from './components/Header'
import StoryView from './components/StoryView'
import LedgerView from './components/LedgerView'
import ConstellationView from './components/ConstellationView'
import InsightsView from './components/InsightsView'
import CinemaModal from './components/CinemaModal'
import ReceiptInspector from './components/ReceiptInspector'
import ThermalReceiptModal from './components/ThermalReceiptModal'
import UploadModal from './components/UploadModal'

import { loadEngine, buildEngineFromUnknown, buildEngine, resetEngine } from './engine/index'
import { parseCsv } from './engine/csvLoader'
import { RECEIPTS } from './data/receipts'
import { sound } from './audio/soundEngine'
import { Sparkles, Terminal, Heart, Keyboard } from 'lucide-react'

export default function App() {
  const [engine, setEngine] = useState(null)
  const [activeTab, setActiveTab] = useState('story')
  const [activeFilterType, setActiveFilterType] = useState('all')
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [isCinemaOpen, setIsCinemaOpen] = useState(false)
  const [isPrintOpen, setIsPrintOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isCustomData, setIsCustomData] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize and load the engine
  useEffect(() => {
    async function init() {
      try {
        const loaded = await loadEngine()
        setEngine(loaded)
      } catch (err) {
        console.error('Failed to load CSV, falling back to bundled dataset:', err)
        setEngine(buildEngine(RECEIPTS))
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return

      if (e.key === 'Escape') {
        setSelectedReceipt(null)
        setIsCinemaOpen(false)
        setIsPrintOpen(false)
        setIsUploadOpen(false)
      } else if (e.key === '1') {
        sound.playTick(1200)
        setActiveTab('story')
      } else if (e.key === '2') {
        sound.playTick(1300)
        setActiveTab('ledger')
      } else if (e.key === '3') {
        sound.playTick(1400)
        setActiveTab('graph')
      } else if (e.key === '4') {
        sound.playTick(1500)
        setActiveTab('insights')
      } else if (e.key === ' ' && !isCinemaOpen) {
        e.preventDefault()
        sound.playChime(660)
        setIsCinemaOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCinemaOpen])

  // Custom CSV Ingestion Handler
  const handleLoadCustomCsv = (rawCsvText) => {
    try {
      const rows = parseCsv(rawCsvText)
      if (!rows || rows.length < 2) return false
      const newEngine = buildEngineFromUnknown(rows)
      if (newEngine && newEngine.receipts.length > 0) {
        setEngine(newEngine)
        setIsCustomData(true)
        setSelectedReceipt(null)
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to parse custom CSV:', err)
      return false
    }
  }

  // Reset to original bundled Kaggle dataset
  const handleResetBundled = () => {
    resetEngine()
    const original = buildEngine(RECEIPTS)
    setEngine(original)
    setIsCustomData(false)
    setSelectedReceipt(null)
  }

  if (isLoading || !engine) {
    return (
      <div className="min-h-screen bg-[#0a0b0e] flex flex-col items-center justify-center space-y-4 text-center px-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e0a458] to-[#d2869a] flex items-center justify-center text-[#0b0c10] font-mono-receipt font-bold text-xl animate-pulse shadow-xl">
          §
        </div>
        <div className="space-y-1">
          <h2 className="font-serif-story text-2xl text-[#f5f2eb]">
            Reading The Ledger...
          </h2>
          <p className="text-xs font-mono-receipt text-[#788195]">
            Segmenting chapters, weaving emotional threads & calculating circadian curves
          </p>
        </div>
      </div>
    )
  }

  const { receipts, chapters, threads, stats, narrative } = engine

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0b0e] text-[#ededed] font-sans-ui selection:bg-[#e0a458]/30 selection:text-[#f7e4c8]">
      {/* Primary Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        onOpenCinema={() => setIsCinemaOpen(true)}
        onOpenPrint={() => setIsPrintOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        isCustomData={isCustomData}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'story' && (
          <StoryView
            narrative={narrative}
            chapters={chapters}
            stats={stats}
            threads={threads}
            onSelectReceipt={(r) => setSelectedReceipt(r)}
            onSwitchTab={(tab) => {
              sound.playTick(1300)
              setActiveTab(tab)
            }}
          />
        )}

        {activeTab === 'ledger' && (
          <LedgerView
            receipts={receipts}
            chapters={chapters}
            threads={threads}
            onSelectReceipt={(r) => setSelectedReceipt(r)}
            activeFilterType={activeFilterType}
            setActiveFilterType={setActiveFilterType}
          />
        )}

        {activeTab === 'graph' && (
          <ConstellationView
            receipts={receipts}
            chapters={chapters}
            threads={threads}
            onSelectReceipt={(r) => setSelectedReceipt(r)}
          />
        )}

        {activeTab === 'insights' && (
          <InsightsView
            narrative={narrative}
            stats={stats}
            chapters={chapters}
            onSelectReceipt={(r) => setSelectedReceipt(r)}
            onSwitchTab={(tab) => {
              sound.playTick(1300)
              setActiveTab(tab)
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#181a24] bg-[#0c0d12] py-8 text-xs font-mono-receipt text-[#62697b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#b0b8cb]">LEDGER</span>
            <span>//</span>
            <span>Your Life, In Receipts · Hackathon Experience</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#565d70]">
            <span className="hidden md:flex items-center gap-1">
              <Keyboard className="w-3.5 h-3.5" />
              <span>Keys: [1] Story [2] Ledger [3] Echoes [4] Patterns [Space] Cinema [Esc] Close</span>
            </span>
            <span>·</span>
            <span>Pure React 19 Frontend</span>
          </div>
        </div>
      </footer>

      {/* Overlays & Modals */}
      <CinemaModal
        isOpen={isCinemaOpen}
        onClose={() => setIsCinemaOpen(false)}
        receipts={receipts}
        chapters={chapters}
        threads={threads}
        onSelectReceipt={(r) => setSelectedReceipt(r)}
      />

      <ReceiptInspector
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        threads={threads}
        onSelectReceipt={(r) => setSelectedReceipt(r)}
      />

      <ThermalReceiptModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        receipts={receipts}
        chapters={chapters}
        stats={stats}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onLoadCustomCsv={handleLoadCustomCsv}
        onResetBundled={handleResetBundled}
        isCustomData={isCustomData}
        currentCount={receipts.length}
      />
    </div>
  )
}
