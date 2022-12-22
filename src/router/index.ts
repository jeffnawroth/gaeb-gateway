import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import LoginView from "@/views/LoginView.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    name: "login",
    path: "/",
    component: LoginView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
