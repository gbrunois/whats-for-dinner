<template>
  <span>
    <v-navigation-drawer v-model="drawer" temporary app>
      <v-toolbar flat class="light">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img :src="photoUrl">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ username }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <div class="container">
          <div class="text-xs-center">
            <h4 class="grey--text">Version {{ version }}</h4>
          </div>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed dark color="primary" extended extension-height="7">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
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
      drawer: true,
      version,
    }
  },
  computed: {
    username() {
      const user = this.$store.getters['auth/user']
      return user && user.displayName
    },
    photoUrl() {
      const user = this.$store.getters['auth/user']
      return user && user.photoURL
    },
    isLoading() {
      return this.$store.getters['days/isLoading']
    },
  },
}
</script>
