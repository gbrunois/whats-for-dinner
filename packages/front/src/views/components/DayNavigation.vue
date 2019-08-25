<template>
  <v-layout row justify-space-between mx-2>
    <v-btn color="primary" small dark fab @click="goToPreviousDay()">
      <v-icon>chevron_left</v-icon>
    </v-btn>
    <v-flex>
      <v-layout
        column
        fill-height
        justify-center
        align-center
        v-if="openedDay"
        >{{ openedDay.date.toLongFormat() }}</v-layout
      >
    </v-flex>
    <v-btn color="primary" small dark fab @click="goToNextDay()">
      <v-icon>chevron_right</v-icon>
    </v-btn>
  </v-layout>
</template>

<script>
import daysService from '@/services/days.service'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({ openedDay: 'days/openedDay' }),
  },
  methods: {
    goToPreviousDay() {
      const previousWeek = daysService.getPreviousDay(
        this.$store.getters['days/openedDay'].date
      )
      const splits = previousWeek.toString().split('-')
      this.$router.push({
        name: 'day',
        params: {
          year: splits[0],
          month: splits[1],
          day: splits[2],
        },
      })
    },
    goToNextDay() {
      const previousWeek = daysService.getNextDay(
        this.$store.getters['days/openedDay'].date
      )
      const splits = previousWeek.toString().split('-')
      this.$router.push({
        name: 'day',
        params: {
          year: splits[0],
          month: splits[1],
          day: splits[2],
        },
      })
    },
  },
}
</script>
