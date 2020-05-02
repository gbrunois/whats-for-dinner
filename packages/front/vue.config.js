module.exports = {
  lintOnSave: process.env.NODE_ENV !== 'production',
  pwa: {
    name: 'plan-your-meals',
    themeColor: '#06a69a',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js',
    },
  },
}
