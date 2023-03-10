<template>
  <div class="d-flex">
    <v-col>
      <ModelViewer
        ref="modelViewer"
        @toggle-list-element="toggleListElement"
        @reset-selected-items="resetSelectedItems"
      />
    </v-col>
    <v-col class="d-flex flex-column">
      <ListOfPositions
        ref="listOfPositions"
        @highlight-model-element="highlightModelElement"
      />
      <v-spacer />
      <div class="d-flex justify-end">
        <v-btn width="350">
          Leistungsverzeichnis erstellen
        </v-btn>
      </div>
    </v-col>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import ModelViewer from "@/components/CreateGaeb/ModelViewer.vue";
import ListOfPositions from "@/components/CreateGaeb/ListOfPositions.vue";
export default Vue.extend({
  components: { ModelViewer, ListOfPositions },
  data: () => ({}),
  methods: {
    highlightModelElement(id: number) {
      (
        this.$refs.modelViewer as InstanceType<typeof ModelViewer>
      ).highlightModelElement(id);
    },
    toggleListElement(id: number) {
      (
        this.$refs.listOfPositions as InstanceType<typeof ListOfPositions>
      ).toggleListElement(id);
    },
    resetSelectedItems() {
      (
        this.$refs.listOfPositions as InstanceType<typeof ListOfPositions>
      ).selectedItems = [];
    },
  },
});
</script>
