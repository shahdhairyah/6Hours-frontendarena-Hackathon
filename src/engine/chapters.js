import { CHAPTER_THEMES, MOOD_WEIGHT, TYPES } from './types.js'
import { fmtMonth } from './preprocess.js'

// ---- week bucketing --------------------------------------------------------
const DAY_MS = 86400000

// ---- sequential change detection ------------------------------------------
// The clock of a life is its strongest narrator. We read three signals from a
// smoothed weekly series: the nights arriving (late activity rises), the
// nights leaving, and the dawns arriving (5–8am activity rising). Each signal
// crossing its threshold in sequence marks the start of a new chapter.
// A 4-week rolling window absorbs single odd weeks (the 6:40am photo in the
// middle of the darkest chapter is a beat, not a chapter).
const ROLL = 4
const TH_NIGHT_UP = 0.34 // late activity can't be ignored any longer
const TH_NIGHT_DOWN = 0.27 // the nights move out
const TH_DAWN_UP = 0.13 // 5–8am becomes a home, not a stumble

const normTypes = (counts, total) => {
  const o = {}
  for (const k of TYPES) o[k] = (counts[k] || 0) / total
  return o
}

function detectBoundaries(receipts, buckets) {
  const series = []
  let firstWeek = null
  for (let w = 0; w < buckets.length; w++) {
    if (buckets[w]) {
      if (firstWeek === null) firstWeek = w
      const win = rollingBucket(buckets, w, ROLL)
      if (!win || win.total === 0) continue
      series.push({
        w,
        night: win.night / win.total,
        dawn: win.dawn / win.total,
      })
    }
  }
  const boundaries = []
  const cut = (i) => {
    if (i >= 0 && i < series.length) boundaries.push(series[i].w)
    return i
  }
  // 1 — nights arrive (and stay: 3 consecutive smoothed weeks past threshold)
  let i = 1
  while (
    i < series.length - 2 &&
    !(series[i].night > TH_NIGHT_UP && series[i + 1].night > TH_NIGHT_UP && series[i + 2].night > TH_NIGHT_UP)
  )
    i++
  if (i >= series.length - 2) return boundaries
  cut(i)
  // 2 — nights leave (and keep leaving)
  while (
    i + 2 < series.length &&
    !(series[i].night < TH_NIGHT_DOWN && series[i + 1].night < TH_NIGHT_DOWN && series[i + 2].night < TH_NIGHT_DOWN)
  )
    i++
  if (i >= series.length - 2) return boundaries
  cut(i)
  // 3 — dawns arrive (5–8am becomes a way of life)
  while (i < series.length && !(series[i].dawn > TH_DAWN_UP && (series[i + 1] ? series[i + 1].dawn > TH_DAWN_UP : true))) i++
  if (i < series.length) cut(i)
  return boundaries
}

function rollingBucket(buckets, w, roll) {
  const acc = { total: 0, byType: {}, night: 0, dawn: 0, mood: 0 }
  for (let k = Math.max(0, w - roll + 1); k <= w; k++) {
    const b = buckets[k]
    if (!b) continue
    acc.total += b.total
    for (const [t, n] of Object.entries(b.byType)) acc.byType[t] = (acc.byType[t] || 0) + n
    acc.night += b.night
    acc.dawn += b.dawn
    acc.mood += b.mood
  }
  return acc.total ? acc : null
}

// ---- segmentation ----------------------------------------------------------
export function segmentChapters(receipts) {
  if (!receipts.length) return []
  const t0 = receipts[0].dt
  const buckets = []
  const weekOf = (r) => Math.floor((r.dt.getTime() - t0.getTime()) / (7 * DAY_MS))

  for (const r of receipts) {
    const w = weekOf(r)
    const b = (buckets[w] ||= { total: 0, byType: {}, night: 0, dawn: 0, mood: 0 })
    b.total++
    b.byType[r.type] = (b.byType[r.type] || 0) + 1
    if (r.isNight) b.night++
    if (r.hour >= 4 && r.hour < 8) b.dawn++
    b.mood += MOOD_WEIGHT[r.mood] ?? 0.4
  }

  const boundaries = detectBoundaries(receipts, buckets)
  const cutWeeks = new Set(boundaries)
  const sections = []
  let current = []
  for (let w = 0; w < buckets.length; w++) {
    const b = buckets[w]
    if (!b) continue
    const weekRecs = receipts.filter((r) => weekOf(r) === w)
    if (cutWeeks.has(w)) {
      if (current.length) sections.push(current)
      current = [...weekRecs]
    } else {
      current.push(...weekRecs)
    }
  }
  if (current.length) sections.push(current)

  // merge tiny chapters into their nearest neighbour
  let grown = true
  while (grown) {
    grown = false
    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i]
      const days = sec.length ? Math.max(1, Math.round((sec[sec.length - 1].dt - sec[0].dt) / DAY_MS)) : 0
      if (sec.length >= 14 && days >= 28) continue
      if (sections.length <= 2) break
      const other = i === 0 ? 1 : i === sections.length - 1 ? i - 1 : undefined
      const targets =
        other === undefined
          ? []
          : [other, ...(i > 0 ? [i - 1] : []), ...(i < sections.length - 1 ? [i + 1] : [])].filter((x) => x !== undefined && x !== other)
      const pickIdx = targets.length ? targets.reduce((best, x) => (signatureDist(sec, sections[x]) < signatureDist(sec, sections[best]) ? x : best), targets[0]) : other
      sections[pickIdx] = [...sections[pickIdx], ...sec].sort((a, b) => a.dt - b.dt)
      sections.splice(i, 1)
      grown = true
      break
    }
  }

  // renumber + characterise
  const chapters = sections
    .filter((s) => s.length > 0)
    .sort((a, b) => a[0].dt - b[0].dt)
    .map((recs, i) => buildChapter(recs, i))
  return chapters
}

