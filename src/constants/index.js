// Centralized application constants and route keys

export const TABS = {
  STORY: 'story',
  LEDGER: 'ledger',
  GRAPH: 'graph',
  INSIGHTS: 'insights',
}

export const SORT_OPTIONS = [
  { id: 'chronological-asc', label: 'Time: Oldest First' },
  { id: 'chronological-desc', label: 'Time: Newest First' },
  { id: 'amount-high', label: 'Spend: Highest First' },
  { id: 'energy-high', label: 'Energy: Highest First' },
]

export const STORY_PRESETS = [
  { id: 'all', label: 'All 466 Receipts', icon: '🧾' },
  { id: '2am', label: 'The 2 AM Curve', icon: '🌙' },
  { id: 'maya', label: 'Maya Connection', icon: '❤️' },
  { id: 'lisbon', label: 'Lisbon Odyssey', icon: '✈️' },
  { id: 'kiln', label: 'The Kiln Cafe', icon: '☕' },
  { id: 'maker', label: 'The Maker Hours', icon: '🎨' },
]

export const LOCAL_STORAGE_KEYS = {
  BOOKMARKS: 'ledger_saved_receipt_ids',
  AUDIO_MUTED: 'ledger_audio_muted',
}
