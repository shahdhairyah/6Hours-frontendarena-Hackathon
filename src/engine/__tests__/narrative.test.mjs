import test from 'node:test'
import assert from 'node:assert/strict'
import { buildNarrative } from '../narrative.js'
import { segmentChapters } from '../chapters.js'
import { buildThreads } from '../threads.js'
import { computeStats } from '../stats.js'
import { preprocessAll } from '../preprocess.js'
import { RECEIPTS } from '../../data/receipts.js'

test('Narrative: synthesizes literary prologue, 4 acts, 6 insights, and epilogue', () => {
  const receipts = preprocessAll(RECEIPTS)
  const chapters = segmentChapters(receipts)
  const threads = buildThreads(receipts, chapters)
  const stats = computeStats(receipts, chapters)
  const narrative = buildNarrative(receipts, chapters, stats, threads)

  // Prologue
  assert.ok(narrative.prologue)
  assert.ok(narrative.prologue.thesis)
  assert.ok(narrative.prologue.opening)
  assert.ok(Array.isArray(narrative.prologue.beats))

  // Chapters
  assert.equal(narrative.chapters.length, 4)
  for (const ch of narrative.chapters) {
    assert.ok(ch.paragraphs.length >= 2, 'Chapter must have multiple paragraphs')
    assert.ok(ch.beats.length > 0, 'Chapter must have narrative beat receipts')
  }

  // Insights (The 6 algorithmic pattern dossiers)
  assert.equal(narrative.insights.length, 6)
  const titles = narrative.insights.map(i => i.title.toLowerCase())
  assert.ok(titles.some(t => t.includes('2 a.m.') || t.includes('curve')))
  assert.ok(titles.some(t => t.includes('quiet') || t.includes('silence')))
  assert.ok(titles.some(t => t.includes('clock') || t.includes('maya') || t.includes('visitor')))

  // Epilogue
  assert.ok(narrative.epilogue)
  assert.ok(narrative.epilogue.text)
  assert.ok(narrative.epilogue.beats.length > 0)
})
