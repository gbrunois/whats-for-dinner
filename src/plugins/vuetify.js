import Vue from "vue";

import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  VTextField,
  VTextarea,
  VForm,
  VCard,
  VDivider,
  VAvatar,
  VDialog,
  VProgressLinear,
  transitions
} from "vuetify";
import { Touch } from "vuetify/es5/directives";
import "vuetify/src/stylus/app.styl";

Vue.use(Vuetify, {
  theme: {
    primary: "#26a69a",
    secondary: "#006064"
  },
  components: {
    VCard,
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VTextField,
    VTextarea,
    VForm,
    VDivider,
    VAvatar,
    VDialog,
    VProgressLinear,
    transitions
  },
  directives: {
    Touch
  }
});
