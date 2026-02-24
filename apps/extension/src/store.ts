import { createSignal } from 'solid-js'
import { STORAGE_KEY, MAX_ITEMS, generateId } from '@limited/config'
import type { Countdown, StoreContext } from '@limited/ui'

const [countdowns, setCountdowns] = createSignal<Countdown[]>([])
const [loaded, setLoaded] = createSignal(false)

export async function loadCountdowns() {
  const result = await chrome.storage.local.get(STORAGE_KEY)
  const items: Countdown[] = result[STORAGE_KEY] ?? []
  setCountdowns(items.map(c => ({
    ...c,
    createdAt: c.createdAt || Date.now(),
  })))
  setLoaded(true)
}

async function save(items: Countdown[]) {
  await chrome.storage.local.set({ [STORAGE_KEY]: items })
}

async function addCountdown(title: string, deadline: number, createdAt: number): Promise<boolean> {
  if (countdowns().length >= MAX_ITEMS) return false
  const next = [...countdowns(), { id: generateId(), title, deadline, createdAt }]
  setCountdowns(next)
  await save(next)
  return true
}

async function updateCountdown(id: string, data: { title?: string; deadline?: number; createdAt?: number }) {
  const next = countdowns().map(c => c.id === id ? { ...c, ...data } : c)
  setCountdowns(next)
  await save(next)
}

async function removeCountdown(id: string) {
  const next = countdowns().filter(c => c.id !== id)
  setCountdowns(next)
  await save(next)
}

export const storeContext: StoreContext = {
  countdowns,
  loaded,
  addCountdown,
  updateCountdown,
  removeCountdown,
}
