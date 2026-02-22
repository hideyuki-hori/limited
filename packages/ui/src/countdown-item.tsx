import { createSignal, onCleanup, onMount, For } from 'solid-js'
import { calcTimeRemaining, padNum, padYear } from './countdown'
import type { Countdown, TimeRemaining } from './types'
import { useStore } from './context'

interface Props {
  item: Countdown
}

function borderClass(tr: TimeRemaining): string {
  if (tr.expired) return 'border-accent-red/20'
  if (tr.urgent) return 'border-accent-amber/20'
  return 'border-border-primary'
}

function dotClass(tr: TimeRemaining): string {
  if (tr.expired) return 'bg-accent-red'
  if (tr.urgent) return 'bg-accent-amber'
  return 'bg-accent-green'
}

function deadlineTextClass(tr: TimeRemaining): string {
  if (tr.expired) return 'text-accent-red'
  if (tr.urgent) return 'text-accent-amber'
  return 'text-text-secondary'
}

function bigValueClass(tr: TimeRemaining): string {
  if (tr.expired) return 'text-accent-red'
  if (tr.urgent) return 'text-accent-amber'
  return 'text-accent-green'
}

function smallValueClass(tr: TimeRemaining): string {
  if (tr.expired) return 'text-accent-red'
  if (tr.urgent) return 'text-accent-amber'
  return 'text-text-primary'
}

export function CountdownItem(props: Props) {
  const { removeCountdown } = useStore()
  const [tr, setTr] = createSignal<TimeRemaining>(calcTimeRemaining(props.item.deadline))

  onMount(() => {
    const interval = setInterval(() => {
      setTr(calcTimeRemaining(props.item.deadline))
    }, 1000)
    onCleanup(() => clearInterval(interval))
  })

  const deadlineStr = () => {
    const d = new Date(props.item.deadline)
    const y = d.getFullYear()
    const m = padNum(d.getMonth() + 1)
    const day = padNum(d.getDate())
    const h = padNum(d.getHours())
    const min = padNum(d.getMinutes())
    return `deadline: ${y}-${m}-${day} ${h}:${min}`
  }

  const units = () => {
    const t = tr()
    return [
      { value: padYear(t.years), label: 'y', big: true },
      { value: padNum(t.months), label: 'm', big: true },
      { value: padNum(t.days), label: 'days', big: true },
      { value: padNum(t.hours), label: 'hrs', big: false },
      { value: padNum(t.minutes), label: 'min', big: false },
      { value: padNum(t.seconds), label: 'sec', big: false },
    ]
  }

  return (
    <div class={`flex flex-col md:flex-row md:items-center gap-3 md:gap-5 p-4 md:p-5 border ${borderClass(tr())} ${tr().expired ? 'opacity-70' : ''}`}>
      <div class={`hidden md:block w-2 h-2 rounded-full shrink-0 ${dotClass(tr())}`} />
      <div class="flex items-center justify-between md:flex-1 md:min-w-0">
        <div class="flex flex-col gap-1 flex-1 min-w-0">
          <span class="font-mono text-sm text-text-primary truncate">{props.item.title}</span>
          <span class={`font-body text-xs ${deadlineTextClass(tr())}`}>
            {deadlineStr()}{tr().expired ? '  [expired]' : ''}
          </span>
        </div>
        <button onClick={() => removeCountdown(props.item.id)} class="text-text-secondary hover:text-text-primary shrink-0 md:hidden">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      <div class="flex items-center justify-center md:justify-start gap-1 md:gap-4">
        <For each={units()}>
          {(u, i) => (
            <>
              {i() > 0 && <span class="font-mono text-sm md:text-xl font-bold text-text-tertiary pb-3.5 md:pb-0">:</span>}
              <div class={`flex flex-col items-center gap-0.5 ${i() === 0 ? 'w-[46px] md:w-[72px]' : 'w-7 md:w-11'}`}>
                <span class={`font-mono text-lg md:text-[28px] font-bold ${u.big ? bigValueClass(tr()) : smallValueClass(tr())}`}>{u.value}</span>
                <span class="font-body text-[10px] text-text-secondary">{u.label}</span>
              </div>
            </>
          )}
        </For>
      </div>
      <button onClick={() => removeCountdown(props.item.id)} class="text-text-secondary hover:text-text-primary shrink-0 hidden md:block">
        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>
  )
}
