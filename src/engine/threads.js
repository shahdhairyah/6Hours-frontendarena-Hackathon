import { TYPES } from './types.js'
import { fmtDateShort } from './preprocess.js'

const MIN = 60000
const DAY = 86400000

const ARTIST = (r) => r.artist && `artist:${r.artist.toLowerCase()}`
const MERCHANT = (r) => r.merchant && `merchant:${r.merchant.toLowerCase()}`
const PERSON = (r) => r.counterpart && `person:${r.counterpart.toLowerCase()}`
const CITY = (r) => r.city && `city:${r.city.toLowerCase()}`
const STRONG_TAG = (r) => (r.tags || []).filter((t) => ['maya', 'robin', 'the-kiln', 'dawn', 'night', 'lisbon', 'porto', 'cornwall', '2am-curve', 'making', 'running', 'sea', 'tram', 'callback', 'pasteis', 'vinyl', 'pair'].includes(t)).map((t) => `t:${t}`)

function themePairs(a, b) {
  const set = new Set(b.themes)
  const pairs = []
  for (const t of a.themes) if (set.has(t)) pairs.push(t)
  return pairs
}

// Score a possible connection between two receipts.
function scorePair(a, b) {
  const delta = Math.abs(a.dt - b.dt)
  const sameDay = a.dayKey === b.dayKey
  let score = 0
  const links = []

  if (sameDay && delta <= 90 * MIN) {
    const s = delta <= 15 * MIN ? 2.2 : delta <= 40 * MIN ? 1.7 : 1.2
    score += s
    const mins = Math.round(delta / MIN)
    links.push({ kind: 'motion', label: mins <= 1 ? 'a minute later, the same day' : `${mins} minutes apart, same day`, mins })
  }

  const ap = ARTIST(a)
  const bp = ARTIST(b)
  if (ap && ap === bp) {
    score += 3
    links.push({ kind: 'echo', theme: a.artist, label: `You reach for ${a.artist} again` })
  }

  const am = MERCHANT(a)
  const bm = MERCHANT(b)
  if (am && am === bm) {
    score += 2.6
    links.push({ kind: 'echo', theme: b.merchant, label: `Another receipt from ${b.merchant}` })
  }

  const ap2 = PERSON(a)
  const bp2 = PERSON(b)
  if (ap2 && ap2 === bp2) {
    score += 3.4
    links.push({ kind: 'echo', theme: a.counterpart, label: `Part of the conversation with ${b.counterpart}` })
  }

  const ac = CITY(a)
  const bc = CITY(b)
  if (ac && ac === bc) {
    score += 2
    links.push({ kind: 'echo', theme: b.city, label: `Both held by ${b.city}` })
  }

  for (const pa of STRONG_TAG(a)) {
    if (b.themes.includes(pa)) {
      const themeLabel = pa.replace('t:', '')
      const tl = {
        '2am-curve': 'The 2am curve runs through here',
        'the-kiln': 'The Kiln keeps reappearing',
        maya: 'Maya is in the frame',
        dawn: 'Both at the turning of the day',
        night: 'The night hour again',
        lisbon: 'Lisbon again',
        making: 'The making-hours recur',
        running: 'Both from a morning on foot',
      }
      score += 1.6
      links.push({ kind: 'echo', theme: themeLabel, label: tl[themeLabel] || `An echo: ${themeLabel}` })
    }
  }

  if (score === 0) {
    const shared = themePairs(a, b).filter((t) => t.startsWith('t:') || t.startsWith('w:'))
    if (shared.length && sameDay) {
      score += 0.8
      links.push({ kind: 'echo', theme: shared[0], label: 'A thin thread between these two' })
    }
  }

  return { score, links }
}

