import { generateId, MAX_ITEMS, STORAGE_KEY } from '@limited/config'
import type { Countdown, StoreContext } from '@limited/ui'
import { createSignal } from 'solid-js'

const [countdowns, setCountdowns] = createSignal<Countdown[]>([])
const [loaded, setLoaded] = createSignal(false)

function load(): Countdown[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const items: Countdown[] = JSON.parse(raw)
    return items.map((c) => ({
      ...c,
      startedAt: c.startedAt || Date.now(),
    }))
  } catch {
    return []
  }
}

function save(items: Countdown[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function loadCountdowns() {
  setCountdowns(load())
  setLoaded(true)
}

async function addCountdown(title: string, deadline: number, startedAt: number): Promise<boolean> {
  if (countdowns().length >= MAX_ITEMS) return false
  const next = [...countdowns(), { id: generateId(), title, deadline, startedAt }]
  setCountdowns(next)
  save(next)
  return true
}

async function updateCountdown(
  id: string,
  data: { title?: string; deadline?: number; startedAt?: number },
) {
  const next = countdowns().map((c) => (c.id === id ? { ...c, ...data } : c))
  setCountdowns(next)
  save(next)
}

async function removeCountdown(id: string) {
  const next = countdowns().filter((c) => c.id !== id)
  setCountdowns(next)
  save(next)
}

export const storeContext: StoreContext = {
  countdowns,
  loaded,
  addCountdown,
  updateCountdown,
  removeCountdown,
}
