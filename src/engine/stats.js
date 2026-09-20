import { MOOD_WEIGHT } from './types.js'
import { fmtMonth } from './preprocess.js'

const DAY = 86400000

export function computeStats(receipts, _chapters) {
  const n = receipts.length
  if (!n) return {}

  const byType = {}
  const byMonth = {}
  const byDay = {}
  const byHour = Array.from({ length: 24 }, () => 0)
  const seenDays = new Set()
  const moods = {}

  for (const r of receipts) {
    byType[r.type] = (byType[r.type] || 0) + 1
    const mk = r.monthKey
    const mb = (byMonth[mk] ||= { count: 0, mood: 0, night: 0, types: {} })
    mb.count++
    mb.mood += MOOD_WEIGHT[r.mood] ?? 0.4
    if (r.isNight) mb.night++
    mb.types[r.type] = (mb.types[r.type] || 0) + 1
    const dk = r.dayKey
    byDay[dk] = (byDay[dk] || 0) + 1
    seenDays.add(dk)
    byHour[r.hour]++
    moods[r.mood] = (moods[r.mood] || 0) + 1
  }

  // longest streak & longest silence & busiest day
  const days = [...seenDays].sort()
  let bestStreak = 1
  let run = 1
  let silence = 0
  let prev = new Date(days[0])
  for (let i = 1; i < days.length; i++) {
    const gap = Math.round((new Date(days[i]) - prev) / DAY)
    if (gap === 1) {
      run++
      bestStreak = Math.max(bestStreak, run)
    } else {
      run = 1
      silence = Math.max(silence, gap - 1)
    }
    prev = new Date(days[i])
  }
  const busiestDay = Object.entries(byDay).sort((a, b) => b[1] - a[1])[0]

  const night = receipts.filter((r) => r.isNight).length
  const nightRatio = night / n

  const byHourArr = byHour.flatMap((c, h) => Array(c).fill(h))
  const hourMean = byHourArr.length ? byHourArr.reduce((s, h) => s + h, 0) / byHourArr.length : 0

  const themes = countThemes(receipts)
  const artists = countBy(receipts, (r) => r.artist)
  const merchants = countBy(receipts, (r) => r.merchant)
  const cities = countBy(
    receipts,
    (r) => (r.type === 'place' || r.type === 'photo' || r.city ? r.city : null)
  )
  const people = countBy(receipts, (r) => r.counterpart)

  const spend = {}
  let totalSpend = 0
  for (const r of receipts) {
    if (typeof r.amount === 'number') {
      const k = r.currency || ''
      spend[k] = Math.round((spend[k] || 0) + r.amount * 100) / 100
      totalSpend += r.amount
    }
  }

  // mood journey by month (for heat strip)
  const moodJourney = Object.entries(byMonth)
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([mk, b]) => ({
      monthKey: mk,
      label: fmtMonth(new Date(`${mk}-01T00:00:00Z`)),
      count: b.count,
      mood: b.mood / b.count,
      night: b.night / b.count,
      types: b.types,
    }))

  return {
    total: n,
    spanDays: Math.round((receipts[n - 1].dt - receipts[0].dt) / DAY),
    byType,
    byTypePct: percent(byType, n),
    byMonth,
    byHour,
    byDay,
    hourMean,
    nightRatio,
    night,
    moods,
    topMood: Object.entries(moods).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'neutral',
    themes,
    artists,
    merchants,
    cities,
    people,
    spend,
    totalSpend,
    bestStreak,
    silence,
    busiestDay: busiestDay ? { day: busiestDay[0], count: busiestDay[1] } : null,
    moodJourney,
    topType: Object.entries(byType).sort((a, b) => b[1] - a[1])[0]?.[0],
    typeRank: Object.entries(byType).sort((a, b) => b[1] - a[1]),
  }
}

function percent(obj, total) {
  const out = {}
  for (const [k, v] of Object.entries(obj)) out[k] = Math.round((v / total) * 1000) / 10
  return out
}

function countThemes(receipts) {
  const counts = {}
  for (const r of receipts) for (const t of r.tags || []) counts[t] = (counts[t] || 0) + 1
  return Object.entries(counts)
    .map(([tag, n]) => ({ tag, n }))
    .filter((x) => !['random', 'quiet', 'travel', 'food'].includes(x.tag))
    .sort((a, b) => b.n - a.n)
    .slice(0, 14)
}

function countBy(receipts, fn) {
  const counts = {}
  for (const r of receipts) {
    const v = fn(r)
    if (v) counts[v] = (counts[v] || 0) + 1
  }
  return Object.entries(counts)
    .map(([label, n]) => ({ label, n }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 10)
}