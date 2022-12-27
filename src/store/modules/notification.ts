let nextId = 1;
export default {
  namespaced: true,
  state: {
    notifications: [],
  },

  mutations: {
    PUSH(state: any, notification: any) {
      state.notifications.push({
        ...notification,
        id: nextId++,
      });
    },
    DELETE(state: any, notification: any) {
      const index = state.notifications.indexOf(notification);
      state.notifications.splice(index, 1);
    },
  },
  actions: {
    add({ commit }: any, notification: any) {
      commit("PUSH", notification);
    },
    remove({ commit }: any, notification: any) {
      commit("DELETE", notification);
    },
  },
  getters: {},
};
