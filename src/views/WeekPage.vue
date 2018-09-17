<template>
  <v-layout column>
    <v-progress-linear :indeterminate="true" v-if="isLoading"></v-progress-linear>
    <v-list two-line>
      <template v-for="(item, index) in items">
        <v-list-tile :key="item.index" ripple>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.date | date }}</v-list-tile-title>
            <v-list-tile-sub-title>Midi {{ item.lunch }}</v-list-tile-sub-title>
            <v-list-tile-sub-title>Soir {{ item.dinner }}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
              <v-btn icon ripple @click="openDay(item)">
                <v-icon color="grey lighten-1">info</v-icon>
              </v-btn>
            </v-list-tile-action>
        </v-list-tile>
        <v-divider v-if="index + 1 < items.length" :key="`divider-${index}`"></v-divider>
      </template>
    </v-list>
  </v-layout>
</template>

<script>
import daysService from "@/services/days.service.js";

export default {
  name: "week",
  created() {
    this.$store.dispatch("auth/autoSignIn").then(() => {
      this.$store.dispatch("days/loadPeriod", {
        beginDate: daysService.getFirstDayOfCurrentWeek(),
        endDate: daysService.getLastDayOfCurrentWeek()
      });
    });
  },
  computed: {
    items() {
      return this.$store.getters["days/watchingDays"];
    },
    isLoading() {
      return this.$store.getters["days/isLoading"];
    }
  },
  methods: {
    openDay: function(day) {
      this.$router.push({
        name: "day",
        params: {
          date: day.date
        }
      });
    }
  },
  filters: {
    date: value => {
      return daysService.toHumanFormat(value);
    }
  }
};
</script>
