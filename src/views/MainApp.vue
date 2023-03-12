<template>
  <v-container>
    <v-row class="flex-nowrap">
      <v-col cols="3">
        <v-sheet rounded="lg">
          <v-list
            nav
            color="transparent"
          >
            <v-list-item
              v-for="item in items"
              :key="item.title"
              :to="item.route"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-sheet>
      </v-col>

      <v-col>
        <v-sheet
          id="sheet"
          min-height="70vh"
          rounded="lg"
        >
          <slot />
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data: () => ({
    //links: ["Dashboard", "Messages", "Profile", "Updates"],

    items: [
      {
        title: "Benutzerverwaltung",
        icon: "mdi-account-group",
        route: "/users",
      },
      {
        title: "Projektverwaltung",
        icon: "mdi-file-document-multiple-outline",
        route: "/projects",
      },
      {
        title: "IFC-Konvertierung",
        route: "/create-boq",
        icon: "mdi-file-document-plus-outline",
      },
      {
        title: "GAEB-Verwaltung",
        route: "/read-boq",
        icon: "mdi-file-document-edit-outline",
      },
    ],
  }),
});
</script>
