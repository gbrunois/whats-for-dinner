<template>
  <v-layout>
    <v-btn @click="authenticate">Authenticate</v-btn>
  </v-layout>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'

export default {
  name: 'signSin',
  computed: {
    ...mapGetters({ user: 'auth/user' }),
  },
  async beforeRouteEnter(to, from, next) {
    if (store.state.auth.user) {
      next('/week')
    } else {
      next()
    }
  },
  methods: {
    authenticate() {
      this.$store.dispatch('auth/signIn')
    },
  },
}
</script>
