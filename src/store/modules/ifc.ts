import { IfcApi } from "@/api";

interface State {
  elements: any[];
}

export default {
  namespaced: true,
  state: {
    elements: [],
  },
  mutations: {
    SET_ELEMENTS(state: State, elements: any[]) {
      state.elements = elements;
    },
  },
  actions: {
    async getBuildingElements({ commit, dispatch }: any) {
      try {
        const elements = await IfcApi.prototype.apiIfcGet();
        commit("SET_ELEMENTS", elements.data);
      } catch (error) {
        const notification = {
          type: "error",
          message: "Beim Exportieren der GAEB ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
      }
    },
  },
  getters: {
    getSortedElements: (state: State) => {
      return state.elements.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    },
  },
};
