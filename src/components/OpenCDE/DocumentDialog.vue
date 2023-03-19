<template>
  <ValidationObserver
    ref="observer"
    v-slot="{ invalid }"
  >
    <BaseDialog
      v-model="showDocumentDialog"
      card-title="Dokument erstellen"
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
  data: () => ({
    document: {
      name: "",
      description: "",
    } as DocumentPost,
    file: null,
    showDocumentDialog: true,
  }),
  methods: {
    ...mapActions("documents", ["uploadDocument"]),
    async saveDocument() {
      await this.uploadDocument({
        projectId: this.$route.params.id,
        documentPost: this.document,
        file: this.file,
      });

      this.closeDialog();
    },
    closeDialog() {
      this.$router.push({ name: "documents" });
    },
  },
});
</script>
