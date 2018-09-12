<template>
  <v-app>
    <v-toolbar app fixed>
      <v-toolbar-items>
      <v-btn icon>
        <v-avatar>
          <img :src="photoUrl">
        </v-avatar>
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
  computed: {
    photoUrl() {
      return this.$store.state.auth.user
        ? this.$store.state.auth.user.photoURL
        : "";
    }
  }
};
</script>

<style scoped>
.v-avatar {
  transform: translateY(-5px);
}
</style>
