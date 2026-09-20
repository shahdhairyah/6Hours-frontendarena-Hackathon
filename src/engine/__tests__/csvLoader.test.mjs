import test from 'node:test'
import assert from 'node:assert/strict'
import { parseCsv, rowsToReceipts } from '../csvLoader.js'

test('CSV Parser: parses basic, quoted, and escaped CSV text', () => {
  const csv = `id,type,at,heading,body\nr001,music,2024-01-01T02:00:00.000Z,"Song, with comma","Body with ""escaped"" quotes"\nr002,photo,2024-01-02T10:00:00.000Z,Lisbon photo,Tram 28`
  const rows = parseCsv(csv)

  assert.equal(rows.length, 3)
  assert.equal(rows[0][0], 'id')
  assert.equal(rows[1][3], 'Song, with comma')
  assert.equal(rows[1][4], 'Body with "escaped" quotes')
  assert.equal(rows[2][1], 'photo')
})

test('CSV Parser: rowsToReceipts normalizes column aliases and filters invalid types', () => {
  const parsed = [
    ['id', 'type', 'when', 'title', 'detail', 'price', 'currency', 'tags'],
    ['t01', 'music', '2024-03-01T22:00:00.000Z', 'Night Music', 'Album notes', '9.99', '£', 'travel|night'],
    ['t02', 'invalid_category', '2024-03-01T22:00:00.000Z', 'Skipped', 'Invalid', '0', '£', ''],
    ['t03', 'place', '2024-03-02T14:00:00.000Z', 'Lisbon Miradouro', 'Viewpoint', '', '€', 'lisbon'],
  ]

  const receipts = rowsToReceipts(parsed)
  assert.equal(receipts.length, 2, 'Should filter out invalid category row')
  assert.equal(receipts[0].id, 't01')
  assert.equal(receipts[0].type, 'music')
  assert.equal(receipts[0].amount, 9.99)
  assert.deepEqual(receipts[0].tags, ['travel', 'night'])
  assert.equal(receipts[1].type, 'place')
})

test('CSV Parser: gracefully handles empty text or empty rows', () => {
  assert.deepEqual(parseCsv(''), [])
  assert.deepEqual(rowsToReceipts([]), [])
})
