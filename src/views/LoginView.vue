<template>
  <v-row>
    <v-col class="d-flex justify-center">
      <v-card width="500">
        <ValidationObserver v-slot="{ invalid }">
          <v-card-title>Login</v-card-title>
          <v-card-text>
            <ValidationProvider
              v-slot="{ errors }"
              rules="required|email"
            >
              <v-text-field
                v-model="email"
                label="E-Mail"
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
            <router-link :to="{ name: 'register-view' }">
              Du hast noch kein Konto? Registrieren.
            </router-link>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              large
              :disabled="invalid"
              @click="loginUser"
            >
              Login
            </v-btn>
          </v-card-actions>
        </ValidationObserver>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { mapActions } from "vuex";
export default Vue.extend({
  components: { ValidationObserver, ValidationProvider },
  data: () => ({
    email: "",
    password: "",
    showPassword: false,
  }),
  methods: {
    ...mapActions("user", ["login"]),
    async loginUser() {
      await this.login({
        email: this.email,
        password: this.password,
      });
    },
  },
});
</script>
