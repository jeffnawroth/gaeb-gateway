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
    /**

    This is a Vuex action that adds a new notification to the notification state by committing a mutation.
    @param {ActionContext<RootState, RootState>} context - the context object for the store module
    @param {CustomNotification} notification - the notification object to be added to the state
    */
    add(
      { commit }: ActionContext<RootState, RootState>,
      notification: CustomNotification
    ) {
      commit("PUSH", notification);
    },

    /**

    This is a Vuex action that removes a notification from the notification state by committing a mutation.
    @param {ActionContext<RootState, RootState>} context - the context object for the store module
    @param {CustomNotification} notification - the notification object to be removed from the state
    */
    remove(
      { commit }: ActionContext<RootState, RootState>,
      notification: CustomNotification
    ) {
      commit("DELETE", notification);
    },
  },
  getters: {},
};
