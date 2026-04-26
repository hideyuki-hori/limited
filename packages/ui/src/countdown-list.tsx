import { createEffect, createSignal, For, onCleanup, onMount, Show } from 'solid-js'
import { useStore } from './context'
import { CountdownCard } from './countdown-card'

export function Carousel() {
  const { countdowns, loaded } = useStore()
  const [current, setCurrent] = createSignal(0)
  let prevLen = 0
  let touchStartX = 0
  let wheelCooldown = false

  createEffect(() => {
    const len = countdowns().length
    if (len > prevLen && prevLen > 0) {
      setCurrent(len - 1)
    }
    if (current() >= len && len > 0) {
      setCurrent(len - 1)
    }
    prevLen = len
  })

  function prev() {
    if (current() > 0) setCurrent(current() - 1)
  }

  function next() {
    if (current() < countdowns().length - 1) setCurrent(current() + 1)
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
  }

  function handleTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX
  }

  function handleTouchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchStartX
    if (Math.abs(dx) > 50) {
      if (dx > 0) prev()
      else next()
    }
  }

  function handleWheel(e: WheelEvent) {
    e.preventDefault()
    if (wheelCooldown || Math.abs(e.deltaY) < 4) return
    wheelCooldown = true
    if (e.deltaY > 0) next()
    else prev()
    setTimeout(() => {
      wheelCooldown = false
    }, 600)
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeyDown)
    onCleanup(() => document.removeEventListener('keydown', handleKeyDown))
  })

  function cardTransform(offset: number): string {
    if (offset === 0) return 'translateZ(60px) scale(1.08)'
    const dir = offset > 0 ? 1 : -1
    const abs = Math.abs(offset)
    const x = 55 + 35 * (abs - 1)
    const rot = Math.max(20, 75 - (abs - 1) * 12)
    return `translateX(${dir * x}%) rotateY(${dir * -rot}deg) translateZ(-80px) scale(0.68)`
  }

  function cardZIndex(offset: number): number {
    return 20 - Math.abs(offset)
  }

  function cardOpacity(offset: number): number {
    const abs = Math.abs(offset)
    if (abs === 0) return 1
    if (abs <= 2) return 0.85
    if (abs <= 4) return 0.65
    return 0.45
  }

  return (
    <Show when={loaded() && countdowns().length > 0}>
      <div
        class='relative w-full flex-1 overflow-hidden'
        style={{ perspective: '1000px' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <For each={countdowns()}>
          {(item, i) => {
            const offset = () => i() - current()
            return (
              <Show when={Math.abs(offset()) <= 6}>
                <div
                  role='button'
                  tabIndex={0}
                  aria-label={offset() !== 0 ? 'select card' : 'current card'}
                  class='absolute left-1/2 top-1/2 transition-all duration-500 ease-out'
                  style={{
                    transform: `translate(-50%, -50%) ${cardTransform(offset())}`,
                    'z-index': cardZIndex(offset()),
                    opacity: cardOpacity(offset()),
                    'pointer-events': 'auto',
                    'backface-visibility': 'hidden',
                  }}
                  onClick={() => {
                    if (offset() !== 0) setCurrent(i())
                  }}
                  onKeyDown={(e) => {
                    if (offset() !== 0 && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault()
                      setCurrent(i())
                    }
                  }}
                  classList={{
                    'cursor-pointer': offset() !== 0,
                  }}
                >
                  <div
                    classList={{
                      'pointer-events-none': offset() !== 0,
                    }}
                  >
                    <CountdownCard item={item} active={offset() === 0} />
                  </div>
                </div>
              </Show>
            )
          }}
        </For>
      </div>
    </Show>
  )
}
