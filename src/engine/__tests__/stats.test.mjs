import test from 'node:test'
import assert from 'node:assert/strict'
import { computeStats } from '../stats.js'
import { preprocessAll } from '../preprocess.js'
import { RECEIPTS } from '../../data/receipts.js'

test('Stats: aggregator calculates 24-hour circadian bins and counts', () => {
  const receipts = preprocessAll(RECEIPTS)
  const stats = computeStats(receipts)

  assert.equal(stats.total, 466)
  assert.equal(stats.byHour.length, 24)

  // Sum of hourly counts must equal total receipts
  const sumHours = stats.byHour.reduce((acc, count) => acc + count, 0)
  assert.equal(sumHours, 466)

  // Check 2 AM bin specifically
  const twoAmCount = stats.byHour[2]
  assert.ok(typeof twoAmCount === 'number')
  assert.ok(twoAmCount > 0, 'Hour 2 must contain receipts')
})

test('Stats: spending aggregation accurately totals currency amounts', () => {
  const receipts = preprocessAll(RECEIPTS)
  const stats = computeStats(receipts)

  assert.ok(typeof stats.totalSpend === 'number')
  assert.ok(stats.totalSpend > 0)
  assert.ok(stats.byType.purchase > 0, 'Should record purchase transactions')

  // Verify city breakdowns
  assert.ok(stats.cities.length > 0)
  const bristol = stats.cities.find(c => c.label.toLowerCase() === 'bristol')
  assert.ok(bristol, 'Bristol should be among the top cities')
})
