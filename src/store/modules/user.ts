import axios from "axios";

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
    CLEAR_USER_DATA() {
      localStorage.removeItem("user");
      location.reload();
    },
  },
  actions: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async register({ commit }: any, credentials: any) {
      const data = await axios.post("//localhost:3000/register", credentials);
      commit("SET_USER_DATA", data.data);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async login({ commit }: any, credentials: any) {
      const data = await axios.post("//localhost:3000/login", credentials);
      commit("SET_USER_DATA", data.data);
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
