import { ApplicationUser, UserApi } from "@/api";

export default {
  namespaced: true,
  state: {
    users: [] as ApplicationUser[],
  },
  mutations: {
    SET_USERS(state: any, users: ApplicationUser[]) {
      state.users = users;
    },
    DELETE_USER(state: any, user: ApplicationUser) {
      state.users.splice(state.users.indexOf(user), 1);
    },
    UPDATE_USER(state: any, user: ApplicationUser) {
      const index = state.users.findIndex(
        (userToUpdate: ApplicationUser) => userToUpdate.id === user.id
      );
      state.users[index] = user;
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
    async deleteUser({ commit, dispatch }: any, user: ApplicationUser) {
      try {
        console.log(user);

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
        await UserApi.prototype.apiUserIdPut(user.id as string);
        commit("UPDATE_USER", user);
      } catch (error) {
        const notification = {
          type: "error",
          message: "Beim Bearbeiten des Nutzers ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
      }
    },
  },
  getters: {},
};
