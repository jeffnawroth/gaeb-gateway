<template>
  <div>
    <v-data-table
      :headers="documentsTableHeaders"
      :items="documents"
      :search="search"
      class="pa-2"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Dokumente</v-toolbar-title>
          <!--  <BaseButton
            class="mx-4"
            @click="backToProjects"
          >
            Zurück
          </BaseButton> -->
          <v-spacer />
          <v-text-field
            v-model="search"
            outlined
            hide-details="auto"
            dense
            placeholder="Suche"
          />
          <v-spacer />
          <BaseButton @click="openDocumentDialog">
            Dokument Hochladen
          </BaseButton>
        </v-toolbar>
      </template>

      <template #[`item.fileSizeInBytes`]="{ item }">
        {{ item.fileSizeInBytes + " B" }}
      </template>

      <template #[`item.createdAtUtc`]="{ item }">
        {{ convertToLocale(item.createdAtUtc) }}
      </template>
      <template #[`item.actions`]="{ item }">
        <v-icon
          class="mr-2"
          @click="downloadFile(item)"
        >
          mdi-download
        </v-icon>
        <v-icon @click="toggleDeleteDocumentDialog(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <DocumentDialog
      v-model="showDocumentDialog"
      @document-to-table="addDocumentToTable"
    />
    <BaseDeleteDialog
      v-model="showDeleteDocumentDialog"
      item-to-delete-title="Dokument"
      :item-to-delete-text="`das Dokument '${documentToDelete.name}'`"
      @click-cancel="toggleDeleteDocumentDialog"
      @click-delete="deleteDocumentConfirm"
    />
  </div>
</template>

<script lang="ts">
import {
  deleteDocument,
  downloadDocument,
  getAllDocumentsForProject,
} from "@/helpers/CDEHelper";
import { DocumentGet } from "@/openCDE API";
import Vue from "vue";
import DocumentDialog from "@/components/OpenCDE/DocumentDialog.vue";
export default Vue.extend({
  components: { DocumentDialog },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    documentsTableHeaders: [
      {
        text: "Name",
        value: "name",
      },
      {
        text: "Beschreibung",
        value: "description",
      },
      {
        text: "Datei",
        value: "fileName",
      },
      {
        text: "Größe",
        value: "fileSizeInBytes",
      },
      {
        text: "Erstellt am",
        value: "createdAtUtc",
      },
      { value: "actions", sortable: false, width: "10%" },
    ],
    search: "",
    documents: [] as DocumentGet[],
    showDocumentDialog: false,
    showDeleteDocumentDialog: false,
    documentToDelete: {} as DocumentGet,
  }),
  async mounted() {
    this.documents = (await getAllDocumentsForProject(this.id)).data.data ?? [];
  },
  methods: {
    openDocumentDialog() {
      this.showDocumentDialog = true;
    },

    toggleDeleteDocumentDialog(document: DocumentGet) {
      this.showDeleteDocumentDialog = !this.showDeleteDocumentDialog;
      if (this.showDeleteDocumentDialog) {
        this.documentToDelete = document;
      }
    },

    addDocumentToTable(document: DocumentGet) {
      this.documents.push(document);
    },

    convertToLocale(utc: string) {
      const date = new Date(utc);
      return date.toLocaleString();
    },

    async deleteDocumentConfirm() {
      await deleteDocument(this.id, this.documentToDelete.id);

      const index = this.documents.indexOf(this.documentToDelete);
      this.documents.splice(index, 1);

      this.showDeleteDocumentDialog = false;
    },

    async downloadFile(document: DocumentGet) {
      await downloadDocument(this.id, document.id, document.fileName!);
    },
    backToProjects() {
      this.$router.go(-1);
    },
  },
});
</script>
