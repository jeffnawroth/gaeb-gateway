import router from "@/router";
import axios from "axios";
import { AuthenticationApi } from "@/api";

export default {
  namespaced: true,
  state: {
    user: null,
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
        router.push({ name: "user-management" });
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
        router.push({ name: "home-view" });
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
    },
  },
  getters: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loggedIn(state: any) {
      return !!state.user;
    },
  },
};
