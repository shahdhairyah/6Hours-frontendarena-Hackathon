/**
 * ReceiptService: Domain repository and query service for the LEDGER digital experience.
 */

export class ReceiptService {
  /**
   * Returns a single receipt by unique ID.
   * @param {Array<Object>} receipts
   * @param {string} id
   * @returns {Object|null}
   */
  static getById(receipts, id) {
    if (!Array.isArray(receipts) || !id) return null
    return receipts.find((r) => r.id === id) || null
  }

  /**
   * Filters receipts by multi-dimensional criteria.
   * @param {Array<Object>} receipts
   * @param {Object} filters
   * @returns {Array<Object>}
   */
  static filter(receipts, filters = {}) {
    if (!Array.isArray(receipts)) return []
    let result = [...receipts]

    if (filters.type && filters.type !== 'all') {
      result = result.filter((r) => r.type === filters.type)
    }
    if (filters.mood && filters.mood !== 'all') {
      result = result.filter((r) => r.mood === filters.mood)
    }
    if (filters.timeOfDay && filters.timeOfDay !== 'all') {
      result = result.filter((r) => r.timeOfDay === filters.timeOfDay)
    }
    if (filters.city && filters.city !== 'all') {
      result = result.filter((r) => r.city && r.city.toLowerCase() === filters.city.toLowerCase())
    }
    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim()
      result = result.filter(
        (r) =>
          r.heading?.toLowerCase().includes(q) ||
          r.body?.toLowerCase().includes(q) ||
          r.city?.toLowerCase().includes(q) ||
          r.artist?.toLowerCase().includes(q) ||
          r.merchant?.toLowerCase().includes(q) ||
          r.counterpart?.toLowerCase().includes(q) ||
          r.tags?.some((t) => t.toLowerCase().includes(q))
      )
    }

    return result
  }

  /**
   * Exports full ledger dataset as downloadable JSON archive.
   * @param {Array<Object>} receipts
   * @returns {string} Serialized JSON
   */
  static exportJson(receipts) {
    return JSON.stringify(receipts, null, 2)
  }
}
