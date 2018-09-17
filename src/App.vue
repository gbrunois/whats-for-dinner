<template>
  <v-app>
    <v-toolbar app fixed dark color="primary">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn icon  @click="viewDay()">
          <v-icon>view_carousel</v-icon>
        </v-btn>
        <v-btn icon @click="viewWeek()">
          <v-icon>view_agenda</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height pa-0>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  created() {
    this.$store.dispatch("auth/autoSignIn");
  },
  methods: {
    viewDay() {
      this.$router.push("/day");
    },
    viewWeek() {
      this.$router.push("/week");
    }
  }
};
</script>
