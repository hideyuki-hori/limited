import { createSignal, onCleanup, onMount, For, Show } from 'solid-js'
import { calcTimeRemaining, padNum, padYear } from './countdown'
import type { Countdown, TimeRemaining } from './types'
import { useStore } from './context'
import { DatePicker } from './date-picker'

interface Props {
  item: Countdown
  active?: boolean
}

function XIcon() {
  return (
    <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  )
}

function TimerIcon() {
  return (
    <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>
  )
}

function PenIcon() {
  return (
    <svg class="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
  )
}

function CheckIcon() {
  return (
    <svg class="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
  )
}

function elapsedDays(startedAt: number): string {
  const days = Math.floor((Date.now() - startedAt) / (1000 * 60 * 60 * 24))
  return `${days}d elapsed`
}

function consumed(startedAt: number, deadline: number): number {
  const total = deadline - startedAt
  if (total <= 0) return 100
  const passed = Date.now() - startedAt
  return Math.min(100, Math.max(0, Math.round((passed / total) * 100)))
}

function formatDate(ts: number) {
  const d = new Date(ts)
  return `${d.getFullYear()}-${padNum(d.getMonth() + 1)}-${padNum(d.getDate())} ${padNum(d.getHours())}:${padNum(d.getMinutes())}`
}

function formatDateISO(ts: number) {
  const d = new Date(ts)
  return `${d.getFullYear()}-${padNum(d.getMonth() + 1)}-${padNum(d.getDate())}T${padNum(d.getHours())}:${padNum(d.getMinutes())}`
}

const GRADIENT_ACCENT = {
  background: 'linear-gradient(to right, var(--color-accent-bright), var(--color-accent-dim))',
  '-webkit-background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
  'background-clip': 'text',
}

const GRADIENT_HEADING = {
  background: 'linear-gradient(to right, var(--color-text-heading), var(--color-text-heading-dim))',
  '-webkit-background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
  'background-clip': 'text',
}

