<template>
  <v-form>
    <v-container>
    {{ day.day }}:
      <div>Lunch: <meal :day="day.day" type="midday"></meal></div>
      <div>Dinner: <meal :day="day.day" type="evening"></meal></div>
    </v-container>
  </v-form>
</template>

<script>
import Meal from "./Meal.vue";

export default {
  name: "day",
  components: {
    Meal
  },
  props: ["day"]
};
</script>
