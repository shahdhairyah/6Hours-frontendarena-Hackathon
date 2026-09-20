import { useEffect } from 'react'

/**
 * Custom hook for global keyboard shortcuts.
 */
export function useKeyboardShortcuts({
  onSelectTab,
  onOpenCinema,
  onCloseModals,
  isModalOpen,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore keystrokes inside form controls
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return

      if (e.key === 'Escape') {
        onCloseModals()
      } else if (e.key === '1') {
        onSelectTab('story')
      } else if (e.key === '2') {
        onSelectTab('ledger')
      } else if (e.key === '3') {
        onSelectTab('graph')
      } else if (e.key === '4') {
        onSelectTab('insights')
      } else if (e.key === ' ' && !isModalOpen) {
        e.preventDefault()
        onOpenCinema()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSelectTab, onOpenCinema, onCloseModals, isModalOpen])
}
