<template>
  <v-text-field @input="onUpdate($event)"></v-text-field>
</template>

<script>
export default {
  name: "meal",
  methods: {
    onUpdate: function(event) {
      this.$store.dispatch("update", {
        day: this.day,
        type: this.type,
        value: event
      });
    }
  },
  props: ["day", "type"]
};
</script>
