<template>
  <v-card>
    <v-navigation-drawer v-if="user" v-model="drawer" temporary app>
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
    <v-toolbar fixed app dark color="primary" :extended="isWeekPage">
      <v-toolbar-side-icon @click.stop="onToolbarButtonClick">
        <v-icon>{{ menuIcon }}</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title class="text-xs-center">
        {{ toolbarTitle }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-side-icon @click.stop="onTodayButtonClick">
        <v-icon>mdi-calendar</v-icon>
      </v-toolbar-side-icon>
      <v-layout column fill-height slot="extension" v-if="isWeekPage">
        <v-flex>
          <!-- https://vuejs.org/v2/guide/components-dynamic-async.html -->
          <component v-bind:is="currentTabComponent"></component>
        </v-flex>
        <v-flex class="flex-progress-linear">
          <v-progress-linear
            class="ma-0"
            :indeterminate="true"
            v-if="isLoading"
            color="white"
          ></v-progress-linear>
        </v-flex>
      </v-layout>
    </v-toolbar>
  </v-card>
</template>

<script>
import { version } from '../../package.json'
import DayNavigation from '../views/components/DayNavigation.vue'
import WeekNavigation from '../views/components/WeekNavigation.vue'

export default {
  name: 'AppNavigation',
  components: {
    weekNavigation: WeekNavigation,
    dayNavigation: DayNavigation,
  },
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
    toolbarTitle() {
      return this.$route.meta.title
    },
    isWeekPage() {
      return this.$route.meta.showToolbarExtension === true
    },
    currentTabComponent() {
      return this.$route.meta.navigationComponent
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
        const lastVisitedPage = this.$store.getters.currentWeekPage || 'week'
        this.$router.push({
          path: lastVisitedPage,
        })
      } else {
        this.drawer = !this.drawer
      }
    },
    onTodayButtonClick() {
      this.$router.push({
        path: '/week',
      })
    },
  },
}
</script>

<style scoped>
.flex-progress-linear {
  height: 7px;
}
</style>
