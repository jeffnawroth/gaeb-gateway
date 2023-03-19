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
import { DocumentPost } from "@/openCDE API";
import Vue from "vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { mapActions } from "vuex";
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
    ...mapActions("documents", ["uploadDocument"]),
    updateValue(event: boolean) {
      this.$emit("input", event);
    },
    async saveDocument() {
      await this.uploadDocument({
        projectId: this.projectId,
        documentPost: this.document,
        file: this.file,
      });

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
