import { type JSX, createSignal, Show } from 'solid-js'
import { type ThemeMode, themeMode, setThemeMode } from './theme'
import { useStore } from './context'
import { MAX_ITEMS } from '@limited/config'
import { DatePicker } from './date-picker'
import { padNum } from './countdown'

function SunIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
  )
}

function MonitorIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
  )
}

function MoonIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
  )
}

function PlusIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  )
}

const iconMap: Record<string, (props: JSX.SvgSVGAttributes<SVGSVGElement>) => JSX.Element> = {
  sun: SunIcon,
  monitor: MonitorIcon,
  moon: MoonIcon,
}

function formatNow() {
  const now = new Date()
  return `${now.getFullYear()}-${padNum(now.getMonth() + 1)}-${padNum(now.getDate())}T${padNum(now.getHours())}:${padNum(now.getMinutes())}`
}

export function Header() {
  const { countdowns, addCountdown } = useStore()
  const [dialogOpen, setDialogOpen] = createSignal(false)
  const [title, setTitle] = createSignal('')
  const [started, setStarted] = createSignal('')
  const [deadline, setDeadline] = createSignal('')

  const modes: { mode: ThemeMode; icon: string }[] = [
    { mode: 'light', icon: 'sun' },
    { mode: 'system', icon: 'monitor' },
    { mode: 'dark', icon: 'moon' },
  ]

  const dateValid = () => {
    const s = started()
    const d = deadline()
    if (!s || !d) return false
    return new Date(s).getTime() < new Date(d).getTime()
  }

  function openDialog() {
    setTitle('')
    setStarted(formatNow())
    setDeadline('')
    setDialogOpen(true)
  }

  async function handleSubmit(e: Event) {
    e.preventDefault()
    const t = title().trim()
    const s = started()
    const d = deadline()
    if (!t || !s || !d) return
    const sTs = new Date(s).getTime()
    const dTs = new Date(d).getTime()
    if (isNaN(sTs) || isNaN(dTs) || sTs >= dTs) return
    const ok = await addCountdown(t, dTs, sTs)
    if (ok) {
      setDialogOpen(false)
    }
  }

  return (
    <>
      <header class="flex items-center justify-between h-14 px-4 md:px-10 border-b border-border-primary">
        <span
          class="font-title text-xl font-bold"
          style={{
            background: 'linear-gradient(to right, var(--color-text-heading), var(--color-text-heading-dim))',
            '-webkit-background-clip': 'text',
            '-webkit-text-fill-color': 'transparent',
            'background-clip': 'text',
          }}
        >
          limited
        </span>
        <div class="flex items-center gap-5">
          <div class="flex border border-border-primary rounded">
            {modes.map(({ mode, icon }) => {
              const Icon = iconMap[icon]
              return (
                <button
                  onClick={() => setThemeMode(mode)}
                  class="flex items-center justify-center w-8 h-7 transition-colors rounded-sm cursor-pointer"
                  classList={{
                    'bg-accent': themeMode() === mode,
                  }}
                >
                  <Icon
                    class="w-3.5 h-3.5"
                    classList={{
                      'text-btn-text': themeMode() === mode,
                      'text-text-tertiary': themeMode() !== mode,
                    }}
                  />
                </button>
              )
            })}
          </div>
          <button
            onClick={openDialog}
            disabled={countdowns().length >= MAX_ITEMS}
            class="flex items-center gap-1.5 px-3.5 py-1.5 border border-accent rounded text-accent font-body text-xs font-medium transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-default"
          >
            <PlusIcon class="w-3.5 h-3.5" />
            add
          </button>
        </div>
      </header>

      <Show when={dialogOpen()}>
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setDialogOpen(false)}>
          <div class="bg-bg-card border border-border-primary rounded-lg p-6 w-[400px] max-w-[90vw] flex flex-col gap-5" style={{ 'box-shadow': '0 16px 48px var(--color-shadow-card)' }} onClick={e => e.stopPropagation()}>
            <span class="font-title text-sm font-bold text-text-heading">add countdown</span>
            <form onSubmit={handleSubmit} class="flex flex-col gap-4">
              <input
                type="text"
                placeholder="title"
                maxLength={40}
                value={title()}
                onInput={e => setTitle(e.currentTarget.value)}
                class="bg-transparent font-title text-sm text-text-heading placeholder:text-text-tertiary outline-none border-b border-border-primary pb-2 focus:border-accent transition-colors"
                autofocus
              />
              <div class="flex items-center justify-between border-b border-border-primary pb-2">
                <span class="font-body text-xs text-text-secondary shrink-0">started</span>
                <DatePicker value={started()} onChange={setStarted} />
              </div>
              <div class="flex items-center justify-between border-b border-border-primary pb-2">
                <span class="font-body text-xs text-text-secondary shrink-0">deadline</span>
                <DatePicker value={deadline()} onChange={setDeadline} />
              </div>
              <Show when={started() && deadline() && !dateValid()}>
                <span class="font-body text-[10px] text-accent">started must be before deadline</span>
              </Show>
              <div class="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  class="font-body text-xs text-text-secondary px-3 py-1.5"
                >
                  cancel
                </button>
                <button
                  type="submit"
                  disabled={!title().trim() || !dateValid()}
                  class="font-body text-xs font-medium text-btn-text bg-accent px-4 py-1.5 rounded disabled:opacity-40"
                >
                  add
                </button>
              </div>
            </form>
          </div>
        </div>
      </Show>
    </>
  )
}
