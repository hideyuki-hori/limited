import { MAX_ITEMS, STORAGE_KEY } from '@limited/config'
import type { Countdown } from '@limited/ui'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadCountdowns, storeContext } from './store'

const FIXED_NOW = new Date('2026-04-26T00:00:00.000Z').getTime()

function makeCountdown(overrides: Partial<Countdown> = {}): Countdown {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    title: overrides.title ?? 'sample',
    deadline: overrides.deadline ?? FIXED_NOW + 86_400_000,
    startedAt: overrides.startedAt ?? FIXED_NOW,
  }
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(FIXED_NOW)
  localStorage.clear()
  loadCountdowns()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('loadCountdowns', () => {
  it('localStorage 空のときは空配列', () => {
    loadCountdowns()
    expect(storeContext.countdowns()).toEqual([])
    expect(storeContext.loaded()).toBe(true)
  })

  it('保存済みデータを読み込む', () => {
    const items = [makeCountdown({ title: 'a' }), makeCountdown({ title: 'b' })]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    loadCountdowns()
    expect(storeContext.countdowns()).toHaveLength(2)
    expect(storeContext.countdowns()[0].title).toBe('a')
  })

  it('壊れた JSON は空配列にフォールバック', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json')
    loadCountdowns()
    expect(storeContext.countdowns()).toEqual([])
  })

  it('startedAt 欠損は Date.now() で補完', () => {
    const items = [{ id: 'x', title: 't', deadline: FIXED_NOW + 1000, startedAt: 0 }]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    loadCountdowns()
    expect(storeContext.countdowns()[0].startedAt).toBe(FIXED_NOW)
  })
})

describe('addCountdown', () => {
  it('新規追加して true を返す', async () => {
    const ok = await storeContext.addCountdown('todo', FIXED_NOW + 1000, FIXED_NOW)
    expect(ok).toBe(true)
    expect(storeContext.countdowns()).toHaveLength(1)
    expect(storeContext.countdowns()[0].title).toBe('todo')
  })

  it('localStorage に永続化する', async () => {
    await storeContext.addCountdown('todo', FIXED_NOW + 1000, FIXED_NOW)
    const raw = localStorage.getItem(STORAGE_KEY)
    expect(raw).not.toBeNull()
    const stored = JSON.parse(raw ?? '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].title).toBe('todo')
  })

  it('MAX_ITEMS に到達したら false を返し、追加しない', async () => {
    for (let i = 0; i < MAX_ITEMS; i++) {
      await storeContext.addCountdown(`t${i}`, FIXED_NOW + 1000, FIXED_NOW)
    }
    expect(storeContext.countdowns()).toHaveLength(MAX_ITEMS)
    const ok = await storeContext.addCountdown('overflow', FIXED_NOW + 1000, FIXED_NOW)
    expect(ok).toBe(false)
    expect(storeContext.countdowns()).toHaveLength(MAX_ITEMS)
  })
})

describe('updateCountdown', () => {
  it('該当 id のフィールドを更新する', async () => {
    await storeContext.addCountdown('a', FIXED_NOW + 1000, FIXED_NOW)
    const id = storeContext.countdowns()[0].id
    await storeContext.updateCountdown(id, { title: 'renamed' })
    expect(storeContext.countdowns()[0].title).toBe('renamed')
  })

  it('部分更新で他フィールドは保持', async () => {
    await storeContext.addCountdown('a', FIXED_NOW + 1000, FIXED_NOW)
    const id = storeContext.countdowns()[0].id
    await storeContext.updateCountdown(id, { deadline: FIXED_NOW + 5000 })
    expect(storeContext.countdowns()[0].title).toBe('a')
    expect(storeContext.countdowns()[0].deadline).toBe(FIXED_NOW + 5000)
  })

  it('存在しない id は何もしない', async () => {
    await storeContext.addCountdown('a', FIXED_NOW + 1000, FIXED_NOW)
    const before = storeContext.countdowns()[0]
    await storeContext.updateCountdown('non-existent', { title: 'x' })
    expect(storeContext.countdowns()[0]).toEqual(before)
  })

  it('localStorage にも反映', async () => {
    await storeContext.addCountdown('a', FIXED_NOW + 1000, FIXED_NOW)
    const id = storeContext.countdowns()[0].id
    await storeContext.updateCountdown(id, { title: 'renamed' })
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(stored[0].title).toBe('renamed')
  })
})

describe('removeCountdown', () => {
  it('該当 id を削除', async () => {
    await storeContext.addCountdown('a', FIXED_NOW + 1000, FIXED_NOW)
    await storeContext.addCountdown('b', FIXED_NOW + 1000, FIXED_NOW)
    const id = storeContext.countdowns()[0].id
    await storeContext.removeCountdown(id)
    expect(storeContext.countdowns()).toHaveLength(1)
    expect(storeContext.countdowns()[0].title).toBe('b')
  })

  it('localStorage にも反映', async () => {
    await storeContext.addCountdown('a', FIXED_NOW + 1000, FIXED_NOW)
    const id = storeContext.countdowns()[0].id
    await storeContext.removeCountdown(id)
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(stored).toEqual([])
  })
})
