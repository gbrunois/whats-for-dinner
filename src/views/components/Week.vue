<template>
  <div>
    <div v-for="day in days" :key="day.day">
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
  created() {
    this.$store.dispatch("fetch");
  },
  data() {
    return {
      days: this.$store.state.days
    };
  }
};
</script>
