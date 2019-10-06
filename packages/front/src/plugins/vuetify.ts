import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
import Vuetify from 'vuetify'
// @ts-ignore
import VuetifyLib from 'vuetify/lib'
// @ts-ignore
import { Touch } from 'vuetify/lib/directives/touch'

// hack vuetify typescript compatibility
Vue.use(VuetifyLib, {
  directives: {
    Touch,
  },
})

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      light: {
        primary: '#26a69a',
        secondary: '#006064',
      },
    },
  },
})
