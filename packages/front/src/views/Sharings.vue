<template>
  <v-row>
    <v-col>
      <v-card>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="newSharing"
              label="Adresse email"
              type="text"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-btn @click="submit">submit</v-btn>
          </v-col>
        </v-row>
        <v-divider />Mes partages
        <v-row>
          <template v-for="sharing in sharings">
            <v-list-item :key="sharing.id">
              <v-list-item-content>{{ sharing.ownerName }}</v-list-item-content>
              <v-list-item-action>
                <v-icon>mdi-delete</v-icon>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'sharings',
  created() {
    this.$store.dispatch('sharings/fetchSharings')
  },
  data: () => {
    return {
      newSharing: '',
    }
  },
  computed: {
    sharings() {
      return this.$store.getters['sharings/sharings']
    },
  },
  methods: {
    submit() {
      this.$store.dispatch('sharings/addNewSharing')
    },
  },
}
</script>
