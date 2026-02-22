import { onMount } from 'solid-js'
import { StoreCtx, ConfigCtx, Header, AddForm, CountdownList, Footer, initTheme } from '@limited/ui'
import { storeContext, loadCountdowns } from '~/store'

export function App() {
  onMount(() => {
    initTheme()
    loadCountdowns()
  })

  return (
    <StoreCtx.Provider value={storeContext}>
      <ConfigCtx.Provider value={{ showExtensionLink: true }}>
        <div class="flex flex-col min-h-screen">
          <Header />
          <main class="flex-1 flex flex-col gap-8 px-4 md:px-20 py-6 md:py-10">
            <AddForm />
            <CountdownList />
          </main>
          <Footer />
        </div>
      </ConfigCtx.Provider>
    </StoreCtx.Provider>
  )
}
