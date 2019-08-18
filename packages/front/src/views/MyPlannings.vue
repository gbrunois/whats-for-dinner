<template>
  <v-layout column>
    <v-flex xs12 sm6>
      <v-card>
        <v-list>
          <template v-for="planning in myPlannings">
            <v-list-tile :key="planning.id" @click="setAsPrimary(planning)">
              <v-list-tile-content>
                {{ planning.ownerName }}
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon v-if="planning.primary === false" color="grey lighten-1"
                  >star_border</v-icon
                >
                <v-icon v-else color="yellow darken-2">star</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'my-plannings',
  computed: {
    myPlannings() {
      return this.$store.getters['sharings/myPlannings']
    },
  },
  created() {
    this.$store.dispatch('sharings/fetchMyPlannings')
  },
  methods: {
    setAsPrimary(planning) {
      this.$store.dispatch('sharings/setAsPrimary', planning)
    },
  },
}
</script>
