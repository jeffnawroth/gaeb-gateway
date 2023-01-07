<template>
  <div>
    <v-app-bar
      app
      elevation="0"
      clipped-left
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title
        class="pointer"
        @click="$router.push({ name: 'home' })"
      >
        GAEB Gateway
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        icon
        @click="TOGGLE_DARK_MODE"
      >
        <v-icon> mdi-theme-light-dark </v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      clipped
      app
    >
      <v-list nav>
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
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapMutations } from "vuex";
export default Vue.extend({
  data: () => ({
    drawer: true,
    items: [
      {
        title: "Benutzerverwaltung",
        icon: "mdi-account-group",
        route: "/users",
      },
    ],
  }),
  methods: mapMutations("authentication", ["TOGGLE_DARK_MODE"]),
});
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
