import test from 'node:test'
import assert from 'node:assert/strict'
import { segmentChapters } from '../chapters.js'
import { preprocessAll } from '../preprocess.js'
import { RECEIPTS } from '../../data/receipts.js'

test('Chapters: segmentation produces 4 distinct acts with valid boundaries', () => {
  const receipts = preprocessAll(RECEIPTS)
  const chapters = segmentChapters(receipts)

  assert.equal(chapters.length, 4)

  // Validate sequential ordering
  for (let i = 0; i < chapters.length; i++) {
    const ch = chapters[i]
    assert.ok(ch.name, `Chapter ${i} must have a name`)
    assert.ok(ch.recs.length > 0, `Chapter ${i} must contain receipts`)
    assert.ok(ch.start instanceof Date)
    assert.ok(ch.end instanceof Date)
    assert.ok(ch.start <= ch.end)

    if (i > 0) {
      const prev = chapters[i - 1]
      assert.ok(prev.end <= ch.start || prev.end.getTime() === ch.start.getTime(), 'Chapters should be chronological')
    }
  }

  // Act I should span early 2024
  assert.equal(chapters[0].start.getUTCFullYear(), 2024)
  // Act IV should reach 2025
  assert.equal(chapters[3].end.getUTCFullYear(), 2025)
})

test('Chapters: each chapter computes average mood and night ratio', () => {
  const receipts = preprocessAll(RECEIPTS)
  const chapters = segmentChapters(receipts)

  for (const ch of chapters) {
    assert.ok(typeof ch.moodMean === 'number')
    assert.ok(ch.moodMean >= 0 && ch.moodMean <= 1)
    assert.ok(typeof ch.nightRatio === 'number')
    assert.ok(ch.dominant.length > 0)
    assert.ok(Array.isArray(ch.topTags))
  }
})
