<template>
  <v-data-table
    :headers="headers"
    :items="items"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { getAllProjects } from "@/helpers/OpenCDEHelper";
import { ProjectGet } from "@/openCDE API";
import { getAccessTokenOpenCDE } from "@/helpers/DanglIdentity";
export default Vue.extend({
  data: () => ({
    headers: [
      {
        text: "Name",
        value: "name",
      },
      {
        text: "Beschreibung",
        value: "description",
      },
    ],
    items: [] as ProjectGet[] | undefined | null,
  }),

  async created() {
    await getAccessTokenOpenCDE();
    this.items = (await getAllProjects()).data.data;
  },
});
</script>
