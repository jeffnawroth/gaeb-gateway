<template>
  <v-tooltip left>
    <template #activator="{ on, attrs }">
      <v-btn
        icon
        :loading="downloading"
        @click="downloadFile"
      >
        <v-icon
          v-bind="attrs"
          v-on="on"
        >
          mdi-download
        </v-icon>
      </v-btn>
    </template>
    <span>Herunterladen</span>
  </v-tooltip>
</template>

<script lang="ts">
import { downloadDocument } from "@/helpers/CDEHelper";
import { DocumentGet } from "@/openCDE API";
import Vue from "vue";
import { PropType } from "vue/types/v3-component-props";
export default Vue.extend({
  props: {
    document: {
      type: Object as PropType<DocumentGet>,
      required: true,
    },
  },
  data: () => ({
    downloading: false,
  }),
  methods: {
    async downloadFile() {
      this.downloading = true;
      await downloadDocument(
        this.$route.params.id,
        this.document.id,
        this.document.fileName!
      );
      this.downloading = false;
    },
  },
});
</script>
