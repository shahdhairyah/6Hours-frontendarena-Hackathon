import { preprocessAll, normalizeReceipt } from './preprocess.js'
import { segmentChapters } from './chapters.js'
import { buildThreads } from './threads.js'
import { computeStats } from './stats.js'
import { buildNarrative } from './narrative.js'
import { loadReceiptsCsv } from './csvLoader.js'
import { RECEIPTS } from '../data/receipts.js'

// Pure builder — safe to call anywhere with any dataset.
export function buildEngine(rawReceipts) {
  const receipts = preprocessAll(rawReceipts)
  const chapters = segmentChapters(receipts)
  const threads = buildThreads(receipts, chapters)
  const stats = computeStats(receipts, chapters)
  const narrative = buildNarrative(receipts, chapters, stats, threads)
  return { receipts, chapters, threads, stats, narrative }
}

export function buildEngineFromUnknown(rows) {
  const clean = rows.map(normalizeReceipt).filter(Boolean)
  return buildEngine(clean)
}

// Source order: a real Kaggle CSV dropped into /public/data wins; otherwise
// the bundled dataset is used. Result is memoised across the app so every view
// shares one computed story.
let enginePromise = null
export function loadEngine() {
  if (!enginePromise) {
    enginePromise = (async () => {
      try {
        const rows = await loadReceiptsCsv('/data/receipts.csv')
        const clean = rows.map(normalizeReceipt).filter(Boolean)
        if (clean.length >= 2) return buildEngine(clean)
      } catch {
        /* fall through to bundled */
      }
      return buildEngine(RECEIPTS)
    })()
  }
  return enginePromise
}

export const BUNDLED_SOURCE = 'bundled'

export function resetEngine() {
  enginePromise = null
}