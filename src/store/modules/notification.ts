let nextId = 1;
export default {
  namespaced: true,
  state: {
    notifications: [],
  },

  mutations: {
    PUSH(state: any, notifications: any) {
      state.notifications.push({
        ...notifications,
        id: nextId++,
      });
    },
    DELETE(state: any, notificationToRemove: any) {
      state.notifications = state.notifications.filter(
        (notification: any) => notification.id !== notificationToRemove.id
      );
    },
  },
  actions: {
    add({ commit }: any, notification: any) {
      commit("PUSH", notification);
    },
    remove({ commit }: any, notificationToRemove: any) {
      commit("DELETE", notificationToRemove);
    },
  },
  getters: {},
};
