<template>
  <span>
    <v-navigation-drawer v-model="drawer" temporary app>
      <v-list class="pa-0" subheader>
        <v-list-tile avatar v-if="user !== null" class="light">
          <v-list-tile-avatar>
            <img :src="user.photoURL" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ user.displayName }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile @click="navigateToSharingsPage()" v-if="false">
          <v-list-tile-action>
            <v-icon>share</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Mes partages</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="navigateToMyPlannings()">
          <v-list-tile-action>
            <v-icon>mdi-calendar-multiple-check</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Mes plannings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="navigateToSettings()">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Paramètres</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="logout()">
          <v-list-tile-action>
            <v-icon>logout</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Déconnecter</v-list-tile-title>
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
      <v-toolbar-side-icon @click.stop="onToolbarButtonClick">
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
      if (this.$route.meta.showBackButton === true) {
        return 'mdi-arrow-left'
      } else {
        return 'menu'
      }
    },
  },
  methods: {
    logout() {
      this.$store
        .dispatch('auth/logout')
        .then(() => this.$router.push('signIn'))
    },
    navigateToSharingsPage() {
      this.$router.push({
        name: 'sharings',
      })
    },
    navigateToSettings() {
      this.$router.push({
        name: 'settings',
      })
    },
    navigateToMyPlannings() {
      this.$router.push({
        name: 'my-plannings',
      })
    },
    onToolbarButtonClick() {
      if (this.$route.meta.showBackButton === true) {
        this.$router.go(-1)
      } else {
        this.drawer = !this.drawer
      }
    },
  },
}
</script>
