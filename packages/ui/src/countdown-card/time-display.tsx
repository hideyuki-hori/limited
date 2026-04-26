import { For } from 'solid-js'
import { padNum, padYear } from '../countdown'
import type { TimeRemaining } from '../types'
import { GRADIENT_ACCENT, GRADIENT_HEADING } from './utils'

interface Props {
  tr: TimeRemaining
}

export function TimeDisplay(props: Props) {
  const units = () => [
    { value: padYear(props.tr.years), label: 'y', big: true },
    { value: padNum(props.tr.months), label: 'm', big: true },
    { value: padNum(props.tr.days), label: 'days', big: true },
    { value: padNum(props.tr.hours), label: 'hrs', big: false },
    { value: padNum(props.tr.minutes), label: 'min', big: false },
    { value: padNum(props.tr.seconds), label: 'sec', big: false },
  ]

  return (
    <div class='flex items-center justify-center gap-1.5'>
      <For each={units()}>
        {(u, i) => (
          <>
            {i() > 0 && <span class='font-mono text-xl font-bold text-separator pb-3.5'>:</span>}
            <div class='flex flex-col items-center gap-0.5'>
              <span
                class='font-mono text-[28px] font-bold'
                style={u.big ? GRADIENT_ACCENT : GRADIENT_HEADING}
              >
                {u.value}
              </span>
              <span class='font-body text-[10px] text-text-secondary'>{u.label}</span>
            </div>
          </>
        )}
      </For>
    </div>
  )
}
