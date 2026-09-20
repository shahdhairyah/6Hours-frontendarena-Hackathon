import test from 'node:test'
import assert from 'node:assert/strict'
import { buildThreads } from '../threads.js'
import { segmentChapters } from '../chapters.js'
import { preprocessAll } from '../preprocess.js'
import { RECEIPTS } from '../../data/receipts.js'

test('Threads: graph weaver constructs edges, echoes, and clusters', () => {
  const receipts = preprocessAll(RECEIPTS)
  const chapters = segmentChapters(receipts)
  const result = buildThreads(receipts, chapters)

  assert.ok(result.edges, 'Must return graph edges')
  assert.ok(result.moments, 'Must return synthesized moments')
  assert.ok(result.echoEdges, 'Must return semantic echo edges')

  // Verify moments clustering
  assert.ok(result.moments.length > 5, 'Should synthesize at least 5 significant multi-receipt moments')
  for (const m of result.moments) {
    assert.ok(m.dayKey, 'Moment must have dayKey')
    assert.ok(m.recs.length >= 2, 'Moment must cluster at least 2 receipts')
  }

  // Verify echo edge connections
  assert.ok(result.echoEdges.length > 0)
  const sampleEcho = result.echoEdges[0]
  assert.ok(sampleEcho.a)
  assert.ok(sampleEcho.b)
  assert.ok(typeof sampleEcho.score === 'number' && sampleEcho.score > 0)
})

test('Threads: echo edges detect recurring tags such as Maya and Lisbon', () => {
  const receipts = preprocessAll(RECEIPTS)
  const chapters = segmentChapters(receipts)
  const result = buildThreads(receipts, chapters)

  const recurringEchoes = result.echoEdges.filter(e => e.links && e.links.some(l => l.theme))
  assert.ok(recurringEchoes.length > 0, 'Should detect longitudinal thematic echo edges')
})
