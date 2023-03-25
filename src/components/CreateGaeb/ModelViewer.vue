<template>
  <canvas id="viewer" />
</template>

<script lang="ts">
import Vue from "vue";
import { Grid, NavigationCube, State, Viewer, ViewType } from "@xbim/viewer";
import { mapActions } from "vuex";
import { bus } from "@/main";
var viewer: Viewer;
var cube: NavigationCube;

export default Vue.extend({
  // Initialize the viewer, sets the viewer size, and emits the bus
  mounted() {
    this.initViewer();
    window.addEventListener("resize", this.setViewerSize);
    this.emitBus();
  },
  // Removes the window resize event listener
  destroyed() {
    window.removeEventListener("resize", this.setViewerSize);
  },

  // Removes event listeners for the bus
  beforeDestroy() {
    bus.$off("zoom-to");
    bus.$off("highlight-model-element");
    bus.$off("clear-selection");
  },
  methods: {
    ...mapActions("notification", ["add"]),

    // Emits events to the bus and sets up event listeners for the bus
    emitBus() {
      bus.$on("zoom-to", (id: number) => viewer.zoomTo(id));
      bus.$on("highlight-model-element", (id: number) =>
        this.highlightModelElement(id)
      );
      bus.$on("clear-selection", () => viewer.clearHighlighting());
    },

    // Sets the viewer size based on the height of the window and width of the
    setViewerSize() {
      const sheet = document.getElementById("sheet");

      viewer.canvas.height = window.innerHeight * 0.6;
      viewer.canvas.width = (sheet?.offsetWidth as number) / 2;
    },

    // Initializes the viewer, checks if there are any errors, and loads the 3D
    initViewer() {
      cube = new NavigationCube();
      viewer = new Viewer("viewer");
      const grid = new Grid();

      cube.ratio = 0.05;
      cube.stopped = false;
      cube.passiveAlpha = 1.0;
      cube.trueNorth = 0;

      const check = Viewer.check();

      if (check.noErrors) {
        //Load
        viewer.load("SampleHouse.wexbim");
        //Add Actions
        this.initViewerActions();
        //Set up Viewer
        this.setViewerSize();
        viewer.addPlugin(cube);
        viewer.addPlugin(grid);
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

    // Initializes viewer actions such as showing the default view, highlighting the selected model element, etc.
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

    // Highlights the selected model element by setting its state to highlighted or undefined based on its current state
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
