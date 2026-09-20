import { MOODS, TYPE_META, TYPES } from './types.js'

export function hourOf(dt) {
  const h = dt.getUTCHours()
  return h
}

export function timeOfDayOf(dt) {
  const h = dt.getUTCHours()
  if (h >= 22 || h < 6) return 'night'
  if (h < 9) return 'early'
  if (h < 17) return 'day'
  return 'evening'
}

export const fmtDate = (d) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)

export const fmtDateShort = (d) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(d)

export const fmtTime = (d) =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(d)

export const fmtMonth = (d) => new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' }).format(d)

export const fmtYear = (d) => new Intl.DateTimeFormat('en-GB', { year: 'numeric' }).format(d)

const monthKey = (d) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`

// Words that hint at meaning when they appear in a receipt.
const SIGNAL = {
  '2am': '2am-curve',
  '3am': '2am-curve',
  dawn: 'dawn',
  night: 'night',
  lisbon: 'lisbon',
  porto: 'porto',
  cornwall: 'cornwall',
  brighton: 'brighton',
  bristol: 'bristol',
  maya: 'maya',
  robin: 'robin',
  leaving: 'leaving',
  home: 'home',
  sea: 'sea',
  kiln: 'the-kiln',
  tram: 'tram',
  running: 'running',
  camera: 'making',
  photograph: 'making',
  doorway: 'making',
  album: 'music',
  espresso: 'coffee',
  coffee: 'coffee',
  insomnia: 'sleep',
  sleep: 'sleep',
  pasteis: 'pasteis',
  flat: 'coffee',
  tickets: 'trip',
}

export function enrich(raw) {
  const dt = new Date(raw.at)
  const h = hourOf(dt)
  const themes = new Set()

  const push = (s) => {
    const low = String(s || '').toLowerCase()
    for (const [word, theme] of Object.entries(SIGNAL)) {
      if (low.includes(word)) themes.add(theme)
    }
    for (const tok of low.split(/[^a-z0-9]+/)) {
      if (tok.length >= 4 && !['that', 'with', 'from', 'this', 'were', 'have', 'been', 'they', 'them', 'your', 'youre', 'about', 'there'].includes(tok)) {
        themes.add(`w:${tok}`)
      }
    }
  }

  push(raw.heading)
  push(raw.body)
  for (const tag of raw.tags || []) themes.add(`t:${tag}`)

  // Structural themes per type
  let artist = null
  let merchant = null
  if (raw.type === 'music' && raw.artist) {
    artist = raw.artist
    themes.add(`artist:${artist.toLowerCase()}`)
  } else if (raw.type === 'music' && raw.heading && raw.heading.includes('—')) {
    artist = raw.heading.split('—').pop().trim()
    themes.add(`artist:${artist.toLowerCase()}`)
  }
  if (raw.type === 'purchase' && raw.merchant) {
    merchant = raw.merchant
    themes.add(`merchant:${merchant.toLowerCase()}`)
  } else if (raw.type === 'purchase' && raw.body && raw.body.includes('·')) {
    merchant = raw.body.split('·')[0].trim()
    themes.add(`merchant:${merchant.toLowerCase()}`)
  }
  if (raw.city) themes.add(`city:${raw.city.toLowerCase()}`)
  if (raw.counterpart) themes.add(`person:${raw.counterpart.toLowerCase()}`)

  const timeOfDay = timeOfDayOf(dt)
  themes.add(`time:${timeOfDay}`)
  const isNight = h >= 22 || h < 6
  if (isNight) themes.add('nightfall')

  return {
    ...raw,
    dt,
    hour: h,
    min: dt.getUTCMinutes(),
    timeOfDay,
    isNight,
    monthKey: monthKey(dt),
    month: dt.getUTCMonth(),
    year: dt.getUTCFullYear(),
    dayKey: `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`,
    artist,
    merchant,
    themes: [...themes],
    mood: MOODS.includes(raw.mood) ? raw.mood : 'neutral',
    energy: typeof raw.energy === 'number' ? raw.energy : 40,
    text: [raw.heading, raw.body].filter(Boolean).join(' · '),
  }
}

export function preprocessAll(raws) {
  const receipts = raws.filter((r) => TYPES.includes(r.type)).map(enrich)
  receipts.sort((a, b) => a.dt - b.dt)
  return receipts
}

export function isValidReceipt(r) {
  return r && TYPES.includes(r.type) && r.at && new Date(r.at).toString() !== 'Invalid Date'
}

export function normalizeReceipt(raw) {
  const dt = new Date(raw.at)
  if (isValidReceipt(raw)) {
    return {
      ...raw,
      at: raw.at,
      type: raw.type,
      heading: raw.heading || raw.title || `${raw.type}`,
      body: raw.body || raw.detail || '',
      tags: Array.isArray(raw.tags) ? raw.tags : String(raw.tags || '').split('|').filter(Boolean),
      energy: Number.isFinite(Number(raw.energy)) ? Number(raw.energy) : 40,
      amount: Number.isFinite(Number(raw.amount)) ? Number(raw.amount) : null,
      lat: Number.isFinite(Number(raw.lat)) ? Number(raw.lat) : null,
      lng: Number.isFinite(Number(raw.lng)) ? Number(raw.lng) : null,
      mood: MOODS.includes(raw.mood) ? raw.mood : 'neutral',
    }
  }
  return null
}