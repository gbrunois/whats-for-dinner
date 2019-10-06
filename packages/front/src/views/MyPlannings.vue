<template>
  <v-row>
    <v-col>
      <v-card>
        <v-list>
          <template v-for="planning in myPlannings">
            <v-list-item :key="planning.id" @click="setAsPrimary(planning)">
              <v-list-item-content>
                {{ planning.ownerName }}
              </v-list-item-content>
              <v-list-item-action>
                <v-icon v-if="planning.primary === false" color="grey lighten-1"
                  >mdi-star-outline</v-icon
                >
                <v-icon v-else color="yellow darken-2">mdi-star</v-icon>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
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
