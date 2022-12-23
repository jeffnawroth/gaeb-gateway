<template>
  <ValidationObserver v-slot="{ invalid }">
    <v-container
      fill-height
      fluid
      class="justify-center"
    >
      <v-card width="500">
        <v-card-title>Registrieren</v-card-title>
        <v-card-text>
          <ValidationProvider
            v-slot="{ errors }"
            rules="required"
          >
            <v-text-field
              v-model="username"
              label="Benutzername"
              :error-messages="errors"
              outlined
            />
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            rules="required"
          >
            <v-text-field
              v-model="password"
              label="Passwort"
              :error-messages="errors"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              outlined
              @click:append="showPassword = !showPassword"
            />
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            rules="required"
          >
            <v-text-field
              v-model="password2"
              label="Passwort bestätigen"
              :error-messages="errors"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              outlined
              @click:append="showPassword = !showPassword"
            />
          </ValidationProvider>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            large
            :disabled="invalid"
            @click="register"
          >
            Registrieren
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </ValidationObserver>
</template>

<script lang="ts">
import Vue from "vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default Vue.extend({
  components: { ValidationObserver, ValidationProvider },
  data: () => ({
    username: "",
    password: "",
    password2: "",
    showPassword: false,
  }),
  methods: {
    register() {
      //TODO: Add registration
    },
  },
});
</script>
