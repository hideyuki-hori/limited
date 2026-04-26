import { createSignal, onCleanup, onMount, Show } from 'solid-js'
import { useStore } from '../context'
import { calcTimeRemaining } from '../countdown'
import { CheckIcon, PenIcon, TimerIcon, XIcon } from '../icons'
import type { Countdown, TimeRemaining } from '../types'
import { DateRangeEditor } from './date-range-editor'
import { DeleteConfirmDialog } from './delete-confirm-dialog'
import { EditableTitle } from './editable-title'
import { ProgressBar } from './progress-bar'
import { TimeDisplay } from './time-display'
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
  let cardRef: HTMLDivElement | undefined

  onMount(() => {
    const interval = setInterval(() => {
      setTr(calcTimeRemaining(props.item.deadline))
    }, 1000)
    onCleanup(() => clearInterval(interval))
  })

  onMount(() => {
    function handleDocPointerDown(e: PointerEvent) {
      if (!editing()) return
      const target = e.target as Node | null
      if (target && cardRef && !cardRef.contains(target)) {
        setEditing(false)
      }
    }
    function handleDocKeyDown(e: KeyboardEvent) {
      if (editing() && e.key === 'Escape') {
        setEditing(false)
      }
    }
    document.addEventListener('pointerdown', handleDocPointerDown)
    document.addEventListener('keydown', handleDocKeyDown)
    onCleanup(() => {
      document.removeEventListener('pointerdown', handleDocPointerDown)
      document.removeEventListener('keydown', handleDocKeyDown)
    })
  })

  function saveTitle(next: string) {
    return updateCountdown(props.item.id, { title: next })
  }

  function startEditing() {
    setDraftStarted(formatDateISO(props.item.startedAt))
    setDraftDeadline(formatDateISO(props.item.deadline))
    setEditing(true)
  }

  function confirmEditing() {
    const sTs = new Date(draftStarted()).getTime()
    const dTs = new Date(draftDeadline()).getTime()
    if (!Number.isNaN(sTs) && !Number.isNaN(dTs) && sTs < dTs) {
      updateCountdown(props.item.id, { startedAt: sTs, deadline: dTs })
    }
    setEditing(false)
  }

  function askDelete() {
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
      ref={cardRef}
      class='flex flex-col rounded-xl border transition-all w-[400px] bg-bg-card border-border-primary'
      style={{ padding: '24px 0 12px 0', 'box-shadow': '0 8px 32px var(--color-shadow-card)' }}
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
                type='button'
                onClick={startEditing}
                class='text-text-secondary hover:text-text-heading transition-colors cursor-pointer'
              >
                <PenIcon />
              </button>
            }
          >
            <button
              type='button'
              onClick={confirmEditing}
              class='text-accent hover:text-text-heading transition-colors cursor-pointer'
            >
              <CheckIcon />
            </button>
          </Show>
          <button
            type='button'
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
