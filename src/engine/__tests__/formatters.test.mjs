import test from 'node:test'
import assert from 'node:assert/strict'
import { fmtDate, fmtDateShort, fmtTime, fmtCurrency, truncate } from '../../utils/formatters.js'
import { hourOf, timeOfDayOf } from '../preprocess.js'

test('Formatters: correctly formats date, short date, and time strings', () => {
  const d = new Date('2024-05-18T14:30:00.000Z')

  assert.equal(fmtDate(d), '18 May 2024')
  assert.equal(fmtDateShort(d), '18 May')
  // Depending on locale, check hours and minutes exist
  const timeStr = fmtTime(d)
  assert.ok(timeStr.includes('30'))

  // Graceful empty input handling
  assert.equal(fmtDate(null), '')
  assert.equal(fmtTime(null), '')
})

test('Formatters: fmtCurrency formats numbers and handles invalid values', () => {
  assert.equal(fmtCurrency(42.5), '£42.50')
  assert.equal(fmtCurrency(100, '€'), '€100.00')
  assert.equal(fmtCurrency(null), null)
  assert.equal(fmtCurrency(NaN), null)
})

test('Formatters: truncate cuts strings at specified limit', () => {
  assert.equal(truncate('Hello world', 5), 'Hello…')
  assert.equal(truncate('Short', 10), 'Short')
  assert.equal(truncate('', 10), '')
})

test('Circadian Utils: hourOf and timeOfDayOf categorize properly', () => {
  const night = new Date('2024-01-01T02:00:00.000Z')
  assert.equal(hourOf(night), 2)
  assert.equal(timeOfDayOf(night), 'night')

  const early = new Date('2024-01-01T07:15:00.000Z')
  assert.equal(timeOfDayOf(early), 'early')

  const day = new Date('2024-01-01T12:00:00.000Z')
  assert.equal(timeOfDayOf(day), 'day')

  const evening = new Date('2024-01-01T19:45:00.000Z')
  assert.equal(timeOfDayOf(evening), 'evening')
})
