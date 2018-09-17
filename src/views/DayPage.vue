<template>
  <v-layout column>
    <v-flex>
      <v-layout row pt-1>
        <v-btn fab @click="goToPreviousDay()">
          <v-icon>chevron_left</v-icon>
        </v-btn>
        <v-flex>
          <v-layout fill-height column justify-center>
            <div class="text-xs-center">{{ date }}</div>
          </v-layout>
        </v-flex>
        <v-btn fab @click="goToNextDay()">
          <v-icon>chevron_right</v-icon>
        </v-btn>
      </v-layout>
    </v-flex>
    <v-progress-linear :indeterminate="true" v-if="isLoading"></v-progress-linear>
    <v-flex fill-height>
      <v-layout column fill-height class="pa-3 pt-4">
        <meal label="Midi" :day=day meal="lunch" :disabled="isLoading"></meal>
        <meal label="Soir" :day=day meal="dinner" :disabled="isLoading"></meal>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import MealComponent from "./components/MealComponent.vue";
import daysService from "@/services/days.service.js";

const dayPageName = "day";

export default {
  name: dayPageName,
  created() {
    this.$store.dispatch("auth/autoSignIn").then(() => {
      this.$store.dispatch(
        "days/load",
        this.$route.params.date || daysService.getNow()
      );
    });
  },
  computed: {
    day() {
      return this.$store.getters["days/currentDay"];
    },
    date() {
      return daysService.toHumanFormat(this.$store.getters["days/currentDate"]);
    },
    isLoading() {
      return this.$store.getters["days/isLoading"];
    }
  },
  components: {
    meal: MealComponent
  },
  methods: {
    goToPreviousDay: function() {
      this.$router.push({
        name: dayPageName,
        params: {
          date: daysService.getPreviousDate(
            this.$store.getters["days/currentDate"]
          )
        }
      });
    },
    goToNextDay: function() {
      this.$router.push({
        name: dayPageName,
        params: {
          date: daysService.getNextDate(this.$store.getters["days/currentDate"])
        }
      });
    }
  },
  watch: {
    $route(to) {
      this.$store.dispatch("days/load", to.params.date);
    }
  }
};
</script>
