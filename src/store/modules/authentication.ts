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

    /**

   /**

    This is an action that handles user login. It takes in user credentials and sends a login request to the server.
    If the login request is successful, it commits the user data to the store and redirects the user to the home page.
    If there is an error during the login process, it dispatches an error notification to the notification module.
    @param {ActionContext<RootState, RootState>} context - the context object that includes the store state and methods
    @param {UserLoginRequestDto} credentials - an object that includes the user's login credentials
    @returns {Promise<void>} - a Promise that resolves when the login request is successful, and rejects if there is an error
    */
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
    /**

    This is an action that handles user logout. It clears the user data from the store and redirects the user to the home page.
    @param {ActionContext<RootState, RootState>} context - the context object that includes the store state and methods
    */
    logout({ commit }: ActionContext<RootState, RootState>) {
      commit("CLEAR_USER_DATA");
      router.push({ name: "home" });
    },

    /**

    This is an action that refreshes the user access token. It sends a request to the server to refresh the token,
    and updates the user data in the store with the new access and refresh tokens if the request is successful.
    If there is an error during the token refresh process, it dispatches an error notification to the notification module
    and rejects the Promise with the error.
    @param {ActionContext<RootState, RootState>} context - the context object that includes the store state and methods
    @returns {Promise<void>} - a Promise that resolves when the token refresh is successful, and rejects if there is an error
    */
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

    /**

    This is an action that loads the user's preferred dark mode setting from local storage and updates the store accordingly.
    If the user has previously set a dark mode preference, it retrieves the value from local storage and commits it to the store.
    @param {ActionContext<RootState, RootState>} context - the context object that includes the store state and methods
    */
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
