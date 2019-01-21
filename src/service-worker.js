workbox.core.setCacheNameDetails({
  prefix: 'whats-for-dinner',
})

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.suppressWarnings()
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

workbox.routing.registerNavigationRoute('/index.html', {
  whitelist: [new RegExp('/week')],
})
workbox.router.registerRoute(
  /\.(?:png|gif|jpg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images-cache',
  })
)
