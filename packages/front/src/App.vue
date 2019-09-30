<template>
  <v-app>
    <app-navigation />
    <v-content>
      <splash-screen :is-loading="isLoading" />
      <v-container fill-height pa-0 v-if="!isLoading">
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import AppNavigation from '@/components/AppNavigation'
import store from '@/store'
import { mapGetters } from 'vuex'
import { Api } from './api/api'
import App from './App.vue'
import router from './router'
import SplashScreen from './views/SplashScreen.vue'

export default {
  name: 'App',
  components: {
    AppNavigation,
    SplashScreen,
  },
  data: () => {
    return {
      isLoading: true,
    }
  },
  created() {
    this.isLoading = true
    Api.getInstance()
      .init()
      .then(() => {
        store.dispatch('auth/watchUserAuthenticated')
      })
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      waitForAuthenticatedState: 'auth/waitForAuthenticatedState',
    }),
  },
  watch: {
    user() {
      if (store.state.auth.user) {
        router.push('/week')
      }
    },
    waitForAuthenticatedState() {
      this.isLoading = store.state.auth.waitForAuthenticatedState
    },
  },
}
</script>
<style>
.v-toolbar__extension {
  padding: 0;
}
</style>
