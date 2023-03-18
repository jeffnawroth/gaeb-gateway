<template>
  <div>
    <v-data-table
      :headers="projectsTableHeaders"
      :items="filteredProjects"
      :search="search"
      class="pa-2 cursor-pointer"
      @click:row="openProject"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Projekte</v-toolbar-title>
          <v-spacer />
          <v-text-field
            v-model="search"
            outlined
            hide-details="auto"
            dense
            placeholder="Suche"
          />
          <v-spacer />
          <BaseButton @click="openProjectDialog">
            Projekt erstellen
          </BaseButton>
        </v-toolbar>
      </template>
    </v-data-table>

    <CreateProjectDialog
      v-model="showProjectDialog"
      @project-to-table="projectToTable"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getAllProjects } from "@/helpers/CDEHelper";
import { ProjectGet } from "@/openCDE API";
import { getAccessTokenOpenCDE } from "@/helpers/DanglIdentity";
import CreateProjectDialog from "@/components/OpenCDE/CreateProjectDialog.vue";
export default Vue.extend({
  components: {
    CreateProjectDialog,
  },
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
    projects: [] as ProjectGet[],
    showProjectDialog: false,
    search: "",
  }),

  computed: {
    filteredProjects() {
      return this.projects.filter((project) => {
        return project.id.endsWith("-28187834537b");
      });
    },
  },

  async mounted() {
    this.projects = (await getAllProjects()) ?? [];
  },

  methods: {
    openProjectDialog() {
      this.showProjectDialog = true;
    },
    projectToTable(project: ProjectGet) {
      this.projects.push(project);
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
