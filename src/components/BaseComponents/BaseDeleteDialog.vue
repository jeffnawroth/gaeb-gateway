<template>
  <BaseDialog
    :value="value"
    @click-cancel="$emit('click-cancel')"
  >
    <template #card-title>
      Nutzer Löschen
    </template>
    <template #card-text>
      Sind Sie sicher, dass Sie den Nutzer
      <!--  {{ user.firstName + " " + user.lastName }}  -->
      löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
    </template>
    <template #card-actions>
      <BaseButton @click="$emit('click-cancel')">
        Abbrechen
      </BaseButton>

      <BaseButton
        class="error"
        @click="$emit('click-delete')"
      >
        Löschen
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
