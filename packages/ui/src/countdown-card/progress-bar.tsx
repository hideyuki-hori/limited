import { GRADIENT_ACCENT } from './utils'

interface Props {
  pct: number
}

export function ProgressBar(props: Props) {
  return (
    <div class='flex flex-col gap-1.5'>
      <div class='flex items-center justify-between'>
        <span class='font-body text-[10px] text-text-secondary'>consumed</span>
        <span class='font-mono text-xs font-bold' style={GRADIENT_ACCENT}>
          {props.pct}%
        </span>
      </div>
      <div class='w-full h-1 rounded-sm bg-progress-bg overflow-hidden'>
        <div
          class='h-full rounded-sm'
          style={{
            width: `${props.pct}%`,
            background:
              'linear-gradient(to right, var(--color-progress-start), var(--color-progress-end))',
          }}
        />
      </div>
    </div>
  )
}
