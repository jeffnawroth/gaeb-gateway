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

      <v-progress-linear
        :active="loadingGlobal"
        :indeterminate="loadingGlobal"
        absolute
        bottom
      />
      <v-spacer />

      <BaseButton
        show-tooltip
        bottom
        icon
        @click="TOGGLE_DARK_MODE"
      >
        <v-icon> mdi-theme-light-dark </v-icon>
        <template #tooltipContent>
          <span v-if="$vuetify.theme.dark">Heller Modus einschalten </span>
          <span v-else>Dunkler Modus einschalten </span>
        </template>
      </BaseButton>

      <BaseButton
        v-if="loggedIn"
        show-tooltip
        bottom
        icon
        @click="logout"
      >
        <v-icon> mdi-logout </v-icon>

        <template #tooltipContent>
          <span>Abmelden</span>
        </template>
      </BaseButton>

      <BaseButton
        v-else
        show-tooltip
        bottom
        icon
        @click="$router.push({ name: 'login' })"
      >
        <v-icon> mdi-login </v-icon>

        <template #tooltipContent>
          <span>Anmelden</span>
        </template>
      </BaseButton>
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
import { authComputed } from "@/store/helpers";
import Vue from "vue";
import { mapActions, mapMutations, mapState } from "vuex";
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
  computed: {
    ...authComputed,
    ...mapState(["loadingGlobal"]),
  },
  methods: {
    ...mapMutations("authentication", ["TOGGLE_DARK_MODE"]),
    ...mapActions("authentication", ["logout"]),
  },
});
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
