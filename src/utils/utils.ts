export function isNullOrUndefinedOrEmpty (value: any): boolean {
  return value === null || value === undefined || value === ''
}

export function formatSmartDate (input: Date | string) {
  const date = new Date(input) // Ensures it's a Date
  const now = new Date()

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  const yesterday = new Date()
  yesterday.setDate(now.getDate() - 1)
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()

  const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

  if (isToday) return `Hoy, ${time}`
  if (isYesterday) return `Ayer, ${time}`

  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
