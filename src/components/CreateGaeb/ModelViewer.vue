<template>
  <canvas id="viewer" />
</template>

<script lang="ts">
import Vue from "vue";
import { State, Viewer, ViewType } from "@xbim/viewer";
import { mapActions } from "vuex";
import { bus } from "@/main";
var viewer: Viewer;

export default Vue.extend({
  mounted() {
    this.initViewer();
    window.addEventListener("resize", this.setViewerSize);
    this.emitBus();
  },
  destroyed() {
    window.removeEventListener("resize", this.setViewerSize);
  },
  methods: {
    ...mapActions("notification", ["add"]),
    emitBus() {
      bus.$on("zoom-to", (id: number) => viewer.zoomTo(id));
      bus.$on("highlight-model-element", (id: number) =>
        this.highlightModelElement(id)
      );
      bus.$on("clear-selection", () => viewer.clearHighlighting());
    },
    setViewerSize() {
      const sheet = document.getElementById("sheet");

      viewer.canvas.height = window.innerHeight * 0.6;
      viewer.canvas.width = (sheet?.offsetWidth as number) / 2;
    },
    initViewer() {
      viewer = new Viewer("viewer");
      const check = Viewer.check();

      if (check.noErrors) {
        //Load
        viewer.load("FourWallsDoorWindowsRoof.wexbim");
        //Add Actions
        this.initViewerActions();
        //Set up Viewer
        this.setViewerSize();
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

        bus.$emit("toggle-list-element", args.id);
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
  },
});
</script>
