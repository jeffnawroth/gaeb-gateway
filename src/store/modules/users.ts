import { ApplicationUser, UserApi } from "@/api";
import { ActionContext } from "vuex";
import { RootState, UserState } from "../types";

export default {
  namespaced: true,
  state: (): UserState => ({
    users: [] as ApplicationUser[],
    user: {} as ApplicationUser,
    creationMode: false,
  }),
  mutations: {
    SET_USERS(state: UserState, users: ApplicationUser[]) {
      state.users = users;
    },
    SET_USER(state: UserState, user: ApplicationUser) {
      state.user = user;
    },
    ADD_USER(state: UserState, user: ApplicationUser) {
      state.users.push(user);
    },
    DELETE_USER(state: UserState, user: ApplicationUser) {
      state.users.splice(state.users.indexOf(user), 1);
    },
    UPDATE_USER(state: UserState, user: ApplicationUser) {
      const index = state.users.findIndex(
        (user: ApplicationUser) => user.id === state.user.id
      );
      state.users.splice(index, 1, user);
    },
    SET_CREATION_MODE(state: UserState, value: boolean) {
      state.creationMode = value;
    },
  },
  actions: {
    async getUsers({ commit, dispatch }: ActionContext<RootState, RootState>) {
      try {
        const response = await UserApi.prototype.apiUserGet();
        commit("SET_USERS", response.data);
      } catch (error) {
        const notification = {
          type: "error",
          message: "Beim Laden der Nutzer ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
        return Promise.reject(error);
      }
    },
    async getUser(
      { commit, dispatch, getters }: ActionContext<RootState, RootState>,
      id: string
    ) {
      const user = getters.getUserById(id);
      if (user) {
        commit("SET_USER", user);
        return user;
      } else {
        try {
          const response = await UserApi.prototype.apiUserIdGet(id);
          commit("SET_USER", response.data);
          return response.data;
        } catch (error) {
          const notification = {
            type: "error",
            message: "Beim Laden des Nutzers ist ein Problem aufgetreten.",
          };
          dispatch("notification/add", notification, { root: true });
        }
      }
    },
    async createUser(
      { commit, dispatch }: ActionContext<RootState, RootState>,
      user: ApplicationUser
    ) {
      try {
        const response = await UserApi.prototype.apiUserPost(user);
        commit("ADD_USER", response.data);
        const notification = {
          type: "success",
          message: "Nutzer erfolgreich erstellt.",
        };
        dispatch("notification/add", notification, { root: true });
      } catch (error) {
        const notification = {
          type: "error",
          message: "Beim erstellen des Nutzers ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
        return Promise.reject(error);
      }
    },
    async deleteUser(
      { commit, dispatch }: ActionContext<RootState, RootState>,
      user: ApplicationUser
    ) {
      try {
        await UserApi.prototype.apiUserIdDelete(user.id as string);
        commit("DELETE_USER", user);
        const notification = {
          type: "success",
          message: "Nutzer erfolgreich gelöscht.",
        };
        dispatch("notification/add", notification, { root: true });
      } catch (error) {
        const notification = {
          type: "error",
          message: "Beim Löschen des Nutzers ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
        return Promise.reject(error);
      }
    },
    async updateUser(
      { commit, dispatch }: ActionContext<RootState, RootState>,
      user: ApplicationUser
    ) {
      try {
        await UserApi.prototype.apiUserIdPut(user.id as string, user);
        commit("UPDATE_USER", user);
        const notification = {
          type: "success",
          message: "Nutzer erfolgreich bearbeitet.",
        };
        dispatch("notification/add", notification, { root: true });
      } catch (error) {
        const notification = {
          type: "error",
          message: "Beim Bearbeiten des Nutzers ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
        return Promise.reject(error);
      }
    },
  },
  getters: {
    getUserById: (state: UserState) => (id: string) => {
      return state.users.find((user: ApplicationUser) => user.id === id);
    },
  },
};
