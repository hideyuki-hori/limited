import { onMount } from 'solid-js'
import { StoreCtx, ConfigCtx, Header, Carousel, Footer, initTheme } from '@limited/ui'
import { storeContext, loadCountdowns } from '~/store'

export function App() {
  onMount(() => {
    initTheme()
    loadCountdowns()
  })

  return (
    <StoreCtx.Provider value={storeContext}>
      <ConfigCtx.Provider value={{ showExtensionLink: false }}>
        <div class="flex flex-col min-h-screen">
          <Header />
          <main class="flex-1 flex flex-col">
            <Carousel />
          </main>
          <Footer />
        </div>
      </ConfigCtx.Provider>
    </StoreCtx.Provider>
  )
}
