module.exports = {
  pwa: {
    name: "What's for dinner",
    themeColor: '#06a69a',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      //skipWaiting: true
      // swSrc is required in InjectManifest mode.
      //globDirectory: '.',
      //globPatterns: ['dist/*.{js,png,html,css}'],
      swSrc: 'public/service-worker.js',
      // ...other Workbox options...
      //swSrc: './src/sw.js',
      //swDest: 'service-worker.js',
    },
  },
}
