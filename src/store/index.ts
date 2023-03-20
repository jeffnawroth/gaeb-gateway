import Vue from "vue";
import Vuex from "vuex";
import authentication from "@/store/modules/authentication";
import notification from "@/store/modules/notification";
import users from "@/store/modules/users";
import projects from "./modules/projects";
import documents from "./modules/documents";
import avacloud from "./modules/avacloud";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loadingGlobal: false,
  },
  getters: {},
  mutations: {
    SET_LOADING_GLOBAL(state, value: boolean) {
      state.loadingGlobal = value;
    },
  },
  actions: {},
  modules: {
    authentication,
    notification,
    users,
    projects,
    documents,
    avacloud,
  },
});
