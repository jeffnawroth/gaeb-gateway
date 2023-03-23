import { CustomNotification } from "@/helpers/Interfaces";
import { ActionContext } from "vuex";
import { NotificationState, RootState } from "../types";

let nextId = 1;
export default {
  namespaced: true,
  state: {
    notifications: [],
  },

  mutations: {
    PUSH(state: NotificationState, notification: CustomNotification) {
      state.notifications.push({
        ...notification,
        id: nextId++,
      });
    },
    DELETE(state: NotificationState, notification: CustomNotification) {
      const index = state.notifications.indexOf(notification);
      state.notifications.splice(index, 1);
    },
  },
  actions: {
    add(
      { commit }: ActionContext<RootState, RootState>,
      notification: CustomNotification
    ) {
      commit("PUSH", notification);
    },
    remove(
      { commit }: ActionContext<RootState, RootState>,
      notification: CustomNotification
    ) {
      commit("DELETE", notification);
    },
  },
  getters: {},
};