export function CountdownCard(props: Props) {
  const { updateCountdown, removeCountdown } = useStore()
  const [tr, setTr] = createSignal<TimeRemaining>(calcTimeRemaining(props.item.deadline))
  const [editingTitle, setEditingTitle] = createSignal(false)
  const [editTitle, setEditTitle] = createSignal(props.item.title)
  const [editing, setEditing] = createSignal(false)
  const [draftStarted, setDraftStarted] = createSignal('')
  const [draftDeadline, setDraftDeadline] = createSignal('')

  onMount(() => {
    const interval = setInterval(() => {
      setTr(calcTimeRemaining(props.item.deadline))
    }, 1000)
    onCleanup(() => clearInterval(interval))
  })

  async function saveTitle() {
    const t = editTitle().trim()
    if (!t) {
      setEditTitle(props.item.title)
      setEditingTitle(false)
      return
    }
    if (t !== props.item.title) {
      await updateCountdown(props.item.id, { title: t })
    }
    setEditingTitle(false)
  }

  function startEditing(e: MouseEvent) {
    e.stopPropagation()
    setDraftStarted(formatDateISO(props.item.startedAt))
    setDraftDeadline(formatDateISO(props.item.deadline))
    setEditing(true)
  }

  function confirmEditing(e: MouseEvent) {
    e.stopPropagation()
    const sTs = new Date(draftStarted()).getTime()
    const dTs = new Date(draftDeadline()).getTime()
    if (!isNaN(sTs) && !isNaN(dTs) && sTs < dTs) {
      updateCountdown(props.item.id, { startedAt: sTs, deadline: dTs })
    }
    setEditing(false)
  }

  function cancelEditing() {
    setEditing(false)
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

  const pct = () => consumed(props.item.startedAt, props.item.deadline)

  return (
    <div
      class="flex flex-col rounded-xl border transition-all w-[400px] bg-bg-card border-border-primary"
      style={{ padding: '24px 0 12px 0', 'box-shadow': '0 8px 32px var(--color-shadow-card)' }}
      onClick={cancelEditing}
    >
      <div class="flex flex-col gap-[18px] px-6">
        <Show
          when={editingTitle()}
          fallback={
            <span
              class="font-title text-sm font-bold text-center truncate cursor-text"
              style={GRADIENT_HEADING}
              onClick={() => { setEditTitle(props.item.title); setEditingTitle(true) }}
            >
              {props.item.title}
            </span>
          }
        >
          <input
            type="text"
            maxLength={40}
            value={editTitle()}
            onInput={e => setEditTitle(e.currentTarget.value)}
            onBlur={saveTitle}
            onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur() }}
            class="bg-transparent font-title text-sm font-bold text-center text-text-heading outline-none border-b-2 border-accent/30 pb-1"
            autofocus
          />
        </Show>

        <div class="flex items-center justify-center gap-1.5">
          <For each={units()}>
            {(u, i) => (
              <>
                {i() > 0 && <span class="font-mono text-xl font-bold text-separator pb-3.5">:</span>}
                <div class="flex flex-col items-center gap-0.5">
                  <span
                    class="font-mono text-[28px] font-bold"
                    style={u.big ? GRADIENT_ACCENT : GRADIENT_HEADING}
                  >
                    {u.value}
                  </span>
                  <span class="font-body text-[10px] text-text-secondary">{u.label}</span>
                </div>
              </>
            )}
          </For>
        </div>

        <div class="flex flex-col gap-1.5">
          <div class="flex items-center justify-between">
            <span class="font-body text-[10px] text-text-secondary">consumed</span>
            <span class="font-mono text-xs font-bold" style={GRADIENT_ACCENT}>
              {pct()}%
            </span>
          </div>
          <div class="w-full h-1 rounded-sm bg-progress-bg overflow-hidden">
            <div
              class="h-full rounded-sm"
              style={{
                width: `${pct()}%`,
                background: 'linear-gradient(to right, var(--color-progress-start), var(--color-progress-end))',
              }}
            />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <Show
            when={editing()}
            fallback={
              <div class="flex items-center justify-between">
                <span class="font-body text-[10px] text-text-meta">
                  started: {formatDate(props.item.startedAt)}
                </span>
                <span class="font-body text-[10px] text-text-meta">
                  deadline: {formatDate(props.item.deadline)}
                </span>
              </div>
            }
          >
            <div class="flex items-center justify-between" onClick={e => e.stopPropagation()}>
              <span class="font-body text-[10px] text-accent shrink-0">started:</span>
              <DatePicker
                value={draftStarted()}
                onChange={setDraftStarted}
              />
            </div>
            <div class="flex items-center justify-between" onClick={e => e.stopPropagation()}>
              <span class="font-body text-[10px] text-accent shrink-0">deadline:</span>
              <DatePicker
                value={draftDeadline()}
                onChange={setDraftDeadline}
              />
            </div>
          </Show>
        </div>
      </div>

      <div class="flex items-center justify-between px-6 pt-3 mt-[18px] border-t border-separator">
        <div class="flex items-center gap-1.5 text-text-secondary">
          <TimerIcon />
          <span class="font-body text-[10px]">{elapsedDays(props.item.startedAt)}</span>
        </div>
        <div class="flex items-center gap-2.5">
          <Show
            when={editing()}
            fallback={
              <button
                onClick={startEditing}
                class="text-text-secondary hover:text-text-heading transition-colors cursor-pointer"
              >
                <PenIcon />
              </button>
            }
          >
            <button
              onClick={confirmEditing}
              class="text-accent hover:text-text-heading transition-colors cursor-pointer"
            >
              <CheckIcon />
            </button>
          </Show>
          <button
            onClick={() => removeCountdown(props.item.id)}
            class="text-text-secondary hover:text-text-heading transition-colors cursor-pointer"
          >
            <XIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
