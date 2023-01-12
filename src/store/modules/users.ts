import { ApplicationUser, UserApi } from "@/api";

export interface State {
  users: ApplicationUser[];
  user: ApplicationUser;
  creationMode: boolean;
}
export default {
  namespaced: true,
  state: (): State => ({
    users: [] as ApplicationUser[],
    user: {} as ApplicationUser,
    creationMode: false,
  }),
  mutations: {
    SET_USERS(state: State, users: ApplicationUser[]) {
      state.users = users;
    },
    SET_USER(state: State, user: ApplicationUser) {
      state.user = user;
    },
    ADD_USER(state: State, user: ApplicationUser) {
      state.users.push(user);
    },
    DELETE_USER(state: State, user: ApplicationUser) {
      state.users.splice(state.users.indexOf(user), 1);
    },
    UPDATE_USER(state: State, user: ApplicationUser) {
      const index = state.users.findIndex(
        (user: ApplicationUser) => user.id === state.user.id
      );
      state.users.splice(index, 1, user);
    },
    SET_CREATION_MODE(state: State, value: boolean) {
      state.creationMode = value;
    },
  },
  actions: {
    async getUsers({ commit, dispatch }: any) {
      try {
        const response = await UserApi.prototype.apiUserGet();
        commit("SET_USERS", response.data);
      } catch (error) {
        const notification = {
          type: "error",
          message: "Beim Laden der Nutzer ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
      }
    },
    async getUser({ commit, dispatch, getters }: any, id: string) {
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
    async createUser({ commit, dispatch }: any, user: ApplicationUser) {
      try {
        const response = await UserApi.prototype.apiUserPost(user);
        commit("ADD_USER", response.data);
      } catch (error) {
        const notification = {
          type: "error",
          message: "Beim erstellen des Nutzers ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
        return Promise.reject(error);
      }
    },
    async deleteUser({ commit, dispatch }: any, user: ApplicationUser) {
      try {
        await UserApi.prototype.apiUserIdDelete(user.id as string);
        commit("DELETE_USER", user);
      } catch (error) {
        const notification = {
          type: "error",
          message: "Beim Löschen des Nutzers ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
        return Promise.reject(error);
      }
    },
    async updateUser({ commit, dispatch }: any, user: ApplicationUser) {
      try {
        await UserApi.prototype.apiUserIdPut(user.id as string, user);
        commit("UPDATE_USER", user);
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
    getUserById: (state: State) => (id: string) => {
      return state.users.find((user: ApplicationUser) => user.id === id);
    },
  },
};
