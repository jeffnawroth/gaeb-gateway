<template>
  <v-app-bar
    app
    color="white"
    flat
  >
    <v-container class="py-0 fill-height">
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

      <!--  <v-btn
          v-for="link in links"
          :key="link"
          text
        >
          {{ link }}
        </v-btn> -->

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
      <!-- <v-responsive max-width="260">
          <v-text-field
            dense
            flat
            hide-details
            rounded
            solo-inverted
          />
        </v-responsive> -->
    </v-container>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import { authComputed } from "@/store/helpers";

import { mapActions, mapMutations, mapState } from "vuex";

export default Vue.extend({
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
