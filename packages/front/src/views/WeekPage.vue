<template>
  <v-row
    no-gutters
    column
    v-touch="{
      left: () => goToNextWeek(),
      right: () => goToPreviousWeek(),
    }"
  >
    <v-col>
      <v-list two-line>
        <template v-for="(item, index) in items">
          <v-list-item :key="item.index" ripple @click="openPopupDay(item)">
            <v-list-item-content>
              <v-list-item-title>
                {{ item.date.toLongFormat() }}
              </v-list-item-title>
              <v-list-item-subtitle>Midi {{ item.lunch }}</v-list-item-subtitle>
              <v-list-item-subtitle
                >Soir {{ item.dinner }}</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-divider
            v-if="index + 1 < items.length"
            :key="`divider-${index}`"
          ></v-divider>
        </template>
      </v-list>
    </v-col>
  </v-row>
</template>

<script>
import { DayService } from '@/api/days/day.service'
import { MenuDate } from '@/api/days/menu-date'
import { daysService } from '@/services/days.service'
import { getDateFromUrlParamsOrToday } from '@/services/router.service'
import WeekNavigation from './components/WeekNavigation.vue'
import { DEFAULT_MAIN_PAGE_PATH, WEEK_PAGE_NAME } from '../router'

export default {
  name: WEEK_PAGE_NAME,
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
        name: WEEK_PAGE_NAME,
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
