<template>
  <v-layout text-xs-center row wrap>
    <v-flex xs12 mt-5>
      <delete-account-button />
    </v-flex>
  </v-layout>
</template>

<script>
import DeleteAccountButton from './components/DeleteAccountButton'

export default {
  name: 'settings',
  components: {
    deleteAccountButton: DeleteAccountButton,
  },
}
</script>

<style scoped></style>
