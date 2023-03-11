<template>
  <div>
    <v-file-input
      dense
      outlined
      placeholder="Durchsuchen..."
      accept=".ifc"
    />
    <canvas id="viewer" />
    <v-btn @click="clearSelection">
      Reset
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { State, Viewer, ViewType } from "@xbim/viewer";
import { mapActions } from "vuex";
var viewer: Viewer;

export default Vue.extend({
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

        this.$emit("toggle-list-element", args.id);
        this.highlightModelElement(args.id);
      });
    },

    clearSelection() {
      viewer.clearHighlighting();
      this.$emit("reset-selected-items");
      /* this.selectedItems = []; */
    },

    highlightModelElement(id: number) {
      if (viewer.getState(id) === 253) {
        viewer.setState(State.UNDEFINED, [id]);
      } else {
        viewer.setState(State.HIGHLIGHTED, [id]);
      }
    },
  },
});
</script>
