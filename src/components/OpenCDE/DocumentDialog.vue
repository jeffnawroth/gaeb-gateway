<template>
  <div>
    <ValidationObserver
      ref="observer"
      v-slot="{ invalid, dirty }"
    >
      <BaseDialog
        v-model="showDocumentDialog"
        card-title="Dokument erstellen"
        @click-cancel="closeDialog(dirty)"
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
            @click="closeDialog(dirty)"
          >
            Abbrechen
          </BaseButton>
          <BaseButton
            :disabled="invalid"
            :loading="loading"
            large
            color="success"
            @click="saveDocument"
          >
            Speichern
          </BaseButton>
        </template>
      </BaseDialog>
    </ValidationObserver>
    <BaseDiscardDialog
      v-model="showDiscardDialog"
      @click-discard="close()"
      @click-cancel="toggleDialogs()"
    />
  </div>
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
    showDiscardDialog: false,
    loading: false,
  }),
  methods: {
    ...mapActions("documents", ["uploadDocument"]),

    //Saves the document by calling the uploadDocument action with the document object
    async saveDocument() {
      this.loading = true;
      await this.uploadDocument({
        projectId: this.$route.params.id,
        documentPost: this.document,
        file: this.file,
      });
      this.loading = false;

      this.closeDialog();
    },

    // Closes the dialog and optionally toggles the discard dialog based on the dirty flag
    closeDialog(dirty?: boolean) {
      if (dirty) {
        this.toggleDialogs();
      } else {
        this.close();
      }
    },

    // Toggles the documenmt and discard dialogs
    toggleDialogs() {
      this.showDocumentDialog = !this.showDocumentDialog;
      this.showDiscardDialog = !this.showDiscardDialog;
    },

    // Closes the document dialog, sets a timeout to wait for the dialog to close completely, and navigates to the documents route
    close() {
      this.showDocumentDialog = false;
      setTimeout(() => {
        this.$router.push({ name: "documents" });
      }, 100);
    },
  },
});
</script>
