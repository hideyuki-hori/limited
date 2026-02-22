import { createSignal } from 'solid-js'
import { STORAGE_KEY, MAX_ITEMS, generateId } from '@limited/config'
import type { Countdown, StoreContext } from '@limited/ui'

const [countdowns, setCountdowns] = createSignal<Countdown[]>([])
const [loaded, setLoaded] = createSignal(false)

function load(): Countdown[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
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

async function addCountdown(title: string, deadline: number): Promise<boolean> {
  if (countdowns().length >= MAX_ITEMS) return false
  const next = [...countdowns(), { id: generateId(), title, deadline }]
  setCountdowns(next)
  save(next)
  return true
}

async function removeCountdown(id: string) {
  const next = countdowns().filter(c => c.id !== id)
  setCountdowns(next)
  save(next)
}

export const storeContext: StoreContext = {
  countdowns,
  loaded,
  addCountdown,
  removeCountdown,
}
