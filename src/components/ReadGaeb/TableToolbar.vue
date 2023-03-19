<template>
  <v-toolbar flat>
    <v-file-input
      :value="value"
      placeholder="Durchsuchen..."
      outlined
      dense
      hide-details="auto"
      @change="updateValue"
    />
    <v-spacer />
    <BaseButton
      class="mr-3"
      :disabled="!value"
      :loading="calculating"
      @click="$emit('ava-2-ava')"
    >
      Preise kalkulieren
      <v-icon right>
        mdi-pencil
      </v-icon>
    </BaseButton>
    <BaseButton
      class="mr-3"
      :disabled="!value"
      @click="$emit('open-converter')"
    >
      Exportieren
      <v-icon right>
        mdi-export
      </v-icon>
    </BaseButton>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    value: {
      type: File,
      default: () => {
        null;
      },
    },
    calculating: {
      type: Boolean,
    },
  },
  methods: {
    updateValue(event: boolean) {
      this.$emit("input", event);
      this.$emit("gaeb-2-ava");
    },
  },
});
</script>
