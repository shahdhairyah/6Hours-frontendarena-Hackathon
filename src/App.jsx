import { useState, lazy, Suspense } from 'react'
import Header from './components/Header'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { SkipLink } from './components/common/SkipLink'
import { LoadingScreen } from './components/common/LoadingScreen'
import { EngineProvider, useEngineContext } from './context/EngineContext'
import { useBookmarks } from './hooks/useBookmarks'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { Keyboard } from 'lucide-react'

// Code-split dynamic views for superior performance
const StoryView = lazy(() => import('./components/StoryView'))
const LedgerView = lazy(() => import('./components/LedgerView'))
const ConstellationView = lazy(() => import('./components/ConstellationView'))
const InsightsView = lazy(() => import('./components/InsightsView'))
const CinemaModal = lazy(() => import('./components/CinemaModal'))
const ReceiptInspector = lazy(() => import('./components/ReceiptInspector'))
const ThermalReceiptModal = lazy(() => import('./components/ThermalReceiptModal'))
const UploadModal = lazy(() => import('./components/UploadModal'))

function MainContent() {
  const {
    engine,
    isLoading,
    activeTab,
    setActiveTab,
    selectedReceipt,
    setSelectedReceipt,
    isCinemaOpen,
    setIsCinemaOpen,
    isPrintOpen,
    setIsPrintOpen,
    isUploadOpen,
    setIsUploadOpen,
    isCustomData,
    loadCustomCsv,
    resetToBundled,
    closeAllModals,
  } = useEngineContext()

  const { isBookmarked, toggleBookmark, bookmarkCount } = useBookmarks()
  const [activeFilterType, setActiveFilterType] = useState('all')
  const [isShowingSavedOnly, setIsShowingSavedOnly] = useState(false)

  // Keyboard shortcut listener
  useKeyboardShortcuts({
    onSelectTab: (tab) => setActiveTab(tab),
    onOpenCinema: () => setIsCinemaOpen(true),
    onCloseModals: closeAllModals,
    isModalOpen: isCinemaOpen || isPrintOpen || isUploadOpen || Boolean(selectedReceipt),
  })

  if (isLoading || !engine) {
    return <LoadingScreen />
  }

  const { receipts, chapters, threads, stats, narrative } = engine

  return (
    <div className="min-h-screen flex flex-col bg-[#07080b] text-[#ededed] font-sans-ui selection:bg-[#f59e0b]/30 selection:text-[#f7e4c8]">
      <SkipLink />

      {/* Accessible Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        onOpenCinema={() => setIsCinemaOpen(true)}
        onOpenPrint={() => setIsPrintOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        isCustomData={isCustomData}
        bookmarkCount={bookmarkCount}
        isShowingSavedOnly={isShowingSavedOnly}
        onToggleSavedOnly={() => {
          setIsShowingSavedOnly(!isShowingSavedOnly)
          if (activeTab !== 'ledger') setActiveTab('ledger')
        }}
      />

      {/* Main View Area with Suspense boundary */}
      <main id="main-content" className="flex-1 pb-16 focus:outline-none" tabIndex={-1}>
        <Suspense fallback={<div className="p-16 text-center text-xs font-mono-receipt text-[#94a3b8]">Loading view...</div>}>
          {activeTab === 'story' && (
            <StoryView
              receipts={receipts}
              narrative={narrative}
              chapters={chapters}
              stats={stats}
              threads={threads}
              onSelectReceipt={(r) => setSelectedReceipt(r)}
              onSwitchTab={(tab) => setActiveTab(tab)}
              isBookmarked={isBookmarked}
              onToggleBookmark={toggleBookmark}
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
              isBookmarked={isBookmarked}
              onToggleBookmark={toggleBookmark}
              isShowingSavedOnly={isShowingSavedOnly}
              onToggleSavedOnly={() => setIsShowingSavedOnly(!isShowingSavedOnly)}
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
              receipts={receipts}
              onSelectReceipt={(r) => setSelectedReceipt(r)}
              onSwitchTab={(tab) => setActiveTab(tab)}
            />
          )}
        </Suspense>
      </main>

      {/* Accessible Footer */}
      <footer role="contentinfo" className="border-t border-white/[0.06] bg-[#08090d] py-8 text-xs font-mono-receipt text-[#94a3b8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#fbf9f5]">LEDGER</span>
            <span>//</span>
            <span>Your Life, In Receipts · Hackathon Digital Experience</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#94a3b8]">
            <span className="hidden md:flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-[#f59e0b]" aria-hidden="true" />
              <span>Keys: [1] Story [2] Ledger [3] Echoes [4] Patterns [Space] Cinema [Esc] Close</span>
            </span>
            <span>·</span>
            <span>Pure React 19 Frontend</span>
          </div>
        </div>
      </footer>

      {/* Lazy Overlays & Modals */}
      <Suspense fallback={null}>
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
          isBookmarked={isBookmarked}
          onToggleBookmark={toggleBookmark}
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
          onLoadCustomCsv={loadCustomCsv}
          onResetBundled={resetToBundled}
          isCustomData={isCustomData}
          currentCount={receipts.length}
        />
      </Suspense>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <EngineProvider>
        <MainContent />
      </EngineProvider>
    </ErrorBoundary>
  )
}
