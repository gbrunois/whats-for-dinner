<template>
    <v-textarea @input="onUpdate($event)" v-model="day[meal]" box :label="label" no-resize></v-textarea>
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
<style>
.v-input {
  flex-direction: column;
}
.v-input .v-input__slot {
  flex: 1 1 auto;
}
</style>
