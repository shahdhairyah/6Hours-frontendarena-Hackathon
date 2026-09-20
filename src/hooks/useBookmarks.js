import { useState, useEffect, useCallback } from 'react'
import { LOCAL_STORAGE_KEYS } from '../constants/index'

/**
 * Custom hook for saving and retrieving bookmarked life receipts.
 */
export function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKMARKS)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarkedIds))
    } catch {
      // safe fallback
    }
  }, [bookmarkedIds])

  const toggleBookmark = useCallback((receiptId) => {
    setBookmarkedIds((prev) => {
      const exists = prev.includes(receiptId)
      if (exists) {
        return prev.filter((id) => id !== receiptId)
      } else {
        return [...prev, receiptId]
      }
    })
  }, [])

  const isBookmarked = useCallback(
    (receiptId) => bookmarkedIds.includes(receiptId),
    [bookmarkedIds]
  )

  const clearBookmarks = useCallback(() => {
    setBookmarkedIds([])
  }, [])

  return {
    bookmarkedIds,
    toggleBookmark,
    isBookmarked,
    clearBookmarks,
    bookmarkCount: bookmarkedIds.length,
  }
}
