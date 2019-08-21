<template>
  <v-layout
    column
    v-touch="{
      left: () => goToNextWeek(),
      right: () => goToPreviousWeek(),
    }"
  >
    <v-list two-line>
      <template v-for="(item, index) in items">
        <v-list-tile :key="item.index" ripple @click="openPopupDay(item)">
          <v-list-tile-content>
            <v-list-tile-title>{{
              item.date.toHumanFormat()
            }}</v-list-tile-title>
            <v-list-tile-sub-title
              >Lunch {{ item.lunch }}</v-list-tile-sub-title
            >
            <v-list-tile-sub-title
              >Dinner {{ item.dinner }}</v-list-tile-sub-title
            >
          </v-list-tile-content>
        </v-list-tile>
        <v-divider
          v-if="index + 1 < items.length"
          :key="`divider-${index}`"
        ></v-divider>
      </template>
    </v-list>
    <day-dialog
      :day="openedDay"
      :status="status"
      @close="closePopup()"
    ></day-dialog>
    <v-flex>
      <v-btn
        color="primary"
        dark
        absolute
        fixed
        bottom
        left
        fab
        style="bottom: 30px"
        @click="goToPreviousWeek()"
      >
        <v-icon>chevron_left</v-icon>
      </v-btn>
      <v-btn
        color="primary"
        dark
        absolute
        fixed
        bottom
        right
        fab
        style="bottom: 30px"
        @click="goToNextWeek()"
      >
        <v-icon>chevron_right</v-icon>
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import { DayService } from '@/api/day.service'
import { MenuDate } from '@/api/menu-date'
import daysService from '@/services/days.service'
import { getDateFromUrlParamsOrToday } from '@/services/router.service'
import DayDialogComponent from './components/DayDialogComponent.vue'

const weekPageName = 'week'

export default {
  name: weekPageName,
  created() {
    const date = getDateFromUrlParamsOrToday(this.$route.params)
    this.$store.dispatch('days/loadPeriod', {
      beginDate: daysService.getFirstDayOfWeek(date),
      endDate: daysService.getLastDayOfWeek(date),
    })
  },
  computed: {
    items() {
      return this.$store.getters['days/watchingDays']
    },
    openedDay() {
      return this.$store.getters['days/openedDay']
    },
    status() {
      return this.$store.getters['days/status']
    },
  },
  components: {
    dayDialog: DayDialogComponent,
  },
  methods: {
    openPopupDay(day) {
      this.$store.dispatch('days/openDay', day)
    },
    closePopup() {
      this.$store.dispatch('days/closeDay')
    },
    goToPreviousWeek() {
      const previousWeek = daysService.getPreviousStartDayOfWeek(
        this.$store.getters['days/currentDate']
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
        this.$store.getters['days/currentDate']
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
  watch: {
    $route(to) {
      const date = getDateFromUrlParamsOrToday(to.params)
      this.$store.dispatch('days/loadPeriod', {
        beginDate: daysService.getFirstDayOfWeek(date),
        endDate: daysService.getLastDayOfWeek(date),
      })
    },
  },
}
</script>
