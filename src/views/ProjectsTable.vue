<template>
  <div>
    <v-data-table
      :headers="projectsTableHeaders"
      :items="getFilteredProjects"
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
  }),

  computed: {
    ...mapGetters("projects", ["getFilteredProjects"]),
  },

  async mounted() {
    await this.getAllProjects();
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
