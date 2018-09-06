<template>
  <v-container fluid>
    <v-layout column fill-height>
      <v-flex xs12>
        <div>
            <v-btn fab @click="goToPreviousDay()"><v-icon>chevron_left</v-icon></v-btn>
            {{ day.date }}
            <v-btn fab @click="goToNextDay()"><v-icon>chevron_right</v-icon></v-btn>
          </div>
      </v-flex>
      <v-flex xs12 fill-height>
          <v-card height="100%">
            <meal label="Midi" :day=day meal="lunch"></meal>
            <v-divider></v-divider>
            <meal label="Soir" :day=day meal="dinner"></meal>
          </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import MealComponent from "./components/MealComponent.vue";
import daysService from "@/services/days.service.js";

const dayPageName = "day";

export default {
  name: dayPageName,
  created() {
    this.$store.dispatch("days/load", daysService.getNow());
  },
  computed: {
    day() {
      return this.$store.state.days.currentDay;
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
          date: daysService.getPreviousDate(this.$store.state.days.currentDate)
        }
      });
    },
    goToNextDay: function() {
      this.$router.push({
        name: dayPageName,
        params: {
          date: daysService.getNextDate(this.$store.state.days.currentDate)
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
