<template>
  <div>
    <div>Week</div>
    <div v-for="day in days" :key="day">
      <day :day="day"></day>
    </div>
  </div>
</template>

<script>
import Day from "./Day.vue";

export default {
  name: "week",
  components: {
    Day
  },
  data() {
    return {
      days: [
        "Monday",
        "Tuesday",
        "Wesnesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ]
    };
  }
};
</script>
