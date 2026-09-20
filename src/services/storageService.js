/**
 * StorageService: Decoupled service layer for persistent browser storage with safe memory fallback.
 */

class StorageService {
  constructor() {
    this.memoryStorage = new Map()
    this.isLocalStorageAvailable = this.checkAvailability()
  }

  checkAvailability() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false
      const testKey = '__ledger_test__'
      window.localStorage.setItem(testKey, testKey)
      window.localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  getItem(key, defaultValue = null) {
    try {
      if (this.isLocalStorageAvailable) {
        const item = window.localStorage.getItem(key)
        return item !== null ? JSON.parse(item) : defaultValue
      }
      return this.memoryStorage.has(key) ? this.memoryStorage.get(key) : defaultValue
    } catch {
      return defaultValue
    }
  }

  setItem(key, value) {
    try {
      const serialized = JSON.stringify(value)
      if (this.isLocalStorageAvailable) {
        window.localStorage.setItem(key, serialized)
      } else {
        this.memoryStorage.set(key, value)
      }
      return true
    } catch {
      return false
    }
  }

  removeItem(key) {
    try {
      if (this.isLocalStorageAvailable) {
        window.localStorage.removeItem(key)
      } else {
        this.memoryStorage.delete(key)
      }
      return true
    } catch {
      return false
    }
  }
}

export const storageService = new StorageService()
