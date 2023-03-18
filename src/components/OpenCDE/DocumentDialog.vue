<template>
  <ValidationObserver
    ref="observer"
    v-slot="{ invalid }"
  >
    <BaseDialog
      :value="value"
      card-title="Dokument erstellen"
      @input="updateValue"
      @click-cancel="closeDialog"
    >
      <template #card-text>
        <ValidationProvider
          v-slot="{ errors }"
          vid="name"
          rules="required"
        >
          <v-text-field
            v-model="document.name"
            outlined
            :error-messages="errors"
            label="Name"
          />
        </ValidationProvider>
        <v-textarea
          v-model="document.description"
          outlined
          label="Beschreibung"
        />
        <ValidationProvider
          v-slot="{ errors }"
          vid="file"
          rules="required"
        >
          <v-file-input
            v-model="file"
            outlined
            label="Durchsuchen..."
            :error-messages="errors"
          />
        </ValidationProvider>
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
          :disabled="invalid"
          @click="saveDocument"
        >
          Speichern
        </BaseButton>
      </template>
    </BaseDialog>
  </ValidationObserver>
</template>

<script lang="ts">
import { uploadDocument } from "@/helpers/CDEHelper";
import { DocumentPost } from "@/openCDE API";
import Vue from "vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default Vue.extend({
  components: { ValidationObserver, ValidationProvider },
  props: {
    value: {
      type: Boolean,
    },
    projectId: {
      type: String,
      required: true,
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
        this.projectId,
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
      requestAnimationFrame(() => {
        (
          this.$refs.observer as InstanceType<typeof ValidationObserver>
        ).reset();
      });
    },
  },
});
</script>
