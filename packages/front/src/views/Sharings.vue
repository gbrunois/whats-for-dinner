<template>
  <v-layout column>
    <v-flex xs12 sm6>
      <v-card>
        <v-layout column>
          <v-flex>
            <v-layout row>
              <v-flex>
                <v-text-field v-model="newSharing" label="Adresse email" type="text"></v-text-field>
              </v-flex>
              <v-flex>
                <v-btn @click="submit">submit</v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex>
            <v-list>
              <template v-for="sharing in sharings">
                <v-list-item :key="sharing.id">
                  <v-list-item-content>
                    {{
                    sharing.ownerName
                    }}
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon>mdi-delete</v-icon>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-list>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
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
