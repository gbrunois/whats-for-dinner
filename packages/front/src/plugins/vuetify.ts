import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
import Vuetify from 'vuetify'

import { Touch } from 'vuetify/es5/directives'

Vue.use(Vuetify)

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
  directives: {
    Touch,
  },
})
