import { Show } from 'solid-js'
import { DatePicker } from '../date-picker'
import { formatDate } from './utils'

interface Props {
  editing: boolean
  startedAt: number
  deadline: number
  draftStarted: string
  draftDeadline: string
  onChangeStarted: (v: string) => void
  onChangeDeadline: (v: string) => void
}

export function DateRangeEditor(props: Props) {
  return (
    <div class='flex flex-col gap-1.5'>
      <Show
        when={props.editing}
        fallback={
          <div class='flex items-center justify-between'>
            <span class='font-body text-[10px] text-text-meta'>
              started: {formatDate(props.startedAt)}
            </span>
            <span class='font-body text-[10px] text-text-meta'>
              deadline: {formatDate(props.deadline)}
            </span>
          </div>
        }
      >
        <div class='flex items-center justify-between'>
          <span class='font-body text-[10px] text-accent shrink-0'>started:</span>
          <DatePicker value={props.draftStarted} onChange={props.onChangeStarted} />
        </div>
        <div class='flex items-center justify-between'>
          <span class='font-body text-[10px] text-accent shrink-0'>deadline:</span>
          <DatePicker value={props.draftDeadline} onChange={props.onChangeDeadline} />
        </div>
      </Show>
    </div>
  )
}
