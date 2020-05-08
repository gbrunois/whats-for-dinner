<template>
  <v-app>
    <app-navigation />
    <v-content>
      <splash-screen :is-loading="isLoading" />
      <v-container fluid class="grey lighten-4 fill-height" v-if="!isLoading">
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
import router, { SIGNIN_PAGE_NAME, DEFAULT_MAIN_PAGE_PATH } from './router'
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
      if (
        store.state.auth.user &&
        this.$router.currentRoute.name === SIGNIN_PAGE_NAME
      ) {
        // user is connected. redirect on main page if current page is SignIn page
        router.push(DEFAULT_MAIN_PAGE_PATH)
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
