import { createSignal } from 'solid-js'
import { MAX_ITEMS } from '@limited/config'
import { useStore } from './context'
import { DatePicker } from './date-picker'

export function AddForm() {
  const { countdowns, addCountdown } = useStore()
  const [title, setTitle] = createSignal('')
  const [deadline, setDeadline] = createSignal('')

  async function handleSubmit(e: Event) {
    e.preventDefault()
    const t = title().trim()
    const d = deadline()
    if (!t || !d) return
    const ts = new Date(d).getTime()
    if (isNaN(ts)) return
    const ok = await addCountdown(t, ts)
    if (ok) {
      setTitle('')
    }
  }

  const inputClass = 'flex items-center gap-2 min-h-10 px-3 border border-border-primary'

  return (
    <div class="flex flex-col gap-4">
      <span class="font-mono text-xs text-text-heading">// add_new_countdown</span>
      <form onSubmit={handleSubmit} class="flex flex-col md:flex-row gap-2 md:gap-3">
        <div class={`${inputClass} flex-1`}>
          <span class="font-mono text-xs text-accent-green">$</span>
          <input
            type="text"
            placeholder="title"
            value={title()}
            onInput={e => setTitle(e.currentTarget.value)}
            class="bg-transparent font-body text-sm text-text-primary placeholder:text-text-secondary outline-none w-full"
          />
        </div>
        <div class={inputClass}>
          <svg class="w-3.5 h-3.5 text-text-secondary shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          <DatePicker value={deadline()} onChange={setDeadline} />
        </div>
        <button
          type="submit"
          disabled={countdowns().length >= MAX_ITEMS}
          class="min-h-10 px-5 bg-accent-green text-btn-text font-mono text-xs font-medium flex items-center justify-center md:w-auto w-full disabled:opacity-50"
        >
          add
        </button>
      </form>
    </div>
  )
}
