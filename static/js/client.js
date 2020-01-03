console.log('client js')

function installServiceWorker () {
  const { serviceWorker } = navigator
  if (!serviceWorker) return

  serviceWorker.addEventListener('controllerchange', async () => {
    console.log('sw controller changed')
  })

  serviceWorker.register('/serviceworker.js', {scope: '/'})
}

installServiceWorker()
