<template>
  <v-form>
    <v-container>
    {{ day }}:
      <div>Midday: <v-text-field></v-text-field></div>
      <div>Evening: <v-text-field></v-text-field></div>
    </v-container>
  </v-form>
</template>

<script>
export default {
  name: "day",
  props: ["day"]
};
</script>
