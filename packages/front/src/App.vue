<template>
  <v-app>
    <app-navigation />
    <v-content>
      <v-container fill-height pa-0>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>

<script>
import AppNavigation from '@/components/AppNavigation'

export default {
  name: 'App',
  components: {
    AppNavigation,
  },
  methods: {
    viewDay() {
      this.$router.push('/day')
    },
    viewWeek() {
      this.$router.push('/week')
    },
  },
}
</script>
<style>
.v-toolbar__extension {
  padding: 0;
}
</style>
