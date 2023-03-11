<template>
  <v-card
    style="max-height: 69vh"
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
          @click="$emit('highlight-model-element', item.id)"
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
      {
        id: 65146,
        name: "Door",
        shortText: "Holztür; 2000x700mm; Rechtsöffnend",
        quantity: 1,
        unit: "Stck",
      },
      {
        id: 4811,
        name: "Wall",
        shortText: "Betonwand",
        quantity: 20,
        unit: "m²",
      },
      {
        id: 72190,
        name: "Window",
        shortText: "Doppeltes Fenster; 150x150mm; Weiß hochglanz",
        quantity: 1,
        unit: "Stck",
      },
      {
        id: 71482,
        name: "Roof",
        shortText: "Flachdach; 10000x6000mm",
        quantity: 40,
        unit: "m²",
      },
      {
        id: 65246,
        name: "Door",
        shortText: "Holztür; 2000x700mm; Rechtsöffnend",
        quantity: 1,
        unit: "Stck",
      },
      {
        id: 4821,
        name: "Wall",
        shortText: "Betonwand",
        quantity: 20,
        unit: "m²",
      },
      {
        id: 72920,
        name: "Window",
        shortText: "Doppeltes Fenster; 150x150mm; Weiß hochglanz",
        quantity: 1,
        unit: "Stck",
      },
      {
        id: 74282,
        name: "Roof",
        shortText: "Flachdach; 10000x6000mm",
        quantity: 40,
        unit: "m²",
      },
      {
        id: 65446,
        name: "Door",
        shortText: "Holztür; 2000x700mm; Rechtsöffnend",
        quantity: 1,
        unit: "Stck",
      },
      {
        id: 4841,
        name: "Wall",
        shortText: "Betonwand",
        quantity: 20,
        unit: "m²",
      },
      {
        id: 72940,
        name: "Window",
        shortText: "Doppeltes Fenster; 150x150mm; Weiß hochglanz",
        quantity: 1,
        unit: "Stck",
      },
      {
        id: 74842,
        name: "Roof",
        shortText: "Flachdach; 10000x6000mm",
        quantity: 40,
        unit: "m²",
      },
      {
        id: 65546,
        name: "Door",
        shortText: "Holztür; 2000x700mm; Rechtsöffnend",
        quantity: 1,
        unit: "Stck",
      },
      {
        id: 4861,
        name: "Wall",
        shortText: "Betonwand",
        quantity: 20,
        unit: "m²",
      },
      {
        id: 72790,
        name: "Window",
        shortText: "Doppeltes Fenster; 150x150mm; Weiß hochglanz",
        quantity: 1,
        unit: "Stck",
      },
      {
        id: 78482,
        name: "Roof",
        shortText: "Flachdach; 10000x6000mm",
        quantity: 40,
        unit: "m²",
      },
    ] as any,
  }),
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
  },
});
</script>
