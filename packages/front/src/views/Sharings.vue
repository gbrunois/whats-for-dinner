<template>
  <v-row class="fill-height" align="start">
    <v-col class="pa-0">
      <v-row no-gutters style="background: #fff;">
        <v-col cols="12" class="px-2">
          <v-text-field
            v-model="email"
            ref="inputEmail"
            label="Saisissez une adresse e-mail"
            type="text"
            append-outer-icon="mdi-account-plus"
            maxlength="100"
            :rules="[rules.email]"
            @click:append-outer="addSharing"
            @keypress="onAddSharingInputKeyPress"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-divider />
        </v-col>
        <v-col cols="12">
          <v-subheader class="font-weight-bold"
            >Menus partagés avec</v-subheader
          >
          <v-list two-line>
            <template v-for="sharing in sharings">
              <v-list-item :key="sharing.userEmail">
                <v-list-item-content>
                  <v-list-item-title
                    v-text="sharing.userDisplayName"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    v-text="sharing.userEmail"
                  ></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-icon>
                  <span v-if="sharing.isOwner" class="font-weight-light caption"
                    >Propriétaire</span
                  >
                  <v-icon v-else @click="removeSharing(sharing)"
                    >mdi-close-circle-outline</v-icon
                  >
                </v-list-item-icon>
              </v-list-item>
            </template>
          </v-list>
          <v-list two-line>
            <template v-for="sharing in pendingSharings">
              <v-list-item :key="sharing.userEmail">
                <v-list-item-content>
                  <v-list-item-title
                    class="font-weight-light font-italic"
                    v-text="sharing.userEmail"
                  ></v-list-item-title>
                  <v-list-item-subtitle>(En attente)</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-icon>
                  <v-icon @click="removePendingSharing(sharing)"
                    >mdi-close-circle-outline</v-icon
                  >
                </v-list-item-icon>
              </v-list-item>
            </template>
          </v-list>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
import { Utils } from '../services/utils'

export default {
  name: 'sharings',

  created() {
    this.$store.dispatch('sharings/fetchSharings')
  },
  data: () => {
    return {
      email: '',
      rules: {
        email: (value) => Utils.emailIsValid(value) || 'E-mail invalide',
      },
    }
  },
  computed: {
    sharings() {
      return this.$store.getters['sharings/sharings']
    },
    pendingSharings() {
      return this.$store.getters['sharings/pendingSharings']
    },
  },
  methods: {
    addSharing(event) {
      if (Utils.emailIsValid(this.email)) {
        this.$store.dispatch('sharings/addNewSharing', this.email)

        this.email = ''
        this.$refs.inputEmail.resetValidation()
        this.$refs.inputEmail.blur()
      }
    },
    onAddSharingInputKeyPress(event) {
      if (event.key === 'Enter') {
        this.addSharing(event)
      }
    },
    removeSharing(sharing) {
      this.$store.dispatch('sharings/removeSharing', sharing)
    },
    removePendingSharing(sharing) {
      this.$store.dispatch('sharings/removePendingSharing', sharing)
    },
  },
}
</script>
