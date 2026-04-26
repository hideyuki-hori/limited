import { Carousel, Header, initTheme, StoreCtx } from '@limited/ui'
import { onMount } from 'solid-js'
import { Footer } from '~/footer'
import { loadCountdowns, storeContext } from '~/store'

export function App() {
  onMount(() => {
    initTheme()
    loadCountdowns()
  })

  return (
    <StoreCtx.Provider value={storeContext}>
      <div class='flex flex-col min-h-screen'>
        <Header />
        <main class='flex-1 flex flex-col'>
          <Carousel />
        </main>
        <Footer />
      </div>
    </StoreCtx.Provider>
  )
}
