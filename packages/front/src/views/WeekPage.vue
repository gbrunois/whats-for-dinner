<template>
  <v-layout
    column
    v-touch="{
      left: () => goToNextWeek(),
      right: () => goToPreviousWeek(),
    }"
  >
    <v-flex>
      <v-list two-line>
        <template v-for="(item, index) in items">
          <v-list-tile :key="item.index" ripple @click="openPopupDay(item)">
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.date.toLongFormat() }}
              </v-list-tile-title>
              <v-list-tile-sub-title
                >Midi {{ item.lunch }}</v-list-tile-sub-title
              >
              <v-list-tile-sub-title
                >Soir {{ item.dinner }}</v-list-tile-sub-title
              >
            </v-list-tile-content>
          </v-list-tile>
          <v-divider
            v-if="index + 1 < items.length"
            :key="`divider-${index}`"
          ></v-divider>
        </template>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
import { DayService } from '@/api/day.service'
import { MenuDate } from '@/api/menu-date'
import daysService from '@/services/days.service'
import { getDateFromUrlParamsOrToday } from '@/services/router.service'
import WeekNavigation from './components/WeekNavigation.vue'

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
    status() {
      return this.$store.getters['days/status']
    },
  },
  methods: {
    openPopupDay(day) {
      const splits = day.date.toString().split('-')
      this.$router.push({
        name: 'day',
        params: {
          year: splits[0],
          month: splits[1],
          day: splits[2],
        },
      })
    },
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
