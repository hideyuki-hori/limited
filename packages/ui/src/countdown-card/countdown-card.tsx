import { Show, createSignal, onCleanup, onMount } from 'solid-js'
import { calcTimeRemaining } from '../countdown'
import type { Countdown, TimeRemaining } from '../types'
import { useStore } from '../context'
import { CheckIcon, PenIcon, TimerIcon, XIcon } from '../icons'
import { EditableTitle } from './editable-title'
import { TimeDisplay } from './time-display'
import { ProgressBar } from './progress-bar'
import { DateRangeEditor } from './date-range-editor'
import { DeleteConfirmDialog } from './delete-confirm-dialog'
import { consumed, elapsedDays, formatDateISO } from './utils'

interface Props {
  item: Countdown
  active?: boolean
}

export function CountdownCard(props: Props) {
  const { updateCountdown, removeCountdown } = useStore()
  const [tr, setTr] = createSignal<TimeRemaining>(calcTimeRemaining(props.item.deadline))
  const [editing, setEditing] = createSignal(false)
  const [draftStarted, setDraftStarted] = createSignal('')
  const [draftDeadline, setDraftDeadline] = createSignal('')
  const [confirmDelete, setConfirmDelete] = createSignal(false)

  onMount(() => {
    const interval = setInterval(() => {
      setTr(calcTimeRemaining(props.item.deadline))
    }, 1000)
    onCleanup(() => clearInterval(interval))
  })

  function saveTitle(next: string) {
    return updateCountdown(props.item.id, { title: next })
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

  function askDelete(e: MouseEvent) {
    e.stopPropagation()
    setConfirmDelete(true)
  }

  function cancelDelete() {
    setConfirmDelete(false)
  }

  function confirmDeleteNow() {
    removeCountdown(props.item.id)
    setConfirmDelete(false)
  }

  const pct = () => consumed(props.item.startedAt, props.item.deadline)

  return (
    <div
      class='flex flex-col rounded-xl border transition-all w-[400px] bg-bg-card border-border-primary'
      style={{ padding: '24px 0 12px 0', 'box-shadow': '0 8px 32px var(--color-shadow-card)' }}
      onClick={cancelEditing}
    >
      <div class='flex flex-col gap-[18px] px-6'>
        <EditableTitle title={props.item.title} onSave={saveTitle} />
        <TimeDisplay tr={tr()} />
        <ProgressBar pct={pct()} />
        <DateRangeEditor
          editing={editing()}
          startedAt={props.item.startedAt}
          deadline={props.item.deadline}
          draftStarted={draftStarted()}
          draftDeadline={draftDeadline()}
          onChangeStarted={setDraftStarted}
          onChangeDeadline={setDraftDeadline}
        />
      </div>

      <div class='flex items-center justify-between px-6 pt-3 mt-[18px] border-t border-separator'>
        <div class='flex items-center gap-1.5 text-text-secondary'>
          <TimerIcon />
          <span class='font-body text-[10px]'>{elapsedDays(props.item.startedAt)}</span>
        </div>
        <div class='flex items-center gap-2.5'>
          <Show
            when={editing()}
            fallback={
              <button
                onClick={startEditing}
                class='text-text-secondary hover:text-text-heading transition-colors cursor-pointer'
              >
                <PenIcon />
              </button>
            }
          >
            <button
              onClick={confirmEditing}
              class='text-accent hover:text-text-heading transition-colors cursor-pointer'
            >
              <CheckIcon />
            </button>
          </Show>
          <button
            onClick={askDelete}
            class='text-text-secondary hover:text-text-heading transition-colors cursor-pointer'
          >
            <XIcon />
          </button>
        </div>
      </div>

      <DeleteConfirmDialog
        open={confirmDelete()}
        title={props.item.title}
        onCancel={cancelDelete}
        onConfirm={confirmDeleteNow}
      />
    </div>
  )
}
