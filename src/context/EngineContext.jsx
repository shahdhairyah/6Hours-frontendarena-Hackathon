import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { loadEngine, buildEngineFromUnknown, buildEngine, resetEngine } from '../engine/index'
import { parseCsv } from '../engine/csvLoader'
import { RECEIPTS } from '../data/receipts'

const EngineContext = createContext(null)

/**
 * Global provider for the analytical engine, dataset state, and active navigation.
 */
export function EngineProvider({ children }) {
  const [engine, setEngine] = useState(null)
  const [activeTab, setActiveTab] = useState('story')
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [isCinemaOpen, setIsCinemaOpen] = useState(false)
  const [isPrintOpen, setIsPrintOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isCustomData, setIsCustomData] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize engine on mount
  useEffect(() => {
    async function init() {
      try {
        const loaded = await loadEngine()
        setEngine(loaded)
      } catch (err) {
        console.error('Failed to load CSV, using bundled dataset:', err)
        setEngine(buildEngine(RECEIPTS))
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  // Ingest custom Kaggle CSV
  const loadCustomCsv = useCallback((rawCsvText) => {
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
  }, [])

  // Reset to bundled dataset
  const resetToBundled = useCallback(() => {
    resetEngine()
    const original = buildEngine(RECEIPTS)
    setEngine(original)
    setIsCustomData(false)
    setSelectedReceipt(null)
  }, [])

  const closeAllModals = useCallback(() => {
    setSelectedReceipt(null)
    setIsCinemaOpen(false)
    setIsPrintOpen(false)
    setIsUploadOpen(false)
  }, [])

  const value = useMemo(
    () => ({
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
    }),
    [
      engine,
      isLoading,
      activeTab,
      selectedReceipt,
      isCinemaOpen,
      isPrintOpen,
      isUploadOpen,
      isCustomData,
      loadCustomCsv,
      resetToBundled,
      closeAllModals,
    ]
  )

  return <EngineContext.Provider value={value}>{children}</EngineContext.Provider>
}

export function useEngineContext() {
  const context = useContext(EngineContext)
  if (!context) {
    throw new Error('useEngineContext must be used within an EngineProvider')
  }
  return context
}
