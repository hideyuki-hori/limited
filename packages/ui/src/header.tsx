import { type JSX, Show } from 'solid-js'
import { type ThemeMode, themeMode, setThemeMode } from './theme'
import { useConfig } from './context'

function SunIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
  )
}

function MonitorIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
  )
}

function MoonIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
  )
}

function PuzzleIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.315 8.685a.98.98 0 0 1 .837-.276c.47.07.802.48.968.925a2.501 2.501 0 1 0 3.214-3.214c-.446-.166-.855-.497-.925-.968a.979.979 0 0 1 .276-.837l1.61-1.61a2.404 2.404 0 0 1 1.705-.707c.618 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z"/></svg>
  )
}

const iconMap: Record<string, (props: JSX.SvgSVGAttributes<SVGSVGElement>) => JSX.Element> = {
  sun: SunIcon,
  monitor: MonitorIcon,
  moon: MoonIcon,
}

export function Header() {
  const config = useConfig()
  const modes: { mode: ThemeMode; icon: string }[] = [
    { mode: 'light', icon: 'sun' },
    { mode: 'system', icon: 'monitor' },
    { mode: 'dark', icon: 'moon' },
  ]

  return (
    <header class="flex items-center justify-between h-14 px-4 md:px-20 border-b border-border-primary">
      <div class="flex items-center gap-2">
        <span class="font-mono text-xl font-bold text-accent-green">&gt;</span>
        <span class="font-mono text-lg font-medium text-text-primary">limited</span>
      </div>
      <div class="flex items-center gap-6">
        <div class="flex border border-border-primary">
          {modes.map(({ mode, icon }) => {
            const Icon = iconMap[icon]
            return (
              <button
                onClick={() => setThemeMode(mode)}
                class="flex items-center justify-center w-8 h-7 transition-colors"
                classList={{
                  'bg-accent-green': themeMode() === mode,
                }}
              >
                <Icon
                  class="w-3.5 h-3.5"
                  classList={{
                    'text-btn-text': themeMode() === mode,
                    'text-text-tertiary': themeMode() !== mode,
                  }}
                />
              </button>
            )
          })}
        </div>
        <Show when={config.showExtensionLink}>
          <a
            href="https://chromewebstore.google.com"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2"
          >
            <PuzzleIcon class="w-4 h-4 text-text-secondary" />
            <span class="font-body text-xs text-text-secondary">chrome extension</span>
          </a>
        </Show>
      </div>
    </header>
  )
}
