<template>
  <v-card>
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
              {{ item.description }}
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
        description: "Lorem Ipsum",
      },
      {
        id: 481,
        name: "Wall",
        description: "Lorem Ipsum",
      },
      {
        id: 7290,
        name: "Window",
        description: "Lorem Ipsum",
      },
      {
        id: 7482,
        name: "Roof",
        description: "Lorem Ipsum",
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
  },
});
</script>
