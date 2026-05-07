import { padNum } from '../countdown'

export function elapsedDays(startedAt: number): string {
  const days = Math.floor((Date.now() - startedAt) / (1000 * 60 * 60 * 24))
  return `${days}d elapsed`
}

export function consumed(startedAt: number, deadline: number): number {
  const total = deadline - startedAt
  if (total <= 0) return 100
  const passed = Date.now() - startedAt
  if (passed <= 0) return 0
  if (passed >= total) return 100
  return Math.min(99, Math.floor((passed / total) * 100))
}

export function formatDate(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${padNum(d.getMonth() + 1)}-${padNum(d.getDate())} ${padNum(d.getHours())}:${padNum(d.getMinutes())}`
}

export function formatDateISO(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${padNum(d.getMonth() + 1)}-${padNum(d.getDate())}T${padNum(d.getHours())}:${padNum(d.getMinutes())}`
}

export const GRADIENT_ACCENT = {
  background: 'linear-gradient(to right, var(--color-accent-bright), var(--color-accent-dim))',
  '-webkit-background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
  'background-clip': 'text',
}

export const GRADIENT_HEADING = {
  background: 'linear-gradient(to right, var(--color-text-heading), var(--color-text-heading-dim))',
  '-webkit-background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
  'background-clip': 'text',
}
