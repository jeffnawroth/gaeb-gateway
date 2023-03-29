<template>
  <div>
    <v-data-table
      :headers="projectsTableHeaders"
      :items="getFilteredProjects"
      :search="search"
      class="pa-2 cursor-pointer"
      :loading="loading"
      @click:row="openProject"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Projekte</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Suche"
            single-line
            hide-details
          />
          <v-spacer />
          <v-spacer />
          <v-spacer />
          <BaseButton @click="openProjectDialog">
            Projekt erstellen
          </BaseButton>
        </v-toolbar>
      </template>
    </v-data-table>

    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ProjectGet } from "@/openCDE API";
import { mapActions, mapGetters } from "vuex";
export default Vue.extend({
  data: () => ({
    projectsTableHeaders: [
      {
        text: "Name",
        value: "name",
      },
      {
        text: "Beschreibung",
        value: "description",
      },
    ],
    search: "",
    loading: true,
  }),

  computed: {
    ...mapGetters("projects", ["getFilteredProjects"]),
  },

  async mounted() {
    await this.getAllProjects();
    this.loading = false;
  },

  methods: {
    ...mapActions("projects", ["getAllProjects"]),
    openProjectDialog() {
      this.$router.push({ name: "create-project" });
    },
    openProject(project: ProjectGet) {
      this.$router.push({ name: "documents", params: { id: project.id } });
    },
  },
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
