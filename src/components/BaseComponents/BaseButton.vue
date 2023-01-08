<template>
  <!-- This v-tooltip component will only be displayed if the showTooltip prop is true -->
  <v-tooltip
    v-if="showTooltip"
    :top="top"
    :bottom="bottom"
    :left="left"
    :right="right"
  >
    <template #activator="{ attrs, on }">
      <v-btn
        v-bind="{ ...attrs, ...$attrs }"
        v-on="{ ...on, ...$listeners }"
      >
        <!-- The default slot will be used to render the content of the button -->
        <slot />
      </v-btn>
    </template>
    <!-- The tooltipContent slot will be used to render the content of the tooltip when it is displayed -->
    <slot name="tooltipContent" />
  </v-tooltip>
  <!-- This v-btn component will be displayed if the showTooltip prop is false -->
  <v-btn
    v-else
    v-bind="$attrs"
    v-on="$listeners"
  >
    <!-- The default slot will be used to render the content of the button -->
    <slot />
  </v-btn>
</template>

<script>
export default {
  components: {},
  inheritAttrs: false,
  props: {
    showTooltip: {
      type: Boolean,
      default: false,
    },
    top: {
      type: Boolean,
      default: false,
    },
    bottom: {
      type: Boolean,
      default: false,
    },
    left: {
      type: Boolean,
      default: false,
    },
    right: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
