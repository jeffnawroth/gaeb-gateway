<template>
  <v-row>
    <v-col class="d-flex justify-center">
      <h1 v-if="!loggedIn">
        Willkommen bei GAEB Gateway!
      </h1>
      <h1 v-else>
        Wilkommen {{ user.firstName }}
      </h1>
    </v-col>
    <v-col
      class="d-flex justify-center"
      cols="12"
    >
      <h2 v-if="!loggedIn">
        Um diese Anwendung zu nutzen, müssen Sie sich
        <router-link :to="{ name: 'login' }">
          Anmelden
        </router-link>
      </h2>
    </v-col>
    <v-col
      class="d-flex justify-center"
      cols="12"
    >
      <p>Zur Registrierung wenden Sie sich bitte an den Administrator</p>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import { authComputed } from "@/store/helpers";
import { mapState } from "vuex";
export default Vue.extend({
  computed: {
    ...mapState("authentication", ["user"]),
    ...authComputed,
  },
  methods: {
    logout() {
      this.$store.dispatch("authentication/logout");
    },
  },
});
</script>
