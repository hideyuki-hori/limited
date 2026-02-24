import { createContext, useContext } from 'solid-js'
import type { Accessor } from 'solid-js'
import type { Countdown } from './types'

export interface StoreContext {
  countdowns: Accessor<Countdown[]>
  loaded: Accessor<boolean>
  addCountdown: (title: string, deadline: number, createdAt: number) => Promise<boolean>
  updateCountdown: (id: string, data: { title?: string; deadline?: number; createdAt?: number }) => Promise<void>
  removeCountdown: (id: string) => Promise<void>
}

export interface AppConfig {
  showExtensionLink: boolean
}

const StoreCtx = createContext<StoreContext>()
const ConfigCtx = createContext<AppConfig>({ showExtensionLink: false })

export function useStore(): StoreContext {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('StoreProvider not found')
  return ctx
}

export function useConfig(): AppConfig {
  return useContext(ConfigCtx)!
}

export { StoreCtx, ConfigCtx }