export function buildThreads(receipts, chapters) {
  const byId = new Map(receipts.map((r) => [r.id, r]))
  const chapterByDay = new Map()
  for (const ch of chapters) {
    const d0 = ch.start.getTime() - (ch.start.getTime() % DAY)
    const d1 = ch.end.getTime() - (ch.end.getTime() % DAY)
    for (let t = d0; t <= d1; t += DAY) chapterByDay.set(t, ch.id)
  }
  const chapterOf = (r) => chapterByDay.get(r.dt.getTime() - (r.dt.getTime() % DAY)) || 'none'
  const chapterIdx = Object.fromEntries(chapters.map((c, i) => [c.id, i]))

  const adjacency = new Map()
  const edges = []
  for (let i = 0; i < receipts.length; i++) {
    for (let j = i + 1; j < receipts.length; j++) {
      const a = receipts[i]
      const b = receipts[j]
      const { score, links } = scorePair(a, b)
      if (score < 1.4) continue
      const strongest = links.find((l) => l.kind === 'echo') || links[0]
      const ci = chapterIdx[chapterOf(a)]
      const cj = chapterIdx[chapterOf(b)]
      const cross = ci !== cj
      const echo = links.some((l) => l.kind === 'echo')
      const edge = {
        a: a.id,
        b: b.id,
        score,
        kind: cross ? 'echo' : 'motion',
        echo: echo && cross,
        links: links.slice(0, 2),
        label: strongest ? strongest.label : links[0] ? links[0].label : 'connected',
        days: Math.round(Math.abs(a.dt - b.dt) / DAY),
      }
      edges.push(edge)
      ;(adjacency.get(a.id) || adjacency.set(a.id, []).get(a.id)).push(edge)
      ;(adjacency.get(b.id) || adjacency.set(b.id, []).get(b.id)).push(edge)
    }
  }

  // keep strongest neighbours per receipt
  for (const [id, list] of adjacency) {
    list.sort((x, y) => y.score - x.score)
    // dedupe multi-typed links between same pair
    const seen = new Set()
    const uniq = []
    for (const e of list) {
      const key = [e.a, e.b].sort().join(':')
      if (seen.has(key)) continue
      seen.add(key)
      uniq.push(e)
      if (uniq.length >= 6) break
    }
    adjacency.set(id, uniq)
  }

  // moments: clusters bound by same-day proximity
  const parent = {}
  const find = (x) => (parent[x] === undefined ? x : (parent[x] = find(parent[x])))
  const union = (x, y) => {
    const rx = find(x)
    const ry = find(y)
    if (rx !== ry) parent[rx] = ry
  }
  for (const e of edges) {
    if (e.kind === 'motion') union(e.a, e.b)
  }
  const clusters = new Map()
  for (const id of byId.keys()) {
    const root = find(id)
    clusters.set(root, (clusters.get(root) || []).concat(id))
  }
  const moments = [...clusters.values()]
    .filter((ids) => ids.length >= 2)
    .map((ids) => {
      const recs = ids.map((id) => byId.get(id)).sort((a, b) => a.dt - b.dt)
      const spansDays = new Set(recs.map((r) => r.dayKey))
      if (spansDays.size > 1) return null
      return {
        ids,
        dayKey: recs[0].dayKey,
        start: recs[0].dt,
        recs,
        types: [...new Set(recs.map((r) => r.type))],
        themes: [...new Set(recs.flatMap((r) => r.tags || []))].slice(0, 5),
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.recs.length - a.recs.length)

  // echoes: longitudinal threads worth drawing across the atlas
  const echoEdges = edges
    .filter((e) => e.echo && e.days > 25)
    .sort((a, b) => b.score - a.score)
    .slice(0, 90)

  const countByKind = edges.reduce((acc, e) => {
    acc[e.kind] = (acc[e.kind] || 0) + 1
    return acc
  }, {})

  return { byId, adjacency, edges, moments, echoEdges, countByKind }
}

// Human answer for the "why are these two connected" question
export function describePair(a, b, edge) {
  if (!edge) return 'Two receipts, listed apart.'
  const whenA = fmtDateShort(a.dt)
  const whenB = fmtDateShort(b.dt)
  if (edge.kind === 'motion') {
    return `Same day, ${edge.label}. One life, two frames, ${Math.abs(a.dt - b.dt) / MIN} minutes between the shutter clicks.`
  }
  const theme = edge.links?.[0]?.theme
  if (theme) {
    return `Separated by ${edge.days} days, they still share ${theme}. ${whenA} and ${whenB} are the same sentence.`
  }
  return `Two moments from ${whenA} and ${whenB}. Look closer and the pattern repeats.`
}