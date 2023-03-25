import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "./vee-validate";
import axios from "axios";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
import {
  getAccessTokenAvaCloud,
  getAccessTokenOpenCDE,
} from "./helpers/DanglIdentity";

const requireComponent = require.context(
  "./components/BaseComponents", //Directory to search within,
  false, // Search subdirectories
  /Base[A-Z]\w+\.(vue|js)$/ //Regex: Searching for files than begin with Base and end with .vue/.js
);

requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName);

  //Converting Filenames to PascalCase
  const componentName = upperFirst(
    camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, "$1"))
  );

  Vue.component(componentName, componentConfig.default || componentConfig);
});

Vue.config.productionTip = false;

export const bus = new Vue();

(async () => {
  await getAccessTokenAvaCloud();
  await getAccessTokenOpenCDE();
  new Vue({
    router,
    store,
    vuetify,
    created() {
      const userString = localStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);
        store.commit("authentication/SET_USER_DATA", userData);
      }
      axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalConfig = error.config;
          if (error.response.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;
            try {
              await store.dispatch("authentication/refreshToken");
              //@ts-expect-error: error
              error.config.headers.Authorization = `Bearer ${store.state.authentication.user.token}`;
              return axios(error.config);
            } catch (error) {
              store.dispatch("authentication/logout");
            }
          }
          return Promise.reject(error);
        }
      );
    },
    render: (h) => h(App),
  }).$mount("#app");
})();
