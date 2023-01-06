<template>
  <div>
    <v-data-table
      :items="users"
      :headers="headers"
    >
      <template #[`item.actions`]="{ item }">
        <v-icon
          small
          class="mr-2"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="removeUser(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog
      v-model="showDeleteDialog"
      width="500"
    >
      <v-card>
        <v-card-title>Löschen</v-card-title>
        <v-card-text>
          Sind Sie sicher, dass Sie diesen Nutzer löschen möchten? Diese Aktion
          kann nicht rückgängig gemacht werden.
        </v-card-text>
        <v-card-actions>
          <v-btn>Abbrechen</v-btn>
          <v-btn
            class="error"
            @click="deleteConfirm"
          >
            Löschen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { ApplicationUser } from "@/api";
import Vue from "vue";
import { mapActions, mapState } from "vuex";
export default Vue.extend({
  data: () => ({
    headers: [
      { text: "Nachname", value: "lastName" },
      { text: "Vorname", value: "firstName" },
      { text: "E-Mail", value: "email" },
      { text: "", value: "actions", sortable: false },
    ],
    showDeleteDialog: false,
    user: {} as ApplicationUser,
  }),
  computed: mapState("users", ["users"]),
  created() {
    this.getUsers();
  },
  methods: {
    ...mapActions("users", ["getUsers", "deleteUser"]),
    removeUser(user: ApplicationUser) {
      this.showDeleteDialog = true;
      this.user = user;
    },
    async deleteConfirm() {
      await this.deleteUser(this.user);
      this.showDeleteDialog = false;
    },
  },
});
</script>
