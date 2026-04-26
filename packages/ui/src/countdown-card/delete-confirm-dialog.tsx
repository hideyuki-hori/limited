import { Show } from 'solid-js'
import { Portal } from 'solid-js/web'

interface Props {
  open: boolean
  title: string
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteConfirmDialog(props: Props) {
  return (
    <Show when={props.open}>
      <Portal>
        <button
          type='button'
          aria-label='close dialog'
          class='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm cursor-default border-0 p-0'
          onClick={props.onCancel}
        />
        <div
          role='dialog'
          aria-modal='true'
          class='fixed inset-0 z-50 flex items-center justify-center pointer-events-none'
        >
          <div
            class='bg-bg-card border border-border-primary rounded-lg p-6 w-[400px] max-w-[90vw] flex flex-col gap-5 pointer-events-auto'
            style={{ 'box-shadow': '0 16px 48px var(--color-shadow-card)' }}
          >
            <span class='font-body text-xs text-text-secondary text-center'>
              「<span class='text-text-heading'>{props.title}</span>」を削除しますか？
            </span>
            <div class='flex justify-end gap-3 pt-2'>
              <button
                type='button'
                onClick={props.onCancel}
                class='font-body text-xs text-text-secondary px-3 py-1.5 cursor-pointer'
              >
                キャンセル
              </button>
              <button
                type='button'
                onClick={props.onConfirm}
                class='font-body text-xs font-medium text-btn-text bg-accent px-4 py-1.5 rounded cursor-pointer'
              >
                削除
              </button>
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  )
}
