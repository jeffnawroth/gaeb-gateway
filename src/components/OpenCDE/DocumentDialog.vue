<template>
  <BaseDialog
    :value="value"
    card-title="Dokument erstellen"
    @input="updateValue"
    @click-cancel="closeDialog"
  >
    <template #card-text>
      <v-text-field
        v-model="document.name"
        outlined
        label="Name"
      />
      <v-textarea
        v-model="document.description"
        outlined
        label="Beschreibung"
      />
      <v-file-input
        v-model="file"
        outlined
        label="Durchsuchen..."
      />
    </template>
    <template #card-actions>
      <BaseButton
        large
        @click="closeDialog"
      >
        Abbrechen
      </BaseButton>
      <BaseButton
        large
        @click="saveDocument"
      >
        Speichern
      </BaseButton>
    </template>
  </BaseDialog>
</template>

<script lang="ts">
import { uploadDocument } from "@/helpers/CDEHelper";
import { DocumentPost } from "@/openCDE API";
import Vue from "vue";
export default Vue.extend({
  props: {
    value: {
      type: Boolean,
    },
  },
  data: () => ({
    document: {
      name: "",
      description: "",
    } as DocumentPost,
    file: null,
  }),
  methods: {
    updateValue(event: boolean) {
      this.$emit("input", event);
    },
    async saveDocument() {
      const documentGet = await uploadDocument(
        "ab5fb34f-b2c4-ed11-8aae-28187834537b",
        this.document,
        this.file!
      );

      this.$emit("document-to-table", documentGet);
      this.closeDialog();
    },
    closeDialog() {
      this.updateValue(false);
      this.document = { name: "", description: "" };
      this.file = null;
    },
  },
});
</script>
