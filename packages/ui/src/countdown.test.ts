import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { calcTimeRemaining, padNum, padYear } from './countdown'

describe('padNum', () => {
  it('左ゼロパディング (デフォルト 2 桁)', () => {
    expect(padNum(0)).toBe('00')
    expect(padNum(5)).toBe('05')
    expect(padNum(42)).toBe('42')
  })

  it('指定桁数より大きい数値はそのまま', () => {
    expect(padNum(123)).toBe('123')
    expect(padNum(1000)).toBe('1000')
  })

  it('len 引数でパディング桁数を指定できる', () => {
    expect(padNum(7, 3)).toBe('007')
    expect(padNum(7, 5)).toBe('00007')
  })
})

describe('padYear', () => {
  it('4 桁にゼロパディング', () => {
    expect(padYear(0)).toBe('0000')
    expect(padYear(99)).toBe('0099')
    expect(padYear(2024)).toBe('2024')
  })

  it('5 桁以上はそのまま', () => {
    expect(padYear(10000)).toBe('10000')
  })
})

describe('calcTimeRemaining', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-26T00:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('期限切れ (deadline <= now) のとき expired: true', () => {
    const past = new Date('2026-04-25T00:00:00.000Z').getTime()
    const result = calcTimeRemaining(past)
    expect(result.expired).toBe(true)
    expect(result.urgent).toBe(false)
    expect(result.years).toBe(0)
    expect(result.months).toBe(0)
    expect(result.days).toBe(0)
    expect(result.hours).toBe(0)
    expect(result.minutes).toBe(0)
    expect(result.seconds).toBe(0)
  })

  it('deadline === now でも expired: true', () => {
    const now = Date.now()
    expect(calcTimeRemaining(now).expired).toBe(true)
  })

  it('24 時間未満は urgent: true', () => {
    const in23h = Date.now() + 23 * 60 * 60 * 1000
    const result = calcTimeRemaining(in23h)
    expect(result.expired).toBe(false)
    expect(result.urgent).toBe(true)
  })

  it('24 時間ちょうどは urgent: false (境界)', () => {
    const in24h = Date.now() + 24 * 60 * 60 * 1000
    const result = calcTimeRemaining(in24h)
    expect(result.urgent).toBe(false)
  })

  it('1 年後の日付を年単位で返す', () => {
    const oneYearLater = new Date('2027-04-26T00:00:00.000Z').getTime()
    const result = calcTimeRemaining(oneYearLater)
    expect(result.years).toBe(1)
    expect(result.months).toBe(0)
    expect(result.days).toBe(0)
  })

  it('秒の繰り下がり計算', () => {
    vi.setSystemTime(new Date('2026-04-26T12:00:30.000Z'))
    const target = new Date('2026-04-26T12:01:10.000Z').getTime()
    const result = calcTimeRemaining(target)
    expect(result.minutes).toBe(0)
    expect(result.seconds).toBe(40)
  })

  it('日の繰り下がり計算 (前月の日数を使用)', () => {
    vi.setSystemTime(new Date('2026-03-15T00:00:00.000Z'))
    const target = new Date('2026-04-10T00:00:00.000Z').getTime()
    const result = calcTimeRemaining(target)
    expect(result.months).toBe(0)
    expect(result.days).toBe(26)
  })

  it('月の繰り下がり計算', () => {
    vi.setSystemTime(new Date('2026-03-01T00:00:00.000Z'))
    const target = new Date('2027-02-01T00:00:00.000Z').getTime()
    const result = calcTimeRemaining(target)
    expect(result.years).toBe(0)
    expect(result.months).toBe(11)
  })
})
