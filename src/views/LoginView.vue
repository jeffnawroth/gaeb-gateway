<template>
  <v-container fill-height fluid class="justify-center">
    <v-card width="500">
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <v-text-field v-model="username" label="Benutzername" outlined>
        </v-text-field>
        <v-text-field
          v-model="password"
          label="Passwort"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          outlined
          @click:append="showPassword = !showPassword"
        >
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer> <v-btn large @click="login">Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data: () => ({
    username: "",
    password: "",
    showPassword: false,
  }),
  methods: {
    login() {
      //TODO: Add login
      console.log("Login pressed");
    },
  },
});
</script>