<template>
  <v-dialog
    :value="value"
    max-width="500"
    @click:outside="$emit('click-cancel')"
    @keydown.esc="$emit('click-cancel')"
    @input="updateValue"
  >
    <v-card>
      <v-card-title> <slot name="card-title" /> </v-card-title>
      <v-card-text>
        <slot name="card-text" />
      </v-card-text>
      <v-card-actions class="justify-space-around">
        <slot name="card-actions" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    updateValue(event: boolean) {
      this.$emit("input", event);
    },
  },
});
</script>
