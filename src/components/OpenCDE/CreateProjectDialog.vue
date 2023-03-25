<template>
  <div>
    <ValidationObserver
      ref="observer"
      v-slot="{ invalid, dirty }"
    >
      <BaseDialog
        v-model="showProjectDialog"
        card-title="Projekt erstellen"
        @click-cancel="closeDialog(dirty)"
      >
        <template #card-text>
          <ValidationProvider
            v-slot="{ errors }"
            vid="name"
            rules="required"
          >
            <v-text-field
              v-model="project.name"
              outlined
              label="Name"
              :error-messages="errors"
            />
          </ValidationProvider>
          <v-textarea
            v-model="project.description"
            outlined
            label="Beschreibung"
          />
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
            @click="saveProject"
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
import { ProjectPost } from "@/openCDE API";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import Vue from "vue";
import { mapActions } from "vuex";
export default Vue.extend({
  components: { ValidationObserver, ValidationProvider },
  data: () => ({
    project: {
      name: "",
      description: "",
    } as ProjectPost,
    showProjectDialog: true,
    loading: false,
    showDiscardDialog: false,
  }),

  methods: {
    ...mapActions("projects", ["createProject"]),

    //Saves the project by calling the createProject action with the project object,
    async saveProject() {
      this.loading = true;
      await this.createProject(this.project);
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
    // Toggles the project and discard dialogs
    toggleDialogs() {
      this.showProjectDialog = !this.showProjectDialog;
      this.showDiscardDialog = !this.showDiscardDialog;
    },
    // Closes the project dialog, sets a timeout to wait for the dialog to close completely, and navigates to the projects route
    close() {
      this.showProjectDialog = false;
      setTimeout(() => {
        this.$router.push({ name: "projects" });
      }, 100);
    },
  },
});
</script>
