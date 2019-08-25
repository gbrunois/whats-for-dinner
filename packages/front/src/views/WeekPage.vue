<template>
  <v-layout
    column
    v-touch="{
      left: () => goToNextWeek(),
      right: () => goToPreviousWeek(),
    }"
  >
    <v-flex shrink="true">
      <v-layout row my-2>
        <v-flex xs12>
          <week-navigation />
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex>
      <v-list two-line>
        <template v-for="(item, index) in items">
          <v-list-tile :key="item.index" ripple @click="openPopupDay(item)">
            <v-list-tile-content>
              <v-list-tile-title>{{
                item.date.toLongFormat()
              }}</v-list-tile-title>
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
    <day-dialog
      :day="openedDay"
      :status="status"
      @close="closePopup()"
    ></day-dialog>
  </v-layout>
</template>

<script>
import { DayService } from '@/api/day.service'
import { MenuDate } from '@/api/menu-date'
import daysService from '@/services/days.service'
import { getDateFromUrlParamsOrToday } from '@/services/router.service'
import DayDialogComponent from './components/DayDialogComponent.vue'
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
    openedDay() {
      return this.$store.getters['days/openedDay']
    },
    status() {
      return this.$store.getters['days/status']
    },
  },
  components: {
    dayDialog: DayDialogComponent,
    weekNavigation: WeekNavigation,
  },
  methods: {
    openPopupDay(day) {
      this.$store.dispatch('days/openDay', day)
    },
    closePopup() {
      this.$store.dispatch('days/closeDay')
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
