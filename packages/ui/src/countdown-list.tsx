import { For, Show } from 'solid-js'
import { useStore } from './context'
import { CountdownItem } from './countdown-item'

export function CountdownList() {
  const { countdowns, loaded } = useStore()

  return (
    <div class="flex flex-col gap-4">
      <span class="font-mono text-xs text-text-heading">// active_countdowns</span>
      <Show when={loaded()}>
        <For each={countdowns()}>
          {item => <CountdownItem item={item} />}
        </For>
      </Show>
    </div>
  )
}
