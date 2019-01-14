<template>
  <span>
    <v-navigation-drawer v-model="drawer" temporary app>
      <v-list class="pa-0" subheader>
        <v-list-tile avatar @click="changeAccount()" v-if="user !== null" class="light">
          <v-list-tile-avatar>
            <img :src="user.photoURL">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ user.displayName }}</v-list-tile-title>
            <v-list-tile-title>{{ user.email }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="navigateToSharingsPage()">
          <v-list-tile-action>
            <v-icon>share</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Sharings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>
      <v-list class="pt-0" dense>
        <div class="container">
          <div class="text-xs-center">
            <h4 class="grey--text">Version {{ version }}</h4>
          </div>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed dark color="primary" extended extension-height="7">
      <v-toolbar-side-icon @click.stop="drawer = !drawer">
        <v-icon>{{ menuIcon }}</v-icon>
      </v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-progress-linear
        slot="extension"
        class="ma-0"
        :indeterminate="true"
        v-if="isLoading"
        color="white"
      ></v-progress-linear>
    </v-toolbar>
  </span>
</template>

<script>
import { version } from '../../package.json'

export default {
  name: 'AppNavigation',
  data() {
    return {
      drawer: false,
      version,
    }
  },
  computed: {
    user() {
      return this.$store.getters['auth/user']
    },
    isLoading() {
      return this.$store.getters['days/isLoading']
    },
    menuIcon() {
      return 'menu'
    },
  },
  methods: {
    changeAccount() {
      this.$store.dispatch('auth/changeAccount')
    },
    navigateToSharingsPage() {
      this.$router.push({
        name: 'sharings',
      })
    },
  },
}
</script>
