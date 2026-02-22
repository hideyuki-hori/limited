import { createSignal } from 'solid-js'

export type ThemeMode = 'dark' | 'light' | 'system'

function getInitialTheme(): ThemeMode {
  const saved = localStorage.getItem('limited-theme')
  if (saved === 'dark' || saved === 'light' || saved === 'system') return saved
  return 'dark'
}

function resolveTheme(mode: ThemeMode): 'dark' | 'light' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return mode
}

const [themeMode, setThemeModeRaw] = createSignal<ThemeMode>(getInitialTheme())

function applyTheme(mode: ThemeMode) {
  const resolved = resolveTheme(mode)
  document.documentElement.classList.toggle('light', resolved === 'light')
}

export function setThemeMode(mode: ThemeMode) {
  setThemeModeRaw(mode)
  localStorage.setItem('limited-theme', mode)
  applyTheme(mode)
}

export function initTheme() {
  applyTheme(themeMode())
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (themeMode() === 'system') applyTheme('system')
  })
}

export { themeMode }
