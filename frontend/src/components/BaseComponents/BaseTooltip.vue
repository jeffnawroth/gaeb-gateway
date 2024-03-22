<template>
  <v-tooltip v-bind="$attrs">
    <template #activator="{ on, attrs }">
      <slot v-bind="{ on, attrs }" />
    </template>
    <slot />
  </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  inheritAttrs: false,
});
</script>
