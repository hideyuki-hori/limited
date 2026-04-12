import { onMount } from 'solid-js'
import { StoreCtx, Header, Carousel, initTheme } from '@limited/ui'
import { Footer } from '~/footer'
import { storeContext, loadCountdowns } from '~/store'

export function App() {
  onMount(() => {
    initTheme()
    loadCountdowns()
  })

  return (
    <StoreCtx.Provider value={storeContext}>
      <div class="flex flex-col min-h-screen">
        <Header />
        <main class="flex-1 flex flex-col">
          <Carousel />
        </main>
        <Footer />
      </div>
    </StoreCtx.Provider>
  )
}
