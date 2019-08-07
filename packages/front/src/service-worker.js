workbox.core.setCacheNameDetails({
  prefix: 'plan-your-meals',
})

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.suppressWarnings()
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
)

workbox.routing.registerRoute(
  new RegExp('/img/icons/'),
  workbox.strategies.cacheFirst({
    cacheName: 'image-cache',
  })
)

workbox.routing.registerRoute(
  new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
  workbox.strategies.cacheFirst({
    cacheName: 'googleapis',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30,
      }),
    ],
  })
)

workbox.routing.registerNavigationRoute('/index.html', {
  whitelist: [new RegExp('/week/?.*'), new RegExp('/signIn')],
})
