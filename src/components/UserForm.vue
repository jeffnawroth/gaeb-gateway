<template>
  <div>
    <ValidationObserver v-slot="{ invalid, dirty }">
      <BaseDialog
        v-model="dialog"
        @click-cancel="close(dirty)"
      >
        <template #card-title>
          {{ cardTitle }}
        </template>

        <template #card-text>
          <ValidationProvider
            v-slot="{ errors }"
            vid="firstName"
            rules="required|alphabeticalName"
          >
            <v-text-field
              v-model="localUser.firstName"
              label="Vorname"
              :error-messages="errors"
              outlined
            />
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            vid="lastName"
            rules="required|alphabeticalName"
          >
            <v-text-field
              v-model="localUser.lastName"
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
              v-model="localUser.email"
              label="E-Mail"
              :error-messages="errors"
              outlined
            />
          </ValidationProvider>
          <ValidationProvider
            v-if="creationMode"
            v-slot="{ errors }"
            vid="password"
            rules="required|min:6|requireDigit|requireLowercase|requireNonAlphanumeric|requireUppercase"
          >
            <v-text-field
              v-model="localUser.passwordHash"
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
                <li :class="{ 'success--text': isMinLengthValid }">
                  mindestens 6 Zeichen
                </li>
                <li :class="{ 'success--text': hasDigit }">
                  mindestens eine Ziffer ('0'-'9')
                </li>
                <li :class="{ 'success--text': hasLowercase }">
                  mindestens einen Kleinbuchstaben ('a'-'z')
                </li>
                <li :class="{ 'success--text': hasNonAlphanumeric }">
                  mindestens ein nicht alphanumerisches Zeichen
                </li>
                <li :class="{ 'success--text': hasUppercase }">
                  mindestens einen Großbuchstaben ('A'-'Z')
                </li>
              </ul>
            </div>
          </ValidationProvider>

          <ValidationProvider
            v-if="creationMode"
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
        </template>

        <template #card-actions>
          <BaseButton
            large
            @click="
              dialog = false;
              close(dirty);
            "
          >
            Abbrechen
          </BaseButton>

          <BaseButton
            large
            color="success"
            :disabled="invalid || !dirty"
            @click="saveUser"
          >
            Speichern
          </BaseButton>
        </template>
      </BaseDialog>
    </ValidationObserver>

    <BaseDiscardDialog
      v-model="discardChangesDialog"
      @click-discard="close()"
      @click-cancel="cancelDiscardDialog"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { mapActions, mapMutations, mapState } from "vuex";
import store from "@/store";
import { ApplicationUser } from "@/api";
export default Vue.extend({
  components: { ValidationObserver, ValidationProvider },
  async beforeRouteEnter(routeTo, routeFrom, next) {
    if (routeTo.name === "edit-user") {
      try {
        await store.dispatch("users/getUser", routeTo.params.id);
      } catch (error) {
        next();
      }
    } else {
      store.commit("users/SET_CREATION_MODE", true);
    }
    next();
  },
  data: () => ({
    localUser: {
      firstName: "",
      lastName: "",
      email: "",
      passwordHash: "",
    },
    passwordConfirm: "",
    showPassword: false,
    showPasswordConfirm: false,
    dialog: true,
    discardChangesDialog: false,
  }),
  computed: {
    ...mapState("users", {
      user: (state: any) => state.user,
      creationMode: (state: any) => state.creationMode,
      cardTitle(state: any) {
        return state.creationMode ? "Nutzer hinzufügen" : "Nutzer bearbeiten";
      },
    }),
    isMinLengthValid(): boolean {
      // check if password is at least 6 characters long
      return this.localUser.passwordHash.length >= 6;
    },
    hasDigit(): boolean {
      // check if password contains a digit
      return /\d/.test(this.localUser.passwordHash);
    },
    hasLowercase(): boolean {
      // check if password contains a lowercase letter
      return /[a-z]/.test(this.localUser.passwordHash);
    },
    hasNonAlphanumeric(): boolean {
      // check if password contains a non-alphanumeric character
      return /\W/.test(this.localUser.passwordHash);
    },
    hasUppercase(): boolean {
      // check if password contains an uppercase letter
      return /[A-Z]/.test(this.localUser.passwordHash);
    },
  },
  created() {
    if (this.user.id) {
      this.localUser = JSON.parse(JSON.stringify(this.user));
    }
  },
  methods: {
    ...mapActions("users", ["createUser", "updateUser"]),
    ...mapMutations("users", ["SET_USER", "SET_CREATION_MODE"]),
    //Register the user
    async saveUser() {
      if (this.creationMode) {
        await this.createUser(this.localUser);
      } else {
        await this.updateUser(this.localUser);
      }
      this.close();
    },
    cancelDiscardDialog() {
      this.discardChangesDialog = false;
      this.dialog = true;
    },
    close(dirty?: false) {
      if (!dirty) {
        this.$router.push({ name: "users" });
        this.SET_USER({});
        this.SET_CREATION_MODE(false);
      } else {
        this.discardChangesDialog = true;
      }
    },
  },
});
</script>

<style scoped></style>
