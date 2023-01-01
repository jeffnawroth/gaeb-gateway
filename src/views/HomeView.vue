<template>
  <v-row>
    <v-col class="d-flex justify-center">
      <h1 v-if="!loggedIn">
        Welcome to the App!
      </h1>
      <h1 v-else>
        Welcome {{ user.firstName }}
      </h1>
    </v-col>
    <v-col
      class="d-flex justify-center"
      cols="12"
    >
      <h2 v-if="!loggedIn">
        To use this app you'll need to
        <router-link :to="{ name: 'login-view' }">
          Login
        </router-link> or
        <router-link :to="{ name: 'register-view' }">
          Register
        </router-link>
      </h2>
      <v-btn
        v-else
        @click="logout"
      >
        Logout
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import { authComputed } from "@/store/helpers";
import { mapState } from "vuex";
export default Vue.extend({
  computed: {
    ...mapState("user", ["user"]),
    ...authComputed,
  },
  methods: {
    logout() {
      this.$store.dispatch("user/logout");
    },
  },
});
</script>
