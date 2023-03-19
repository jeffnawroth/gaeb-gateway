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
        <TableDownloadButton :document="item" />

        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <v-btn icon>
              <v-icon
                v-bind="attrs"
                @click="toggleDeleteDocumentDialog(item)"
                v-on="on"
              >
                mdi-delete
              </v-icon>
            </v-btn>
          </template>
          <span>Löschen</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <router-view />

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
import { DocumentGet } from "@/openCDE API";
import Vue from "vue";
import TableDownloadButton from "@/components/OpenCDE/TableDownloadButton.vue";
import { mapActions, mapState } from "vuex";
export default Vue.extend({
  components: { TableDownloadButton },
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
    showDeleteDocumentDialog: false,
    documentToDelete: {} as DocumentGet,
  }),
  computed: {
    ...mapState("documents", ["documents"]),
  },
  async mounted() {
    await this.getAllDocumentsForProject(this.id);
  },
  methods: {
    ...mapActions("documents", ["getAllDocumentsForProject", "deleteDocument"]),
    openDocumentDialog() {
      this.$router.push({ name: "upload-document" });
    },

    toggleDeleteDocumentDialog(document: DocumentGet) {
      this.showDeleteDocumentDialog = !this.showDeleteDocumentDialog;
      if (this.showDeleteDocumentDialog) {
        this.documentToDelete = document;
      }
    },

    convertToLocale(utc: string) {
      const date = new Date(utc);
      return date.toLocaleString();
    },

    async deleteDocumentConfirm() {
      await this.deleteDocument({
        projectId: this.id,
        documentId: this.documentToDelete.id,
      });
      this.showDeleteDocumentDialog = false;
    },
  },
});
</script>
