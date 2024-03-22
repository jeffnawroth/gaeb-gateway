<template>
  <div>
    <v-data-table
      :headers="documentsTableHeaders"
      :items="documents"
      :search="search"
      :loading="loading"
      class="pa-2"
    >
      <template #top>
        <v-toolbar flat>
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <BaseButton
                v-bind="attrs"
                icon
                v-on="on"
                @click="returnToProjects"
              >
                <v-icon> mdi-arrow-left </v-icon>
              </BaseButton>
            </template>
            <span>Zurück</span>
          </v-tooltip>
          <v-toolbar-title>Dokumente</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Suche"
            single-line
            hide-details
          />
          <v-spacer />
          <v-spacer />
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
      :item-to-delete-text="`das Dokument '${documentToDelete.name}'`"
      :loading="deleting"
      item-to-delete-title="Dokument"
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
      { value: "actions", sortable: false, width: "15%" },
    ],
    search: "",
    showDeleteDocumentDialog: false,
    documentToDelete: {} as DocumentGet,
    loading: true,
    deleting: false,
  }),
  computed: {
    ...mapState("documents", ["documents"]),
  },

  async mounted() {
    await this.getAllDocumentsForProject(this.id);
    this.loading = false;
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

    returnToProjects() {
      this.$router.push({ name: "projects" });
    },

    async deleteDocumentConfirm() {
      this.deleting = true;
      await this.deleteDocument({
        projectId: this.id,
        documentId: this.documentToDelete.id,
      });
      this.deleting = false;
      this.showDeleteDocumentDialog = false;
    },
  },
});
</script>
