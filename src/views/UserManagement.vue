<template>
  <div>
    <v-data-table
      :items="users"
      :headers="headers"
      sort-by="lastName"
      :search="search"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Benutzerverwaltung</v-toolbar-title>
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
          <BaseButton @click="$router.push({ name: 'create-user' })">
            Nutzer hinzufügen
          </BaseButton>
        </v-toolbar>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-icon
          class="mr-2"
          @click="$router.push({ name: 'edit-user', params: { id: item.id } })"
        >
          mdi-pencil
        </v-icon>
        <v-icon @click="removeUser(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog
      v-model="deleteDialog"
      width="500"
    >
      <v-card>
        <v-card-title>Nutzer Löschen</v-card-title>
        <v-card-text>
          Sind Sie sicher, dass Sie
          {{ user.firstName + " " + user.lastName }} löschen möchten? Diese
          Aktion kann nicht rückgängig gemacht werden.
        </v-card-text>
        <v-card-actions class="justify-space-around">
          <BaseButton @click="closeDelete">
            Abbrechen
          </BaseButton>

          <BaseButton
            class="error"
            @click="deleteConfirm"
          >
            Löschen
          </BaseButton>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <router-view />
  </div>
</template>

<script lang="ts">
import { ApplicationUser } from "@/api";
import BaseButton from "@/components/BaseComponents.vue/BaseButton.vue";
import Vue from "vue";
import { mapActions, mapState } from "vuex";
export default Vue.extend({
  components: { BaseButton },
  data: () => ({
    headers: [
      { text: "Nachname", value: "lastName" },
      { text: "Vorname", value: "firstName" },
      { text: "E-Mail", value: "email" },
      { text: "", value: "actions", sortable: false, width: "10%" },
    ],
    search: "",
    deleteDialog: false,
    user: {} as ApplicationUser,
  }),
  computed: {
    ...mapState("users", ["users"]),
  },
  created() {
    this.getUsers();
  },
  methods: {
    ...mapActions("users", ["getUsers", "deleteUser"]),
    removeUser(user: ApplicationUser) {
      this.deleteDialog = true;
      this.user = user;
    },

    async deleteConfirm() {
      await this.deleteUser(this.user);
      this.closeDelete();
    },
    closeDelete() {
      this.deleteDialog = false;
      setTimeout(() => {
        this.user = {};
      }, 200);
    },
  },
});
</script>
