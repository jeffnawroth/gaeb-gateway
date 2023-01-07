import router from "@/router";
import axios from "axios";
import { AuthenticationApi } from "@/api";
import vuetify from "@/plugins/vuetify";

export default {
  namespaced: true,
  state: {
    user: null,
    darkMode: false,
  },
  mutations: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SET_USER_DATA(state: any, userData: any) {
      state.user = userData;
      localStorage.setItem("user", JSON.stringify(userData));
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${userData.token}`;
    },
    CLEAR_USER_DATA(state: any) {
      localStorage.removeItem("user");
      state.user = null;
      axios.defaults.headers.common["Authorization"] = null;
    },
    TOGGLE_DARK_MODE(state: any) {
      state.darkMode = !state.darkMode;
      vuetify.framework.theme.dark = state.darkMode;
      localStorage.setItem("darkMode", state.darkMode);
    },
    SET_DARK_MODE(state: any, value: boolean) {
      state.darkMode = value;
      vuetify.framework.theme.dark = state.darkMode;
    },
  },
  actions: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    /* async register({ commit, dispatch }: any, credentials: any) {
      try {
        const data =
          await AuthenticationApi.prototype.apiAuthenticationRegisterPost(
            credentials
          );
        commit("SET_USER_DATA", data.data);
        router.push({ name: "users" });
      } catch (error) {
        const notification = {
          type: "error",
          message: "Bei der Registrierung ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
      }
    }, */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async login({ commit, dispatch }: any, credentials: any) {
      try {
        const data =
          await AuthenticationApi.prototype.apiAuthenticationLoginPost(
            credentials
          );
        commit("SET_USER_DATA", data.data);
        router.push({ name: "users" });
      } catch (error) {
        const notification = {
          type: "error",
          message: "Bei der Anmeldung ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
      }
    },
    logout({ commit }: any) {
      commit("CLEAR_USER_DATA");
      router.push({ name: "home" });
    },
    loadDarkMode({ commit }: any) {
      const darkMode = localStorage.getItem("darkMode");
      if (darkMode !== null) {
        commit("SET_DARK_MODE", darkMode === "true");
      }
    },
  },
  getters: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loggedIn(state: any) {
      return !!state.user;
    },
  },
};
