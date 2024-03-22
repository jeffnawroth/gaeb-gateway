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
    /**

    This is an asynchronous Vuex action that fetches a list of users from the server using the UserApi prototype.
    If the request is successful, it commits the users to the Vuex store by calling the SET_USERS mutation.
    If the request fails, it dispatches a notification to display an error message and returns a rejected promise.
    @param {ActionContext<RootState, RootState>} context - the Vuex action context object that provides access to commit and dispatch methods
    */
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

    /**

    This is an asynchronous Vuex action that retrieves a user's data either from the Vuex store or the server using the UserApi prototype.
    If the user's data is already available in the Vuex store, it commits the data to the store by calling the SET_USER mutation and returns the data.
    If the user's data is not available in the Vuex store, it makes an API request to the server to fetch the user's data.
    If the request is successful, it commits the data to the Vuex store by calling the SET_USER mutation and returns the data.
    If the request fails, it dispatches a notification to display an error message.
    @param {ActionContext<RootState, RootState>} context - the Vuex action context object that provides access to commit, dispatch, and getters methods
    @param {string} id - the ID of the user to retrieve
    @returns {Promise<User>} - a Promise that resolves to the user's data if successful, or rejects with an error if unsuccessful
    */
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

    /**

    This is an asynchronous Vuex action that creates a new user by sending a POST request to the server using the UserApi prototype.
    If the request is successful, it adds the new user to the Vuex store by calling the ADD_USER mutation and dispatches a notification to display a success message.
    If the request fails, it dispatches a notification to display an error message and returns a rejected promise.
    @param {ActionContext<RootState, RootState>} context - the Vuex action context object that provides access to commit and dispatch methods
    @param {ApplicationUser} user - the user object containing the data to create the new user
    @returns {Promise<any>} - a Promise that resolves if the user is successfully created or rejects with an error if unsuccessful
    */
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

    /**

    This is an asynchronous Vuex action that deletes a user by sending a DELETE request to the server using the UserApi prototype.
    If the request is successful, it removes the user from the Vuex store by calling the DELETE_USER mutation and dispatches a notification to display a success message.
    If the request fails, it dispatches a notification to display an error message and returns a rejected promise.
    @param {ActionContext<RootState, RootState>} context - the Vuex action context object that provides access to commit and dispatch methods
    @param {ApplicationUser} user - the user object to delete
    @returns {Promise<any>} - a Promise that resolves if the user is successfully deleted or rejects with an error if unsuccessful
    */
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

    /**

    This is an asynchronous Vuex action that updates a user by sending a PUT request to the server using the UserApi prototype.
    If the request is successful, it updates the user in the Vuex store by calling the UPDATE_USER mutation and dispatches a notification to display a success message.
    If the request fails, it dispatches a notification to display an error message and returns a rejected promise.
    @param {ActionContext<RootState, RootState>} context - the Vuex action context object that provides access to commit and dispatch methods
    @param {ApplicationUser} user - the updated user object
    @returns {Promise<any>} - a Promise that resolves if the user is successfully updated or rejects with an error if unsuccessful
    */
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
    /**

    This is a getter function that returns a user object from the Vuex store based on the given ID.
    @param {UserState} state - the current state of the Vuex user module
    @param {string} id - the ID of the user to be returned
    @returns {ApplicationUser | undefined} - the user object matching the ID or undefined if no matching user is found
    */
    getUserById: (state: UserState) => (id: string) => {
      return state.users.find((user: ApplicationUser) => user.id === id);
    },
  },
};
