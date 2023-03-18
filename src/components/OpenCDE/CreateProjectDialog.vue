<template>
  <ValidationObserver
    ref="observer"
    v-slot="{ invalid }"
  >
    <BaseDialog
      :value="value"
      card-title="Projekt erstellen"
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
          @click="closeDialog"
        >
          Abbrechen
        </BaseButton>
        <BaseButton
          large
          :disabled="invalid"
          @click="saveProject"
        >
          Speichern
        </BaseButton>
      </template>
    </BaseDialog>
  </ValidationObserver>
</template>

<script lang="ts">
import { createProjectApi } from "@/helpers/CDEHelper";
import { ProjectPost } from "@/openCDE API";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import Vue from "vue";
export default Vue.extend({
  components: { ValidationObserver, ValidationProvider },
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
      const projectGet = await createProjectApi(this.project);
      this.$emit("project-to-table", projectGet);
      this.closeDialog();
    },
    closeDialog() {
      this.updateValue(false);
      this.project = {};
      requestAnimationFrame(() => {
        (
          this.$refs.observer as InstanceType<typeof ValidationObserver>
        ).reset();
      });
    },
  },
});
</script>
