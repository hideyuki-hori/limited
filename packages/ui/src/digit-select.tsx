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
    <div ref={containerRef} class="relative inline-flex">
      <button
        type="button"
        onClick={() => !singleOption() && setOpen(!open())}
        onKeyDown={handleKeyDown}
        class="font-mono text-sm w-[18px] h-7 flex items-center justify-center transition-all rounded-sm"
        classList={{
          'text-text-primary': !open(),
          'text-accent-green bg-accent-green/10': open(),
          'hover:text-accent-green hover:bg-accent-green/5 cursor-pointer': !singleOption(),
          'text-text-tertiary cursor-default': singleOption(),
        }}
      >
        {props.value}
      </button>
      <Show when={open()}>
        <div class="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50 flex flex-col border border-border-primary bg-bg-page/95 backdrop-blur-sm rounded-sm shadow-lg shadow-black/30 overflow-hidden">
          <For each={props.options}>
            {opt => (
              <button
                type="button"
                onClick={() => handleSelect(opt)}
                class="font-mono text-sm w-7 h-7 flex items-center justify-center transition-colors"
                classList={{
                  'text-accent-green bg-accent-green/15': opt === props.value,
                  'text-text-secondary hover:text-text-primary hover:bg-accent-green/5': opt !== props.value,
                }}
              >
                {opt}
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}
