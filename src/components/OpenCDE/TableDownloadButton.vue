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
import { DocumentGet } from "@/openCDE API";
import Vue from "vue";
import { PropType } from "vue/types/v3-component-props";
import { mapActions } from "vuex";
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
    ...mapActions("documents", ["downloadDocument"]),

    //Downloads a document file
    async downloadFile() {
      this.downloading = true;

      await this.downloadDocument({
        projectId: this.$route.params.id,
        documentId: this.document.id,
        fileName: this.document.fileName,
      });
      this.downloading = false;
    },
  },
});
</script>
