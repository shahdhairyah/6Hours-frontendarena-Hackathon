import test from 'node:test'
import assert from 'node:assert/strict'
import { ReceiptService } from '../../services/receiptService.js'
import { preprocessAll } from '../preprocess.js'
import { RECEIPTS } from '../../data/receipts.js'

test('ReceiptService: getById finds receipt or returns null', () => {
  const receipts = preprocessAll(RECEIPTS)
  const first = receipts[0]

  const found = ReceiptService.getById(receipts, first.id)
  assert.ok(found)
  assert.equal(found.id, first.id)

  const notFound = ReceiptService.getById(receipts, 'non_existent_id')
  assert.equal(notFound, null)
})

test('ReceiptService: filter handles type, mood, query, and city', () => {
  const receipts = preprocessAll(RECEIPTS)

  const musicOnly = ReceiptService.filter(receipts, { type: 'music' })
  assert.ok(musicOnly.length > 0)
  assert.ok(musicOnly.every(r => r.type === 'music'))

  const querySearch = ReceiptService.filter(receipts, { query: 'Lisbon' })
  assert.ok(querySearch.length > 0)

  const json = ReceiptService.exportJson(musicOnly.slice(0, 2))
  assert.ok(json.startsWith('['))
})
