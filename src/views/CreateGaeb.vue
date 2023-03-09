<template>
  <div class="d-flex">
    <v-col>
      <canvas id="viewer" />
      <v-btn @click="clearSelection">
        Reset
      </v-btn>
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

import { State, Viewer, ViewType } from "@xbim/viewer";
import { mapActions } from "vuex";
var viewer: Viewer;
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
  mounted() {
    this.initViewer();
  },
  methods: {
    ...mapActions("notification", ["add"]),

    initViewer() {
      viewer = new Viewer("viewer");
      const sheet = document.getElementById("sheet");
      const check = Viewer.check();

      if (check.noErrors) {
        //Load
        viewer.load("FourWallsDoorWindowsRoof.wexbim");
        //Add Actions
        this.initViewerActions();
        //Set up Viewer
        viewer.canvas.height = sheet?.offsetHeight as number;
        viewer.canvas.width = (sheet?.offsetWidth as number) / 2;
        //Start viewer
        viewer.start();
      } else {
        const notification = {
          type: "error",
          message: "Die Viewer konnte nicht geladen werden.",
        };
        this.add(notification);
      }
    },

    initViewerActions() {
      viewer.on("loaded", () => {
        viewer.show(ViewType.DEFAULT);
      });

      viewer.on("pick", (args) => {
        if (args == null || args.id == null) return;

        this.toggleListElement(args.id);
        this.highlightModelElement(args.id);
      });
    },

    highlightModelElement(id: number) {
      if (viewer.getState(id) === 253) {
        viewer.setState(State.UNDEFINED, [id]);
      } else {
        viewer.setState(State.HIGHLIGHTED, [id]);
      }
    },

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
    clearSelection() {
      viewer.clearHighlighting();
      this.selectedItems = [];
    },
  },
});
</script>
