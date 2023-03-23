import router from "@/router";
import axios from "axios";
import { AuthenticationApi, UserLoginRequestDto } from "@/api";
import vuetify from "@/plugins/vuetify";
import { ActionContext } from "vuex";
import { AuthUserState, RootState } from "../types";
import { User } from "@/helpers/Interfaces";

export default {
  namespaced: true,
  state: {
    user: null,
    darkMode: false,
  },
  mutations: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SET_USER_DATA(state: AuthUserState, userData: User) {
      state.user = userData;
      localStorage.setItem("user", JSON.stringify(userData));
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${userData.token}`;
    },
    CLEAR_USER_DATA(state: AuthUserState) {
      localStorage.removeItem("user");
      state.user = null;
      axios.defaults.headers.common["Authorization"] = null;
    },
    TOGGLE_DARK_MODE(state: AuthUserState) {
      state.darkMode = !state.darkMode;
      vuetify.framework.theme.dark = state.darkMode;
      localStorage.setItem("darkMode", JSON.stringify(state.darkMode));
    },
    SET_DARK_MODE(state: AuthUserState, value: boolean) {
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
    async login(
      { commit, dispatch }: ActionContext<RootState, RootState>,
      credentials: UserLoginRequestDto
    ) {
      try {
        const data =
          await AuthenticationApi.prototype.apiAuthenticationLoginPost(
            credentials
          );
        commit("SET_USER_DATA", data.data);
        router.push({ name: "home" });
      } catch (error) {
        const notification = {
          type: "error",
          message: "Bei der Anmeldung ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
      }
    },
    logout({ commit }: ActionContext<RootState, RootState>) {
      commit("CLEAR_USER_DATA");
      router.push({ name: "home" });
    },
    async refreshToken({
      commit,
      state,
      dispatch,
    }: ActionContext<RootState, RootState>) {
      try {
        const data =
          await AuthenticationApi.prototype.apiAuthenticationRefreshTokenPost({
            token: state.authUser.user?.token,
            refreshToken: state.authUser.user?.refreshToken,
          });
        commit("SET_USER_DATA", data.data);
      } catch (error) {
        const notification = {
          type: "error",
          message: "Die aktuelle Sitzung wurde beendet.",
        };
        dispatch("notification/add", notification, { root: true });
        return Promise.reject(error);
      }
    },
    loadDarkMode({ commit }: ActionContext<RootState, RootState>) {
      const darkMode = localStorage.getItem("darkMode");
      if (darkMode !== null) {
        commit("SET_DARK_MODE", darkMode === "true");
      }
    },
  },
  getters: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loggedIn(state: AuthUserState) {
      return !!state.user;
    },
  },
};
