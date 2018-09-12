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
  VProgressLinear,
  transitions
} from "vuetify";
import "vuetify/src/stylus/app.styl";

Vue.use(Vuetify, {
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
    VProgressLinear,
    transitions
  }
});
