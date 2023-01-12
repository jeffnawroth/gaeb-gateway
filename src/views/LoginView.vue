<template>
  <v-container
    fill-height
    fluid
  >
    <v-row>
      <v-col class="d-flex justify-center">
        <v-card width="500">
          <ValidationObserver
            ref="observer"
            v-slot="{ invalid }"
            @keyup.enter="loginUser"
          >
            <v-card-title>Anmelden</v-card-title>
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
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <BaseButton
                large
                :disabled="invalid"
                @click="loginUser"
              >
                Anmelden
              </BaseButton>
            </v-card-actions>
          </ValidationObserver>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
    ...mapActions("authentication", ["login"]),
    //Logging in the user
    async loginUser() {
      const valid = await (
        this.$refs.observer as InstanceType<typeof ValidationObserver>
      ).validate();

      if (valid) {
        await this.login({
          email: this.email,
          password: this.password,
        });
      }
    },
  },
});
</script>
