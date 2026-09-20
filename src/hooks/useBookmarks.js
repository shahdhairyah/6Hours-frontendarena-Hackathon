import { useState, useEffect, useCallback } from 'react'
import { LOCAL_STORAGE_KEYS } from '../constants/index'
import { storageService } from '../services/storageService'

/**
 * Custom hook for saving and retrieving bookmarked life receipts.
 */
export function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    return storageService.getItem(LOCAL_STORAGE_KEYS.BOOKMARKS, [])
  })

  // Sync to storage service
  useEffect(() => {
    storageService.setItem(LOCAL_STORAGE_KEYS.BOOKMARKS, bookmarkedIds)
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
