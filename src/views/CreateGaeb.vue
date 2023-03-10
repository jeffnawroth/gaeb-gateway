<template>
  <div class="d-flex">
    <v-col>
      <ModelViewer
        ref="modelViewer"
        @toggle-list-element="toggleListElement"
        @reset-selected-items="selectedItems = []"
      />
      <!-- <v-btn @click="clearSelection">
        Reset
      </v-btn> -->
    </v-col>
    <v-col class="d-flex flex-column">
      <v-card>
        <v-list>
          <v-list-item-group
            v-model="selectedItems"
            multiple
          >
            <v-list-item
              v-for="item in items"
              :key="item.id"
              @click="highlightModelElement(item.id)"
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

import { mapActions } from "vuex";
import ModelViewer from "@/components/CreateGaeb/ModelViewer.vue";
export default Vue.extend({
  components: { ModelViewer },
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
    ...mapActions("notification", ["add"]),

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
    highlightModelElement(id: number) {
      (
        this.$refs.modelViewer as InstanceType<typeof ModelViewer>
      ).highlightModelElement(id);
    },
  },
});
</script>
