<template>
  <v-dialog v-model="isOpened" persistent full-width v-if="day" @keydown.esc="close()">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click.native="close()">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ day.date | date }}</v-toolbar-title>
        <v-toolbar-title>{{ status }}</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-layout row wrap>
          <v-flex d-flex xs12>
            <meal label="Midi" :day="day" meal="lunch"></meal>
          </v-flex>
          <v-divider></v-divider>
          <v-flex d-flex xs12>
            <meal label="Soir" :day="day" meal="dinner"></meal>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import daysService from '@/services/days.service'
import MealComponent from './MealComponent.vue'

export default {
  name: 'dayDialog',
  computed: {
    isOpened() {
      return this.day != null
    },
  },
  methods: {
    close: function() {
      this.$emit('close')
    },
  },
  components: {
    meal: MealComponent,
  },
  props: ['day', 'status'],
  filters: {
    date: value => {
      return daysService.toHumanFormat(value)
    },
  },
}
</script>
