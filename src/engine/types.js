// Central catalogue of knowledge the engine uses to interpret receipts.
// Colour, label, and emotional weight live here so the UI and the engine
// stay in lockstep.

export const TYPES = ['music', 'film', 'place', 'purchase', 'photo', 'message', 'search', 'event', 'note']

export const TYPE_META = {
  music: { label: 'Music', short: '♪', color: '#d2869a', hue: 340 },
  film: { label: 'Movie & TV', short: '▸', color: '#7a9cc6', hue: 214 },
  place: { label: 'Place', short: '⌖', color: '#e0a458', hue: 33 },
  purchase: { label: 'Purchase', short: '◈', color: '#5da88b', hue: 158 },
  photo: { label: 'Photo', short: '☐', color: '#e5c558', hue: 48 },
  message: { label: 'Message', short: '§', color: '#9b82d8', hue: 258 },
  search: { label: 'Search', short: '⌕', color: '#8a95a5', hue: 210 },
  event: { label: 'Event', short: '✦', color: '#d0675c', hue: 8 },
  note: { label: 'Note', short: '¶', color: '#e8dcc3', hue: 44 },
}

export const MOODS = ['bright', 'warm', 'driven', 'hopeful', 'wistful', 'restless', 'anxious', 'melancholic', 'neutral']

// Higher = lighter. Used to plot the mood of a life over time.
export const MOOD_WEIGHT = {
  melancholic: 0.12,
  anxious: 0.22,
  restless: 0.3,
  neutral: 0.42,
  wistful: 0.5,
  hopeful: 0.62,
  driven: 0.72,
  warm: 0.82,
  bright: 0.9,
}

export const MOOD_META = {
  bright: { label: 'bright', color: '#e5c558' },
  warm: { label: 'warm', color: '#e0a458' },
  driven: { label: 'driven', color: '#d2869a' },
  hopeful: { label: 'hopeful', color: '#7fc6a8' },
  wistful: { label: 'wistful', color: '#a8b7d8' },
  restless: { label: 'restless', color: '#c98a6a' },
  anxious: { label: 'anxious', color: '#c6869e' },
  melancholic: { label: 'melancholic', color: '#7a7fae' },
  neutral: { label: 'neutral', color: '#9aa0a6' },
}

export const MOOD_ORDER = ['melancholic', 'anxious', 'restless', 'wistful', 'hopeful', 'driven', 'warm', 'bright']

export const TIME_OF_DAY = {
  night: { label: 'night', range: [22, 24, 0, 6] },
  early: { label: 'early', range: [6, 9] },
  day: { label: 'day', range: [9, 17] },
  evening: { label: 'evening', range: [17, 22] },
}

export const CHAPTER_THEMES = {
  wander: { name: 'The Long Way', deck: 'You were leaving something. It took a while to learn what.', tone: 'amber' },
  night: { name: 'The Night Shift', deck: 'Somewhere around spring, the dark started keeping your hours.', tone: 'indigo' },
  anchor: { name: 'The Anchor', deck: 'Then a conversation grew roots in your calendar.', tone: 'rose' },
  maker: { name: 'The Maker', deck: 'The mornings stopped being leftovers. You started building with them.', tone: 'gold' },
  transition: { name: 'The Turn', deck: 'Quiet months when the receipts thin out and the decisions thicken.', tone: 'sage' },
}

export const TIME_BUCKETS = ['night', 'early', 'day', 'evening']