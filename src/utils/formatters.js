// Utility formatters for timestamps, currencies, and text snippets

export const fmtDate = (d) => {
  if (!d) return ''
  const date = d instanceof Date ? d : new Date(d)
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export const fmtDateShort = (d) => {
  if (!d) return ''
  const date = d instanceof Date ? d : new Date(d)
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(date)
}

export const fmtTime = (d) => {
  if (!d) return ''
  const date = d instanceof Date ? d : new Date(d)
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }).format(date)
}

export const fmtMonthYear = (d) => {
  if (!d) return ''
  const date = d instanceof Date ? d : new Date(d)
  return new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export const fmtCurrency = (amount, currency = '£') => {
  if (typeof amount !== 'number' || isNaN(amount)) return null
  return `${currency}${amount.toFixed(2)}`
}

export const truncate = (str, len = 80) => {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '…' : str
}
