import Vue from "vue";
import Vuex from "vuex";
import authentication from "@/store/modules/authentication";
import notification from "@/store/modules/notification";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    authentication,
    notification,
  },
});
