<template>
  <v-card flat>
    <v-layout row justify-space-between mx-2>
      <v-btn color="primary" small dark fab @click="goToPreviousWeek()">
        <v-icon>chevron_left</v-icon>
      </v-btn>
      <v-flex>
        <v-layout column fill-height justify-center align-center>{{
          currentPeriod
        }}</v-layout>
      </v-flex>
      <v-btn color="primary" small dark fab @click="goToNextWeek()">
        <v-icon>chevron_right</v-icon>
      </v-btn>
    </v-layout>
  </v-card>
</template>

<script>
import daysService from '@/services/days.service'
import { mapGetters } from 'vuex'
const weekPageName = 'week'

export default {
  computed: {
    ...mapGetters({ currentPeriod: 'days/currentPeriod' }),
  },
  methods: {
    goToPreviousWeek() {
      const previousWeek = daysService.getPreviousStartDayOfWeek(
        this.$store.getters['days/beginDate']
      )
      const splits = previousWeek.toString().split('-')
      this.$router.push({
        name: weekPageName,
        params: {
          year: splits[0],
          month: splits[1],
          day: splits[2],
        },
      })
    },
    goToNextWeek() {
      const previousWeek = daysService.getNextStartDayOfWeek(
        this.$store.getters['days/beginDate']
      )
      const splits = previousWeek.toString().split('-')
      this.$router.push({
        name: weekPageName,
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
