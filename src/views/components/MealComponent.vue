<template>
  <v-card>
    <v-card-title primary-title>{{ label }}</v-card-title>
    <v-card-text>
      <v-text-field @input="onUpdate($event)" v-model="day[meal]"></v-text-field>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "meal",
  methods: {
    onUpdate: function(event) {
      this.$store.dispatch("days/update", {
        date: this.day.date,
        meal: this.meal,
        value: event
      });
    }
  },
  props: ["label", "day", "meal"]
};
</script>
