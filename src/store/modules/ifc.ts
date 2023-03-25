import { IfcApi } from "@/api";
import { ActionContext } from "vuex";
import { IfcState, RootState } from "../types";

export default {
  namespaced: true,
  state: {
    elements: [],
  },
  mutations: {
    SET_ELEMENTS(state: IfcState, elements: any[]) {
      state.elements = elements;
    },
  },
  actions: {
    /**

    This is a Vuex action that fetches building elements from the server and sets them in the store state.
    If there is an error, it dispatches a notification to be displayed.
    @param {ActionContext<RootState, RootState>} context - the context object for the store module
    */
    async getBuildingElements({
      commit,
      dispatch,
    }: ActionContext<RootState, RootState>) {
      try {
        const elements = await IfcApi.prototype.apiIfcGet();
        commit("SET_ELEMENTS", elements.data);
      } catch (error) {
        const notification = {
          type: "error",
          message: "Beim Laden der Bauelemente ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
      }
    },
  },
  getters: {
    getSortedElements: (state: IfcState) => {
      return state.elements.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    },
  },
};
