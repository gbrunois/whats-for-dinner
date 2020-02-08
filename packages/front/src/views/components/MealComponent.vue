<template>
  <v-textarea
    @change="onChange($event)"
    @input="onUpdate($event)"
    @
    v-model="day[meal]"
    filled
    :label="label"
    no-resize
    :disabled="disabled"
  ></v-textarea>
</template>

<script>
export default {
  name: 'meal',
  methods: {
    onUpdate(event) {
      // defer
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.updateStore(event)
      }, 500)
    },
    onChange(event) {
      this.updateStore(event)
    },
    destroyed() {
      this.timer = undefined
    },
    updateStore(event) {
      this.$store.dispatch('days/update', {
        date: this.day.date,
        meal: this.meal,
        value: event,
      })
    },
  },
  props: ['label', 'day', 'meal', 'disabled'],
}
</script>
<style>
.v-input {
  flex-direction: column;
}
.v-input .v-input__slot {
  flex: 1 1 auto;
}
</style>
