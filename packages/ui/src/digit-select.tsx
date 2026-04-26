import { createSignal, For, onCleanup, onMount, Show } from 'solid-js'

interface Props {
  value: number
  options: number[]
  onChange: (v: number) => void
}

export function DigitSelect(props: Props) {
  let containerRef: HTMLDivElement | undefined
  const [open, setOpen] = createSignal(false)

  function handleSelect(v: number) {
    props.onChange(v)
    setOpen(false)
  }

  function handleClickOutside(e: MouseEvent) {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      setOpen(false)
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') setOpen(false)
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = props.options.indexOf(props.value)
      if (idx > 0) props.onChange(props.options[idx - 1])
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = props.options.indexOf(props.value)
      if (idx < props.options.length - 1) props.onChange(props.options[idx + 1])
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen(!open())
    }
  }

  onMount(() => {
    document.addEventListener('mousedown', handleClickOutside)
    onCleanup(() => document.removeEventListener('mousedown', handleClickOutside))
  })

  const singleOption = () => props.options.length <= 1

  return (
    <div ref={containerRef} class='relative inline-flex'>
      <button
        type='button'
        onClick={() => !singleOption() && setOpen(!open())}
        onKeyDown={handleKeyDown}
        class='font-mono text-sm w-4 h-7 flex items-center justify-center transition-all rounded-sm'
        classList={{
          'text-text-primary': !open(),
          'text-accent bg-accent/10': open(),
          'hover:text-accent hover:bg-accent/5 cursor-pointer': !singleOption(),
          'text-text-tertiary cursor-default': singleOption(),
        }}
      >
        {props.value}
      </button>
      <Show when={open()}>
        <div class='absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50'>
          <div class='absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-bg-page border-l border-t border-border-primary' />
          <div class='relative flex border border-border-primary bg-bg-page/95 backdrop-blur-sm rounded-md shadow-lg shadow-shadow-card p-1 gap-0.5'>
            <For each={props.options}>
              {(opt) => (
                <button
                  type='button'
                  onClick={() => handleSelect(opt)}
                  class='font-mono text-base w-8 h-9 shrink-0 flex items-center justify-center transition-colors rounded-sm'
                  classList={{
                    'text-accent bg-accent/15': opt === props.value,
                    'text-text-secondary hover:text-text-primary hover:bg-accent/5':
                      opt !== props.value,
                  }}
                >
                  {opt}
                </button>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  )
}