function signatureDist(a, b) {
  if (!a.length || !b.length) return 1
  const va = signatureOf(a)
  const vb = signatureOf(b)
  let d = 0
  for (const k of TYPES) d += Math.abs((va.byType[k] || 0) - (vb.byType[k] || 0))
  d += 0.5 * Math.abs(va.night - vb.night) + 0.4 * Math.abs(va.mood - vb.mood)
  return d
}

function signatureOf(recs) {
  const byType = {}
  let night = 0
  let mood = 0
  for (const r of recs) {
    byType[r.type] = (byType[r.type] || 0) + 1
    if (r.isNight) night++
    mood += MOOD_WEIGHT[r.mood] ?? 0.4
  }
  const n = recs.length || 1
  return { byType: normTypes(byType, n), night: night / n, mood: mood / n }
}

function dominant(list) {
  if (!list.length) return []
  const counts = {}
  for (const x of list) counts[x] = (counts[x] || 0) + 1
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k)
}

function buildChapter(recs, i) {
  const start = recs[0].dt
  const end = recs[recs.length - 1].dt
  const days = Math.round((end - start) / DAY_MS) + 1
  const sig = signatureOf(recs)
  const n = recs.length

  const travel =
    recs.filter((r) =>
      (r.themes || []).some(
        (t) => t === 'lisbon' || t === 'porto' || t === 'cornwall' || t === 'travel' || t === 't:travel' || t.startsWith('city:')
      )
    ).length / n
  const nightFall = recs.filter((r) => (r.themes || []).includes('nightfall')).length / n
  const maya = recs.filter(
    (r) =>
      (r.themes || []).some((t) => t === 'maya' || t === 't:maya' || t === 'person:maya')
  ).length / n
  const making = recs.filter((r) => (r.tags || []).some((t) => ['dawn', 'project', 'show', 'idea', 'camera', 'vinyl'].includes(t))).length / n
  const sea = recs.filter((r) => (r.themes || []).includes('sea')).length / n

  let theme = 'transition'
  if (nightFall > 0.38 || sig.night > 0.42) theme = 'night'
  else if (travel > 0.18 || ((sig.byType.place || 0) + (sig.byType.photo || 0)) / n > 0.26) theme = 'wander'
  else if (making > 0.18) theme = 'maker'
  else if (maya > 0.12 || (sig.byType.message + (sig.byType.event || 0)) / n > 0.24) theme = 'anchor'

  const meta = CHAPTER_THEMES[theme] || CHAPTER_THEMES.transition
  const counts = {}
  for (const r of recs) counts[r.type] = (counts[r.type] || 0) + 1

  const tags = {}
  for (const r of recs) for (const t of r.tags || []) tags[t] = (tags[t] || 0) + 1

  return {
    index: i,
    id: `ch${i}`,
    roman: ['I', 'II', 'III', 'IV', 'V', 'VI'][i] || String(i + 1),
    theme,
    name: meta.name,
    deck: meta.deck,
    tone: meta.tone,
    start,
    end,
    days,
    count: n,
    span: `${fmtMonth(start)} – ${fmtMonth(end)}`,
    counts,
    dominant: dominant(recs.map((r) => r.type)),
    topTags: dominant(recs.flatMap((r) => r.tags || []))
      .slice(0, 6)
      .map((t) => ({ tag: t, n: tags[t] || 1 })),
    nightRatio: sig.night,
    moodMean: sig.mood,
    travel, nightFall, maya, making, sea,
    recs,
    ids: recs.map((r) => r.id),
  }
}