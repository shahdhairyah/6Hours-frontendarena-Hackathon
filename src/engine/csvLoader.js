import { TYPES } from './types.js'

// Tolerant CSV parser (handles quoted fields, newlines inside quotes, CRLF).
export function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  const src = String(text || '')
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    const next = src[i + 1]
    if (inQuotes) {
      if (c === '"' && next === '"') {
        field += '"'
        i++
      } else if (c === '"') {
        inQuotes = false
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && next === '\n') i++
      row.push(field)
      field = ''
      if (row.some((x) => x.trim() !== '')) rows.push(row)
      row = []
    } else {
      field += c
    }
  }
  row.push(field)
  if (row.some((x) => x.trim() !== '')) rows.push(row)
  return rows
}

// Guess which column holds what, forgiving mis-cased / alternate headers.
const HEADER_FORMS = {
  at: ['at', 'timestamp', 'time', 'date', 'datetime', 'createdat', 'when'],
  type: ['type', 'kind', 'category', 'receipttype'],
  heading: ['heading', 'title', 'name', 'item', 'summary'],
  body: ['body', 'text', 'detail', 'description', 'caption', 'notes', 'note'],
  tags: ['tags', 'tag', 'labels', 'topics'],
  mood: ['mood', 'sentiment', 'emotion'],
  energy: ['energy', 'intensity', 'valence'],
  amount: ['amount', 'price', 'cost', 'value'],
  currency: ['currency', 'curr'],
  lat: ['lat', 'latitude'],
  lng: ['lng', 'lon', 'longitude', 'long'],
  city: ['city', 'location', 'place'],
  artist: ['artist', 'trackartist'],
  merchant: ['merchant', 'store', 'shop', 'venue'],
  counterpart: ['counterpart', 'person', 'recipient', 'contact'],
}

const lower = (s) => String(s || '').toLowerCase().replace(/[^a-z]/g, '')

// Converts parsed CSV rows (array of arrays) into unified receipts.
export function rowsToReceipts(parsed) {
  if (!parsed.length) return []
  const header = parsed[0].map((h) => lower(h))
  const mapping = {}
  for (const [key, forms] of Object.entries(HEADER_FORMS)) {
    let idx = header.findIndex((h) => forms.includes(h) || forms.some((f) => h.includes(lower(f))))
    if (idx < 0) idx = header.findIndex((h) => header.some((c) => forms.includes(c)) && h === key)
    if (idx >= 0) mapping[key] = idx
  }
  const out = []
  for (let i = 1; i < parsed.length; i++) {
    const r = parsed[i]
    if (!r || r.every((c) => String(c).trim() === '')) continue
    const dict = {}
    for (const [key, idx] of Object.entries(mapping)) dict[key] = r[idx]
    const type = String(dict.type || '').toLowerCase()
    if (!TYPES.includes(type)) continue
    if (!dict.at) continue
    out.push({
      id: String(dict.id || dict.heading || dict.at).trim(),
      type,
      at: String(dict.at).trim(),
      heading: String(dict.heading || '').trim(),
      body: String(dict.body || '').trim(),
      tags: String(dict.tags || '')
        .split(/[|;]/)
        .map((t) => t.trim())
        .filter(Boolean),
      mood: String(dict.mood || '').trim(),
      energy: num(dict.energy),
      amount: num(dict.amount),
      currency: String(dict.currency || '').trim(),
      lat: num(dict.lat),
      lng: num(dict.lng),
      city: String(dict.city || '').trim(),
      artist: String(dict.artist || '').trim(),
      merchant: String(dict.merchant || '').trim(),
      counterpart: String(dict.counterpart || '').trim(),
    })
  }
  return out
}

const num = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

// Fetch + parse + normalise. Returns [] if the file isn't there.
export async function loadReceiptsCsv(url) {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return []
  const text = await res.text()
  const parsed = parseCsv(text)
  return rowsToReceipts(parsed)
}