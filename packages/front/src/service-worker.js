workbox.core.setCacheNameDetails({
  prefix: 'plan-your-meals',
})

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.suppressWarnings()
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

workbox.routing.registerNavigationRoute('/index.html', {
  whitelist: [new RegExp('/week')],
})
workbox.routing.registerRoute(
  new RegExp('/img/icons/'),
  workbox.strategies.cacheFirst({
    cacheName: 'image-cache',
  })
)
