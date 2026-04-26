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
        <div
          class='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'
          onClick={props.onCancel}
        >
          <div
            class='bg-bg-card border border-border-primary rounded-lg p-6 w-[400px] max-w-[90vw] flex flex-col gap-5'
            style={{ 'box-shadow': '0 16px 48px var(--color-shadow-card)' }}
            onClick={e => e.stopPropagation()}
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
