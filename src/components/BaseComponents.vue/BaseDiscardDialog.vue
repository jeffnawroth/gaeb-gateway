<template>
  <BaseDialog
    :value="value"
    @click-cancel="$emit('click-cancel')"
  >
    <template #card-title>
      Änderungen verwerfen?
    </template>
    <template #card-text>
      Sind Sie sicher, dass Sie Ihre Änderungen verwerfen möchten?
    </template>
    <template #card-actions>
      <BaseButton @click="$emit('click-cancel')">
        Abbrechen
      </BaseButton>
      <BaseButton
        class="error"
        @click="$emit('click-discard')"
      >
        Verwerfen
      </BaseButton>
    </template>
  </BaseDialog>
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
});
</script>
