import { createContext, useContext } from 'solid-js'
import type { Accessor } from 'solid-js'
import type { Countdown } from './types'

export interface StoreContext {
  countdowns: Accessor<Countdown[]>
  loaded: Accessor<boolean>
  addCountdown: (title: string, deadline: number, startedAt: number) => Promise<boolean>
  updateCountdown: (id: string, data: { title?: string; deadline?: number; startedAt?: number }) => Promise<void>
  removeCountdown: (id: string) => Promise<void>
}

const StoreCtx = createContext<StoreContext>()

export function useStore(): StoreContext {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('StoreProvider not found')
  return ctx
}

export { StoreCtx }
