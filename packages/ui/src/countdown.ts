import type { TimeRemaining } from './types'

const URGENT_THRESHOLD_MS = 24 * 60 * 60 * 1000

export function calcTimeRemaining(deadline: number): TimeRemaining {
  const now = Date.now()
  const diff = deadline - now

  if (diff <= 0) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true,
      urgent: false,
    }
  }

  const urgent = diff < URGENT_THRESHOLD_MS

  const deadlineDate = new Date(deadline)
  const nowDate = new Date(now)

  let years = deadlineDate.getFullYear() - nowDate.getFullYear()
  let months = deadlineDate.getMonth() - nowDate.getMonth()
  let days = deadlineDate.getDate() - nowDate.getDate()
  let hours = deadlineDate.getHours() - nowDate.getHours()
  let minutes = deadlineDate.getMinutes() - nowDate.getMinutes()
  let seconds = deadlineDate.getSeconds() - nowDate.getSeconds()

  if (seconds < 0) {
    seconds += 60
    minutes--
  }
  if (minutes < 0) {
    minutes += 60
    hours--
  }
  if (hours < 0) {
    hours += 24
    days--
  }
  if (days < 0) {
    const prevMonth = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), 0)
    days += prevMonth.getDate()
    months--
  }
  if (months < 0) {
    months += 12
    years--
  }

  return { years, months, days, hours, minutes, seconds, expired: false, urgent }
}

export function padNum(n: number, len = 2): string {
  return String(n).padStart(len, '0')
}

export function padYear(n: number): string {
  return String(n).padStart(4, '0')
}
