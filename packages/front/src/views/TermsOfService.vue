<template>
  <v-container>
    <v-layout text-xs-justify row wrap>
      <v-flex xs12>
        <div v-html="content"></div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  name: 'terms-of-service',
  data: () => {
    return {
      content: '<p></p>',
    }
  },
  async mounted() {
    const response = await axios.get('/policies/terms-of-service.fr.html')
    const parser = new DOMParser()
    this.content = parser.parseFromString(
      response.data,
      'text/html'
    ).body.innerHTML
  },
}
</script>

<style scoped></style>
