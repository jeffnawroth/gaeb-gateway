<template>
  <BaseDialog
    :value="value"
    card-title="Projekt erstellen"
    @input="updateValue"
    @click-cancel="closeDialog"
  >
    <template #card-text>
      <v-text-field
        v-model="project.name"
        outlined
        label="Name"
      />
      <v-textarea
        v-model="project.description"
        outlined
        label="Beschreibung"
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
        @click="saveProject"
      >
        Speichern
      </BaseButton>
    </template>
  </BaseDialog>
</template>

<script lang="ts">
import { createProjectApi } from "@/helpers/CDEHelper";
import { ProjectPost } from "@/openCDE API";
import Vue from "vue";
export default Vue.extend({
  props: {
    value: {
      type: Boolean,
    },
  },
  data: () => ({
    project: {
      name: "",
      description: "",
    } as ProjectPost,
  }),
  methods: {
    updateValue(event: boolean) {
      this.$emit("input", event);
    },
    async saveProject() {
      const projectGet = (await createProjectApi(this.project)).data;
      this.$emit("project-to-table", projectGet);
      this.closeDialog();
    },
    closeDialog() {
      this.updateValue(false);
      this.project = {};
    },
  },
});
</script>
