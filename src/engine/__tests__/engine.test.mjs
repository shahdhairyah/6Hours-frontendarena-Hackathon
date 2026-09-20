import test from 'node:test'
import assert from 'node:assert/strict'
import { buildEngine } from '../index.js'
import { normalizeReceipt, isValidReceipt } from '../preprocess.js'
import { RECEIPTS } from '../../data/receipts.js'

test('Preprocess: isValidReceipt detects valid and invalid formats', () => {
  const valid = {
    id: 'r0001',
    type: 'music',
    at: '2024-01-03T14:12:00.000Z',
    heading: 'Song Title',
  }
  assert.equal(isValidReceipt(valid), true)

  const invalidType = { id: 'r0002', type: 'unknown_type', at: '2024-01-03T14:12:00.000Z' }
  assert.equal(isValidReceipt(invalidType), false)

  const invalidDate = { id: 'r0003', type: 'music', at: 'not-a-date' }
  assert.equal(isValidReceipt(invalidDate), false)
})

test('Preprocess: normalizeReceipt safely defaults missing fields', () => {
  const raw = {
    id: 'test01',
    type: 'purchase',
    at: '2024-05-10T10:00:00.000Z',
    heading: 'Coffee',
  }
  const normalized = normalizeReceipt(raw)
  assert.ok(normalized)
  assert.equal(normalized.energy, 40)
  assert.equal(normalized.mood, 'neutral')
  assert.deepEqual(normalized.tags, [])
})

test('Engine Core: buildEngine processes full 466 Kaggle records', () => {
  const engine = buildEngine(RECEIPTS)

  assert.ok(engine)
  assert.equal(engine.receipts.length, 466)
  assert.equal(engine.chapters.length, 4)

  // Chapter themes
  assert.equal(engine.chapters[0].theme, 'wander')
  assert.equal(engine.chapters[1].theme, 'night')
  assert.equal(engine.chapters[2].theme, 'anchor')
  assert.equal(engine.chapters[3].theme, 'maker')

  // Stats verification
  assert.ok(engine.stats.total >= 466)
  assert.equal(engine.stats.byHour.length, 24)
  assert.ok(engine.stats.nightRatio > 0)

  // Threads & Echoes verification
  assert.ok(engine.threads.edges.length > 0)
  assert.ok(engine.threads.moments.length > 0)
  assert.ok(engine.threads.echoEdges.length > 0)

  // Narrative verification
  assert.ok(engine.narrative.prologue.thesis)
  assert.equal(engine.narrative.chapters.length, 4)
  assert.equal(engine.narrative.insights.length, 6)
})
