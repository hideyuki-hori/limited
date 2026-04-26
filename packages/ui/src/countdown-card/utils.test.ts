import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { consumed, elapsedDays, formatDate, formatDateISO } from './utils'

describe('elapsedDays', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-26T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('開始直後は 0d elapsed', () => {
    expect(elapsedDays(Date.now())).toBe('0d elapsed')
  })

  it('5 日経過を返す', () => {
    const fiveDaysAgo = Date.now() - 5 * 24 * 60 * 60 * 1000
    expect(elapsedDays(fiveDaysAgo)).toBe('5d elapsed')
  })

  it('未来の startedAt は負数 (Math.floor で繰り下げ)', () => {
    const future = Date.now() + 24 * 60 * 60 * 1000
    expect(elapsedDays(future)).toBe('-1d elapsed')
  })
})

describe('consumed', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-26T00:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('開始直後は 0%', () => {
    const start = Date.now()
    const end = start + 10 * 24 * 60 * 60 * 1000
    expect(consumed(start, end)).toBe(0)
  })

  it('中間地点で 50%', () => {
    const start = Date.now() - 5 * 24 * 60 * 60 * 1000
    const end = Date.now() + 5 * 24 * 60 * 60 * 1000
    expect(consumed(start, end)).toBe(50)
  })

  it('期限到達で 100%', () => {
    const start = Date.now() - 10 * 24 * 60 * 60 * 1000
    const end = Date.now()
    expect(consumed(start, end)).toBe(100)
  })

  it('期限超過は 100% にクランプ', () => {
    const start = Date.now() - 20 * 24 * 60 * 60 * 1000
    const end = Date.now() - 10 * 24 * 60 * 60 * 1000
    expect(consumed(start, end)).toBe(100)
  })

  it('開始前は 0% にクランプ', () => {
    const start = Date.now() + 5 * 24 * 60 * 60 * 1000
    const end = Date.now() + 10 * 24 * 60 * 60 * 1000
    expect(consumed(start, end)).toBe(0)
  })

  it('total <= 0 のときは 100%', () => {
    const start = Date.now()
    expect(consumed(start, start)).toBe(100)
    expect(consumed(start, start - 1000)).toBe(100)
  })
})

describe('formatDate', () => {
  it('YYYY-MM-DD HH:MM 形式', () => {
    const ts = new Date(2026, 3, 26, 14, 30).getTime()
    expect(formatDate(ts)).toBe('2026-04-26 14:30')
  })

  it('1 桁の月日時分はゼロパディング', () => {
    const ts = new Date(2026, 0, 5, 7, 9).getTime()
    expect(formatDate(ts)).toBe('2026-01-05 07:09')
  })
})

describe('formatDateISO', () => {
  it('YYYY-MM-DDTHH:MM 形式 (datetime-local 用)', () => {
    const ts = new Date(2026, 3, 26, 14, 30).getTime()
    expect(formatDateISO(ts)).toBe('2026-04-26T14:30')
  })

  it('1 桁の月日時分はゼロパディング', () => {
    const ts = new Date(2026, 0, 5, 7, 9).getTime()
    expect(formatDateISO(ts)).toBe('2026-01-05T07:09')
  })
})
