<template>
  <v-layout text-xs-center wrap>
    <v-flex xs12>
      <v-img
        src="./img/icons/android-chrome-512x512.png"
        class="my-3"
        contain
        height="200"
      ></v-img>
    </v-flex>
    <v-flex mb-4>
      <h1 class="display-2 font-weight-bold mb-3">Plan your meals</h1>
      <p class="subheading font-weight-regular">
        Plannifier vous repas de la semaine et partager vos plannings avec vos
        proches
      </p>
      <p class="subheading font-weight-regular">
        Pour continuer, vous devez vous authentifier avec un compte Google
      </p>
    </v-flex>
    <v-flex mb-5 xs12>
      <v-btn @click="authenticate" color="secondary">
        <v-icon left dark>mdi-google</v-icon>Me connecter avec Google
      </v-btn>
    </v-flex>
    <v-flex class="pa-3" color="primary">
      <v-layout justify-center>
        <a class="mx-1" href="terms-of-service">Condition d'utilisation</a>
        <a class="mx-1" href="privacy-policy">Politique de confidentialité</a>
      </v-layout>
    </v-flex>
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
