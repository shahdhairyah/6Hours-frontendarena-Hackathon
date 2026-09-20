/**
 * TypeScript Type Declarations for LEDGER Analytical Engine & State
 */

export type ReceiptType =
  | 'music'
  | 'film'
  | 'place'
  | 'purchase'
  | 'photo'
  | 'message'
  | 'search'
  | 'event'
  | 'note'

export type ReceiptMood =
  | 'bright'
  | 'warm'
  | 'driven'
  | 'hopeful'
  | 'wistful'
  | 'restless'
  | 'anxious'
  | 'melancholic'
  | 'neutral'

export type TimeOfDay = 'night' | 'early' | 'day' | 'evening'

export interface RawReceipt {
  id: string
  type: ReceiptType
  at: string
  heading?: string
  body?: string
  tags?: string[] | string
  mood?: ReceiptMood
  energy?: number
  amount?: number | null
  currency?: string | null
  lat?: number | null
  lng?: number | null
  city?: string | null
  counterpart?: string | null
  direction?: 'sent' | 'received'
  artist?: string | null
  merchant?: string | null
}

export interface EnrichedReceipt extends RawReceipt {
  dt: Date
  hour: number
  min: number
  timeOfDay: TimeOfDay
  isNight: boolean
  monthKey: string
  dayKey: string
  themes: string[]
  text: string
}

export interface Chapter {
  index: number
  id: string
  roman: string
  theme: 'wander' | 'night' | 'anchor' | 'maker' | 'transition'
  name: string
  deck: string
  tone: string
  start: Date
  end: Date
  days: number
  count: number
  span: string
  counts: Record<string, number>
  dominant: string[]
  topTags: Array<{ tag: string; n: number }>
  nightRatio: number
  moodMean: number
  travel: number
  nightFall: number
  maya: number
  making: number
  sea: number
  recs: EnrichedReceipt[]
  ids: string[]
  paragraphs?: string[]
  beats?: string[]
}

export interface ThreadLink {
  kind: 'motion' | 'echo'
  label: string
  theme?: string
  mins?: number
}

export interface ThreadEdge {
  a: string
  b: string
  score: number
  kind: 'motion' | 'echo'
  echo: boolean
  links: ThreadLink[]
  label: string
  days: number
}

export interface SynthesizedMoment {
  ids: string[]
  dayKey: string
  start: Date
  recs: EnrichedReceipt[]
  types: ReceiptType[]
  themes: string[]
}

export interface ThreadGraph {
  byId: Map<string, EnrichedReceipt>
  adjacency: Map<string, ThreadEdge[]>
  edges: ThreadEdge[]
  moments: SynthesizedMoment[]
  echoEdges: ThreadEdge[]
  countByKind: Record<string, number>
}

export interface EngineStats {
  total: number
  spanDays: number
  byType: Record<string, number>
  byTypePct: Record<string, number>
  byMonth: Record<string, any>
  byHour: number[]
  byDay: Record<string, number>
  hourMean: number
  nightRatio: number
  night: number
  moods: Record<string, number>
  topMood: string
  themes: Array<{ tag: string; n: number }>
  artists: Array<{ label: string; n: number }>
  merchants: Array<{ label: string; n: number }>
  cities: Array<{ label: string; n: number }>
  people: Array<{ label: string; n: number }>
  spend: Record<string, number>
  totalSpend: number
  bestStreak: number
  silence: number
  busiestDay: { day: string; count: number } | null
  moodJourney: Array<{
    monthKey: string
    label: string
    count: number
    mood: number
    night: number
    types: Record<string, number>
  }>
  topType?: string
  typeRank: Array<[string, number]>
}

export interface InsightDossier {
  no: number
  title: string
  body: string
  ids: string[]
}

export interface EngineNarrative {
  prologue: {
    opening: string
    thesis: string
    beats: string[]
  }
  chapters: Chapter[]
  insights: InsightDossier[]
  epilogue: {
    text: string
    beats: string[]
  }
}

export interface EngineInstance {
  receipts: EnrichedReceipt[]
  chapters: Chapter[]
  threads: ThreadGraph
  stats: EngineStats
  narrative: EngineNarrative
}
