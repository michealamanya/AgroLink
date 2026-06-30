export function createDisplayTimestamp() {
  return new Date().toLocaleString('en-UG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function summarizeTimestamp(primary, fallback = 'Not available') {
  return primary || fallback
}
