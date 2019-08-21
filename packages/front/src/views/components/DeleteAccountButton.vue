<template>
  <v-dialog v-model="dialog" persistent>
    <template v-slot:activator="{ on }">
      <v-btn color="error" outline v-on="on">
        <v-icon left dark>mdi-delete-forever</v-icon>Supprimer mon compte
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">Supprimer mon compte?</v-card-title>
      <v-card-text>
        <v-card color="red lighten-5">
          <v-layout align-center pa-1>
            <v-flex xs1 fill-height>
              <v-icon color="red">warning</v-icon>
            </v-flex>
            <v-flex
              xs11
              class="font-weight-bold red--text"
              fill-height
              justify
              pl-1
            >
              La suppression de votre compte supprime vos données et vos
              partages. Cette action est définitive et irréversible.
            </v-flex>
          </v-layout>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" flat @click="dialog = false"
          >Annuler</v-btn
        >
        <v-btn color="red darken-1 white--text" @click="deleteAccount"
          >Supprimer</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
    }
  },
  methods: {
    deleteAccount() {
      this.dialog = false
      this.$store
        .dispatch('auth/deleteAccount')
        .then(() => this.$router.push('signIn'))
    },
  },
}
</script>

<style scoped></style>
