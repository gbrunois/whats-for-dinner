<template>
  <v-app>
    <v-toolbar app fixed dark color="primary" extended extension-height="7">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-progress-linear slot="extension" class="ma-0" :indeterminate="true" v-if="isLoading" color="white"></v-progress-linear>
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
  computed: {
    isLoading() {
      return this.$store.getters["days/isLoading"];
    }
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
<style>
.v-toolbar__extension {
  padding: 0;
}
</style>
