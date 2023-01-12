import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "./vee-validate";
import axios from "axios";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";

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

new Vue({
  router,
  store,
  vuetify,
  created() {
    store.dispatch("authentication/loadDarkMode");
    const userString = localStorage.getItem("user");
    if (userString) {
      const userData = JSON.parse(userString);
      store.commit("authentication/SET_USER_DATA", userData);
    }
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          store.dispatch("authentication/logout");
        }
        return Promise.reject(error);
      }
    );
  },
  render: (h) => h(App),
}).$mount("#app");
