import { createSignal, Show } from 'solid-js'
import { GRADIENT_HEADING } from './utils'

interface Props {
  title: string
  onSave: (next: string) => Promise<void> | void
}

export function EditableTitle(props: Props) {
  const [editing, setEditing] = createSignal(false)
  const [draft, setDraft] = createSignal(props.title)

  function startEdit() {
    setDraft(props.title)
    setEditing(true)
  }

  async function commit() {
    const next = draft().trim()
    if (!next) {
      setDraft(props.title)
      setEditing(false)
      return
    }
    if (next !== props.title) {
      await props.onSave(next)
    }
    setEditing(false)
  }

  return (
    <Show
      when={editing()}
      fallback={
        <button
          type='button'
          class='font-title text-sm font-bold text-center truncate cursor-text bg-transparent border-0 p-0'
          style={GRADIENT_HEADING}
          onClick={startEdit}
        >
          {props.title}
        </button>
      }
    >
      <input
        type='text'
        maxLength={40}
        value={draft()}
        onInput={(e) => setDraft(e.currentTarget.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur()
        }}
        class='bg-transparent font-title text-sm font-bold text-center text-text-heading outline-none border-b-2 border-accent/30 pb-1'
        autofocus
      />
    </Show>
  )
}
