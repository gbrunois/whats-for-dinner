<template>
  <v-layout column>
    <v-list subheader>
      <v-subheader class="title font-weight-bold">Sharings</v-subheader>
      <v-list-tile v-for="sharing in sharings" :key="sharing.id" avatar>
        <v-list-tile-content>
          <v-list-tile-title v-text="sharing.displayName"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-layout>
</template>

<script>
export default {
  name: 'sharings',
  created() {
    this.$store.dispatch('sharings/fetchSharings')
  },
  computed: {
    sharings() {
      return this.$store.getters['sharings/sharings']
    },
  },
}
</script>
