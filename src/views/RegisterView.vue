<template>
  <v-row>
    <v-col class="d-flex justify-center">
      <v-card width="500">
        <ValidationObserver v-slot="{ invalid }">
          <v-card-title>Registrieren</v-card-title>
          <v-card-text>
            <ValidationProvider
              v-slot="{ errors }"
              vid="firstName"
              rules="required"
            >
              <v-text-field
                v-model="firstName"
                label="Vorname"
                :error-messages="errors"
                outlined
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              vid="lastName"
              rules="required"
            >
              <v-text-field
                v-model="lastName"
                label="Nachname"
                :error-messages="errors"
                outlined
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              vid="email"
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
              vid="password"
              rules="required|min:6|requireDigit|requireLowercase|requireNonAlphanumeric"
            >
              <v-text-field
                v-model="password"
                label="Passwort"
                :error-messages="errors"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                outlined
                counter
                @click:append="showPassword = !showPassword"
              />

              <div class="mb-6">
                <ul>
                  <li
                    v-for="option in passwordOptions"
                    :key="option"
                  >
                    {{ option }}
                  </li>
                </ul>
              </div>
            </ValidationProvider>

            <ValidationProvider
              v-slot="{ errors }"
              vid="passwordConfirm"
              rules="required|confirmed:password"
            >
              <v-text-field
                v-model="passwordConfirm"
                label="Passwort bestätigen"
                :error-messages="errors"
                :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPasswordConfirm ? 'text' : 'password'"
                outlined
                counter
                @click:append="showPasswordConfirm = !showPasswordConfirm"
              />
            </ValidationProvider>
            <router-link :to="{ name: 'login-view' }">
              Du hast bereits ein Konto? Anmelden.
            </router-link>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              large
              :disabled="invalid"
              @click="registerUser"
            >
              Registrieren
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
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    showPassword: false,
    showPasswordConfirm: false,
    passwordOptions: [
      "mindestens 6 Zeichen",
      "mindestens eine Ziffer ('0'-'9')",
      "mindestens einen Kleinbuchstaben ('a'-'z')",
      "mindestens ein nicht alphanumerisches Zeichen",
      "mindestens einen Großbuchstaben ('A'-'Z')",
    ],
  }),
  methods: {
    ...mapActions("user", ["register"]),
    //Register the user
    async registerUser() {
      await this.register({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
      });
    },
  },
});
</script>
