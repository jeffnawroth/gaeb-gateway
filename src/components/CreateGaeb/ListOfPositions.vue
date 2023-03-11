<template>
  <v-card
    style="max-height: 60vh"
    class="overflow-y-auto"
  >
    <v-list>
      <v-list-item-group
        v-model="selectedItems"
        multiple
      >
        <v-list-item
          v-for="item in items"
          :key="item.id"
          @click="highlightModelElement(item.id)"
          @dblclick="zoomTo(item.id)"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ item.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ item.shortText }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { bus } from "@/main";
import Vue from "vue";
export default Vue.extend({
  data: () => ({
    selectedItems: [] as any,
    items: [
      {
        id: 6546,
        name: "Door",
        shortText: "Holztür; 2000x700mm; Rechtsöffnend",
        quantity: 1,
        unit: "Stck",
      },
      {
        id: 481,
        name: "Wall",
        shortText: "Betonwand",
        quantity: 20,
        unit: "m²",
      },
      {
        id: 7290,
        name: "Window",
        shortText: "Doppeltes Fenster; 150x150mm; Weiß hochglanz",
        quantity: 1,
        unit: "Stck",
      },
      {
        id: 7482,
        name: "Roof",
        shortText: "Flachdach; 10000x6000mm",
        quantity: 40,
        unit: "m²",
      },
    ] as any,
  }),
  mounted() {
    bus.$on("toggle-list-element", (id: number) => this.toggleListElement(id));
    bus.$on("clear-selection", () => (this.selectedItems = []));
  },
  methods: {
    toggleListElement(modelId: number) {
      const listItemIndex = this.items.findIndex(
        (item: any) => item.id == modelId
      );
      if (listItemIndex === -1) return;

      this.selectedItems.includes(listItemIndex)
        ? this.selectedItems.splice(
            this.selectedItems.indexOf(listItemIndex),
            1
          )
        : this.selectedItems.push(listItemIndex);
    },

    getSelectedItems() {
      const selectedItems: any[] = [];
      this.selectedItems.forEach((index: number) => {
        selectedItems.push(this.items[index]);
      });

      return selectedItems;
    },
    zoomTo(id: number) {
      bus.$emit("zoom-to", id);
    },
    highlightModelElement(id: number) {
      bus.$emit("highlight-model-element", id);
    },
  },
});
</script>
